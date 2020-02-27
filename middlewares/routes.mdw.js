module.exports = function (app) {
    app.use('/', require('../routes/home.route'));
    app.use('/account', require('../routes/account.route'));
    app.use('/products', require('../routes/products.route'));
    app.use('/admin', require('../routes/admin/admin.route'));
    app.use('/admin/categories', require('../routes/admin/categories.route'));
    app.use('/admin/accounts', require('../routes/admin/accounts.route'));
    app.use('/search',require('../routes/search.route'));
    app.use('/favourite', require('../routes/favourite.route'));
    app.use('/upload', require('../routes/uploadProduct.route'));
  };
  
  