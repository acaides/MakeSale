// External dependencies.
var express = require('express'),
    http = require('http'),
    path = require('path');

// Routes
var users = require('./routes/users'),
    customers = require('./routes/customers');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, '../client')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//app.get('/', routes.index);
app.get('/services/v1/users', users.list);
app.post('/services/v1/users', users.create);

app.get('/services/v1/customers', customers.list);
app.post('/services/v1/customers', customers.create);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
