import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import validator from "validator";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Don't forget the name"],
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Don't forget the email"],
    validate: {
      validator: validator.isEmail,
      message: "What is that? An email?",
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Don't forget the password"],
    minlength: 6,
    select: false, //non funziona per create()
  },
  lastName: {
    type: String,
    minlength: 3,
    maxlength: 20,
    trim: true,
    default: "Wootalano",
  },
  location: {
    type: String,
    minlength: 2,
    maxlength: 30,
    trim: true,
    default: "Barcelona",
  },
});

//pre('save') funziona solo con save() e create(), no con findAndUpdate!!
UserSchema.pre("save", async function () {
  // console.log(this.modifiedPaths()); controlla cosa viene modificato rispetto a database

  if (!this.isModified("password")) return;

  // encrypt the password
  const salt = await bcryptjs.genSalt(10); // 10 é una quantità sicura!
  this.password = await bcryptjs.hash(this.password, salt);
});

// Create JWT custom function
UserSchema.methods.createJWT = function () {
  // jwt.sign(payload, secret, options)
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
    // expiresIn: "1" TESTING,
  });
};

// Compare password custom function
UserSchema.methods.comparePassword = async function (enterPassword) {
  const isMatch = await bcryptjs.compare(enterPassword, this.password);
  return isMatch;
};

export default mongoose.model("User", UserSchema);
