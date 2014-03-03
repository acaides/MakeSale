# MakeSale

MakeSale is a web-based platform that helps makers make and sell their wares.

Features include:

- Product Catalog, with groups and variable pricing.
- Customer Listing.
- Order Building and Tracking.
- Invoicing.

Planned Features:

- Improved Invoicing: automatic emailing and online payment links on invoices.
- Production Management: Product "receipes", batches, and production run
modeling.
- Inventory Management: Tracking of inventory resources integrated with
production runs and suppliers.
- Labor Tracking: Logging hours work, integrated with production runs and tools
for worker time management.
- Accounting: Balance tracking integrated with invoicing, ordering, and banks.
- Reporting: Automatic generation of key business metrics like sales, expenses,
etc and reporting tools for tax and other government filing.

## Local Development

To run MakeSale locally, you need node and npm.

To get setup, run:

    npm install

Then, to start the server:

    node server/app.js -c "config.dev.json"
