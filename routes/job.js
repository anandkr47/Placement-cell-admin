const express = require("express");
const router = express.Router();
const Job = require("../models/job");
const Student = require("../models/student");
const { sendEmail } = require('../controllers/email');

// Render the job post page
router.get("/job/create", (req, res) => {
    res.render("post-jobs", { job: {} });
});

// Create a new job post
router.post("/job/create", async (req, res) => {
  const { title, company, location, description, requirements, contact, deadline, applylink } = req.body;

  const job = new Job({
    title,
    company,
    location,
    description,
    requirements,
    contact,
    deadline,
    applylink,
  });

  try {
    await job.save();

    // Fetch all registered students
    const students = await Student.find({});
    const interviewLink = `https://myplacement-cell.onrender.com/job-portal`;
    // Send email to each student
    students.forEach(async (student) => {
      const emailSubject = 'New Job Opportunity';
      const emailContent = `
        <h3>New Job Opportunity</h3>
        <p>Dear ${student.name},</p>
        <p>We have a new job opportunity for you:</p>
        <p><strong>Title: ${job.title}</strong></p>
        <p><strong>Company: ${job.company}</strong></p>
        <p><strong>Location: ${job.location}</strong></p>
        <p>${job.description}</p>
        <p>Requirements: ${job.requirements}</p>
        <p>Contact: ${job.contact}</p>
        <p>Apply by: ${job.deadline}</p>
        <div style="text-align: center; margin-top: 20px;">
          <a href="${interviewLink}" style="background-color: #ff5f5f; color: #fff; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-weight: bold;">Apply Now</a>
        </div>
        <p>Don't miss out on this exciting opportunity. Apply now!</p>
        <p>Best regards,</p>
        <p>The Placement Cell Team</p>
      `;

      await sendEmail(student.email, emailSubject, emailContent);
    });

    req.flash("success", "Job posted successfully!");
    res.redirect("/");
  } catch (err) {
    req.flash("error", "Failed to post the job");
    console.error("Error saving job", err);
    res.redirect("/job/create");
  }
});

// Render the job edit page
router.get("/job/:id/edit", (req, res) => {
  const jobId = req.params.id;

  Job.findById(jobId)
    .then((job) => {
      res.render("job_edit", { title:"edit job", job });
    })
    .catch((err) => {
      console.error("Error retrieving job", err);
      req.flash("error", "Failed to retrieve the job");
      res.redirect("/");
    });
});

// Update a job post
router.post("/job/:id/update", (req, res) => {
  const jobId = req.params.id;
  const { title, company, location, description, requirements, contact, deadline,applylink } = req.body;

  Job.findByIdAndUpdate(jobId, {
    title,
    company,
    location,
    description,
    requirements,
    contact,
    deadline,
    applylink,
  })
    .then(() => {
      req.flash("success", "Job updated successfully!");
      res.redirect("/");
    })
    .catch((err) => {
      console.error("Error updating job", err);
      req.flash("error", "Failed to update the job");
      res.redirect(`/job/${jobId}/edit`);
    });
});

// Delete a job post
router.post("/job/:id/delete", (req, res) => {
  const jobId = req.params.id;

  Job.findByIdAndDelete(jobId)
    .then(() => {
      req.flash("success", "Job deleted successfully!");
      res.redirect("/");
    })
    .catch((err) => {
      console.error("Error deleting job", err);
      req.flash("error", "Failed to delete the job");
      res.redirect("/");
    });
});

module.exports = router;
