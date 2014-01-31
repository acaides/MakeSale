var _ = require('lodash'),
    sqlStubs = {
        SELECT_ORDER: 'SELECT `order`.`id`, `order`.`name`, `order`.`subtotal`, ' +
            '`order`.`total`, `order`.`item_count`, `order`.`created_timestamp`, ' +
            '`order`.`modified_timestamp`, `customer`.`id` AS `customer_id`, `customer`.`name` AS `customer_name`, ' +
            '`customer`.`email` AS `customer_email`, `customer`.`phone` AS `customer_phone`, ' +
            '`order_type`.`id` AS `type_id`, `order_type`.`name` AS `type`, `order_status`.`id` AS `status_id`, ' +
            '`order_status`.`name` AS `status` ' +
            'FROM `order` ' +
            'JOIN `customer` ON `customer`.`id` = `order`.`customer_id` ' +
            'JOIN `order_type` ON `order_type`.`id` = `order`.`type_id` ' +
            'JOIN `order_status` ON `order_status`.`id` = `order`.`status_id` ',
        SELECT_INVOICE: 'SELECT `invoice`.`id`, `invoice`.`status_id`, `invoice_status`.`name` AS `status_name`, ' +
            '`invoice`.`modified_timestamp`, `invoice`.`created_timestamp`, `invoice`.`subtotal`, `invoice`.`total`, ' +
            '`invoice`.`order_count`, `invoice`.`access_code`, `invoice`.`name`, `invoice`.`billed_to_name`, ' +
            '`invoice`.`billed_to_address`, `invoice`.`billed_to_phone`, `invoice`.`billed_to_email`, ' +
            '`invoice`.`billed_to_customer_id` ' +
            'FROM `invoice`' +
            'JOIN `invoice_status` ON `invoice_status`.`id` = `invoice`.`status_id` '
    };

