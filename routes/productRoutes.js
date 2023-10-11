import express from 'express'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { braintreePaymentsController, braintreeTokenController, createProductController, deleteProductController, getPhotoController, getProductController, getSingleProductController, productCategoryController, productCountController, productFiltersController, productListController, relatedProductController, searchProductController, updateProductController } from '../controllers/productController.js';
import formidable from 'express-formidable'

// create a new router
const router = express.Router();

// routing
// CREATE PRODUCT | METHOD : POST
router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController);
// GET ALL PRODUCTS | METHOD : GET
router.get('/get-product', getProductController);
// GET SINGLE PRODUCT | METHOD : GET
router.get('/get-product/:slug', getSingleProductController);
// GET PRODUCT PHOTO | METHOD : GET
router.get('/product-photo/:pid', getPhotoController);
// DELETE PRODUCT | METHOD : DELETE
router.delete('/delete-product/:pid', deleteProductController);
// UPDATE PRODUCT | METHOD : PUT
router.put('/update-product/:pid', requireSignIn, isAdmin, formidable(), updateProductController);
// Filter product 
router.post('/product-filters', productFiltersController)
// Product count
router.get('/product-count', productCountController)
// Product per page
router.get('/product-list/:page', productListController)
// search product
router.get('/search/:keyword', searchProductController)
// similar products
router.get('/related-product/:pid/:cid', relatedProductController)
// category wise products
router.get('/product-category/:slug', productCategoryController)
// Payments route
// token 
router.get('/braintree/token', braintreeTokenController)
// payments
router.post('/braintree/payment', requireSignIn, braintreePaymentsController)


export default router