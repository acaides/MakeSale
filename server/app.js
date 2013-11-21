// External dependencies.
var express = require('express'),
    http = require('http'),
    path = require('path');

// Routes
var V1_SERVICES_BASE = '/services/v1/',
    users = require('./routes/users'),
    customers = require('./routes/customers'),
    products = require('./routes/products'),
    productPrices = require('./routes/productPrices'),
    orders = require('./routes/orders'),
    orderItems = require('./routes/orderItems');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, '../client')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Service Routes //

// Users routes
app.get(V1_SERVICES_BASE + 'users', users.list);
app.post(V1_SERVICES_BASE + 'users', users.create);

// Customers routes
app.get(V1_SERVICES_BASE + 'customers', customers.list);
app.post(V1_SERVICES_BASE + 'customers', customers.create);

// Products routes
app.get(V1_SERVICES_BASE + 'products', products.list);
app.get(V1_SERVICES_BASE + 'products/:productId', products.retrieve);
app.put(V1_SERVICES_BASE + 'products/:productId', products.modify);
app.patch(V1_SERVICES_BASE + 'products/:productId', products.modify);
app.post(V1_SERVICES_BASE + 'products', products.create);
app.get(V1_SERVICES_BASE + 'products/:productId/prices', productPrices.list);
app.post(V1_SERVICES_BASE + 'products/:productId/prices', productPrices.create);
app.put(V1_SERVICES_BASE + 'products/:productId/prices/:orderTypeId', productPrices.modify);
app.patch(V1_SERVICES_BASE + 'products/:productId/prices/:orderTypeId', productPrices.modify);

// Orders routes
app.get(V1_SERVICES_BASE + 'orders', orders.list);
app.post(V1_SERVICES_BASE + 'orders', orders.create);
app.get(V1_SERVICES_BASE + 'orders/:orderId', orders.retrieve);
app.get(V1_SERVICES_BASE + 'orders/:orderId/items', orderItems.list);
app.post(V1_SERVICES_BASE + 'orders/:orderId/items', orderItems.create);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
