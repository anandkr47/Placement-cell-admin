const express = require("express");
const router = express.Router();
const Job = require("../models/job");

// Render the job post page
router.get("/create", (req, res) => {
  res.render("post-jobs");
});

// Create a new job post
router.post("/create", (req, res) => {
  const { title, company, location, description, requirements, contact, deadline } = req.body;

  const job = new Job({
    title,
    company,
    location,
    description,
    requirements,
    contact,
    deadline,
  });

  job.save()
    .then(() => {
      req.flash("success", "Job posted successfully!");
      res.redirect("/");
    })
    .catch((err) => {
      req.flash("error", "Failed to post the job");
      console.error("Error saving job", err);
      res.redirect("/job/create");
    });
});

// Render the job edit page
router.get("/:id/edit", (req, res) => {
  const jobId = req.params.id;

  Job.findById(jobId)
    .then((job) => {
      res.render("job_edit", { job });
    })
    .catch((err) => {
      console.error("Error retrieving job", err);
      req.flash("error", "Failed to retrieve the job");
      res.redirect("/");
    });
});

// Update a job post
router.post("/:id/update", (req, res) => {
  const jobId = req.params.id;
  const { title, company, location, description, requirements, contact, deadline } = req.body;

  Job.findByIdAndUpdate(jobId, {
    title,
    company,
    location,
    description,
    requirements,
    contact,
    deadline,
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
router.post("/:id/delete", (req, res) => {
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
