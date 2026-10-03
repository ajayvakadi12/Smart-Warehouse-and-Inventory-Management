require("dotenv").config({
  path: require("path").resolve(__dirname, "../../../.env"),
});

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Warehouse = require("../models/Warehouse");
const Category = require("../models/Category");
const Supplier = require("../models/Supplier");
const Product = require("../models/Product");
const Rack = require("../models/Rack");
const Bin = require("../models/Bin");
const StockTransaction = require("../models/StockTransaction");
const Order = require("../models/Order");
const Shipment = require("../models/Shipment");
const InventoryLog = require("../models/InventoryLog");

async function seed() {
  try {
    console.log("Connecting to MongoDB for seeding...");
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log("MongoDB connected.");

    // Clear existing data (optional / safe reset)
    console.log("Clearing old collections...");
    await Promise.all([
      User.deleteMany({}),
      Warehouse.deleteMany({}),
      Category.deleteMany({}),
      Supplier.deleteMany({}),
      Product.deleteMany({}),
      Rack.deleteMany({}),
      Bin.deleteMany({}),
      StockTransaction.deleteMany({}),
      Order.deleteMany({}),
      Shipment.deleteMany({}),
      InventoryLog.deleteMany({}),
    ]);

    // 1. Seed Users
    console.log("Seeding Demo Users...");
    const adminPassword = await bcrypt.hash("Admin@123", 10);
    const managerPassword = await bcrypt.hash("Manager@123", 10);
    const staffPassword = await bcrypt.hash("Staff@123", 10);

    const admin = await User.create({
      fullName: "System Administrator",
      email: "admin@warehouse.com",
      password: adminPassword,
      phone: "+91 9876543210",
      role: "Admin",
    });

    const manager = await User.create({
      fullName: "Alex Miller (Manager)",
      email: "manager@warehouse.com",
      password: managerPassword,
      phone: "+91 9876543211",
      role: "Warehouse Manager",
    });

    const staff = await User.create({
      fullName: "Sarah Jenkins (Staff)",
      email: "staff@warehouse.com",
      password: staffPassword,
      phone: "+91 9876543212",
      role: "Staff",
    });

    // 2. Seed Warehouses
    console.log("Seeding Warehouses...");
    const warehouseA = await Warehouse.create({
      warehouseName: "Central Logistics Hub",
      location: "Sector 62, Noida, UP",
      managerName: manager.fullName,
      capacity: 50000,
      status: "Active",
    });

    const warehouseB = await Warehouse.create({
      warehouseName: "West Distribution Facility",
      location: "Bhiwandi, Mumbai, MH",
      managerName: "Rajesh Kumar",
      capacity: 35000,
      status: "Active",
    });

    // 3. Seed Racks & Bins
    console.log("Seeding Racks & Bins...");
    const rack1 = await Rack.create({
      rackCode: "RACK-A1",
      warehouse: warehouseA._id,
      description: "Aisle 1 Heavy Pallet Storage",
      status: "Active",
    });
    const bin1 = await Bin.create({
      binCode: "BIN-A1-01",
      warehouse: warehouseA._id,
      rack: rack1._id,
      capacity: 100,
      currentStock: 30,
      status: "Available",
    });

    // 4. Seed Categories
    console.log("Seeding Categories...");
    const catElectronics = await Category.create({
      categoryName: "Electronics",
      description: "Smartphones, Laptops, Accessories",
    });
    const catIndustrial = await Category.create({
      categoryName: "Industrial & Tools",
      description: "Sensors, Power tools, Safety equipment",
    });
    const catPackaging = await Category.create({
      categoryName: "Packaging Materials",
      description: "Boxes, Tapes, Thermal rolls",
    });

    // 5. Seed Suppliers
    console.log("Seeding Suppliers...");
    const supApex = await Supplier.create({
      supplierName: "Apex Components International",
      contactPerson: "David Harris",
      email: "orders@apexcomponents.com",
      phone: "+1 555-0199",
      address: "100 Innovation Way, Austin, TX",
    });
    const supPrime = await Supplier.create({
      supplierName: "Prime Logistics Supplies Ltd",
      contactPerson: "Priya Sharma",
      email: "sales@primelogistics.in",
      phone: "+91 9988776655",
      address: "Plot 45, GIDC Industrial Estate, Gujarat",
    });

    // 6. Seed Products
    console.log("Seeding Products...");
    const prod1 = await Product.create({
      productName: "Barcode Scanner Handheld 2D",
      sku: "SKU-SCAN-001",
      category: catElectronics.categoryName,
      description: "Wireless QR & Barcode laser reader for warehouse fulfillment",
      price: 4500,
      quantity: 85,
      warehouse: warehouseA._id,
      status: "Available",
    });

    const prod2 = await Product.create({
      productName: "Thermal Label Rolls 4x6 (Pack of 10)",
      sku: "SKU-LBL-002",
      category: catPackaging.categoryName,
      description: "Direct thermal shipping labels for dispatch cartons",
      price: 1200,
      quantity: 8, // Low Stock
      warehouse: warehouseA._id,
      status: "Low Stock",
    });

    const prod3 = await Product.create({
      productName: "Industrial IoT Temperature Sensor",
      sku: "SKU-IOT-003",
      category: catIndustrial.categoryName,
      description: "Real-time cold-chain temperature telemetry beacon",
      price: 8900,
      quantity: 0, // Out of Stock
      warehouse: warehouseB._id,
      status: "Out of Stock",
    });

    const prod4 = await Product.create({
      productName: "Heavy Duty Corrugated Carton (L)",
      sku: "SKU-BOX-004",
      category: catPackaging.categoryName,
      description: "3-ply reinforced shipping boxes",
      price: 150,
      quantity: 450,
      warehouse: warehouseA._id,
      status: "Available",
    });

    const prod5 = await Product.create({
      productName: "Laser Distance Measure 50m",
      sku: "SKU-TOOL-005",
      category: catIndustrial.categoryName,
      description: "Handheld digital laser distance measuring gauge",
      price: 3200,
      quantity: 5, // Low stock
      warehouse: warehouseB._id,
      status: "Low Stock",
    });

    // 7. Seed Stock Movements & Audit Logs
    console.log("Seeding Stock Movements...");
    await StockTransaction.create([
      {
        product: prod1._id,
        warehouse: warehouseA._id,
        transactionType: "Stock In",
        quantity: 100,
        remarks: "Initial procurement from Apex",
      },
      {
        product: prod1._id,
        warehouse: warehouseA._id,
        transactionType: "Stock Out",
        quantity: 15,
        remarks: "Fulfillment order #ORD-101",
      },
      {
        product: prod2._id,
        warehouse: warehouseA._id,
        transactionType: "Stock In",
        quantity: 20,
        remarks: "Stock arrival from Prime Supplies",
      },
      {
        product: prod2._id,
        warehouse: warehouseA._id,
        transactionType: "Stock Out",
        quantity: 12,
        remarks: "Dispatch workstation usage",
      },
    ]);

    await InventoryLog.create([
      {
        product: prod1._id,
        action: "PRODUCT_CREATED",
        previousQuantity: 0,
        newQuantity: 100,
        changeAmount: 100,
        warehouse: warehouseA._id,
        performedBy: admin._id,
        notes: "Initial inventory setup",
      },
      {
        product: prod1._id,
        action: "STOCK_OUT",
        previousQuantity: 100,
        newQuantity: 85,
        changeAmount: -15,
        warehouse: warehouseA._id,
        performedBy: staff._id,
        notes: "Dispatched order #ORD-101",
      },
    ]);

    // 8. Seed Orders
    console.log("Seeding Orders...");
    await Order.create({
      customerName: "Metro Superstores Inc",
      customerEmail: "logistics@metrosuperstores.com",
      customerPhone: "+91 9123456780",
      shippingAddress: "Gate 3, Metro Central Warehouse, Gurgaon, HR",
      products: [
        {
          product: prod1._id,
          quantity: 15,
          price: 4500,
        },
      ],
      totalAmount: 67500,
      status: "Delivered",
      createdBy: manager._id,
    });

    await Order.create({
      customerName: "OmniTech Solutions",
      customerEmail: "procurement@omnitech.io",
      customerPhone: "+91 9123456789",
      shippingAddress: "Tech Park Phase 2, Bangalore, KA",
      products: [
        {
          product: prod4._id,
          quantity: 50,
          price: 150,
        },
      ],
      totalAmount: 7500,
      status: "Pending",
      createdBy: staff._id,
    });

    // 9. Seed Shipment
    console.log("Seeding Shipments...");
    await Shipment.create({
      supplier: supApex._id,
      warehouse: warehouseA._id,
      products: [
        {
          product: prod1._id,
          quantity: 50,
        },
      ],
      status: "Pending",
      shipmentDate: new Date(),
    });

    console.log("==================================================");
    console.log("✅ SEEDING COMPLETED SUCCESSFULLY!");
    console.log("==================================================");
    console.log("Demo Credentials:");
    console.log("  • Admin:             admin@warehouse.com   / Admin@123");
    console.log("  • Warehouse Manager: manager@warehouse.com / Manager@123");
    console.log("  • Staff:             staff@warehouse.com   / Staff@123");
    console.log("==================================================");

    process.exit(0);
  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
}

seed();
