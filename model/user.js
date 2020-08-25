const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const availableCity = [
  "tirane",
  "durres",
  "elbasan",
  "fier",
  "gjirokaster",
  "kavaje",
  "korce",
  "kruje",
  "kukes",
  "lezhe",
  "lushnje",
  "permet",
  "peshkopi",
  "pogradec",
  "puke",
  "sarande",
  "shkoder",
  "skrapar",
  "tepelene",
  "tirane",
  "tropoje",
  "vlore",
  "",
];

const availableType = [1, 2, 3, 0];

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    required: [true, "Please add an email address"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email address",
    ],
  },
  sendEmail: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    maxlength: 100,
    select: false,
  },
  jobTitle: String,
  jobCity: { type: String, enum: availableCity, default: "" },
  jobType: { type: Number, enum: availableType, default: 0 },
  verifiedAccountToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

UserSchema.methods.forgotPassword = function () {
  const generatedToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(generatedToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return generatedToken;
};

UserSchema.methods.verifyAccount = function () {
  const generatedToken = crypto.randomBytes(20).toString("hex");

  this.verifiedAccountToken = crypto
    .createHash("sha256")
    .update(generatedToken)
    .digest("hex");

  return generatedToken;
};

module.exports = mongoose.model("User", UserSchema);