module.exports = {
    INSERT_USER: 'INSERT INTO `user` ' +
        '(`first_name`, `last_name`, `email`, `password`, `last_auth_timestamp`, `created_timestamp`, `address`, ' +
        '`phone`, `enabled`) ' +
        'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);',
    SELECT_USERS_BY_ID: 'SELECT * FROM `user` WHERE ',
    SELECT_USERS_BY_EMAIL: 'SELECT * FROM `user` WHERE ',
    INSERT_CUSTOMER: 'INSERT INTO `customer` (`name`, `address`, `phone`, `email`) VALUES (?, ?, ?, ?);',
    UPDATE_CUSTOMER: 'UPDATE `customer` SET ?',
    SELECT_CUSTOMER_LISTING: 'SELECT * FROM `customer` ORDER BY `name`;',
    SELECT_CUSTOMERS_BY_ID: 'SELECT * FROM `customer` WHERE `id` IN(?);',
    SELECT_CUSTOMERS_BY_EMAIL: 'SELECT * FROM `customer` WHERE ',
    INSERT_PRODUCT: 'INSERT INTO `product` (`name`, `description`, `unit_id`, `enabled`, `product_group_id`) VALUES (?, ?, ?, ?, ?);',
    INSERT_PRODUCT_GROUP: 'INSERT INTO `product_group` (`name`) VALUES (?);',
    UPDATE_PRODUCT: 'UPDATE `product` SET ?',
    UPDATE_PRODUCT_GROUP: 'UPDATE `product_group` SET ?',
    INSERT_PRODUCT_PRICE: 'INSERT INTO `product_price` (`product_id`, `order_type_id`, `unit_price`, `customer_id`) VALUES (?, ?, ?, ?);',
//    SELECT_PRODUCT_PRICES_BY_PRODUCT_ID: 'SELECT * FROM `product_price` WHERE `product_id` = ?;',
    SELECT_PRODUCT_PRICES_BY_PRODUCT_ID: 'SELECT `product_price`.*, ' +
        '`order_type`.`name` AS `order_type_name`, ' +
        '`customer`.`name` AS `customer_name` ' +
        'FROM `product_price` ' +
        'JOIN `order_type` ON `order_type`.`id` = `product_price`.`order_type_id` ' +
        'LEFT JOIN `customer` ON `customer`.`id` = `product_price`.`customer_id` ' +
        'WHERE `product_id` = ?;',
    SELECT_PRODUCT_PRICE_FOR_ORDER: 'SELECT ' +
        '`product_price`.`unit_price` AS `unit_price`, ' +
        '`product_price`.`customer_id` AS `customer_id` ' +
        'FROM `product_price` ' +
        'WHERE `product_id` = ? AND `order_type_id` = ?;',
    UPDATE_PRODUCT_PRICE: 'UPDATE `product_price` SET `unit_price` = ? WHERE `product_id` = ? AND `id` = ?;',
    SELECT_PRODUCTS_BY_ID: 'SELECT * FROM `product` WHERE `id` IN(?);',
    SELECT_PRODUCTS: 'SELECT `product`.*, ' +
        '`product_group`.`name` AS `product_group_name` ' +
        'FROM `product` ' +
        'LEFT JOIN `product_group` ON `product`.`product_group_id` = `product_group`.`id` ' +
        'ORDER BY `product_group`.`name`, `product`.`name`;',
    SELECT_PRODUCTS_BY_GROUP_ID: 'SELECT `product`.*, ' +
        '`product_group`.`name` AS `product_group_name` ' +
        'FROM `product` ' +
        'LEFT JOIN `product_group` ON `product`.`product_group_id` = `product_group`.`id` ' +
        'WHERE `product`.`product_group_id` = ? ' +
        'ORDER BY `product_group`.`name`, `product`.`name`;',
    SELECT_PRODUCT_GROUPS: 'SELECT * FROM `product_group` ORDER BY `name`;',
    SELECT_PRODUCT_GROUP_BY_ID: 'SELECT * FROM `product_group` WHERE `id` = ?;',
    SELECT_PRODUCTS_FOR_ORDER: 'SELECT `default_prices`.`id`, ' +
        '`default_prices`.`name`, ' +
        '`default_prices`.`description`, ' +
        '`default_prices`.`unit_id`, ' +
        '`default_prices`.`unit_name`, ' +
        '`default_prices`.`enabled`, ' +
        '`default_prices`.`product_group_id`, ' +
        '`default_prices`.`product_group_name`, ' +
        'Ifnull(`customer_specific`.`customer_price`, `unit_price`) AS ' +
        '`unit_price` ' +
        'FROM (SELECT `product`.*, ' +
        '`product_price`.`product_id`, ' +
        '`product_price`.`unit_price`, ' +
        '`unit`.`name` AS `unit_name`, ' +
        '`product_group`.`name` AS `product_group_name` ' +
        'FROM   `product` ' +
        'JOIN `product_price` ' +
        'ON `product_price`.`product_id` = `product`.`id` ' +
        'AND `product_price`.`order_type_id` = 1 ' +
        'JOIN `unit` ' +
        'ON `unit`.`id` = `product`.`unit_id` ' +
        'LEFT JOIN `product_group` ON `product`.`product_group_id` = `product_group`.`id` ' +
        'WHERE  `product_price`.`customer_id` IS NULL) default_prices ' +
        'LEFT JOIN (SELECT `product`.*, ' +
        '`product_price`.`product_id`, ' +
        '`product_price`.`unit_price` AS `customer_price`, ' +
        '`unit`.`name` AS `unit_name`, ' +
        '`product_group`.`name` AS `product_group_name` ' +
        'FROM   `product` ' +
        'JOIN `product_price` ' +
        'ON `product_price`.`product_id` = `product`.`id` ' +
        'AND `product_price`.`order_type_id` = 1 ' +
        'JOIN `unit` ' +
        'ON `unit`.`id` = `product`.`unit_id` ' +
        'LEFT JOIN `product_group` ON `product`.`product_group_id` = `product_group`.`id` ' +
        'WHERE  `product_price`.`customer_id` = 1) `customer_specific` ' +
        'ON `default_prices`.`product_id` = `customer_specific`.`product_id` ' +
        'ORDER BY `product_group_name`, `name`;',
//    SELECT_PRODUCTS_FOR_ORDER: 'SELECT `default_prices`.`id`, ' +
//        '`default_prices`.`name`, ' +
//        '`default_prices`.`description`, ' +
//        '`default_prices`.`unit_id`, ' +
//        '`default_prices`.`unit_name`, ' +
//        '`default_prices`.`enabled`, ' +
//        'Ifnull(`customer_specific`.`customer_price`, `unit_price`) AS ' +
//        '`unit_price` ' +
//        'FROM (SELECT `product`.*, ' +
//        '`product_price`.`product_id`, ' +
//        '`product_price`.`unit_price`, ' +
//        '`unit`.`name` AS `unit_name` ' +
//        'FROM   `product` ' +
//        'JOIN `product_price` ' +
//        'ON `product_price`.`product_id` = `product`.`id` ' +
//        'AND `product_price`.`order_type_id` = ? ' +
//        'JOIN `unit` ' +
//        'ON `unit`.`id` = `product`.`unit_id` ' +
//        'WHERE  `product_price`.`customer_id` IS NULL) default_prices ' +
//        'LEFT JOIN (SELECT `product`.*, ' +
//        '`product_price`.`product_id`, ' +
//        '`product_price`.`unit_price` AS `customer_price`, ' +
//        '`unit`.`NAME` AS `unit_name` ' +
//        'FROM   `product` ' +
//        'JOIN `product_price` ' +
//        'ON `product_price`.`product_id` = `product`.`id` ' +
//        'AND `product_price`.`order_type_id` = ? ' +
//        'JOIN `unit` ' +
//        'ON `unit`.`id` = `product`.`unit_id` ' +
//        'WHERE  `product_price`.`customer_id` = ?) `customer_specific` ' +
//        'ON `default_prices`.`product_id` = ' +
//        '`customer_specific`.`product_id` ORDER BY `name`;',
//    SELECT_PRODUCTS_FOR_ORDER: 'SELECT `product`.*, `product_price`.`unit_price`, `unit`.`name` AS `unit_name` ' +
//        'FROM `product` ' +
//        'JOIN `product_price` ON `product_price`.`product_id` = `product`.`id` ' +
//        'AND `product_price`.`order_type_id` = ? ' +
//        'JOIN `unit` ON `unit`.`id` = `product`.`unit_id`;',
    INSERT_ORDER: 'INSERT INTO `order` (`customer_id`, `created_user_id`, `modified_user_id`, `type_id`, `name`, `access_code`) VALUES (?, ?, ?, ?, ?, ?);',
    SELECT_100_MOST_RECENT_ORDERS_LISTING: sqlStubs.SELECT_ORDER +
        'ORDER BY `modified_timestamp` DESC ' +
        'LIMIT 100;',
    SELECT_100_MOST_RECENT_ORDERS_LIMITED_LISTING: function (limits) {
        var where = [];

        _.forEach(limits, function (limit) {
            where.push('`' + limit.name + '` ' + limit.test + ' ' + limit.value);
        });

        where = ' WHERE ' + where.join(' AND ') + ' ';

        return sqlStubs.SELECT_ORDER +
            where +
            'ORDER BY `modified_timestamp` DESC ' +
            'LIMIT 100';
    },
    SELECT_ORDER_BY_ID: sqlStubs.SELECT_ORDER +
        'WHERE `order`.`id` = ?;',
    SELECT_ORDER_TYPE_ID_BY_ORDER_ID: 'SELECT `type_id` FROM `order` WHERE `id` = ?;',
    SELECT_ORDER_ITEMS_BY_ORDER_ID: 'SELECT `order_item`.`id` as `id`, `product`.`id` as `product_id`, ' +
        '`product`.`name`, `product`.`description`, `order_item`.`unit_price`, `product`.`unit_id`, ' +
        '`unit`.`name` as `unit_name`, `order_item`.`quantity`, ' +
        '`order_item`.`unit_price` * `order_item`.`quantity` as `item_total` ' +
        'FROM `order` ' +
        'JOIN `order_item` on `order_item`.`order_id` = `order`.`id` ' +
        'JOIN `product` on `product`.`id` = `order_item`.`product_id` ' +
        'JOIN `unit` on `unit`.`id` = `product`.`unit_id` ' +
        'WHERE `order`.`id` = ? AND `order_item`.`quantity` > 0;',
    SELECT_BARE_ORDER_ITEMS_BY_ORDER_ID: 'SELECT * FROM `order_item` WHERE `order_id` = ?;',
    INSERT_ORDER_ITEM: 'INSERT INTO `order_item` (`order_id`, `product_id`, `quantity`, `unit_price`) VALUES (?, ?, ?, ?);',
    UPDATE_ORDER_ITEM: 'UPDATE `order_item` SET `quantity` = ? WHERE `id` = ?;',
    DELETE_ORDER_ITEM: 'DELETE FROM `order_item` WHERE `id` = ?;',
    SELECT_ORDER_ITEM_COUNT_AND_SUBTOTAL_BY_ORDER_ID: 'SELECT SUM(`order_item`.`quantity`) AS `count`, ' +
        'SUM(`order_item`.`unit_price` * `order_item`.`quantity`) AS `subtotal` ' +
        'FROM `order` ' +
        'JOIN `order_item` on `order_item`.`order_id` = `order`.`id` ' +
        'WHERE `order`.`id` = ?;',
    SYNC_ORDER: 'UPDATE `order` SET `total` = ?, `subtotal` = ?, `item_count` = ?, `modified_timestamp` = NOW() WHERE `id` = ?;',
    UPDATE_ORDER: function (values) {
        var vs = _.map(values, function (value, key) {
            return '`' + key + '` = \'' + value + '\'';
        });

        return 'UPDATE `order` SET ' + vs.join(', ') + ', `modified_timestamp` = NOW() WHERE `id` = ?;'
    },
    SELECT_ORDER_TYPE_LISTING: 'SELECT * FROM `order_type`;',

    INSERT_INVOICE: 'INSERT INTO `invoice` ' +
        '(`created_user_id`, `modified_user_id`, `modified_timestamp`, `access_code`, `name`, ' +
        '`billed_to_name`, `billed_to_address`, `billed_to_phone`, `billed_to_email`, `billed_to_customer_id`) ' +
        'VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?);',
    SELECT_INVOICE_BY_ID: sqlStubs.SELECT_INVOICE + ' WHERE `invoice`.`id` = ?;',
    DELETE_INVOICE_ORDER_BY_ORDER_ID: 'DELETE FROM `invoice_order` WHERE `invoice_id` = ? AND `order_id` = ?;',
    SELECT_INVOICE_ORDERS_BY_INVOICE_ID: 'SELECT `order`.`id`, ' +
        '`order`.`type_id`, `order_type`.`name` AS `type_name`, ' +
        '`order`.`status_id`, `order_status`.`name` AS `status_name`, ' +
        '`order`.`created_timestamp`, `order`.`modified_timestamp`, `order`.`name`, ' +
        '`order`.`item_count`, `order`.`customer_id`, ' +
        '`order`.`total`, `order`.`subtotal`, ' +
        '`customer`.`name` AS `customer_name`, `customer`.`address` AS `customer_address`, ' +
        '`customer`.`phone` AS `customer_phone`, `customer`.`email` AS `customer_email` ' +
        'FROM `invoice_order` ' +
        'JOIN `order` ON `order`.`id` = `invoice_order`.`order_id` ' +
        'JOIN `order_type` ON `order_type`.`id` = `order`.`type_id` ' +
        'JOIN `order_status` ON `order_status`.`id` = `order`.`status_id` ' +
        'JOIN `customer` ON `customer`.`id` = `order`.`customer_id` ' +
        'WHERE `invoice_id` = ?;',
    INSERT_INVOICE_ORDER: 'INSERT INTO `invoice_order` (`invoice_id`, `order_id`) VALUES (?, ?);',
    SELECT_BARE_INVOICE_ORDERS_BY_INVOICE_ID: 'SELECT * FROM `invoice_order` WHERE `invoice_id` = ?;',
    SYNC_INVOICE: 'UPDATE `invoice` SET `total` = ?, `subtotal` = ?, `order_count` = ?, `modified_timestamp` = NOW() WHERE `id` = ?;',
    SELECT_INVOICE_ORDER_COUNT_AND_SUBTOTAL_BY_INVOICE_ID: 'SELECT COUNT(`invoice_order`.`order_id`) AS `count`, ' +
        'SUM(`order`.`total`) AS `subtotal` ' +
        'FROM `invoice` ' +
        'JOIN `invoice_order` on `invoice_order`.`invoice_id` = `invoice`.`id` ' +
        'JOIN `order` on `order`.`id` = `invoice_order`.`order_id` ' +
        'WHERE `invoice`.`id` = ?;',
    SELECT_100_MOST_RECENT_INVOICES_LISTING: sqlStubs.SELECT_INVOICE +
        'ORDER BY `modified_timestamp` DESC ' +
        'LIMIT 100;',
    SELECT_INVOICE_IDS_BY_ORDER_ID: 'SELECT `invoice_id` AS `id` FROM `invoice_order` WHERE `order_id` = ?;',
    UPDATE_INVOICE: function (values) {
        var vs = _.map(values, function (value, key) {
            return '`' + key + '` = \'' + value + '\'';
        });

        return 'UPDATE `invoice` SET ' + vs.join(', ') + ', `modified_timestamp` = NOW() WHERE `id` = ?;'
    },
    SELECT_ORDER_STATUS_ID_BY_ORDER_ID: 'SELECT `status_id` FROM `order` WHERE `id` = ?;',
    SELECT_UNITS: 'SELECT * FROM `unit`;',
    SELECT_UNITS_BY_ID: 'SELECT * FROM `unit` WHERE `id` IN(?);'
};