var mysql = require('mysql'),
    dbc = mysql.createConnection({
        host: GLOBAL.config.dbHost,
        user: GLOBAL.config.dbUsername,
        password: GLOBAL.config.dbPassword,
        database: GLOBAL.config.dbName,
        supportBigNumbers: true
    }),
    sqlTemplates = require('./sqlTemplates'),
    bcrypt = require('bcrypt'),
    _ = require('lodash');

function us2cc (obj) {
    if(_.isObject(obj) && !_.isDate(obj)) {
        return _.transform(obj, function (result, value, key) {
            if(_.isNull(value) || _.isUndefined(value) ) {
                return;
            }

            if(_.isString(key)) {
                var ccKey = key.replace(/(\_[a-z])/g, function($1) {
                    return $1.toUpperCase().replace('_', '');
                });
                result[ccKey] = us2cc(value);
            } else {
                result[key] = us2cc(value);
            }
        });
    } else {
        return obj;
    }
}

function cc2us (obj) {
    if(_.isObject(obj) && !_.isDate(obj)) {
        return _.transform(obj, function (result, value, key) {
            if(_.isNull(value) || _.isUndefined(value) ) {
                return;
            }

            if(_.isString(key)) {
                    var ccKey = key.replace(/([A-Z])/g, function ($1) {
                    return '_' + $1.toLowerCase();
                });
                result[ccKey] = cc2us(value);
            } else {
                result[key] = cc2us(value);
            }
        });
    } else {
        return obj;
    }
}

