const mongoose = require("mongoose");

const stockTransactionSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },

    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true
    },

    rack: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rack"
    },

    bin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bin"
    },

    transactionType: {
      type: String,
      enum: ["Stock In", "Stock Out", "Transfer"],
      required: true
    },

    quantity: {
      type: Number,
      required: true
    },

    remarks: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("StockTransaction", stockTransactionSchema);