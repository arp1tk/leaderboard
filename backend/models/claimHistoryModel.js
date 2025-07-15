const mongoose = require("mongoose");

const claimHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    pointsClaimed: {
        type: Number,
        required: true
    },
    claimedAt: {
        type: Date,
        default: Date.now
    },
});

const claimHistoryModel = mongoose.model("ClaimHistory", claimHistorySchema);
module.exports = claimHistoryModel;
