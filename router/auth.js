const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserDetail,
  updateUserDetail,
  updateUserPassword,
  getUserJobs,
  forgotPassword,
  resetPassword,
  bookmarkJob,
  viewBookmark,
  checkBookmarkStatus,
  unBookmarkJob,
  deleteUser,
  verifyAccount,
} = require("../controller/auth");

const protect = require("../middleware/protect");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/verify/:token", verifyAccount);

router.get("/me", protect, getUserDetail);
router.put("/update", protect, updateUserDetail);
router.put("/update/password", protect, updateUserPassword);
router.get("/jobs", protect, getUserJobs);
router.delete("/remove", protect, deleteUser);

router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:token", resetPassword);

router.post("/bookmark", protect, bookmarkJob);
router.get("/bookmark", protect, viewBookmark);
router.delete("/bookmark/:link", protect, unBookmarkJob);
router.post("/bookmark/check", protect, checkBookmarkStatus);

module.exports = router;
