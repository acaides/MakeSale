var mysql = require('mysql'),
    dbc = mysql.createConnection({
        host: 'localhost',
        user: 'beurrageDotNet',
        password: 'V8e80ih&}8C472w02/gPlR73',
        database: 'beurrage',
        supportBigNumbers: true
    }),
    sqlTemplates = require('./sqlTemplates'),
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
                dbc.query(sqlTemplates.SELECT_ORDER_TYPE_ID_BY_ORDER_ID, [ options.orderId ], function (err, results) {
                    if(err) {
                        cb(err);
                    } else if(results.length == 1) {
                        var typeId = results[0].type_id;

                        dbc.query(sqlTemplates.SELECT_PRODUCTS_FOR_ORDER_TYPE, [ typeId ], p);
                    } else {
                        cb('No such order.');
                    }
                });
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
            if('customerId' in newOrder && 'typeId' in newOrder) {
                dbc.query(sqlTemplates.INSERT_ORDER, [
                    newOrder.customerId,
                    1,
                    1,
                    newOrder.typeId,
                    newOrder.name
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

        // Process each of the add item requests.
        _.forEach(requests, function (orderItem) {
            // Make sure we have valid product ids and quantities.
            if('productId' in orderItem && _.isNumber(orderItem.productId) && orderItem.productId > 0 &&
                'quantity' in orderItem && _.isNumber(orderItem.quantity) && orderItem.quantity > 0) {
                // Pull a list of existing product ids for the order, to detect duplication.
                dbc.query(sqlTemplates.SELECT_BARE_ORDER_ITEMS_BY_ORDER_ID, [ orderId ], function (err, result) {
                    var orderItems = us2cc(result),
                        productIds = _.map(orderItems, function (orderItem) { return orderItem.productId; }),
                        matchingItemIndex = productIds.indexOf(orderItem.productId),
                        matchingItem = matchingItemIndex === -1 ? null : orderItems[matchingItemIndex];

                    if(!matchingItem) {
                        // If there's not already a product in this order with the specified id, insert a new item.
                        dbc.query(
                            sqlTemplates.INSERT_ORDER_ITEM,
                            [
                                orderId,
                                orderItem.productId,
                                orderItem.quantity
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
                        // And we're done!
                        c(false, result);
                    }
                });
            }
        });
    },

    updateOrderItem: function updateOrderItem (orderId, orderItemId, quantity, cb) {
        if(_.isNumber(orderItemId) && _.isNumber(quantity)) {
            if(orderItemId < 1) {
                cb('Invalid order item id.');
                return;
            }

            if(quantity < 0) {
                cb('Invalid quantity.');
                return;
            }

            // TODO: Make this transactional!
            // First, change the order item quantity.
            dbc.query(sqlTemplates.UPDATE_ORDER_ITEM, [ quantity, orderItemId ], function (err, result) {
                if(err) {
                    cb(err);
                } else {
                    // Now, update the order.
                    db.syncOrder(orderId, function (err, result) {
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
                cb('Missing required input.');
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
                    done('Invalid created user id.');
                    return;
                }

                if(!_.isNumber(invoice.modifiedUserId || invoice.modifiedUserId < 1)) {
                    done('Invalid modified user id.');
                    return;
                }

                if(!_.isString(invoice.accessCode) || invoice.accessCode.length < 8) {
                    done('Invalid access code.');
                    return;
                }

                dbc.query(sqlTemplates.INSERT_INVOICE, [ invoice.createdUserId, invoice.modifiedUserId, invoice.accessCode ], function (err, result) {
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
    }
};