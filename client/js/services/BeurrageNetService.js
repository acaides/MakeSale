define([ './module' ], function (services) {
    'use strict';

    var SB = '/services/v1/';

    services.service('BeurrageNet', [ '$http', function ($http) {
        return {
            getProducts: function BNGetProducts (orderId) {
                var products = [];

                $http({ method: 'GET', url: SB + 'products' + (orderId ? ('?orderId=' + orderId) : '') }).
                    success(function(data, status, headers, config) {
                        _.extend(products, data);
                    }).
                    error(function(data, status, headers, config) {

                    });

                return products;
            },

            getProductById: function BNGetProductById (productId) {
                var product = {};

                $http({ method: 'GET', url: SB + 'products/' + productId }).
                    success(function(data, status, headers, config) {
                        _.extend(product, data);
                    }).
                    error(function(data, status, headers, config) {

                    });

                return product;
            },

            getCustomers: function BNGetCustomers (cb) {
                var c = _.isFunction(cb) ? cb : function () {},
                    customers = [];

                $http({ method: 'GET', url: SB + 'customers' }).
                    success(function(data, status, headers, config) {
                        _.extend(customers, data);
                        c(customers);
                    }).
                    error(function(data, status, headers, config) {
                        _.extend(customers, data);
                        c(customers);
                    });

                return customers;
            },

            startOrder: function BNStartOrder (customerId, typeId, name, cb) {
                var order = {
                    loading: true
                };

                $http({ method: 'POST', url: SB + 'orders/', data: { customerId: customerId, typeId: typeId, name: name } }).
                    success(function(data, status, headers, config) {
                        delete order.loading;
                        _.extend(order, data);

                        order.createdTimestamp = new Date(order.createdTimestamp);
                        order.modifiedTimestamp = new Date(order.modifiedTimestamp);

                        if(_.isFunction(cb)) {
                            cb(order);
                        }
                    }).
                    error(function(data, status, headers, config) {
                        delete order.loading;
                        _.extend(order, data);

                        if(_.isFunction(cb)) {
                            cb(order);
                        }
                    });

                return order;
            },

            getOrders: function BNGetOrders (p0, p1) {
                var c = _.isFunction(p0) ? p0 : (_.isFunction(p1) ? p1 : function () {}),
                    limits = _.isPlainObject(p0) ? p0 : {},
                    orders = [];

                $http({ method: 'GET', url: SB + 'orders', params: limits }).
                    success(function(data, status, headers, config) {
                        _.extend(orders, data);

                        _.forEach(orders, function (order) {
                            order.createdTimestamp = new Date(order.createdTimestamp);
                            order.modifiedTimestamp = new Date(order.modifiedTimestamp);
                        });

                        c(orders);
                    }).
                    error(function(data, status, headers, config) {
                        _.extend(orders, data);
                        c(orders);
                    });

                return orders;
            },

            getOrderTypes: function BNGetOrderTypes (cb) {
                var c = _.isFunction(cb) ? cb : function () {},
                    orderTypes = [];

                $http({ method: 'GET', url: SB + 'orders/types' }).
                    success(function(data, status, headers, config) {
                        _.extend(orderTypes, data);
                        c(orderTypes);
                    }).
                    error(function(data, status, headers, config) {
                        _.extend(orderTypes, data);
                        c(orderTypes);
                    });

                return orderTypes;
            },

            getOrderById: function BNGetOrderById (orderId, cb) {
                var c = _.isFunction(cb) ? cb : function () {},
                    order = {
                        loading: true
                    };

                $http({ method: 'GET', url: SB + 'orders/' + orderId }).
                    success(function(data, status, headers, config) {
                        delete order.loading;
                        _.extend(order, data);

                        order.createdTimestamp = new Date(order.createdTimestamp);
                        order.modifiedTimestamp = new Date(order.modifiedTimestamp);
                        c(order);
                    }).
                    error(function(data, status, headers, config) {
                        delete order.loading;
                        _.extend(order, data);
                        c(order);
                    });

                return order;
            },

            addOrderItem: function BNAddOrderItem (orderId, productId, quantity, cb) {
                var order = {};

                $http({ method: 'POST', url: SB + 'orders/' + orderId + '/items', data: { productId: productId, quantity: quantity } }).
                    success(function(data, status, headers, config) {
                        _.extend(order, data);

//                        order.createdTimestamp = new Date(order.createdTimestamp);
//                        order.modifiedTimestamp = new Date(order.modifiedTimestamp);

                        if(_.isFunction(cb)) {
                            cb(order);
                        }
                    }).
                    error(function(data, status, headers, config) {

                    });

                return order;
            },

            updateOrderItemQuantity: function BNUpdateOrderItemQuantity (orderId, itemId, newQuantity, cb) {
                var order = {};

                $http({ method: 'PATCH', url: SB + 'orders/' + orderId + '/items/' + itemId, data: { quantity: newQuantity } }).
                    success(function(data, status, headers, config) {
                        _.extend(order, data);

                        order.createdTimestamp = new Date(order.createdTimestamp);
                        order.modifiedTimestamp = new Date(order.modifiedTimestamp);

                        if(_.isFunction(cb)) {
                            cb(order);
                        }
                    }).
                    error(function(data, status, headers, config) {

                    });

                return order;
            },

            updateOrder: function BNUpdateOrder (orderId, mods, cb) {
                var c = _.isFunction(cb) ? cb : function () {},
                    order = {
                        loading: true
                    };

                $http({ method: 'PATCH', url: SB + 'orders/' + orderId, data: mods }).
                    success(function(data, status, headers, config) {
                        delete order.loading;
                        _.extend(order, data);

                        order.createdTimestamp = new Date(order.createdTimestamp);
                        order.modifiedTimestamp = new Date(order.modifiedTimestamp);
                        c(order);
                    }).
                    error(function(data, status, headers, config) {
                        delete order.loading;
                        _.extend(order, data);
                        c(order);
                    });

                return order;
            },

            getInvoices: function BNGetInvoices (cb) {
                var c = _.isFunction(cb) ? cb : function () {},
                    invoices = [];

                $http({ method: 'GET', url: SB + 'invoices' }).
                    success(function(data, status, headers, config) {
                        _.extend(invoices, data);

                        _.forEach(invoices, function (invoice) {
                            invoice.createdTimestamp = new Date(invoice.createdTimestamp);
                            invoice.modifiedTimestamp = new Date(invoice.modifiedTimestamp);
                        });

                        c(invoices);
                    }).
                    error(function(data, status, headers, config) {
                        _.extend(invoices, data);
                        c(invoices);
                    });

                return invoices;
            },

            getInvoiceById: function BNGetInvoiceById (invoiceId, cb) {
                var c = _.isFunction(cb) ? cb : function () {},
                    invoice = {
                        loading: true
                    };

                $http({ method: 'GET', url: SB + 'invoices/' + invoiceId }).
                    success(function(data, status, headers, config) {
                        delete invoice.loading;
                        _.extend(invoice, data);

                        invoice.createdTimestamp = new Date(invoice.createdTimestamp);
                        invoice.modifiedTimestamp = new Date(invoice.modifiedTimestamp);

                        _.forEach(invoice.orders, function (order) {
                            order.createdTimestamp = new Date(order.createdTimestamp);
                            order.modifiedTimestamp = new Date(order.modifiedTimestamp);
                        });

                        c(invoice);
                    }).
                    error(function(data, status, headers, config) {
                        delete invoice.loading;
                        _.extend(invoice, data);
                        c(invoice);
                    });

                return invoice;
            },

            startInvoice: function BNStartOrder (billToInfo, cb) {
                var c = _.isFunction(cb) ? cb : function () {},
                    invoice = {
                        loading: true
                    };

                $http({ method: 'POST', url: SB + 'invoices', data: billToInfo }).
                    success(function(data, status, headers, config) {
                        delete invoice.loading;
                        _.extend(invoice, data);
                        invoice.createdTimestamp = new Date(invoice.createdTimestamp);
                        invoice.modifiedTimestamp = new Date(invoice.modifiedTimestamp);
                        c(invoice);
                    }).
                    error(function(data, status, headers, config) {
                        delete invoice.loading;
                        _.extend(invoice, data);
                        c(invoice);
                    });

                return invoice;
            },

            addInvoiceOrders: function BNAddInvoiceOrders (invoiceId, orders, cb) {
                var c = _.isFunction(cb) ? cb : function () {},
                    res = {};

                $http({ method: 'POST', url: SB + 'invoices/' + invoiceId + '/orders', data: orders }).
                    success(function(data, status, headers, config) {
                        _.extend(res, data);
                        c(res);
                    }).
                    error(function(data, status, headers, config) {
                        _.extend(orders, data);
                        c(res);
                    });

                return res;
            }
        };
    } ]);
});