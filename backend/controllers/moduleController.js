const Module = require("../models/module.js");
const User = require("../models/user.js");

// Create a new module
const createModule = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, order, quesSet } = req.body;

    const newModule = new Module({
      course: courseId,
      title,
      description,
      order,
      quesSet,
    });

    await newModule.save();
    res.status(201).json(newModule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all modules for a course with unlock info
const getModulesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const modules = await Module.find({ course: courseId }).sort({ order: 1 });
    const user = await User.findById(userId).select("completedModules unlockedModules");

    const response = modules.map((mod) => ({
  _id: mod._id,
  title: mod.title,
  description: mod.description,
  order: mod.order,
  unlocked: mod.unlockedBy.includes(userId),  
  unlockedBy: mod.unlockedBy,             
  completed: user.completedModules.includes(mod._id),
}));

    res.json(response);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch modules" });
  }
};


//Get a single module by ID
const getModule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.moduleId).select(
      "title description order quesSet"
    );
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }
    res.status(200).json(module);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Submit quiz & unlock next module if passed
const submitQuiz = async (req, res) => {
  try {
    const { moduleId, quesSetId } = req.params;
    const { answers } = req.body;

    const module = await Module.findById(moduleId);
    if (!module) return res.status(404).json({ message: "Module not found" });

    const quesSet = module.quesSet.id(quesSetId);
    if (!quesSet) return res.status(404).json({ message: "Question set not found" });

    let correctCount = 0;
    quesSet.quiz.forEach((q, index) => {
      if (q.correctAnswer === answers[index]) correctCount++;
    });

    const total = quesSet.quiz.length;
    const passingScore = Math.ceil(total * 0.7);
    const passed = correctCount >= passingScore;

    if (passed) {
      // Mark current module as completed
      await User.findByIdAndUpdate(
        req.user.id,
        { $addToSet: { completedModules: moduleId } },
        { new: true }
      );

      //Find next module in the same course
      const nextModule = await Module.findOne({
        course: module.course,
        order: module.order + 1,
      });

      // Unlock next module for this student
   if (nextModule) {
  await Module.findByIdAndUpdate(
    nextModule._id,
    { $addToSet: { unlockedBy: req.user.id } },
    { new: true }
  );
} else {
  // If this is the last module, mark it as unlocked for reference
  await Module.findByIdAndUpdate(
    module._id,
    { $addToSet: { unlockedBy: req.user.id } },
    { new: true }
  );
}
    }

    res.status(200).json({
      correctCount,
      total,
      passingScore,
      passed,
    });
  } catch (err) {
    console.error("Error submitting quiz:", err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  createModule,
  getModulesByCourse,
  getModule,
  submitQuiz,
};
