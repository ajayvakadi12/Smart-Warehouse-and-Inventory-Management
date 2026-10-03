const Bin = require("../models/Bin");

// Create Bin
exports.createBin = async (req, res) => {
  try {
    const bin = await Bin.create(req.body);

    res.status(201).json({
      success: true,
      message: "Bin created successfully",
      data: bin
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Bins
exports.getBins = async (req, res) => {
  try {

    const bins = await Bin.find()
      .populate("warehouse")
      .populate("rack");

    res.json({
      success: true,
      data: bins
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};