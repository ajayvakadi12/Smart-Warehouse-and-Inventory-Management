const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");


const {
    getInventoryReport,
    getSalesReport,
    getStockReport
} = require("../controllers/reportController");



// Inventory Report
router.get(
    "/inventory",
    protect,
    getInventoryReport
);


// Sales Report
router.get(
    "/sales",
    protect,
    getSalesReport
);


// Stock Movement Report
router.get(
    "/stock",
    protect,
    getStockReport
);



module.exports = router;