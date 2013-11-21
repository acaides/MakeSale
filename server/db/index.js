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

function cc (obj) {
    if(_.isObject(obj) && !_.isDate(obj)) {
        return _.transform(obj, function (result, value, key) {
            if(_.isString(key)) {
                var ccKey = key.replace(/(\_[a-z])/g, function($1) {
                    return $1.toUpperCase().replace('_', '');
                });
                result[ccKey] = cc(value);
            } else {
                result[key] = cc(value);
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

    selectProducts: function selectProducts (cb) {
        if(_.isFunction(cb)) {
            dbc.query(sqlTemplates.SELECT_PRODUCTS, function (err, result) {
                if(err) {
                    cb(err);
                } else {
                    cb(false, cc(result));
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
                    cb(false, cc(result));
                }
            });
        }
    },

    selectOrders: function selectOrders (cb) {
        if(_.isFunction(cb)) {
            dbc.query(sqlTemplates.SELECT_ORDERS, function (err, result) {
                if(err) {
                    cb(err);
                } else {
                    cb(false, cc(result));
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
                        cb(false, cc(result));
                    }
                });
            } else {
                cb('Bad orderId.');
            }
        }
    }
};