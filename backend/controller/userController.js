const claimHistoryModel = require("../models/claimHistoryModel");
const userModel = require( "../models/userModel");


// Create New User
 const createUser = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

 
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

const claimPoints = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "User ID is required" });

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const points = Math.floor(Math.random() * 10) + 1;

    // Update user total points
    user.totalPoints += points;
    await user.save();
    const history = await claimHistoryModel.create({
      userId: user._id,
      pointsClaimed: points,
    });

    res.status(200).json({
      message: "Points claimed successfully",
      points,
      updatedPoints: user.totalPoints,
      history,
    });
  } catch (error) {
    console.error("Claim Points Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getAllClaimHistories = async (req, res) => {
  try {
    const history = await claimHistoryModel.find()
      .populate("userId", "name") 
      .sort({ claimedAt: -1 }); // Latest first

    res.status(200).json({ history });
  } catch (error) {
    console.error("Get History Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const resetAllPoints = async (req, res) => {
  try {
    const result = await userModel.updateMany({}, { $set: { totalPoints: 0 } });
    res.status(200).json({
      message: "Leaderboard reset successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Reset Points Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = { createUser, getAllUsers ,claimPoints,getAllClaimHistories,resetAllPoints};

