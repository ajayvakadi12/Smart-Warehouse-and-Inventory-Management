const Rack = require("../models/Rack");

// Create Rack
exports.createRack = async (req, res) => {
  try {
    const rack = await Rack.create(req.body);

    res.status(201).json({
      success: true,
      message: "Rack created successfully",
      data: rack
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Racks
exports.getRacks = async (req, res) => {
  try {
    const racks = await Rack.find().populate("warehouse");

    res.json({
      success: true,
      data: racks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};