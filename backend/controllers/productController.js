const Product = require("../models/productModel");
const ApiFeature = require("../utils/apiFeature");

exports.uploadProduct = async (req, res) => {
  try {
    req.body.user = req.user._id;
    const product = await Product.create(req.body);

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.json(error.message);
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const resultPerPage = 5;
    const apiFeature = new ApiFeature(Product.find(), req.query)
      .search()
      .filter()
      .pagination(resultPerPage);

    let products = await apiFeature.query;

    res.json({
      success: true,
      totalProducts: products.length,
      products,
    });
  } catch (error) {
    res.json(error.message);
  }
};

exports.getProductDetails = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.json(error.message);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      returnOriginal: false,
    });

    if (!product) {
      return res.json({
        success: false,
        message: "Product Not Found!",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.json(error.message);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.json({
        success: false,
        message: "Product Not Found!",
      });
    }

    res.json({
      success: true,
      message: "Product Deleted!",
      product,
    });
  } catch (error) {
    res.json(error.message);
  }
};

exports.createReview = async (req, res) => {
  try {
    const { rating, comment, productId } = req.body;
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString())
          (rev.rating = rating), (rev.comment = comment);
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    let avg = 0;

    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    await product.save();

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.json(error.message);
  }
};

exports.getReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.query.id);

    if (!product) {
      return res.json({
        success: false,
        message: "Product Not Found!",
      });
    }

    const reviews = product;

    res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    res.json(error.message);
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const product = await Product.findById(req.query.id);

    if (!product) {
      return res.json({
        success: false,
        message: "Product Not Found!",
      });
    }

    const reviews = product.reviews.filter(
      (rev) => rev.user.toString() !== req.user._id.toString()
    );

    let avg = 0;

    reviews.forEach((rev) => {
      avg += rev.rating;
    });

    let ratings = 0;

    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(
      req.query.id,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.json(error.message);
  }
};
