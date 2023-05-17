require("./config/database").connect();
const express = require("express");
const axios = require('axios');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config();
const { PORT, MONGODB_URI } = process.env;
const expressLayouts = require("express-ejs-layouts");
const fetch = require('cross-fetch');
const Student = require("./models/student");
const { authenticator } = require('otplib');
const emailRoutes = require('./routes/emailRoutes');
const taskemailRoutes = require('./routes/taskemailRoutes');
const dsataskRoutes=require('./routes/dsataskRoutes');
// used for session cookie
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");

const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const customMware = require("./config/middleware");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(cookieParser());

app.use(expressLayouts);

// set up view engine
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static('public'));


// mongo store is used to store the session cookie in the db
app.use(
  session({
    name: "placement-cell",
    secret: "secret",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create({
      mongoUrl: MONGODB_URI,
      autoRemove: "disabled",
    }),
    function(err) {
      console.log(err || "connect-mongodb setup ok");
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// sets the authenticated user in the response
app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

// use express router
app.use("/", require("./routes"));
app.use('/', emailRoutes);
app.use('/',taskemailRoutes);
app.use('/',dsataskRoutes);


app.get('/student_dashboard/:email', async (req, res) => {
  try {
    const { email } = req.params;

    // Assuming you have a Student model/schema defined
    const student = await Student.findOne({ email });

    if (!student) {
      // Handle the case where the student is not found
      return res.status(404).send('Student not found.');
    }

    res.render('student_dashboard', {
      title: 'Student Dashboard',
      student: student, // Pass the student variable as a local variable
    });
  } catch (error) {
    // Handle the error if any
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});



app.get('/verify-email/:email', (req, res) => {
  const { email } = req.params;
  res.render('verify-email', { title: 'Verify Email', email });
});



app.post('/verify-email/:email', (req, res) => {
  const { otp } = req.body;
  const { email } = req.params;
  console.log(email);
  console.log(otp);
  // Assuming you have a Student model/schema defined and using a MongoDB-like database
  Student.findOne({ email }, (err, student) => {
    if (err || !student) {
      // Handle error or student not found scenario
      res.send('Student not found.'); // Display an error message or redirect as needed
    } else {
      // Retrieve the OTP for the student from the database
      const studentOTP = student.otp;
      console.log(studentOTP);
      // Verify the entered OTP against the retrieved OTP
      if (otp === studentOTP) {
        // Perform any necessary tasks after successful email verification
        res.redirect(`/student_dashboard/${email}`); // Redirect to the student dashboard page
      } else {
        res.send('Invalid OTP. Please try again.'); // Display an error message
      }
    }
  });
});


app.get('/job-portal', (req, res) => {
  // Render the EJS template for the job search page
  res.render('job-search.ejs', { title: 'Job Search', jobs: [] });
});

// Define the route for handling the job search
// Define the route for handling the job search
app.get('/search', (req, res) => {
  const { location, jobName } = req.query;

  // Construct the API URL with the provided location and job name
  const currency = '₹';
  const appId = process.env.APP_ID;
  const appKey = process.env.APP_KEY;
  const apiUrl = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${appId}&app_key=${appKey}&what=${encodeURIComponent(jobName)}&where=${encodeURIComponent(location)}`;

  // Make the GET request to the Adzuna API endpoint
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const jobs = data.results || []; // Extract the job results from the API response
      if (jobs.length === 0) {
        // No jobs found
        res.render('job-results.ejs', { title: 'Job Result', jobs: [], message: 'No jobs found' });
      } else {
        // Jobs found
        res.render('job-results.ejs', { title: 'Job Result', jobs, currency });
      }
    })
    .catch(error => {
      console.error('Error:', error);
      res.render('job-results.ejs', { title: 'Job Result', jobs: [], message: 'Error retrieving job data' }); // Render the template with an error message
    });
});

app.get('/dsa', (req, res) => {
  res.render('dsa.ejs', { title: 'DSA Tasks' });
});

app.get('/react', (req, res) => {
  res.render('react.ejs', { title: 'React Tasks' });

});
app.get('/development', (req, res) => {
  res.render('development.ejs', { title: 'Development Tasks' });
});

app.listen(PORT || 5000, (err) => {
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }
  console.log(`server is running on port: ${PORT}`);
});
