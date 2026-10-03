const mongoose = require("mongoose");

const shipmentSchema = new mongoose.Schema(
  {
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true
    },

    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true
    },

    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },

        quantity: {
          type: Number,
          required: true
        }
      }
    ],

    status: {
      type: String,
      enum: [
        "Pending",
        "Received",
        "Cancelled"
      ],
      default: "Pending"
    },

    shipmentDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);


module.exports = mongoose.model("Shipment", shipmentSchema);                