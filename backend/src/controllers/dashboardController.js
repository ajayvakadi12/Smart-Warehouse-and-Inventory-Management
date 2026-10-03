const Product = require("../models/Product");
const Order = require("../models/Order");
const Shipment = require("../models/Shipment");
const Warehouse = require("../models/Warehouse");
const Category = require("../models/Category");
const StockTransaction = require("../models/StockTransaction");

// Dashboard Overview / Summary (PDF: GET /api/dashboard/summary)
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalProducts,
      totalOrders,
      totalShipments,
      totalWarehouses,
      totalCategories,
      pendingOrders,
      shippedOrders,
      receivedShipments,
      lowStockCount,
      outOfStockCount,
    ] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      Shipment.countDocuments(),
      Warehouse.countDocuments(),
      Category.countDocuments(),
      Order.countDocuments({ status: "Pending" }),
      Order.countDocuments({ status: "Shipped" }),
      Shipment.countDocuments({ status: "Received" }),
      Product.countDocuments({ quantity: { $gt: 0, $lte: 10 } }),
      Product.countDocuments({ quantity: 0 }),
    ]);

    // Inventory Cost and Total Quantity Aggregation
    const inventoryAgg = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalCost: { $sum: { $multiply: ["$price", "$quantity"] } },
          totalQuantity: { $sum: "$quantity" },
        },
      },
    ]);

    const totalCost = inventoryAgg[0]?.totalCost || 0;
    const totalQuantity = inventoryAgg[0]?.totalQuantity || 0;

    // Stock In / Out totals
    const [stockInAgg, stockOutAgg] = await Promise.all([
      StockTransaction.aggregate([
        { $match: { transactionType: "Stock In" } },
        { $group: { _id: null, total: { $sum: "$quantity" } } },
      ]),
      StockTransaction.aggregate([
        { $match: { transactionType: "Stock Out" } },
        { $group: { _id: null, total: { $sum: "$quantity" } } },
      ]),
    ]);

    const stockIn = stockInAgg[0]?.total || 0;
    const stockOut = stockOutAgg[0]?.total || 0;

    // Recent Orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("customerName totalAmount status createdAt");

    // Low stock items list for alerts (PDF: Low-stock alerts)
    const lowStockAlerts = await Product.find({
      quantity: { $lte: 10 },
    })
      .populate("warehouse", "warehouseName")
      .select("productName sku quantity status warehouse")
      .sort({ quantity: 1 })
      .limit(10);

    // Recent movements for simulated real-time tracking
    const recentMovements = await StockTransaction.find()
      .populate("product", "productName sku")
      .populate("warehouse", "warehouseName")
      .sort({ createdAt: -1 })
      .limit(5);

    // Predictive restocking logic (Bonus feature from PDF)
    // Estimate daily burn rate from past 30 days of Stock Out transactions
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const stockOutStats = await StockTransaction.aggregate([
      {
        $match: {
          transactionType: "Stock Out",
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: "$product",
          totalOut: { $sum: "$quantity" },
        },
      },
    ]);

    const outMap = new Map();
    stockOutStats.forEach((s) => outMap.set(String(s._id), s.totalOut));

    const sampleProducts = await Product.find().limit(10);
    const predictiveRestock = sampleProducts.map((p) => {
      const outIn30Days = outMap.get(String(p._id)) || 1;
      const dailyUsage = Math.max(0.1, outIn30Days / 30);
      const daysRemaining = Math.round(p.quantity / dailyUsage);
      return {
        productId: p._id,
        productName: p.productName,
        currentStock: p.quantity,
        estimatedDailyUsage: Number(dailyUsage.toFixed(1)),
        daysRemaining: daysRemaining < 0 ? 0 : daysRemaining,
        recommendation:
          p.quantity <= 10
            ? "Reorder Immediately"
            : daysRemaining <= 7
            ? "Reorder Soon"
            : "Adequate Stock",
      };
    });

    const responsePayload = {
      inventory: {
        totalProducts,
        totalCategories,
        totalWarehouses,
        totalCost,
        totalQuantity,
      },
      orders: {
        totalOrders,
        pendingOrders,
        shippedOrders,
        recentOrders,
      },
      shipments: {
        totalShipments,
        receivedShipments,
      },
      stock: {
        stockIn,
        stockOut,
        lowStockProducts: lowStockCount,
        outOfStockProducts: outOfStockCount,
      },
      lowStockAlerts,
      recentMovements,
      predictiveRestock,
    };

    res.status(200).json({
      success: true,
      data: responsePayload,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};