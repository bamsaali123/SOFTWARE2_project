const Product = require("../models/product");
const { showDiscount, calculateNewPrice, getDiscountAmount } = require('../helpers/discount');
const { convertToUppercase } = require('../helpers/convert')
const homePage = async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/auth");
  }

  if (req.session.user.isAdmin == true) {
    return res.redirect("/discount");
  }

  try {
    const products = await Product.find({});

    res.render("../views/home.ejs", {
      user: req.session.user,
      products: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Error retrieving products");
  }
};



const authPage = (req, res) => {
  res.render("../views/auth.ejs");
};

const discountPage = async (req, res) => {
  const products = await Product.find({});
  res.render("../views/discount.ejs", {
    user: req.session.user,
    products: products,
    showDiscount,
    calculateNewPrice,
    getDiscountAmount,
    convertToUppercase 

  });
};

module.exports = {
    homePage,
    authPage,
    discountPage,

}