var sqlStubs = {
    SELECT_ORDER: 'SELECT `order`.`id`, `order`.`name`, `order`.`subtotal`, ' +
        '`order`.`total`, `order`.`item_count`, `order`.`created_timestamp`, ' +
        '`order`.`modified_timestamp`, `customer`.`id` AS `customer_id`, `customer`.`name` AS `customer_name`, ' +
        '`customer`.`email` AS `customer_email`, `customer`.`phone` AS `customer_phone`, ' +
        '`order_type`.`id` AS `type_id`, `order_type`.`name` AS `type`, `order_status`.`id` AS `status_id`, ' +
        '`order_status`.`name` AS `status` ' +
        'FROM `order` ' +
        'JOIN `customer` ON `customer`.`id` = `order`.`customer_id` ' +
        'JOIN `order_type` ON `order_type`.`id` = `order`.`type_id` ' +
        'JOIN `order_status` ON `order_status`.`id` = `order`.`status_id` '
};

module.exports = {
    INSERT_USER: 'INSERT INTO `user` ' +
        '(`first_name`, `last_name`, `email`, `password`, `last_auth_timestamp`, `created_timestamp`, `address`, ' +
        '`phone`, `enabled`) ' +
        'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);',
    SELECT_USERS_BY_ID: 'SELECT * FROM `user` WHERE ',
    SELECT_USERS_BY_EMAIL: 'SELECT * FROM `user` WHERE ',
    INSERT_CUSTOMER: 'INSERT INTO `customer` (`name`, `address`, `phone`, `email`) VALUES (?, ?, ?, ?);',
    SELECT_CUSTOMER_LISTING: 'SELECT * FROM `customer`;',
    SELECT_CUSTOMERS_BY_ID: 'SELECT * FROM `customer` WHERE ',
    SELECT_CUSTOMERS_BY_EMAIL: 'SELECT * FROM `customer` WHERE ',
    INSERT_PRODUCT: 'INSERT INTO `product` (`name`, `description`, `unit_id`, `enabled`) VALUES (?, ?, ?, ?);',
    UPDATE_PRODUCT: 'UPDATE `product` SET ?',
    INSERT_PRODUCT_PRICE: 'INSERT INTO `product_price` (`product_id`, `order_type_id`, `unit_price`) VALUES (?, ?, ?);',
    SELECT_PRODUCT_PRICES_BY_PRODUCT_ID: 'SELECT * FROM `product_price` WHERE `product_id` = ?;',
    UPDATE_PRODUCT_PRICE: 'UPDATE `product_price` SET `unit_price` = ? WHERE `product_id` = ? AND `order_type_id` = ?;',
    SELECT_PRODUCTS_BY_ID: 'SELECT * FROM `product` WHERE id IN(?);',
    SELECT_PRODUCTS: 'SELECT * FROM `product`;',
    SELECT_PRODUCTS_FOR_ORDER_TYPE: 'SELECT `product`.*, `product_price`.`unit_price`, `unit`.`name` AS `unit_name` ' +
        'FROM `product` ' +
        'JOIN `product_price` ON `product_price`.`product_id` = `product`.`id` ' +
        'AND `product_price`.`order_type_id` = ? ' +
        'JOIN `unit` ON `unit`.`id` = `product`.`unit_id`;',
    INSERT_ORDER: 'INSERT INTO `order` (`customer_id`, `created_user_id`, `modified_user_id`, `type_id`, `name`) VALUES (?, ?, ?, ?, ?);',
    SELECT_100_MOST_RECENT_ORDERS_LISTING: sqlStubs.SELECT_ORDER +
        'ORDER BY `modified_timestamp` DESC ' +
        'LIMIT 100;',
    SELECT_ORDER_BY_ID: sqlStubs.SELECT_ORDER +
        'WHERE `order`.`id` = ?;',
    SELECT_ORDER_TYPE_ID_BY_ORDER_ID: 'SELECT `type_id` FROM `order` WHERE `id` = ?;',
    SELECT_ORDER_ITEMS_BY_ORDER_ID: 'SELECT `order_item`.`id` as `id`, `product`.`id` as `product_id`, ' +
        '`product`.`name`, `product`.`description`, `product_price`.`unit_price`, `product`.`unit_id`, ' +
        '`unit`.`name` as `unit_name`, `order_item`.`quantity`, ' +
        '`product_price`.`unit_price` * `order_item`.`quantity` as `item_total` ' +
        'FROM `order` ' +
        'JOIN `order_item` on `order_item`.`order_id` = `order`.`id` ' +
        'JOIN `product` on `product`.`id` = `order_item`.`product_id` ' +
        'JOIN `unit` on `unit`.`id` = `product`.`unit_id` ' +
        'JOIN `product_price` on `product_price`.`product_id` = `product`.`id` ' +
        'AND `product_price`.`order_type_id` = `order`.`type_id` ' +
        'WHERE `order`.`id` = ? AND `order_item`.`quantity` > 0;',
    SELECT_BARE_ORDER_ITEMS_BY_ORDER_ID: 'SELECT * FROM `order_item` WHERE `order_id` = ?;',
    INSERT_ORDER_ITEM: 'INSERT INTO `order_item` (`order_id`, `product_id`, `quantity`) VALUES (?, ?, ?);',
    UPDATE_ORDER_ITEM: 'UPDATE `order_item` SET `quantity` = ? WHERE `id` = ?;',
    SELECT_ORDER_ITEM_COUNT_AND_SUBTOTAL_BY_ORDER_ID: 'SELECT SUM(`order_item`.`quantity`) AS `count`, ' +
        'SUM(`product_price`.`unit_price` * `order_item`.`quantity`) AS `subtotal` ' +
        'FROM `order` ' +
        'JOIN `order_item` on `order_item`.`order_id` = `order`.`id` ' +
        'JOIN `product_price` on `product_price`.`product_id` = `order_item`.`product_id` AND ' +
        '`product_price`.`order_type_id` = `order`.`type_id` ' +
        'WHERE `order`.`id` = ?;',
    UPDATE_ORDER: 'UPDATE `order` SET `total` = ?, `subtotal` = ?, `item_count` = ?, `modified_timestamp` = NOW() WHERE `id` = ?;',
    SELECT_ORDER_TYPE_LISTING: 'SELECT * FROM `order_type`;'
};