const Product = require("../models/Product");
const Order = require("../models/Order");
const StockTransaction = require("../models/StockTransaction");

// Inventory Report
exports.getInventoryReport = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("warehouse", "warehouseName location")
      .select("productName sku category quantity price status warehouse")
      .sort({ productName: 1 });

    const totalStockResult = await Product.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$quantity" },
          totalValue: { $sum: { $multiply: ["$price", "$quantity"] } },
        },
      },
    ]);

    const totalStock = totalStockResult[0]?.total || 0;
    const totalValue = totalStockResult[0]?.totalValue || 0;

    res.status(200).json({
      success: true,
      data: {
        totalStock,
        totalValue,
        products,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Sales Report
exports.getSalesReport = async (req, res) => {
  try {
    const salesAggregate = await Order.aggregate([
      {
        $match: {
          status: { $in: ["Shipped", "Delivered"] },
        },
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalOrders = salesAggregate[0]?.totalOrders || 0;
    const totalRevenue = salesAggregate[0]?.totalRevenue || 0;

    const recentCompletedOrders = await Order.find({
      status: { $in: ["Shipped", "Delivered"] },
    })
      .select("customerName customerEmail totalAmount status createdAt")
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        recentOrders: recentCompletedOrders,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Stock Movement Report
exports.getStockReport = async (req, res) => {
  try {
    const transactions = await StockTransaction.find()
      .populate("product", "productName sku category price")
      .populate("warehouse", "warehouseName location")
      .populate("rack", "rackNumber")
      .populate("bin", "binNumber")
      .sort({ createdAt: -1 })
      .limit(200);

    res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};