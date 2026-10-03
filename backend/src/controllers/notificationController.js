const Notification = require("../models/Notification");


// Get All Notifications
exports.getNotifications = async(req,res)=>{

    try{

        const notifications = await Notification.find()
        .sort({
            createdAt:-1
        });


        res.status(200).json({

            success:true,

            data:notifications

        });


    }catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};



// Create Notification
exports.createNotification = async(req,res)=>{

    try{


        const notification = await Notification.create(
            req.body
        );


        res.status(201).json({

            success:true,

            message:"Notification created successfully",

            data:notification

        });


    }catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};




// Mark Notification as Read
exports.markAsRead = async(req,res)=>{

    try{


        const notification = await Notification.findById(
            req.params.id
        );


        if(!notification){

            return res.status(404).json({

                success:false,

                message:"Notification not found"

            });

        }


        notification.isRead = true;

        await notification.save();


        res.status(200).json({

            success:true,

            message:"Notification marked as read",

            data:notification

        });


    }catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });


    }

};