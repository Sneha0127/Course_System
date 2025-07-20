const User = require("../models/user");

// get profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      profilePicture: user.profilePicture,
      description: user.description,
    });
    // console.log(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

// UPDATE profile
const updateProfile = async (req, res) => {
  try {
    const updates = req.body;

    //if a file has been uploaded then req.file exists
    if (req.file) {
      updates.profilePicture = `/uploads/${req.file.filename}`; // Relative path to access image
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true, //new obj is returned 
    }).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error updating profile", error: err.message });
  }
};

module.exports = { getProfile, updateProfile };
