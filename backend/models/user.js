const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true ,required:true},
  password: String,
  role: { type: String, enum: ["student", "admin"] },
  age: Number,
  gender: String,
  profilePicture: String, // store URL 
  description: String,
 enrolledCourses: [
    {
      course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
      enrollmentDate: { type: Date, default: Date.now }
    }
  ],
  completedModules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Module" }],
   unlockedModules: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Module" }
  ]
});

module.exports = mongoose.model("user", userSchema);
