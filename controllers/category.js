const { Op } = require("sequelize");
var db = require("../models");
var Category = db.Category;
const TokenVerifier = require('./utils/user_tokenVerify');

const createCategory = async (req, res) => {
  try {
    const { user_id, title, description } = req.body;

    if (!user_id || !title || !description) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!req.headers.authorization) {
      return res.status(401).json({ error: 'Authorization header is missing' });
    }

    const token = req.headers.authorization.split(' ')[1];
    await TokenVerifier.verifyUserToken(user_id, token, res);

    const newCategory = await Category.create({
      title,
      description,
      user_id
    });

    res.status(201).json({ data: newCategory, message: 'Category created successfully' });
  } catch (error) {
    console.error(error);

    if (error.name === 'SequelizeValidationError') {
      const validationErrors = {};
      error.errors.forEach(err => {
        validationErrors[err.path] = err.message;
      });
      return res.status(400).json({ error: 'Validation error', validationErrors });
    }

    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { user_id, categoryId } = req.body;
    if (!req.headers.authorization) {
      return res.status(401).json({ error: 'Authorization header is missing' });
    }

    const token = req.headers.authorization.split(' ')[1];
    await TokenVerifier.verifyUserToken(user_id, token, res);

    if (!categoryId) {
      return res.status(400).json({ error: 'Category ID is required' });
    }

    // Find the category to delete
    const existingCategory = await Category.findOne({
      where: {
        category_id: categoryId,
        user_id: user_id
      }
    });

    // Check if the category exists
    if (!existingCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Delete the category
    await existingCategory.destroy();

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getCategorys = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!req.headers.authorization) {
      return res.status(401).json({ error: 'Authorization header is missing' });
    }

    const token = req.headers.authorization.split(' ')[1];
    await TokenVerifier.verifyUserToken(user_id, token, res);

    const categories = await Category.findAll({
      where: {
        user_id: user_id
      }
    });

    res.status(200).json({ data: categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createCategory,
  getCategorys,
  deleteCategory
};
