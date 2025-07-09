const Course = require("../models/course");
const User = require("../models/user");

// admin creates new course
const createCourse = async (req, res) => {
  const { title, description, image, price } = req.body;

  try {
    const newCourse = new Course({
      title,
      description,
      image,   
      price    
    });

    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// view all courses
const getAllCourses = async (_, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Student enrolls in a course
const enrollInCourse = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Access denied. Students only." });
    }
    console.log("req.user:", req.user);

    const courseId = req.params.courseId;

    const course = await Course.findById(courseId);
    const student = await User.findById(req.user.userId);
    

    if (!course|| !student) {
  return res.status(404).json({ message: "Course or Student not found" });
   }



    if (student.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    student.enrolledCourses.push(courseId);
    await student.save();

    res.json({ message: "Enrolled successfully" });
  } catch (error) {
  console.error("Enrollment error:", error);  // add this
  res.status(500).json({ message: error.message || "Server error" });
}
};

// Student views enrolled courses
const getEnrolledCourses = async (req, res) => {
  try {
     const student = await User.findById(req.user.userId).populate("enrolledCourses");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student.enrolledCourses);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Admin views students enrolled in a specific course
const getStudentsInCourse = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const courseId = req.params.courseId;

    const students = await User.find({ role: "student", enrolledCourses: courseId }).select("name email");

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// delete course
const deleteCourse = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await Course.findByIdAndDelete(courseId);

    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// update course
const updateCourse = async (req, res) => {
  const { courseId } = req.params;
  const { title, description, image, price } = req.body;

  try {
    const updated = await Course.findByIdAndUpdate(
      courseId,
      { title, description, image, price },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// remove enrolled student from course
const removeStudent = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const { courseId, studentId } = req.params;
    const student = await User.findById(studentId);

    if (!student) return res.status(404).json({ message: "Student not found" });

    student.enrolledCourses = student.enrolledCourses.filter(id => id.toString() !== courseId);
    await student.save();

    res.json({ message: "Student removed from course" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// get course by ID
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  enrollInCourse,
  getEnrolledCourses,
  getStudentsInCourse,
  deleteCourse,
  updateCourse,
  removeStudent,
  getCourseById,
};
