
const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');    

//Users
router.get('/users/count', adminController.getUsersCount);
router.delete('/users/:id', adminController.getUserById);

//Categories
router.post('/categories', adminController.addCategory);
router.put('/categories/:id', adminController.updateCategory);
router.delete('/categories/:id', adminController.deleteCategory);

// Products
router.get('/products/count', adminController.getProductsCount);
router.post('/products', adminController.addProduct);
router.put('/products/:id', adminController.updateProduct);
router.delete('/products/:id/images', adminController.deleteProductImages);
router.delete('/products/:id', adminController.deleteProduct);

// Orders
router.get('/orders', adminController.getOrders);
router.put('/orders/count', adminController.getOrdersCount);    
router.put('/orders/:id', adminController.updateOrderStatus);


module.exports = router