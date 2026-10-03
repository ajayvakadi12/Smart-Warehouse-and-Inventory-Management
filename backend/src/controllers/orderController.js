const Order = require("../models/order");
const Product = require("../models/Product");
const StockTransaction = require("../models/StockTransaction");

// ==============================
// Create Order
// ==============================
// ==============================
// Create Order
// ==============================
exports.createOrder = async (req, res) => {
  try {
    console.log("===== CREATE ORDER =====");
    console.log("USER:", req.user);
    console.log("BODY:", req.body);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const orderData = {
      ...req.body,
      createdBy: req.user._id,
    };

    const order = await Order.create(orderData);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get All Orders
// ==============================
exports.getOrders = async (req, res) => {
  try {
    const {
      search,
      status,
      page = 1,
      limit = 10,
    } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        {
          customerName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          customerEmail: {
            $regex: search,
            $options: "i",
          },
        },
        {
          customerPhone: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .populate("createdBy", "fullName email")
      .populate("products.product")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const totalOrders = await Order.countDocuments(query);

    res.json({
      success: true,
      totalOrders,
      currentPage: Number(page),
      totalPages: Math.ceil(totalOrders / limit),
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get Single Order
// ==============================
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("createdBy", "fullName email")
      .populate("products.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Update Order Status
// ==============================
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status === "Shipped") {
      return res.status(400).json({
        success: false,
        message: "Order already shipped",
      });
    }

    if (status === "Shipped") {
      for (const item of order.products) {
        const product = await Product.findById(item.product);

        if (!product) continue;

        if (product.quantity < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${product.productName}`,
          });
        }

        // Reduce Stock
        product.quantity -= item.quantity;

        // Auto Status
        if (product.quantity === 0) {
          product.status = "Out of Stock";
        } else if (product.quantity <= 10) {
          product.status = "Low Stock";
        } else {
          product.status = "Available";
        }

        await product.save();

        // Stock Transaction
        await StockTransaction.create({
          product: product._id,
          warehouse: product.warehouse,
          transactionType: "Stock Out",
          quantity: item.quantity,
          remarks: `Order shipped (${order.customerName})`,
        });
      }
    }

    order.status = status;

    await order.save();

    res.json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Delete Order
// ==============================
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
  console.error("CREATE ORDER ERROR:");
  console.error(error);

  res.status(500).json({
    success: false,
    message: error.message,
    stack: error.stack,
  });
}
};