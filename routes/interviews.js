const express = require("express");
const router = express.Router();

const interviewController = require("../controllers/interviews_controller");

router.get("/add-interview", interviewController.addInterview);

router.post("/create", interviewController.create);

router.get("/edit/:id", interviewController.editInterview);
router.post("/edit/:id", interviewController.updateInterview);

router.get("/delete/:id", interviewController.deleteInterview);

router.post("/enroll-in-interview/:id", interviewController.enrollInInterview);

router.get("/deallocate/:studentId/:interviewId", interviewController.deallocate);

module.exports = router;
