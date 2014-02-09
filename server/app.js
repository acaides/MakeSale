// External dependencies.
var express = require('express'),
    http = require('http'),
    path = require('path'),
    fs = require('fs');

var options = require('optimist')
        .usage('Run the MakeSale Server Backend.\n' +
            'Serves services and documents to client applications.\n' +
            'Usage: $0')
        .options({
            httpPort: {
                alias : 'p',
                'default' : 3000,
                describe : 'The port number on the local host where the http server is to listen.'
            },
            masterAccessCode : {
                alias : 'm',
                'default' : 'louisAndLanaLoveCroissants',
                describe: 'The string to be accepted as an access code for all requests.'
            },
            dbHost : {
                alias : 'h',
                'default' : 'localhost',
                describe : 'The hostname of the server hosting the db.'
            },
            dbUsername : {
                alias : 'u',
                'default' : 'makesale',
                describe : 'The name of the MySQL user the app should use to access the db.'
            },
            dbPassword: {
                alias: 'p',
                'default': 'makesale',
                describe: 'The password of the MySQL user the app should use to access the db.'
            },
            dbName: {
                alias: 'd',
                describe: 'The name of the database the app should use.',
                'default': 'makesale'
            },
            configFile: {
                alias: 'c',
                describe: 'The path to the configuration file the app should use to load configuration values.'
            }
        }),
    argv = options.argv;

var app = express(),
    forRoutes = {},
    config = GLOBAL.config = forRoutes.config = (function () {
        if (argv.configFile) {
            return require(argv.configFile);
        } else {
            return argv;
        }
    })();

var hostname;

forRoutes.httpServer = http.createServer(app).listen(config.httpPort, function () {
    console.log('HTTP server listening on port ' +  config.httpPort);
});

// Routes
var V1_SERVICES_BASE = '/services/v1/',
    authentications = require('./routes/services/v1/authentications'),
    users = require('./routes/services/v1/users'),
    customers = require('./routes/services/v1/customers'),
    products = require('./routes/services/v1/products'),
    productPrices = require('./routes/services/v1/productPrices'),
    productGroups = require('./routes/services/v1/productGroups'),
    units = require('./routes/services/v1/units'),
    orders = require('./routes/services/v1/orders'),
    orderItems = require('./routes/services/v1/orderItems'),
    orderTypes = require('./routes/services/v1/orderTypes'),
    invoices = require('./routes/services/v1/invoices'),
    invoiceOrders = require('./routes/services/v1/invoiceOrders'),
    DOCUMENTS_BASE = '/documents/',
    invoiceDocuments = require('./routes/documents/invoices')(forRoutes);

// Middlewear

//var MSAuthMiddlewear = require('./middlewear/MSAuthMiddlewear');

app.locals._ = require('lodash');
app.locals._.str = require('underscore.string');
app.locals.moment = require('moment');
app.engine('jade', require('jade').__express);
app.set('views', __dirname + '/templates');
app.use(express.favicon());
//app.use(MSAuthMiddlewear);
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, '../client')));


// Service Routes //

// Authentications routes
app.get(V1_SERVICES_BASE + 'authentications', authentications.list);
app.get(V1_SERVICES_BASE + 'authentications/:authenticationId', authentications.retrieve);
app.post(V1_SERVICES_BASE + 'authentications', authentications.create);
app.delete(V1_SERVICES_BASE + 'authentications/:authenticationId', authentications.destroy);

// Users routes
app.get(V1_SERVICES_BASE + 'users', users.list);
app.post(V1_SERVICES_BASE + 'users', users.create);

// Customers routes
app.get(V1_SERVICES_BASE + 'customers', customers.list);
app.get(V1_SERVICES_BASE + 'customers/:customerId', customers.retrieve);
app.patch(V1_SERVICES_BASE + 'customers/:customerId', customers.modify);
app.post(V1_SERVICES_BASE + 'customers', customers.create);

// Products routes
app.get(V1_SERVICES_BASE + 'products/groups', productGroups.list);
app.get(V1_SERVICES_BASE + 'products/groups/:productGroupId', productGroups.retrieve);
app.post(V1_SERVICES_BASE + 'products/groups', productGroups.create);
app.put(V1_SERVICES_BASE + 'products/groups/:productGroupId', productGroups.modify);
app.patch(V1_SERVICES_BASE + 'products/groups/:productGroupId', productGroups.modify);
app.get(V1_SERVICES_BASE + 'products', products.list);
app.get(V1_SERVICES_BASE + 'products/:productId', products.retrieve);
app.put(V1_SERVICES_BASE + 'products/:productId', products.modify);
app.patch(V1_SERVICES_BASE + 'products/:productId', products.modify);
app.post(V1_SERVICES_BASE + 'products', products.create);
app.get(V1_SERVICES_BASE + 'products/:productId/prices', productPrices.list);
app.post(V1_SERVICES_BASE + 'products/:productId/prices', productPrices.create);
app.put(V1_SERVICES_BASE + 'products/:productId/prices/:priceId', productPrices.modify);
app.patch(V1_SERVICES_BASE + 'products/:productId/prices/:priceId', productPrices.modify);

// Units routes
app.get(V1_SERVICES_BASE + 'units', units.list);
app.get(V1_SERVICES_BASE + 'units/:unitId', units.retrieve);

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
app.delete(V1_SERVICES_BASE + 'invoices/:invoiceId/orders/:orderId', invoiceOrders.destroy);

// Document Routes //

app.get(DOCUMENTS_BASE + 'invoices/:invoiceId', invoiceDocuments);

// Any unhandled routes will return the client app.
app.use(function(req, res){
    res.sendfile(path.join(__dirname, '../client/index.html'));
});