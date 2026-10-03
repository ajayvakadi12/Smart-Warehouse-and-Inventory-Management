const mongoose = require("mongoose");

const binSchema = new mongoose.Schema(
  {
    binCode: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    rack: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rack",
      required: true
    },

    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true
    },

    capacity: {
      type: Number,
      default: 100
    },

    currentStock: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ["Available", "Full", "Inactive"],
      default: "Available"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Bin", binSchema);