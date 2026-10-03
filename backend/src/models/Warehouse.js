const mongoose = require("mongoose");

const warehouseSchema = new mongoose.Schema(
  {
    warehouseName: {
      type: String,
      required: true
    },

    location: {
      type: String,
      required: true
    },

    managerName: {
      type: String,
      required: true
    },

    capacity: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Warehouse", warehouseSchema);