// External dependencies.
var express = require('express'),
    http = require('http'),
    https = require('https'),
    path = require('path'),
    fs = require('fs');

// Routes
var V1_SERVICES_BASE = '/services/v1/',
    users = require('./routes/services/v1/users'),
    customers = require('./routes/services/v1/customers'),
    products = require('./routes/services/v1/products'),
    productPrices = require('./routes/services/v1/productPrices'),
    orders = require('./routes/services/v1/orders'),
    orderItems = require('./routes/services/v1/orderItems'),
    orderTypes = require('./routes/services/v1/orderTypes'),
    invoices = require('./routes/services/v1/invoices'),
    invoiceOrders = require('./routes/services/v1/invoiceOrders'),
    DOCUMENTS_BASE = '/documents/',
    invoiceDocuments = require('./routes/documents/invoices');

var app = express();


app.engine('jade', require('jade').__express);
app.set('views', __dirname + '/templates');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, '../client')));

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
app.get(V1_SERVICES_BASE + 'orders/types', orderTypes.list);
app.post(V1_SERVICES_BASE + 'orders', orders.create);
app.get(V1_SERVICES_BASE + 'orders/:orderId', orders.retrieve);
app.put(V1_SERVICES_BASE + 'orders/:orderId', orders.modify);
app.patch(V1_SERVICES_BASE + 'orders/:orderId', orders.modify);
app.get(V1_SERVICES_BASE + 'orders/:orderId/items', orderItems.list);
app.post(V1_SERVICES_BASE + 'orders/:orderId/items', orderItems.create);
app.put(V1_SERVICES_BASE + 'orders/:orderId/items/:orderItemId', orderItems.modify);
app.patch(V1_SERVICES_BASE + 'orders/:orderId/items/:orderItemId', orderItems.modify);

// Invoice routes
app.get(V1_SERVICES_BASE + 'sendInvoice', invoices.send); // Action route.
app.get(V1_SERVICES_BASE + 'invoices', invoices.list);
app.post(V1_SERVICES_BASE + 'invoices', invoices.create);
app.get(V1_SERVICES_BASE + 'invoices/:invoiceId', invoices.retrieve);
app.put(V1_SERVICES_BASE + 'invoices/:invoiceId', invoices.modify);
app.patch(V1_SERVICES_BASE + 'invoices/:invoiceId', invoices.modify);
app.get(V1_SERVICES_BASE + 'invoices/:invoiceId/orders', invoiceOrders.list);
app.post(V1_SERVICES_BASE + 'invoices/:invoiceId/orders', invoiceOrders.create);
app.delete(V1_SERVICES_BASE + 'invoices/:invoiceId/orders/:invoiceItemId', invoiceOrders.destroy);

// Document Routes //

app.get(DOCUMENTS_BASE + 'invoices/:invoiceId', invoiceDocuments);

// Any unhandled routes will return the client app.
app.use(function(req, res){
    res.sendfile(path.join(__dirname, '../client/index.html'));
});

var hostname, httpPort, httpsPort;

var config = require('./config.json');

// Security
var privateKey  = fs.readFileSync(path.join(__dirname, 'ia.key'), 'utf8'),
    certificate = fs.readFileSync(path.join(__dirname, 'ia.crt'), 'utf8'),
    credentials = {key: privateKey, cert: certificate};

https.createServer(credentials, app).listen(config.httpsPort, function (){
  console.log('HTTPS server listening on port ' +  config.httpsPort);
});

// Redirect ALL http traffic to https
var redirectApp = express();

redirectApp.get('*', function(req, res) {
    res.redirect('https://' + config.hostname + ((config.httpsPort === 443) ? '' : ((':' + config.httpsPort) + req.url)));
})

http.createServer(redirectApp).listen(config.httpPort, function () {
    console.log('HTTP->HTTPS redirecting server listening on port ' +  config.httpPort);
});