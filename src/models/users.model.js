import mongoose from "mongoose";
import jwt from "json-web-token";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true, // Indexing the username field for faster query performance.
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    projectId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    backlogId: {
      type: Schema.Types.ObjectId,
      ref: "Backlog",
    },
    userStoryId: [
      {
        type: Schema.Types.ObjectId,
        ref: "UserStory",
      },
    ],
    taskId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    sprintId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Sprint",
      },
    ],
    issueId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Issue",
      },
    ],
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);


// Middleware to hash the password before saving the user to the database.
userSchema.pre("save", async function (next) {
  // if the password field has not been modified it calls next() to move on to the next middleware or save operation.
  if (!this.isModified("password")) return next();

  // if the password field has been modified, it hashes the password and assigns it to the password field.
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


// Method to check if the password is correct.
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};


// Method to generate access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    // generate a token
    {
      // payload(data to be stored in token)
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET, // secret key
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY, // expiry time
    }
  );
};


// Method to generate refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};


export const User = mongoose.model("User", userSchema);
