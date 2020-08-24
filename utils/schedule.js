require("dotenv").config({ path: "./config/config.env" });
const mongoose = require("mongoose");

// Send Email function
const sendEmail = require("./sendEmail");

// Get Jobs
const getJobs = require("../utils/getJobs");

// Models
const User = require("../model/user");
const Schedule = require("../model/schedule");
const jobCategory = require("../model/jobCategory");

async function processUsers() {
  // Get All users
  const users = await User.find({ sendEmail: true }, { email: 1, jobTitle: 1 });

  if (users.length === 0) {
    return;
  }

  if (process.env.time === "newday") {
    await jobCategory.updateMany(
      {},
      {
        jobs: [],
        count: 0,
      }
    );
  }

  // Get jobs for each user category
  const jobCategorys = await User.distinct("jobTitle");

  for (const job of jobCategorys) {
    const jobs = await getJobs(job);

    const category = await jobCategory.findOne({
      $text: { $search: job },
    });

    if (!category) {
      await jobCategory.create({
        name: job,
        jobs,
        count: [jobs.length],
      });
    } else {
      await jobCategory.findByIdAndUpdate(category._id, {
        jobs,
        $push: { count: jobs.length },
      });
    }
  }

  // Loop through users
  for (const user of users) {
    const category = await jobCategory.findOne({
      $text: { $search: user.jobTitle },
    });

    let sendEmails = false;

    const time = category.count;
    let newJobs = 0;
    if (time.length > 1) {
      const calc = time[time.length - 1] - time[time.length - 2];

      if (calc !== 0) {
        sendEmails = true;
        newJobs = calc;
      }
    } else {
      newJobs = category.jobs.length;
    }

    // Check if result were found
    if (newJobs !== 0 && category.jobs.length !== 0) {
      // Create Html
      let html = "";
      for (let i = 0; i < newJobs; i++) {
        html += ` 
        <li style="width: 100%; display:flex; margin:0;">
          <a href="${category.jobs[i].link}" style="color: #afacc3;text-decoration: none;padding: 20px 15px;width: 100%;" target="_blank">${category.jobs[i].title}</a>
        </li>`;
      }

      // Send Email with Number of jobs
      await sendEmail({
        email: user.email,
        subject: `Job Offerings`,
        text: `You have ${newJobs} new Job Offers`,
        html: `
          <div style="background-color: #302c45; width: 100%; height: 100%; margin:auto;">

              <h1 style="color: #0fa645;font-weight: 800;font-family: sans-serif;text-align: center;margin: 0; padding:10px">
                Punetori
              </h1>

              <div style="display:flex;background-color: #332f46;padding: 20px 15px;font-size: 0.9em;color: #afacc3;font-family: sans-serif;">

                <p>${
                  user.jobTitle.charAt(0).toUpperCase() + user.jobTitle.slice(1)
                }</p>
                <p style=" margin-left: auto;">${newJobs} Jobs</p>

              </div>
        
              <ul style="padding: 0;margin: 0;color: #afacc3;font-family: sans-serif;background-color: #37334a;">
                ${html}
              </ul>

          </div>
        `,
      });
    }
  }
}

// Check if Emails are send
async function checkTime() {
  let onTime = false;
  const currentHour = new Date().getHours();
  // Get Schedule time
  const schedule = await Schedule.find();
  const timeSchedule = schedule[0].time;

  // Loop in the array of scheduled times
  for (const time of timeSchedule) {
    // If currentHour is the same as scheduled times
    if (time === currentHour) {
      // Check if emails are already send
      if (!schedule[0].usedTime.includes(time)) {
        onTime = true;

        // Add current hour to usedTime in db
        await Schedule.updateOne(
          { _id: "5f045262f1aabd0d4eaa4afa" },
          {
            $push: { usedTime: time },
          }
        );
      }
    }
  }

  // When the current time is bigger than the last scheduled time reset usedTime
  if (currentHour > timeSchedule[timeSchedule.length - 1]) {
    await Schedule.findByIdAndUpdate("5f045262f1aabd0d4eaa4afa", {
      time: [8, 12, 16, 20],
      usedTime: [],
    });
  }

  return onTime;
}

// @desc      Send Jobs with email
const sendEmails = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB, {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // const check = await checkTime();

    await processUsers();

    console.log("Email send successfully");
  } catch (error) {
    console.log("Failed to send emails", error);
  }

  process.exit();
};

sendEmails();
