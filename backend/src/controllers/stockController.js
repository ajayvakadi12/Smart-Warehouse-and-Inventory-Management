const StockTransaction = require("../models/StockTransaction");
const Product = require("../models/Product");
const InventoryLog = require("../models/InventoryLog");

// Helper to determine product stock status
const getProductStatus = (qty) => {
  if (qty <= 0) return "Out of Stock";
  if (qty <= 10) return "Low Stock";
  return "Available";
};

// Common handler for stock in / out
exports.createStockTransaction = async (req, res) => {
  try {
    const { product: productId, transactionType, warehouse, rack, bin, remarks } = req.body;
    const quantity = Number(req.body.quantity);

    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ success: false, message: "Quantity must be a positive number greater than 0" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const prevQty = product.quantity;

    if (transactionType === "Stock In") {
      product.quantity += quantity;
    } else if (transactionType === "Stock Out") {
      if (product.quantity < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock. Current stock is ${product.quantity}, requested deduction is ${quantity}. Stock cannot go below zero.`,
        });
      }
      product.quantity -= quantity;
    } else {
      return res.status(400).json({ success: false, message: "Invalid transaction type" });
    }

    product.status = getProductStatus(product.quantity);
    await product.save();

    const transaction = await StockTransaction.create({
      product: product._id,
      warehouse: warehouse || product.warehouse,
      rack: rack || undefined,
      bin: bin || undefined,
      transactionType,
      quantity,
      remarks: remarks || "",
    });

    // Audit Log
    await InventoryLog.create({
      product: product._id,
      action: transactionType === "Stock In" ? "STOCK_IN" : "STOCK_OUT",
      previousQuantity: prevQty,
      newQuantity: product.quantity,
      changeAmount: transactionType === "Stock In" ? quantity : -quantity,
      warehouse: warehouse || product.warehouse,
      performedBy: req.user?._id || undefined,
      notes: remarks || `Stock transaction: ${transactionType}`,
    });

    res.status(201).json({
      success: true,
      message: "Stock transaction completed successfully",
      data: transaction,
      currentStock: product.quantity,
      status: product.status,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/stock/in (PDF requirement)
exports.stockIn = async (req, res) => {
  req.body.transactionType = "Stock In";
  if (!req.body.product && req.body.productId) {
    req.body.product = req.body.productId;
  }
  return exports.createStockTransaction(req, res);
};

// POST /api/stock/out (PDF requirement)
exports.stockOut = async (req, res) => {
  req.body.transactionType = "Stock Out";
  if (!req.body.product && req.body.productId) {
    req.body.product = req.body.productId;
  }
  return exports.createStockTransaction(req, res);
};

// GET /api/stock/movements OR /api/stocks
exports.getStockTransactions = async (req, res) => {
  try {
    const { productId, warehouseId, type, page = 1, limit = 50 } = req.query;
    const query = {};

    if (productId) query.product = productId;
    if (warehouseId) query.warehouse = warehouseId;
    if (type) query.transactionType = type;

    const skip = (Number(page) - 1) * Number(limit);

    const transactions = await StockTransaction.find(query)
      .populate("product", "productName sku category price status quantity")
      .populate("warehouse", "warehouseName location")
      .populate("rack", "rackNumber")
      .populate("bin", "binNumber")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await StockTransaction.countDocuments(query);

    res.json({
      success: true,
      total,
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/stock/audit-logs
exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await InventoryLog.find()
      .populate("product", "productName sku")
      .populate("warehouse", "warehouseName")
      .populate("performedBy", "fullName email role")
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};