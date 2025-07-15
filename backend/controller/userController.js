const userModel = require( "../models/userModel");


// Create New User
 const createUser = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    // Check if user already exists
    const existingUser = await userModel.findOne({ name });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const newUser = new userModel({ name });
    await newUser.save();

    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Create User Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find().sort({ totalPoints: -1 });
    res.status(200).json({ users });
  } catch (error) {
    console.error("Get All Users Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { createUser, getAllUsers };

