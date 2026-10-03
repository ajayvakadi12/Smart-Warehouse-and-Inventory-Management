const Product = require("../models/Product");
const StockTransaction = require("../models/StockTransaction");
const InventoryLog = require("../models/InventoryLog");

const calculateStatus = (qty) => {
  if (qty <= 0) return "Out of Stock";
  if (qty <= 10) return "Low Stock";
  return "Available";
};

// Create Product
exports.createProduct = async (req, res) => {
  try {
    const { productName, sku, category, description, price, quantity, warehouse } = req.body;

    if (!productName || !sku || !category || price === undefined || !warehouse) {
      return res.status(400).json({
        success: false,
        message: "Product name, SKU, category, price, and warehouse are required",
      });
    }

    const existingSku = await Product.findOne({ sku });
    if (existingSku) {
      return res.status(400).json({
        success: false,
        message: `Product with SKU "${sku}" already exists`,
      });
    }

    const initialQty = Number(quantity) || 0;
    const status = calculateStatus(initialQty);

    const product = await Product.create({
      productName,
      sku,
      category,
      description: description || "",
      price: Number(price),
      quantity: initialQty,
      warehouse,
      status,
    });

    // Create audit log
    await InventoryLog.create({
      product: product._id,
      action: "PRODUCT_CREATED",
      previousQuantity: 0,
      newQuantity: initialQty,
      changeAmount: initialQty,
      warehouse,
      performedBy: req.user?._id,
      notes: `Product created with initial quantity ${initialQty}`,
    });

    if (initialQty > 0) {
      await StockTransaction.create({
        product: product._id,
        warehouse,
        transactionType: "Stock In",
        quantity: initialQty,
        remarks: "Initial stock on product creation",
      });
    }

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Products (Search + Filter by Category & Stock Level + Pagination)
exports.getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const search = req.query.search || "";
    const category = req.query.category || "";
    const status = req.query.status || req.query.stockLevel || "";
    const warehouse = req.query.warehouse || "";

    const query = {};

    // Search by Product Name or SKU
    if (search) {
      const sanitized = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { productName: { $regex: sanitized, $options: "i" } },
        { sku: { $regex: sanitized, $options: "i" } },
      ];
    }

    // Filter by Category
    if (category) {
      query.category = category;
    }

    // Filter by Stock Level / Status
    if (status) {
      query.status = status;
    }

    // Filter by Warehouse
    if (warehouse) {
      query.warehouse = warehouse;
    }

    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
      .populate("warehouse", "warehouseName location")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit) || 1,
      totalProducts,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Product By ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("warehouse", "warehouseName location");
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const history = await StockTransaction.find({ product: product._id })
      .populate("warehouse", "warehouseName")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: product,
      recentMovements: history,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const prevQty = product.quantity;

    if (req.body.productName) product.productName = req.body.productName;
    if (req.body.category) product.category = req.body.category;
    if (req.body.description !== undefined) product.description = req.body.description;
    if (req.body.price !== undefined) product.price = Number(req.body.price);
    if (req.body.warehouse) product.warehouse = req.body.warehouse;

    if (req.body.quantity !== undefined) {
      const newQty = Number(req.body.quantity);
      if (newQty < 0) {
        return res.status(400).json({ success: false, message: "Stock quantity cannot go below zero" });
      }
      product.quantity = newQty;
    }

    product.status = calculateStatus(product.quantity);
    await product.save();

    if (req.body.quantity !== undefined && req.body.quantity !== prevQty) {
      const diff = product.quantity - prevQty;
      await InventoryLog.create({
        product: product._id,
        action: "PRODUCT_UPDATED",
        previousQuantity: prevQty,
        newQuantity: product.quantity,
        changeAmount: diff,
        warehouse: product.warehouse,
        performedBy: req.user?._id,
        notes: "Quantity manually adjusted via update",
      });
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await InventoryLog.create({
      product: product._id,
      action: "PRODUCT_DELETED",
      previousQuantity: product.quantity,
      newQuantity: 0,
      changeAmount: -product.quantity,
      warehouse: product.warehouse,
      performedBy: req.user?._id,
      notes: `Product ${product.productName} deleted`,
    });

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Stock In (from product endpoint)
exports.stockIn = async (req, res) => {
  try {
    const quantity = Number(req.body.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ success: false, message: "Quantity must be greater than 0" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const prevQty = product.quantity;
    product.quantity += quantity;
    product.status = calculateStatus(product.quantity);
    await product.save();

    await StockTransaction.create({
      product: product._id,
      warehouse: req.body.warehouse || product.warehouse,
      transactionType: "Stock In",
      quantity,
      remarks: req.body.remarks || "Stock In via product action",
    });

    await InventoryLog.create({
      product: product._id,
      action: "STOCK_IN",
      previousQuantity: prevQty,
      newQuantity: product.quantity,
      changeAmount: quantity,
      warehouse: product.warehouse,
      performedBy: req.user?._id,
      notes: req.body.remarks || "Stock In",
    });

    res.json({
      success: true,
      message: "Stock added successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Stock Out (from product endpoint)
exports.stockOut = async (req, res) => {
  try {
    const quantity = Number(req.body.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ success: false, message: "Quantity must be greater than 0" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Current stock is ${product.quantity}, requested deduction is ${quantity}. Stock cannot go below zero.`,
      });
    }

    const prevQty = product.quantity;
    product.quantity -= quantity;
    product.status = calculateStatus(product.quantity);
    await product.save();

    await StockTransaction.create({
      product: product._id,
      warehouse: req.body.warehouse || product.warehouse,
      transactionType: "Stock Out",
      quantity,
      remarks: req.body.remarks || "Stock Out via product action",
    });

    await InventoryLog.create({
      product: product._id,
      action: "STOCK_OUT",
      previousQuantity: prevQty,
      newQuantity: product.quantity,
      changeAmount: -quantity,
      warehouse: product.warehouse,
      performedBy: req.user?._id,
      notes: req.body.remarks || "Stock Out",
    });

    res.json({
      success: true,
      message: "Stock removed successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};