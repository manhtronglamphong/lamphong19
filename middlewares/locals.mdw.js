const categoryModel = require('../models/phanloai.model');
const productModel=require('../models/sanpham.model');

module.exports = function (app) {
  app.use(async (req, res, next) => {
    const rows = await categoryModel.all();
    res.locals.lcCategories = rows;
    const rows2=await productModel.topbid();
    res.locals.slider=rows2;
    console.log(res.locals.slider);

    
    if (typeof (req.session.isAuthenticated) === 'undefined') {
      req.session.isAuthenticated = false;
    }
    res.locals.isAuthenticated = req.session.isAuthenticated;
    res.locals.authUser = req.session.authUser;
    
  
    next();
  })
};
