const express = require("express");
const router = express.Router();


const protect = require("../middleware/authMiddleware");


const {
    getNotifications,
    createNotification,
    markAsRead
} = require("../controllers/notificationController");



// Get Notifications
router.get(
    "/",
    protect,
    getNotifications
);


// Create Notification
router.post(
    "/",
    protect,
    createNotification
);


// Mark Read
router.put(
    "/:id/read",
    protect,
    markAsRead
);



module.exports = router;