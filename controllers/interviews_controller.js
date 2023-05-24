const Interview = require("../models/interview");
const Student = require("../models/student");

// Renders the addInterview page
module.exports.addInterview = (req, res) => {
  if (req.isAuthenticated()) {
    return res.render("add_interview", {
      title: "Schedule An Interview",
    });
  }

  return res.redirect("/");
};

// Creation of a new interview
// Creation of a new interview
module.exports.create = async (req, res) => {
  try {
    const { company, date, time, link } = req.body;

    await Interview.create(
      {
        company,
        date,
        students: [],
        time,
        link,
      },
      (err, interview) => {
        if (err) {
          req.flash("error", "Couldn't add the interview!");
          return res.redirect("back");
        }
        req.flash("success", "Interview added successfully!");
        return res.redirect("back");
      }
    );
  } catch (err) {
    console.log(err);
  }
};


// Enrolling a student in the interview
module.exports.enrollInInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    const { email, result } = req.body;

    if (interview) {
      const student = await Student.findOne({ email });

      if (student) {
        // Check if already enrolled
        const alreadyEnrolled = await Interview.findOne({
          _id: { $ne: interview._id },
          "students.student": student.id,
        });

        // Preventing student from enrolling in the same company more than once
        if (alreadyEnrolled) {
          if (alreadyEnrolled.company === interview.company) {
            req.flash(
              "error",
              `${student.name} is already enrolled in an interview with ${interview.company}!`
            );
            return res.redirect("back");
          }
        }

        const studentObj = {
          student: student.id,
          result,
        };

        // Update students field of the interview by adding the reference of the newly enrolled student
        await interview.updateOne({
          $push: { students: studentObj },
        });

        // Update the student's interviews field with the assigned interview details
        const assignedInterview = {
          company: interview.company,
          date: interview.date,
          time: interview.time,
          link: interview.link,
          result,
        };
        await student.updateOne({
          $push: { interviews: assignedInterview },
        });

        req.flash(
          "success",
          `${student.name} enrolled in an interview with ${interview.company}!`
        );
        return res.redirect("back");
      }

      req.flash("error", "Student not found!");
      return res.redirect("back");
    }

    req.flash("error", "Interview not found!");
    return res.redirect("back");
  } catch (err) {
    req.flash("error", "Error in enrolling for the interview!");
  }
};

// Deallocating a student from an interview
module.exports.deallocate = async (req, res) => {
  try {
    const { studentId, interviewId } = req.params;

    // Find the interview
    const interview = await Interview.findById(interviewId);

    if (interview) {
      // Remove the reference of the student from the interview schema
      await Interview.findOneAndUpdate(
        { _id: interviewId },
        { $pull: { students: { student: studentId } } }
      );

      // Remove the interview from the student's schema using the interview's company
      await Student.findOneAndUpdate(
        { _id: studentId },
        { $pull: { interviews: { company: interview.company } } }
      );

      req.flash(
        "success",
        `Successfully deallocated from the interview with ${interview.company}!`
      );
      return res.redirect("back");
    }

    req.flash("error", "Interview not found!");
    return res.redirect("back");
  } catch (err) {
    req.flash("error", "Couldn't deallocate from the interview!");
  }
};
