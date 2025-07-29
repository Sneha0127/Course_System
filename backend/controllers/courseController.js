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

    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    const student = await User.findById(req.user.id);

    if (!course || !student) {
      return res.status(404).json({ message: "Course or Student not found" });
    }

   let alreadyEnrolled = false;
for (let i = 0; i < student.enrolledCourses.length; i++) {
  const entry = student.enrolledCourses[i];
  if (entry.course && entry.course.toString() === courseId) { //if entry.course is present then only chage to string , preventing null values or undefined
    alreadyEnrolled = true;
    break;
  }
}
if(alreadyEnrolled){
  return res.json({message:"Already Enrolled !!"})
}

    student.enrolledCourses.push({
      course: courseId,
      enrollmentDate: new Date()
    });

    await student.save();
    res.json({ message: "Enrolled successfully" });
  } catch (error) {
    console.error("Enrollment error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// Student views enrolled courses
const getEnrolledCourses = async (req, res) => {
  try {
    const student = await User.findById(req.user.id).populate("enrolledCourses.course");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const enrolledCourses = student.enrolledCourses.map(entry => ({
      _id: entry.course._id,
      title: entry.course.title,
      description: entry.course.description,
      price: entry.course.price,
      image: entry.course.image,
      enrollmentDate: entry.enrollmentDate
    }));

    res.json(enrolledCourses);
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
    const students = await User.find({
      role: "student",
      "enrolledCourses.course": courseId,
    }).select("name email profilePicture enrolledCourses");

    const filtered = students.map((student) => {
      const courseData = student.enrolledCourses.find(
        (entry) => entry.course && entry.course.toString() === courseId
      );
    console.log(student.profilePicture);
      return {
        _id: student._id,
        name: student.name,
        email: student.email,
        profilePicture: student.profilePicture || null,
        enrollmentDate: courseData?.enrollmentDate || null,
      };
    });

    res.json(filtered);
  } catch (error) {
    console.error("Error fetching students in course:", error);
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

   student.enrolledCourses = student.enrolledCourses.filter(
  (entry) => entry.course && entry.course.toString() !== courseId
);
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

// Search courses by title 
const searchCourses = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 2) {
      return res.status(400).json({ message: "Query too short" });
    }

    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escapedQuery, "i");

    const courses = await Course.find({ title: regex }).select("title _id");
    res.json(courses);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Search failed" });
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
  searchCourses,
};
