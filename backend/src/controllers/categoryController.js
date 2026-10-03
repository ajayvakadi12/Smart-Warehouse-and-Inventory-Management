const Category = require("../models/Category");

// Create Category
exports.createCategory = async (req, res) => {
  try {

    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


// Get All Categories
exports.getCategories = async (req, res) => {

  try {

    const categories = await Category.find();

    res.json({
      success: true,
      data: categories
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// Update Category
exports.updateCategory = async (req, res) => {

  try {

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true
      }
    );

    if (!category) {

      return res.status(404).json({
        success: false,
        message: "Category not found"
      });

    }

    res.json({
      success: true,
      message: "Category updated successfully",
      data: category
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// Delete Category
exports.deleteCategory = async (req, res) => {

  try {

    const category = await Category.findByIdAndDelete(
      req.params.id
    );

    if (!category) {

      return res.status(404).json({
        success: false,
        message: "Category not found"
      });

    }

    res.json({
      success: true,
      message: "Category deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};  