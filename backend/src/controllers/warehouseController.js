const Warehouse = require("../models/Warehouse");


// Create Warehouse
exports.createWarehouse = async (req, res) => {
  try {

    const warehouse = await Warehouse.create(req.body);

    res.status(201).json({
      success: true,
      message: "Warehouse created successfully",
      data: warehouse
    });

  } catch (error) {

    res.status(500).json({
      success:false,
      message:error.message
    });

  }
};


// Get All Warehouses
exports.getWarehouses = async (req,res)=>{
  try{

    const warehouses = await Warehouse.find();

    res.json({
      success:true,
      data:warehouses
    });

  }catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }
};
// Update Warehouse
exports.updateWarehouse = async (req, res) => {
  try {

    const warehouse = await Warehouse.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true
      }
    );

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: "Warehouse not found"
      });
    }

    res.json({
      success: true,
      message: "Warehouse updated successfully",
      data: warehouse
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// Delete Warehouse
exports.deleteWarehouse = async (req, res) => {
  try {

    const warehouse = await Warehouse.findByIdAndDelete(
      req.params.id
    );

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: "Warehouse not found"
      });
    }

    res.json({
      success: true,
      message: "Warehouse deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

