const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
   title: { type: String, required: true },
  description: { type: String },
  image: {
    type: String, 
    required: true, 
  },
  price: {
    type: Number,
    required: true,
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
});

module.exports = mongoose.model("Course", courseSchema);
