const Student = require("../models/student");
const fs = require("fs");
const path = require("path");
const { Parser } = require('json2csv');

module.exports.downloadCSVReport = async function (req, res) {
  try {
    const allStudents = await Student.find({});
    
    const fields = [
      'id', 'name', 'college', 'email', 'placement_status', 
      'dsa_score', 'webdev_score', 'react_score',
      { label: 'Interview Date', value: row => (row.interviews.length > 0 ? row.interviews.map(interview => interview.date.toString()).join(', ') : '') },
      { label: 'Interview Company', value: row => (row.interviews.length > 0 ? row.interviews.map(interview => interview.company).join(', ') : '') },
      { label: 'Interview Result', value: row => (row.interviews.length > 0 ? row.interviews.map(interview => interview.result).join(', ') : '') }
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(allStudents);

    const filePath = path.join(__dirname, '..', 'uploads', 'studentsReport.csv');
    fs.writeFile(filePath, csv, function (err) {
      if (err) {
        console.error(err);
        return res.redirect("back");
      }
      req.flash("success", "Successfully downloaded CSV report!");
      return res.download(filePath);
    });
  } catch (err) {
    console.error(err);
    // Handle error response
    return res.status(500).send("Internal Server Error");
  }
};
