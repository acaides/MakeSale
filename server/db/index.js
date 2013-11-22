var mysql = require('mysql'),
    dbc = mysql.createConnection({
        host: 'localhost',
        user: 'beurrageDotNet',
        password: 'V8e80ih&}8C472w02/gPlR73',
        database: 'beurrage',
        supportBigNumbers: true
    }),
    sqlTemplates = require('./sqlTemplates.json'),
    bcrypt = require('bcrypt'),
    _ = require('lodash');

function us2cc (obj) {
    if(_.isObject(obj) && !_.isDate(obj)) {
        return _.transform(obj, function (result, value, key) {
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

module.exports = {
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

    selectCustomersById: function selectCustomersById (customerIds, cb) {},

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
                    newProduct.enabled
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
                    newProductPrice.unitPrice
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

    selectProducts: function selectProducts (cb) {
        if(_.isFunction(cb)) {
            dbc.query(sqlTemplates.SELECT_PRODUCTS, function (err, result) {
                if(err) {
                    cb(err);
                } else {
                    cb(false, us2cc(result));
                }
            });
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

    updateProductPrice: function updateProductPrice (productId, orderTypeId, unitPrice, cb) {
        if(productId && orderTypeId && unitPrice) {
            dbc.query(sqlTemplates.UPDATE_PRODUCT_PRICE, [ unitPrice, productId, orderTypeId ], function (err, result) {
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
            if('customerId' in newOrder && 'createdUserId' in newOrder && 'typeId' in newOrder) {
                dbc.query(sqlTemplates.INSERT_ORDER, [
                    newOrder.customerId,
                    newOrder.createdUserId,
                    newOrder.typeId
                ], function (err, result) {
                    if(err) {
                        done([ err ]);
                    } else {
                        done([ false, _.extend(result, newOrder) ]);
                    }
                });
            } else {
                done([ 'Missing required information in newOrder.' ]);
            }
        });
    },

    selectOrdersById: function selectOrdersById(orderIds, cb) {
        if(_.isFunction(cb)) {
            dbc.query(sqlTemplates.SELECT_ORDERS_BY_ID, [ _.isArray(orderIds) ? orderIds : [ orderIds ] ], function (err, result) {
                if(err) {
                    cb(err);
                } else {
                    cb(false, us2cc(result));
                }
            });
        }
    },

    selectOrders: function selectOrders (cb) {
        if(_.isFunction(cb)) {
            dbc.query(sqlTemplates.SELECT_100_MOST_RECENT_ORDERS_LISTING, function (err, result) {
                if(err) {
                    cb(err);
                } else {
                    cb(false, us2cc(result));
                }
            });
        }
    },

    insertOrderItems: function insertOrderItems (newOrderItems, cb) {},

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
    }
};