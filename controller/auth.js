const User = require("../model/user");
const BookmarkedJob = require("../model/bookmarkedJob");
const JobCategory = require("../model/jobCategory");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const getJobs = require("../utils/getJobs");

// @desc      Register User
// @route     POST /auth/register
// @access    Public
exports.registerUser = async (req, res, next) => {
  try {
    delete req.body["verifiedAccountToken"];
    delete req.body["resetPasswordToken"];
    delete req.body["resetPasswordExpire"];
    delete req.body["createdAt"];
    delete req.body["sendEmail"];
    const { email } = req.body;

    const exist = await User.findOne({ email });

    if (exist) {
      return next({
        message: "User already exists",
        statusCode: 400,
      });
    }

    const user = await User.create(req.body);

    const verifyToken = user.verifyAccount();
    await user.save({ validateBeforeSave: false });

    await sendEmail({
      email,
      subject: "Verify Account",
      text: "Please Verify account by clicking the link bellow",
      html: `
      <div style="background-color: #302c45;width: 100%;height: 100%;margin: auto;">
        <h1 style="color: #0fa645;font-weight: 800;font-family: sans-serif;text-align: center;margin: 0;padding: 10px;">
          Punetori
        </h1>

        <div style="padding: 20px 0;margin: auto;color: #afacc3;font-family: sans-serif;background-color: #37334a;text-align: center;">
          <h2 style="margin: 0;">Verify Account</h2>
          <a style="background-color: #12ad47;padding: 10px 25px;display: inline-block;border: none;border-radius: 3px;color: #d6ffe8;transition: background-color 0.2s;margin: 20px 0;text-decoration: none;" href="${process.env.CLIENT_URL}verify/${verifyToken}" >
            Verify
          </a>
        </div>
      </div>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Please check your email address",
    });
  } catch (error) {
    next(error);
  }
};

// @desc      Verify Account
// @route     GET /auth/verify/:token
// @access    Public
exports.verifyAccount = async (req, res, next) => {
  try {
    const verifiedAccountToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      verifiedAccountToken,
    });

    if (!user) {
      return next({
        message: "Invalid Token",
        statusCode: 404,
      });
    }

    user.verifiedAccountToken = undefined;
    user.sendEmail = true;
    await user.save();

    const token = user.getSignedToken();

    res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// @desc      Login User
// @route     POST /auth/login
// @access    Public
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email && !password) {
      return next({
        message: "Please provide all needed credentials",
        statusCode: 400,
      });
    }

    const user = await User.findOne({
      email,
      verifiedAccountToken: undefined,
    }).select("+password");

    if (!user) {
      return next({
        message: "Invalid Credentials",
        statusCode: 401,
      });
    }

    const matchPassword = await user.matchPassword(password);

    if (!matchPassword) {
      return next({
        message: "Invalid Credentials",
        statusCode: 401,
      });
    }

    const token = user.getSignedToken();

    res.status(201).json({
      success: true,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc      Get User Detail
// @route     GET /auth/me
// @access    Private
exports.getUserDetail = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc      Update User Detail
// @route     PUT /auth/update
// @access    Private
exports.updateUserDetail = async (req, res, next) => {
  try {
    delete req.body["password"];
    delete req.body["verifiedAccountToken"];
    delete req.body["resetPasswordToken"];
    delete req.body["resetPasswordExpire"];
    delete req.body["createdAt"];

    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      runValidators: true,
      new: true,
    });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc      Update User Password
// @route     PUT /auth/update/password
// @access    Private
exports.updateUserPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return next({
        message: "Please provide current password and new password",
        statusCode: 400,
      });
    }

    const user = await User.findById(req.user.id).select("+password");

    const matchPassword = await user.matchPassword(currentPassword);

    if (!matchPassword) {
      return next({
        message: "Wrong Password",
        statusCode: 400,
      });
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: true });

    res.status(200).json({
      success: true,
      message: "Password was updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc      Get User Jobs
// @route     GET /auth/jobs
// @access    Private
exports.getUserJobs = async (req, res, next) => {
  try {
    const query = req.user.jobTitle;
    const city = req.user.jobCity;
    const type = req.user.jobType;
    let data;

    const jobs = await JobCategory.findOne({
      $text: { $search: query },
      city,
      type,
    });

    if (!jobs) {
      data = await getJobs(query, city, type);

      await JobCategory.create({
        name: query,
        jobs: data,
        city,
        type,
        count: [data.length],
      });
    } else {
      if (jobs.jobs.length === 0) {
        data = await getJobs(query, city, type);

        await JobCategory.findByIdAndUpdate(jobs._id, {
          jobs: data,
          $push: { count: data.length },
        });
      } else {
        data = jobs.jobs;
      }
    }

    // todo Find a better solution to check if a job is bookmarked
    const jobLinks = [];
    data.forEach((e) => {
      jobLinks.push(e.link);
    });

    const bookmarkedJobs = await BookmarkedJob.find({
      link: jobLinks,
      user: req.user._id,
    });

    const bookmark = {};
    bookmarkedJobs.forEach((e) => {
      bookmark[e.link] = 1;
    });

    const finalData = data.map((e) => {
      if (bookmark[e.link]) {
        return { ...e, bookmarked: true };
      }
      return e;
    });

    res.status(200).json({
      success: true,
      query,
      data: finalData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc      Bookmark Job
// @route     POST /auth/bookmark
// @access    Private
exports.bookmarkJob = async (req, res, next) => {
  try {
    const { title, link } = req.body;

    if (!title && !link) {
      return next({
        message: "Please provide a title and link",
        statusCode: 400,
      });
    }

    const getJobId = () => {
      if (link.includes("njoftimefalas.com")) {
        return link.split("oferta-njoftime-pune/")[1];
      }
      if (link.includes("duapune.com")) {
        return link.split("/jobs/")[1];
      }
      if (link.includes("njoftime.com")) {
        return link.split("showthread.php?")[1];
      }
    };

    let jobId = getJobId();
    const checkBookmarkStatus = async () => {
      const job = await BookmarkedJob.find({ jobId, user: req.user._id });

      if (job.length === 0) {
        return false;
      }

      return true;
    };

    if (await checkBookmarkStatus()) {
      return next({
        message: "Job is already bookmarked",
        statusCode: 400,
      });
    }

    await BookmarkedJob.create({ title, link, user: req.user._id, jobId });

    res.status(200).json({
      success: true,
      message: "Job bookmarked",
    });
  } catch (error) {
    next(error);
  }
};

// @desc      UnBookmark Job
// @route     DELETE /auth/bookmark/:link
// @access    Private
exports.unBookmarkJob = async (req, res, next) => {
  try {
    const job = await BookmarkedJob.findOneAndRemove({
      jobId: req.params.link,
      user: req.user._id,
    });

    if (!job) {
      return next({
        message: "Job is not bookmarked",
        statusCode: 404,
      });
    }

    res.status(200).json({
      success: true,
      message: "Job was unbokmarked successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc      Check if Job is Bookmarked
// @route     GET /auth/bookmark/check
// @access    Private
exports.checkBookmarkStatus = async (req, res, next) => {
  try {
    const { link } = req.body;

    if (!link) {
      return next({
        message: "Please provide a title and link",
        statusCode: 400,
      });
    }

    const getJobId = () => {
      if (link.includes("njoftimefalas.com")) {
        return link.split("oferta-njoftime-pune/")[1];
      }
      if (link.includes("duapune.com")) {
        return link.split("/jobs/")[1];
      }
      if (link.includes("njoftime.com")) {
        return link.split("showthread.php?")[1];
      }
    };

    let jobId = getJobId();
    const checkBookmarkStatus = async () => {
      const job = await BookmarkedJob.find({ jobId, user: req.user._id });

      if (job.length === 0) {
        return true;
      }

      return false;
    };

    if (await checkBookmarkStatus()) {
      return next({
        message: "Job is not bookmarked",
        statusCode: 400,
      });
    }

    res.status(200).json({
      success: true,
      message: "Job is Bookmarked",
    });
  } catch (error) {
    next(error);
  }
};

// @desc      View Bookmarked Jobs
// @route     GET /auth/bookmark
// @access    Private
exports.viewBookmark = async (req, res, next) => {
  try {
    let query = BookmarkedJob.find(
      { user: req.user._id },
      {
        title: 1,
        link: 1,
      }
    );

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await BookmarkedJob.find({
      user: req.user._id,
    }).countDocuments();
    const pagination = {
      currentPage: page,
      limit,
      count: total,
    };

    query = query.skip(startIndex).limit(limit);

    if (startIndex > 0) {
      pagination.prevPage = page - 1;
    }

    if (total > endIndex) {
      pagination.nextPage = page + 1;
    }

    const data = await query;

    res.status(200).json({
      success: true,
      pagination,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// @desc      Forgot Password
// @route     POST /auth/forgotpassword
// @access    Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return next({
        message: "Please provide an email address",
        statusCode: 400,
      });
    }

    const redex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const checkEmail = redex.test(email);

    if (!checkEmail) {
      return next({
        message: "Please provide a valid email address",
        statusCode: 400,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return next({
        message: `User with email: ${email} does not exist`,
        statusCode: 404,
      });
    }

    const resetToken = user.forgotPassword();

    await user.save({ validateBeforeSave: false });

    await sendEmail({
      email,
      subject: "Forgot Password Token",
      text: `
      ${process.env.CLIENT_URL}resetpassword/${resetToken}
      Click The Link Up to Reset Password
      `,
    });

    res.status(201).json({
      success: true,
      message: "Please check your email address",
    });
  } catch (error) {
    return next({
      message: "Email could not be sent",
      statusCode: 500,
    });
  }
};

// @desc      Reset Password
// @route     PUT /auth/resetpassword/:token
// @access    Public
exports.resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next({
        message: "Invalid Token",
        statusCode: 400,
      });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = user.getSignedToken();

    res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc      Delete Uset
// @route     DELETE /auth/remove
// @access    Private
exports.deleteUser = async (req, res, next) => {
  try {
    await BookmarkedJob.deleteMany({
      user: req.user._id,
    });

    await User.deleteOne({
      _id: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "Your account was deleted successfullys",
    });
  } catch (error) {
    next(error);
  }
};
