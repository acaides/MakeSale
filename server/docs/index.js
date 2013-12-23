var PDFDocument = require('pdfkit');

function startDoc (title) {
    var doc = new PDFDocument();

    doc.info.Title = title;
    doc.info.Author = 'Beurrage LLC';

    return doc;
}

var docs = module.exports = {
    createInvoiceDoc: function (invoice) {
        var fileName = 'docFiles/invoices/Invoice' + invoice.id + '.pdf',
            doc = startDoc('Invoice');

        doc.text('Invoice ' + invoice.id);
        doc.text('\n\n');
        doc.text('Billed To: ' + invoice.billedToName);
        doc.text('')

        doc.write(fileName);

        return fileName;
    }
};