var db = module.exports = {
    /**
     * Inserts a new user into the database.
     *
     * @param newUsers  An object or array of objects specifying the new user(s) to be created.
     * @param cb        Callback to be passed the result of the action.
     */
    insertUsers: function insertUsers (newUsers, cb) {
        var results = [],
            requests = _.isArray(newUsers) ? newUsers : [ newUsers ],
            done = function (result) {
                results.push(result);

                if(results.length === requests.length) {
                    if(_.isFunction(cb)) {
                        if(results.length === 1) {
                            cb.apply(results[0], results[0]);
                        } else {
                            cb(false, results);
                        }
                    }
                }
            };

        _.forEach(requests, function (newUser) {
            if('firstName' in newUser &&
                'lastName' in newUser &&
                'email' in newUser &&
                'password' in newUser &&
                'address' in newUser) {

                bcrypt.hash(newUser.password, 8, function (err, hash) {
                    if(!err) {
                        dbc.query(sqlTemplates.INSERT_USER, [
                            newUser.firstName,
                            newUser.lastName,
                            newUser.email,
                            hash,
                            null,
                            new Date(),
                            newUser.address,
                            newUser.phoneNumber,
                            1
                        ], function (err, result) {
                            if(err) {
                                done([ err ]);
                            } else {
                                done([ false, _.extend(result, newUser) ]);
                            }
                        });
                    } else {
                        done([ 'Error hashing password.' ]);
                    }
                });
            } else {
                done([ 'Missing required information in newUser.' ]);
            }
        });
    },

    selectUsersById: function selectUsersById (userIds, cb) {},

    selectUsersByEmail: function selectUsersByEmail (userEmails, cb) {},

    insertCustomers: function insertCustomers (newCustomers, cb) {
        var results = [],
            requests = _.isArray(newCustomers) ? newCustomers : [ newCustomers ],
            done = function (result) {
                results.push(result);

                if(results.length === requests.length) {
                    if(_.isFunction(cb)) {
                        if(results.length === 1) {
                            cb.apply(results[0], results[0]);
                        } else {
                            cb(false, results);
                        }
                    }
                }
            };

        _.forEach(requests, function (newCustomer) {
            if('name' in newCustomer && 'email' in newCustomer) {
                dbc.query(sqlTemplates.INSERT_CUSTOMER, [
                    newCustomer.name,
                    newCustomer.address,
                    newCustomer.phone,
                    newCustomer.email
                ], function (err, result) {
                    if(err) {
                        done([ err ]);
                    } else {
                        done([ false, _.extend(result, newCustomer) ]);
                    }
                });
            } else {
                done([ 'Missing required information in newCustomer.' ]);
            }
        });
    },

    updateCustomer: function updateCustomer (customerId, mods, cb) {
        if(customerId && mods) {
            delete mods.id;

            dbc.query(sqlTemplates.UPDATE_CUSTOMER + ' WHERE `id` = ' + customerId + ';', cc2us(mods), function (err, result) {
                if(err) {
                    cb(err);
                } else {
                    cb(false, result);
                }
            });
        } else {
            cb('Missing required input.');
        }
    },

    selectCustomers: function selectCustomers (options, cb) {
        if(_.isFunction(cb)) {
            dbc.query(sqlTemplates.SELECT_CUSTOMER_LISTING, function (err, customers) {
                if(err) {
                    cb(err);
                } else {
                    cb(false, customers);
                }
            });
        }
    },

    selectCustomersById: function selectCustomersById (customerIds, cb) {
        if(_.isFunction(cb)) {
            dbc.query(sqlTemplates.SELECT_CUSTOMERS_BY_ID, [ _.isArray(customerIds) ? customerIds : [ customerIds ] ], function (err, result) {
                if(err) {
                    cb(err);
                } else {
                    cb(false, us2cc(result));
                }
            });
        }
    },

    insertProductGroups: function insertProductGroups (newProductGroups, cb) {
        var results = [],
            requests = _.isArray(newProductGroups) ? newProductGroups : [ newProductGroups ],
            done = function (result) {
                results.push(result);

                if(results.length === requests.length) {
                    if(_.isFunction(cb)) {
                        if(results.length === 1) {
                            cb.apply(results[0], results[0]);
                        } else {
                            cb(false, results);
                        }
                    }
                }
            };

        _.forEach(requests, function (newProductGroup) {
            if('name' in newProductGroup) {
                dbc.query(sqlTemplates.INSERT_PRODUCT_GROUP, [
                    newProductGroup.name,
                ], function (err, result) {
                    if(err) {
                        done([ err ]);
                    } else {
                        done([ false, _.extend(result, newProductGroup) ]);
                    }
                });
            } else {
                done([ 'Missing required information in newProductGroup.' ]);
            }
        });
    },

    insertProducts: function insertProducts (newProducts, cb) {
        var results = [],
            requests = _.isArray(newProducts) ? newProducts : [ newProducts ],
            done = function (result) {
                results.push(result);

                if(results.length === requests.length) {
                    if(_.isFunction(cb)) {
                        if(results.length === 1) {
                            cb.apply(results[0], results[0]);
                        } else {
                            cb(false, results);
                        }
                    }
                }
            };

        _.forEach(requests, function (newProduct) {
            if('name' in newProduct && 'unitId' in newProduct && 'enabled' in newProduct) {
                dbc.query(sqlTemplates.INSERT_PRODUCT, [
                    newProduct.name,
                    newProduct.description,
                    newProduct.unitId,
                    newProduct.enabled,
                    newProduct.productGroupId
                ], function (err, result) {
                    if(err) {
                        done([ err ]);
                    } else {
                        done([ false, _.extend(result, newProduct) ]);
                    }
                });
            } else {
                done([ 'Missing required information in newProduct.' ]);
            }
        });
    },

    updateProduct: function updateProduct (productId, mods, cb) {
        if(productId && mods) {
            dbc.query(sqlTemplates.UPDATE_PRODUCT + ' WHERE `id` = ' + productId + ';', cc2us(mods), function (err, result) {
                if(err) {
                    cb(err);
                } else {
                    cb(false, result);
                }
            });
        } else {
            cb('Missing required input.');
        }
    },

    updateProductGroup: function updateProductGroups (productGroupId, mods, cb) {
        if(productGroupId && mods) {
            dbc.query(sqlTemplates.UPDATE_PRODUCT_GROUP + ' WHERE `id` = ' + productGroupId + ';', cc2us(mods), function (err, result) {
                if(err) {
                    cb(err);
                } else {
                    cb(false, result);
                }
            });
        } else {
            cb('Missing required input.');
        }
    },

    insertProductPrices: function insertProductPrices (newProductPrices, cb) {
        var results = [],
            requests = _.isArray(newProductPrices) ? newProductPrices : [ newProductPrices ],
            done = function (result) {
                results.push(result);

                if(results.length === requests.length) {
                    if(_.isFunction(cb)) {
                        if(results.length === 1) {
                            cb.apply(results[0], results[0]);
                        } else {
                            cb(false, results);
                        }
                    }
                }
            };

        _.forEach(requests, function (newProductPrice) {
            if('productId' in newProductPrice && 'orderTypeId' in newProductPrice && 'unitPrice' in newProductPrice) {
                dbc.query(sqlTemplates.INSERT_PRODUCT_PRICE, [
                    newProductPrice.productId,
                    newProductPrice.orderTypeId,
                    newProductPrice.unitPrice,
                    newProductPrice.customerId
                ], function (err, result) {
                    if(err) {
                        done([ err ]);
                    } else {
                        done([ false, _.extend(result, newProductPrice) ]);
                    }
                });
            } else {
                done([ 'Missing required information in newProductPrice.' ]);
            }
        });
    },

    selectProductPricesByProductId: function selectProductPricesByProductId (productId, cb) {
        if(_.isFunction(cb)) {
            dbc.query(sqlTemplates.SELECT_PRODUCT_PRICES_BY_PRODUCT_ID, [ productId ], function (err, result) {
                if(err) {
                    cb(err);
                } else {
                    cb(false, us2cc(result));
                }
            });
        }
    },

    selectProductGroups: function selectProductGroups (cb) {
        if(_.isFunction(cb)) {
            var p = function (err, result) {
                if(err) {
                    cb(err);
                } else {
                    cb(false, us2cc(result));
                }
            };

            dbc.query(sqlTemplates.SELECT_PRODUCT_GROUPS, p);
        }
    },

    selectProductGroupById: function selectProductGroupById (productGroupId, cb) {
        if(_.isNumber(productGroupId) && productGroupId > 0 && _.isFunction(cb)) {
            var p = function (err, result) {
                if(err) {
                    cb(err);
                } else {
                    cb(false, us2cc(result));
                }
            };

            dbc.query(sqlTemplates.SELECT_PRODUCT_GROUP_BY_ID, productGroupId, p);
        } else if(_.isFunction(cb)) {
            cb('Bad parameters for selectProductGroupById.');
        }
    },

    selectProducts: function selectProducts (options, cb) {
        if(_.isFunction(cb)) {
            var p = function (err, result) {
                if(err) {
                    cb(err);
                } else {
                    cb(false, us2cc(result));
                }
            };

            if('orderId' in options && _.isNumber(options.orderId) && options.orderId > 0) {
                dbc.query(sqlTemplates.SELECT_ORDER_BY_ID, [ options.orderId ], function (err, results) {
                    if(err) {
                        cb(err);
                    } else if(results.length == 1) {
                        var typeId = results[0].type_id,
                            customerId = results[0].customer_id;

                        dbc.query(sqlTemplates.SELECT_PRODUCTS_FOR_ORDER, [ typeId, typeId, customerId ], p);
                    } else {
                        cb('No such order.');
                    }
                });
            } else if('productGroupId' in options && _.isNumber(options.productGroupId) && options.productGroupId > 0) {
                dbc.query(sqlTemplates.SELECT_PRODUCTS_BY_GROUP_ID, options.productGroupId, p);
            } else {
                dbc.query(sqlTemplates.SELECT_PRODUCTS, p);
            }
        }
    },

    selectProductsById: function selectProductsById (productIds, cb) {
        if(_.isFunction(cb)) {
            dbc.query(sqlTemplates.SELECT_PRODUCTS_BY_ID, [ _.isArray(productIds) ? productIds : [ productIds ] ], function (err, result) {
                if(err) {
                    cb(err);
                } else {
                    cb(false, us2cc(result));
                }
            });
        }
    },

    updateProductPrice: function updateProductPrice (productId, priceId, unitPrice, cb) {
        if(productId && priceId && unitPrice) {
            dbc.query(sqlTemplates.UPDATE_PRODUCT_PRICE, [ unitPrice, productId, priceId ], function (err, result) {
                if(err) {
                    cb(err);
                } else {
                    cb(false, result);
                }
            });
        } else {
            if(_.isFunction(cb)) {
                cb('Missing required input.');
            }
        }
    },

    selectUnits: function selectUnits (options, cb) {
        if(_.isFunction(cb)) {
            dbc.query(sqlTemplates.SELECT_UNITS, function (err, result) {
                if(err) {
                    cb(err);
                } else {
                    cb(false, us2cc(result));
                }
            });
        }
    },

    selectUnitsById: function selectUnitsById (unitIds, cb) {
        if(_.isFunction(cb)) {
            dbc.query(sqlTemplates.SELECT_UNITS_BY_ID, [ _.isArray(unitIds) ? unitIds : [ unitIds ] ], function (err, result) {
                if(err) {
                    cb(err);
                } else {
                    cb(false, us2cc(result));
                }
            });
        }
    },

    insertOrders: function insertOrders (newOrders, cb) {
        var results = [],
            requests = _.isArray(newOrders) ? newOrders : [ newOrders ],
            done = function (result) {
                results.push(result);

                if(results.length === requests.length) {
                    if(_.isFunction(cb)) {
                        if(results.length === 1) {
                            cb.apply(results[0], results[0]);
                        } else {
                            cb(false, results);
                        }
                    }
                }
            };

        _.forEach(requests, function (newOrder) {
            if('customerId' in newOrder && 'typeId' in newOrder) {
                dbc.query(sqlTemplates.INSERT_ORDER, [
                    newOrder.customerId,
                    1,
                    1,
                    newOrder.typeId,
                    newOrder.name,
                    '00000000'
                ], function (err, result) {
                    if(err) {
                        done([ err ]);
                    } else {
                        db.syncOrder(result.insertId, function (err) {
                            if(err) {
                                done([ err ]);
                            } else {
                                done([ false, _.extend(result, newOrder) ]);
                            }
                        });
                    }
                });
            } else {
                done([ 'Missing required information in newOrder.' ]);
            }
        });
    },

    selectOrderById: function selectFullOrderById(orderId, cb) {
        if(_.isFunction(cb)) {
            dbc.query(sqlTemplates.SELECT_ORDER_BY_ID, [ orderId ], function (err, result) {
                if(err) {
                    cb(err);
                } else {
                    if(result.length === 1) {
                        cb(false, us2cc(result[0]));
                    } else {
                        cb('No such order.');
                    }
                }
            });
        }
    },

    selectOrders: function selectOrders (pLims, cb) {
        var l = [],
            c = _.isFunction(pLims) ? pLims : cb,
            limits;

        if(_.isPlainObject(pLims)) {
            limits = _.extend({}, pLims);

            _.forEach(limits, function (value, key) {
                switch(key) {
                    case 'customerId':
                        limits.customerId = parseInt(limits.customerId, 10);
                        if(_.isNumber(limits.customerId) && limits.customerId > 0) {
                            l.push({
                                name: 'customer_id',
                                test: '=',
                                value: limits.customerId
                            });
                        } else {
                            c('Invalid customer id limit.');
                        }

                        break;
                    case 'statusId':
                        limits.statusId = parseInt(limits.statusId, 10);
                        if(_.isNumber(limits.statusId) && limits.statusId > 0) {
                            l.push({
                                name: 'status_id',
                                test: '=',
                                value: limits.statusId
                            });
                        } else {
                            c('Invalid status id limit.');
                        }

                        break;
                    case 'typeId':
                        limits.typeId = parseInt(limits.typeId, 10);
                        if(_.isNumber(limits.typeId) && limits.typeId > 0) {
                            l.push({
                                name: 'type_id',
                                test: '=',
                                value: limits.typeId
                            });
                        } else {
                            c('Invalid type id limit.');
                        }

                        break;
                    case 'createdOn':
                        limits.createdOn = new Date(limits.createdOn);
                        if(_.isNumber(limits.createdOn.getTime())) {
                            l.push({
                                name: 'created_timestamp',
                                test: '=',
                                value: '\'' + limits.createdOn.toISOString() + '\''
                            });
                        } else {
                            c('Invalid created on limit.');
                        }
                        break;
                    case 'createdBefore':
                        limits.createdBefore = new Date(limits.createdBefore);
                        if(_.isNumber(limits.createdBefore.getTime())) {
                            l.push({
                                name: 'created_timestamp',
                                test: '<',
                                value: '\'' + limits.createdBefore.toISOString() + '\''
                            });
                        } else {
                            c('Invalid created before limit.');
                        }
                        break;
                    case 'createdAfter':
                        limits.createdAfter = new Date(limits.createdAfter);
                        if(_.isNumber(limits.createdAfter.getTime())) {
                            l.push({
                                name: 'created_timestamp',
                                test: '>',
                                value: '\'' + limits.createdAfter.toISOString() + '\''
                            });
                        } else {
                            c('Invalid created after limit.');
                        }
                        break;
                    case 'createdOnOrBefore':
                        limits.createdOnOrBefore = new Date(limits.createdOnOrBefore);
                        if(_.isNumber(limits.createdOnOrBefore.getTime())) {
                            l.push({
                                name: 'created_timestamp',
                                test: '<=',
                                value: '\'' + limits.createdOnOrBefore.toISOString() + '\''
                            });
                        } else {
                            c('Invalid created on or before limit.');
                        }
                        break;
                    case 'createdOnOrAfter':
                        limits.createdOnOrAfter = new Date(limits.createdOnOrAfter);
                        if(_.isNumber(limits.createdOnOrAfter.getTime())) {
                            l.push({
                                name: 'created_timestamp',
                                test: '>=',
                                value: '\'' + limits.createdOnOrAfter.toISOString() + '\''
                            });
                        } else {
                            c('Invalid created on or after limit.');
                        }
                        break;
                    case 'modifiedOn':
                        limits.modifiedOn = new Date(limits.modifiedOn);
                        if(_.isNumber(limits.modifiedOn.getTime())) {
                            l.push({
                                name: 'modified_timestamp',
                                test: '=',
                                value: '\'' + limits.modifiedOn.toISOString() + '\''
                            });
                        } else {
                            c('Invalid modified on limit.');
                        }
                        break;
                    case 'modifiedBefore':
                        limits.modifiedBefore = new Date(limits.modifiedBefore);
                        if(_.isNumber(limits.modifiedBefore.getTime())) {
                            l.push({
                                name: 'modified_timestamp',
                                test: '<',
                                value: '\'' + limits.modifiedBefore.toISOString() + '\''
                            });
                        } else {
                            c('Invalid modified before limit.');
                        }
                        break;
                    case 'modifiedAfter':
                        limits.modifiedAfter = new Date(limits.modifiedAfter);
                        if(_.isNumber(limits.modifiedAfter.getTime())) {
                            l.push({
                                name: 'modified_timestamp',
                                test: '>',
                                value: '\'' + limits.modifiedAfter.toISOString() + '\''
                            });
                        } else {
                            c('Invalid modified after limit.');
                        }
                        break;
                    case 'modifiedOnOrBefore':
                        limits.modifiedOnOrBefore = new Date(limits.modifiedOnOrBefore);
                        if(_.isNumber(limits.modifiedOnOrBefore.getTime())) {
                            l.push({
                                name: 'modified_timestamp',
                                test: '<=',
                                value: '\'' + limits.modifiedOnOrBefore.toISOString() + '\''
                            });
                        } else {
                            c('Invalid modified on or before limit.');
                        }
                        break;
                    case 'modifiedOnOrAfter':
                        limits.modifiedOnOrAfter = new Date(limits.modifiedOnOrAfter);
                        if(_.isNumber(limits.modifiedOnOrAfter.getTime())) {
                            l.push({
                                name: 'modified_timestamp',
                                test: '>=',
                                value: '\'' + limits.modifiedOnOrAfter.toISOString() + '\''
                            });
                        } else {
                            c('Invalid modified on or after limit.');
                        }
                        break;
                }
            });
        }

        if(_.isFunction(c)) {
            dbc.query(_.size(l) > 0 ? sqlTemplates.SELECT_100_MOST_RECENT_ORDERS_LIMITED_LISTING(l) : sqlTemplates.SELECT_100_MOST_RECENT_ORDERS_LISTING, function (err, result) {
                if(err) {
                    c(err);
                } else {
                    c(false, us2cc(result));
                }
            });
        }
    },

    insertOrderItems: function insertOrderItems (orderId, newOrderItems, cb) {
        var results = [],
            requests = _.isArray(newOrderItems) ? newOrderItems : [ newOrderItems ],
            done = function (result) {
                results.push(result);

                if(results.length === requests.length) {
                    // Now, update the order.
                    db.syncOrder(orderId, function (err, result) {
                        if(_.isFunction(cb)) {
                            if(err) {
                                cb(err);
                            } else {
                                if(results.length === 1) {
                                    cb.apply(results[0], results[0]);
                                } else {
                                    cb(false, results);
                                }
                            }
                        }
                    });
                }
            };

        // Make sure we have a valid order id.
        if(!_.isNumber(orderId) || orderId < 1) {
            if(_.isFunction(cb)) {
                cb('Invalid order id.');
            }

            return;
        }

        db.isOrderLocked(orderId, function (err, locked) {
            if(err) {
                if(_.isFunction(cb)) {
                    cb(err);
                }
            } else if (locked) {
                if(_.isFunction(cb)) {
                    cb({ forbidden: 'Order is locked.' });
                }
            } else {
                dbc.query(sqlTemplates.SELECT_ORDER_BY_ID, [ orderId ], function (err, orderResults) {
                    var order = orderResults.length > 0 ? us2cc(orderResults[0]) : null;

                    if(err || !order) {
                        done([ err || 'Unable to retrieve order.' ]);
                        return;
                    }

                    // Process each of the add item requests.
                    _.forEach(requests, function (orderItem) {
                        // Make sure we have valid product ids and quantities.
                        if('productId' in orderItem && _.isNumber(orderItem.productId) && orderItem.productId > 0 &&
                            'quantity' in orderItem && _.isNumber(orderItem.quantity) && orderItem.quantity > 0) {
                                dbc.query(sqlTemplates.SELECT_BARE_ORDER_ITEMS_BY_ORDER_ID, [ orderId ], function (err, result) {
                                    var orderItems = us2cc(result),
                                        productIds = _.map(orderItems, function (orderItem) { return orderItem.productId; }),
                                        matchingItemIndex = productIds.indexOf(orderItem.productId),
                                        matchingItem = matchingItemIndex === -1 ? null : orderItems[matchingItemIndex];

                                    if(!matchingItem) {
                                        // If there's not already a product in this order with the specified id, insert a new item.
                                        dbc.query(sqlTemplates.SELECT_PRODUCT_PRICE_FOR_ORDER, [ orderItem.productId, order.typeId ], function (err, productPrices) {
                                            if(err || productPrices.length === 0) {
                                                done([ err ]);
                                                return;
                                            }

                                            var productPrice;

                                            // Try to find a customer-specific price.
                                            _.forEach(productPrices, function (pp) {
                                                if(pp.customer_id === order.customerId) {
                                                    productPrice = us2cc(pp);
                                                }
                                            });

                                            // If there was no customer-specific price, find the price without
                                            // a customer id - The "all customers" price.
                                            if(!productPrice) {
                                                _.forEach(productPrices, function (pp) {
                                                    if(!pp.customer_id) {
                                                        productPrice = us2cc(pp);
                                                    }
                                                });
                                            }

                                            if(productPrice) {
                                                dbc.query(
                                                    sqlTemplates.INSERT_ORDER_ITEM,
                                                    [
                                                        orderId,
                                                        orderItem.productId,
                                                        orderItem.quantity,
                                                        productPrice.unitPrice
                                                    ],
                                                    function (err, result) {
                                                        if(err) {
                                                            done([ err ]);
                                                        } else {
                                                            done([ false, _.extend(result, orderItem) ]);
                                                        }
                                                    }
                                                );
                                            } else {
                                                done([ 'Unable to retrieve appropriate price for product.' ]);
                                            }
                                        });
                                    } else {
                                        // If there's already an item in the order of the specified product,
                                        // just add the quantity to that item.
                                        db.updateOrderItem(orderId, matchingItem.id, matchingItem.quantity + orderItem.quantity, function (err, result) {
                                            if(err) {
                                                done([ err ]);
                                            } else {
                                                done([ false, _.extend(result, orderItem) ]);
                                            }
                                        });
                                    }
                                });
                        } else {
                            done([ 'Required information is missing or invalid.' ]);
                        }
                    });
                });
            }
        });
    },

    selectOrderItemsByOrderId: function selectOrderItemsByOrderId (orderId, cb) {
        if(_.isFunction(cb)) {
            if(_.isNumber(orderId)) {
                dbc.query(sqlTemplates.SELECT_ORDER_ITEMS_BY_ORDER_ID, [ orderId ], function (err, result) {
                    if(err) {
                        cb(err);
                    } else {
                        cb(false, us2cc(result));
                    }
                });
            } else {
                cb('Bad orderId.');
            }
        }
    },

    isOrderLocked: function isOrderCompleted (orderId, cb) {
        if(_.isFunction(cb)) {
            if(_.isNumber(orderId) && orderId > 0) {
                dbc.query(sqlTemplates.SELECT_ORDER_STATUS_ID_BY_ORDER_ID, [ orderId ], function (err, orderStatusId) {
                    if(err) {
                        cb(err);
                    } else if(orderStatusId.length === 1) {
                        cb(false, orderStatusId[0].status_id !== 1);
                    } else {
                        cb('No such order.');
                    }
                });
            } else {
                cb('Invalid order id.');
            }
        }
    },

    isOrderCompleted: function isOrderCompleted (orderId, cb) {
        if(_.isFunction(cb)) {
            if(_.isNumber(orderId) && orderId > 0) {
                dbc.query(sqlTemplates.SELECT_ORDER_STATUS_ID_BY_ORDER_ID, [ orderId ], function (err, orderStatusId) {
                    if(err) {
                        cb(err);
                    } else if(orderStatusId.length === 1) {
                        cb(false, orderStatusId[0].status_id === 2);
                    } else {
                        cb('No such order.');
                    }
                });
            } else {
                cb('Invalid order id.');
            }
        }
    },

    updateOrder: function updateOrder (orderId, mods, cb) {
        var usMods = cc2us(mods),
            c = _.isFunction(cb) ? cb : _.noop;

        if(!orderId) {
            c('Missing required order id.');
            return;
        } else if(!_.isNumber(orderId) || orderId < 1) {
            c('Invalid order id.');
            return;
        }

        db.isOrderLocked(orderId, function (err, locked) {
            if(err) {
                c(err);
            } else if(locked) {
                c({ forbidden: 'Order is locked.' });
            } else {
                dbc.query(sqlTemplates.UPDATE_ORDER(usMods), [ orderId ], function (err, result) {
                    if(err) {
                        c(err);
                    } else {
                        db.syncOrder(orderId, function (err, result) {
                            db.selectOrderById(orderId, function (err, result) {
                                if(err) {
                                    c(err);
                                } else {
                                    db.selectOrderById(orderId, function (err, order) {
                                        if(err) {
                                            c(err);
                                        } else {
                                            c(false, order);
                                        }
                                    });
                                }
                            });
                        });
                    }
                });
            }
        });
    },

    syncOrder: function syncOrder (orderId, cb) {
        var c = _.isFunction(cb) ? cb : _.noop;

        if(!orderId) {
            c('Missing required order id.');
            return;
        } else if(!_.isNumber(orderId) || orderId < 1) {
            c('Invalid order id.');
            return;
        }

        db.isOrderLocked(orderId, function (err, locked) {
            if(err) {
                c(err);
            } else if(locked) {
                c({ forbidden: 'Order is locked.' });
            } else {
                // Recalculate the order subtotal and total.
                dbc.query(sqlTemplates.SELECT_ORDER_ITEM_COUNT_AND_SUBTOTAL_BY_ORDER_ID, [ orderId ], function (err, result) {
                    if(err) {
                        c(err);
                    } else {
                        var q = result[0];
                        // Now, update the order entry.
                        dbc.query(sqlTemplates.SYNC_ORDER, [ q.subtotal, q.subtotal, q.count, orderId ], function (err, result) {
                            if(err) {
                                c(err);
                            } else {
                                // Identify any invoices this order appears on, and sync those.
                                dbc.query(sqlTemplates.SELECT_INVOICE_IDS_BY_ORDER_ID, [ orderId ], function (err, invoiceIds) {
                                    if(!err) {
                                        var ds = 0,
                                            d = function () {
                                                ds++;

                                                if(ds >= invoiceIds.length) {
                                                    // And we're done!
                                                    c(false, result);
                                                }
                                            };

                                        if(invoiceIds.length > 0) {
                                            _.forEach(invoiceIds, function (invoiceId) {
                                                db.syncInvoice(invoiceId.id, d);
                                            });
                                        } else {
                                            d();
                                        }
                                    } else {
                                        c(err);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    },

    updateOrderItem: function updateOrderItem (orderId, orderItemId, quantity, cb) {
        var c = _.isFunction(cb) ? cb : _.noop;

        if(_.isNumber(orderItemId) && _.isNumber(quantity)) {
            if(orderId < 1) {
                c('Invalid order item id.');
                return;
            }

            if(orderItemId < 1) {
                c('Invalid order item id.');
                return;
            }

            if(quantity < 0) {
                c('Invalid quantity.');
                return;
            }

            db.isOrderLocked(orderId, function (err, locked) {
                if(err) {
                    c(err);
                } else if(locked) {
                    c({ forbidden: 'Order is locked.' });
                } else {
                    if(quantity === 0) {
                        dbc.query(sqlTemplates.DELETE_ORDER_ITEM, [ orderItemId ], function (err, result) {
                            if(err) {
                                c(err);
                            } else {
                                // Now, update the order.
                                db.syncOrder(orderId, function (err, result) {
                                    if(err) {
                                        c(err);
                                    } else {
                                        // And we're done!
                                        c(false, result);
                                    }
                                });
                            }
                        });
                    } else {
                        // TODO: Make this transactional!
                        // First, change the order item quantity.
                        dbc.query(sqlTemplates.UPDATE_ORDER_ITEM, [ quantity, orderItemId ], function (err, result) {
                            if(err) {
                                c(err);
                            } else {
                                // Now, update the order.
                                db.syncOrder(orderId, function (err, result) {
                                    if(err) {
                                        c(err);
                                    } else {
                                        // And we're done!
                                        c(false, result);
                                    }
                                });
                            }
                        });
                    }
                }
            });
        } else {
            if(_.isFunction(cb)) {
                c('Missing required input.');
            }
        }
    },

    selectOrderTypes: function selectOrderTypes (options, cb) {
        if(_.isFunction(cb)) {
            dbc.query(sqlTemplates.SELECT_ORDER_TYPE_LISTING, function (err, orderTypes) {
                if(err) {
                    cb(err);
                } else {
                    cb(false, orderTypes);
                }
            });
        }
    },

    syncInvoice: function syncInvoice (invoiceId, cb) {
        var c = _.isFunction(cb) ? cb : _.noop;

        if(!invoiceId) {
            c('Missing required invoice id.');
            return;
        } else if(!_.isNumber(invoiceId) || invoiceId < 1) {
            c('Invalid invoice id.');
            return;
        }

        // Recalculate the invoice subtotal and total.
        dbc.query(sqlTemplates.SELECT_INVOICE_ORDER_COUNT_AND_SUBTOTAL_BY_INVOICE_ID, [ invoiceId ], function (err, result) {
            if(err) {
                c(err);
            } else {
                var q = result[0];
                // Now, update the order entry.
                dbc.query(sqlTemplates.SYNC_INVOICE, [ q.subtotal, q.subtotal, q.count, invoiceId ], function (err, result) {
                    if(err) {
                        c(err);
                    } else {
                        // And we're done!
                        c(false, result);
                    }
                });
            }
        });
    },

    insertInvoices: function insertInvoices (invoices, cb) {
        var c = _.isFunction(cb) ? cb : _.noop,
            is = _.isArray(invoices) ? invoices : [ invoices ],
            results = [],
            done = function (err, result) {
                results.push([ err, result ]);

                if(results.length == is.length) {
                    if(results.length === 1) {
                        c(results[0][0], results[0][1]);
                    } else {
                        c(results);
                    }
                }
            };

        _.forEach(is, function (invoice) {
            if(_.isPlainObject(invoice)) {
                if(!_.isNumber(invoice.createdUserId) || invoice.createdUserId < 1) {
                    done({ inputError: 'Invalid created user id.' });
                    return;
                }

                if(!_.isNumber(invoice.modifiedUserId || invoice.modifiedUserId < 1)) {
                    done({ inputError: 'Invalid modified user id.' });
                    return;
                }

                if(!_.isString(invoice.accessCode) || invoice.accessCode.length < 8) {
                    done({ inputError: 'Invalid access code.' });
                    return;
                }

                if(!_.isString(invoice.billedToName) || invoice.billedToName.length < 1) {
                    done({ inputError: 'Invalid billed to name.' });
                    return;
                }

                dbc.query(sqlTemplates.INSERT_INVOICE, [
                        invoice.createdUserId,
                        invoice.modifiedUserId,
                        invoice.accessCode,
                        invoice.name,
                        invoice.billedToName,
                        invoice.billedToAddress,
                        invoice.billedToPhone,
                        invoice.billedToEmail,
                        invoice.billedToCustomerId
                    ],
                    function (err, result) {
                        if(err) {
                            done(err);
                        } else {
                            done(false, result);
                        }
                    });
            } else {
                done('Invalid invoice specification.');
            }
        });
    },

    insertInvoiceOrders: function insertInvoiceOrders (invoiceId, newInvoiceOrders, cb) {
        var c = _.isFunction(cb) ? cb : _.noop,
            results = [],
            requests = _.isArray(newInvoiceOrders) ? newInvoiceOrders : [ newInvoiceOrders ],
            done = function (result) {
                results.push(result);

                if(results.length === requests.length) {
                    // Now, update the invoice.
                    db.syncInvoice(invoiceId, function (err, result) {
                        if(err) {
                            c(err);
                        } else {
                            if(results.length === 1) {
                                c.apply(results[0], results[0]);
                            } else {
                                c(false, results);
                            }
                        }
                    });
                }
            };

        // Make sure we have a valid invoice id.
        if(!_.isNumber(invoiceId) || invoiceId < 1) {
            c('Invalid invoice id.');
            return;
        }

        if(requests.length === 0) {
            c('Nothing to do.');
            return;
        }

        if(requests.length > 100) {
            c('Too many orders.');
            return;
        }

        // Process each of the add order requests.
        _.forEach(requests, function (invoiceOrder) {
            // Make sure we have valid order ids.
            if(_.isNumber(invoiceOrder.id) && invoiceOrder.id > 0) {
                // Pull a list of existing order ids for the invoice, to detect duplication.
                dbc.query(sqlTemplates.SELECT_BARE_INVOICE_ORDERS_BY_INVOICE_ID, [ invoiceId ], function (err, result) {
                    var invoiceOrders = us2cc(result),
                        orderIds = _.map(invoiceOrders, function (invoiceOrder) { return invoiceOrder.orderId; }),
                        matchingItemIndex = orderIds.indexOf(invoiceOrder.id),
                        matchingItem = matchingItemIndex === -1 ? null : invoiceOrders[matchingItemIndex];

                    if(!matchingItem) {
                        // If there's not already an order in this invoice with the specified id, make sure the
                        // specified order exists and is completed.
                        db.isOrderCompleted(invoiceOrder.id, function (err, completed) {
                            if(err) {
                                done([ 'No such order.' ]);
                            } else if(completed) {
                                dbc.query(
                                    sqlTemplates.INSERT_INVOICE_ORDER,
                                    [
                                        invoiceId,
                                        invoiceOrder.id
                                    ],
                                    function (err, result) {
                                        if(err) {
                                            done([ err ]);
                                        } else {
                                            done([ false, _.extend(result, invoiceOrder) ]);
                                        }
                                    }
                                );
                            } else {
                                done([ { forbidden: 'Order is not completed.' } ]);
                            }
                        });
                    } else {
                        // If the specified order is already in the invoice, return an error.
                        done([ 'Order already on invoice.' ]);
                    }
                });
            } else {
                done([ 'Required information is missing or invalid.' ]);
            }
        });
    },

    selectInvoiceOrdersByInvoiceId: function selectInvoiceOrdersByInvoiceId (invoiceId, cb) {
        if(_.isFunction(cb)) {
            if(_.isNumber(invoiceId) && invoiceId > 0) {
                dbc.query(sqlTemplates.SELECT_INVOICE_ORDERS_BY_INVOICE_ID, [ invoiceId ], function (err, result) {
                    if(err) {
                        cb(err);
                    } else {
                        cb(false, us2cc(result));
                    }
                });
            } else {
                cb('Invalid invoice id.');
            }
        }
    },

    deleteInvoiceOrder: function deleteInvoiceOrder (invoiceId, orderId, cb) {
        if(_.isNumber(orderId) && orderId < 1) {
            // TODO: Make this transactional!
            // First, change the order item quantity.
            dbc.query(sqlTemplates.DELETE_INVOICE_ORDER_BY_ORDER_ID, [ orderId ], function (err, result) {
                if(err) {
                    cb(err);
                } else {
                    // Now, update the invoice.
                    db.syncInvoice(invoiceId, function (err, result) {
                        if(err) {
                            cb(err);
                        } else {
                            // And we're done!
                            cb(false, result);
                        }
                    });
                }
            });
        } else {
            if(_.isFunction(cb)) {
                cb('Invalid order id.');
            }
        }
    },

    selectInvoiceById: function selectInvoiceById (invoiceId, cb) {
        if(_.isFunction(cb)) {
            dbc.query(sqlTemplates.SELECT_INVOICE_BY_ID, [ invoiceId ], function (err, result) {
                if(err) {
                    cb(err);
                } else {
                    if(result.length === 1) {
                        cb(false, us2cc(result[0]));
                    } else {
                        cb('No such invoice.');
                    }
                }
            });
        }
    },

    selectInvoices: function selectInvoices (cb) {
        if(_.isFunction(cb)) {
            dbc.query(sqlTemplates.SELECT_100_MOST_RECENT_INVOICES_LISTING, function (err, result) {
                if(err) {
                    cb(err);
                } else {
                    cb(false, us2cc(result));
                }
            });
        }
    },

    updateInvoice: function updateInvoice (invoiceId, mods, cb) {
        var usMods = cc2us(mods),
            c = _.isFunction(cb) ? cb : _.noop;

        if(!invoiceId) {
            c('Missing required invoice id.');
            return;
        } else if(!_.isNumber(invoiceId) || invoiceId < 1) {
            c('Invalid invoice id.');
            return;
        }

        dbc.query(sqlTemplates.UPDATE_INVOICE(usMods), [ invoiceId ], function (err, result) {
            if(err) {
                c(err);
            } else {
                db.selectInvoiceById(invoiceId, function (err, invoice) {
                    if(err) {
                        c(err);
                    } else {
                        c(false, invoice);
                    }
                });
            }
        });
    }
};