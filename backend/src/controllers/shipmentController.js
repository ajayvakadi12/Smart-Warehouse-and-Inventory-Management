const Shipment = require("../models/Shipment");
const Product = require("../models/Product");
const StockTransaction = require("../models/StockTransaction");
const InventoryLog = require("../models/InventoryLog");

const calculateStatus = (qty) => {
  if (qty <= 0) return "Out of Stock";
  if (qty <= 10) return "Low Stock";
  return "Available";
};

// Create Shipment
exports.createShipment = async (req, res) => {
  try {
    const shipment = await Shipment.create(req.body);

    res.status(201).json({
      success: true,
      message: "Shipment created successfully",
      data: shipment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Shipments
exports.getShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find()
      .populate("supplier")
      .populate("warehouse")
      .populate("products.product")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: shipments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Receive Shipment
exports.receiveShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    if (shipment.status === "Received") {
      return res.status(400).json({
        success: false,
        message: "Shipment already received",
      });
    }

    for (const item of shipment.products) {
      const product = await Product.findById(item.product);

      if (product) {
        const prevQty = product.quantity;
        product.quantity += item.quantity;
        product.status = calculateStatus(product.quantity);
        await product.save();

        await StockTransaction.create({
          product: product._id,
          warehouse: shipment.warehouse,
          transactionType: "Stock In",
          quantity: item.quantity,
          remarks: `Stock received from shipment #${shipment.trackingNumber || shipment._id}`,
        });

        await InventoryLog.create({
          product: product._id,
          action: "SHIPMENT_RECEIVED",
          previousQuantity: prevQty,
          newQuantity: product.quantity,
          changeAmount: item.quantity,
          warehouse: shipment.warehouse,
          performedBy: req.user?._id,
          notes: `Shipment received #${shipment.trackingNumber || shipment._id}`,
        });
      }
    }

    shipment.status = "Received";
    await shipment.save();

    res.json({
      success: true,
      message: "Shipment received successfully",
      data: shipment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};