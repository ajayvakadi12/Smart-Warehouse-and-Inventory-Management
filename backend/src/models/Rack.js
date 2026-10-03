const mongoose = require("mongoose");

const rackSchema = new mongoose.Schema(
  {
    rackCode: {
      type: String,
      required: true,
      unique: true
    },

    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true
    },

    description: {
      type: String,
      default: ""
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

module.exports = mongoose.model("Rack", rackSchema);