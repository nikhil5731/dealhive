const {
  uploadProduct,
  getAllProducts,
  getProductDetails,
  updateProduct,
  deleteProduct,
  createReview,
  getReviews,
  deleteReview,
} = require("../controllers/productController");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

const router = require("express").Router();

router
  .route("/admin/product/new")
  .post(isAuthenticated, isAdmin, uploadProduct);

router.route("/products").get(getAllProducts);

router
  .route("/product/:id")
  .get(getProductDetails)
  .put(updateProduct)
  .delete(deleteProduct);

router
  .route("/review")
  .put(isAuthenticated, createReview)
  .get(getReviews)
  .delete(isAuthenticated, deleteReview);

// router.route("/review").get(getReviews);

module.exports = router;
