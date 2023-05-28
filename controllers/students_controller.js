const Student = require("../models/student");
const Interview = require("../models/interview");
const { sendEmail } = require('./email');
const { authenticator } = require('otplib');




// render add student page
module.exports.addStudent = (req, res) => {
  if (req.isAuthenticated()) {
    return res.render("add_student", {
      title: "Add Student",
    });
  }

  return res.redirect("/");
};

// render edit student page
module.exports.editStudent = async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (req.isAuthenticated()) {
    return res.render("edit_student", {
      title: "Edit Student",
      student_details: student,
    });
  }

  return res.redirect("/");
};

//const otpGenerator = new OTP();
// creation of new student
module.exports.create = async (req, res) => {
  try {
    const {
      name,
      email,
      batch,
      college,
      placement_status,
      dsa_score,
      react_score,
      webdev_score,
    } = req.body;

    // check if student already exists
    const existingStudent = await Student.findOne({ email });

    if (existingStudent) {
      req.flash('error', 'Student already exists!');
      return res.redirect('back');
    }
    const otp = authenticator.generateSecret();

    const newStudent = await Student.create({
      name,
      email,
      college,
      batch,
      dsa_score,
      react_score,
      webdev_score,
      placement_status,
      otp: otp,
    });

    const joiningLink = `https://myplacement-cell.onrender.com/verify-email/${newStudent.email}`;


    const emailSubject = 'Placement Cell Joining Link';
   /* const emailContent = `
      <h3>Placement Cell Joining Link</h3>
      <p>Dear ${newStudent.name},</p>
      <p>Please use the following Pass Code to verify your email:</p>
      <p><strong>${otp}</strong></p>
      <p>You have been successfully added to the placement cell.</p>
      <p>Click <a href="${joiningLink}">${joiningLink}</a> to access the interview and job portal.</p>
    `;*/
    const emailContent = `
      <h3>Welcome to the Placement Cell!</h3>
      <p>Dear ${newStudent.name},</p>
      <p>Congratulations on joining our vibrant community of aspiring professionals!</p>
      <p>We're thrilled to have you on board and can't wait to help you unlock endless opportunities.</p>
      <p>To get started, please use the following Pass Code to verify your email:</p>
      <h2 style="text-align: center; color: #ff5f5f; font-weight: bold;">${otp}</h2>
      <p>Once you've verified your email, you'll gain access to our exclusive interview and job portal, designed to elevate your career prospects.</p>
      <div style="text-align: center; margin-top: 20px;">
        <a href="${joiningLink}" style="background-color: #ff5f5f; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">Access the Portal Now</a>
      </div>
      <p>Use the above link  to access the portal always and without pass code it wont open so always remember it.</p>
      <p>Always remember, we're here to support you every step of the way!</p>
      <p>Discover a world of opportunities, connect with industry professionals, and showcase your skills to top employers.</p>
      <p>We're here to support you every step of the way, providing valuable resources, interview preparation tips, and personalized guidance.</p>
      <p>Get ready to unlock your true potential and embark on an exciting career journey!</p>

      <p>Best regards,</p>
      <p>The Placement Cell Team</p>
    `;


    sendEmail(newStudent.email, emailSubject, emailContent);

    req.flash('success', 'Student added!');
    return res.redirect('back');
  } catch (err) {
    console.log(err);
    req.flash('error', 'An error occurred.');
    return res.redirect('back');
  }
};
// Deletion of student
module.exports.destroy = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId);

    if (!student) {
      req.flash("error", "Couldn't find student");
      return;
    }

    const interviewsOfStudent = student.interviews;

    // delete reference of student from companies in which this student is enrolled
    if (interviewsOfStudent.length > 0) {
      for (let interview of interviewsOfStudent) {
        await Interview.findOneAndUpdate(
          { company: interview.company },
          { $pull: { students: { student: studentId } } }
        );
      }
    }

    student.remove();
    req.flash("success", "Student deleted!");
    return res.redirect("back");
  } catch (err) {
    console.log("error", err);
    return;
  }
};

// update student details
module.exports.update = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    const {
      name,
      college,
      batch,
      dsa_score,
      react_score,
      webdev_score,
      placement_status,
    } = req.body;

    if (!student) {
      req.flash("error", "Student does not exist!");
      return res.redirect("back");
    }

    student.name = name;
    student.college = college;
    student.batch = batch;
    student.dsa_score = dsa_score;
    student.react_score = react_score;
    student.webdev_score = webdev_score;
    student.placement_status = placement_status;

    student.save();
    req.flash("success", "Student updated!");
    return res.redirect("/dashboard");
  } catch (err) {
    req.flash("error", err);
    console.log(err);
    return res.redirect("back");
  }
};
