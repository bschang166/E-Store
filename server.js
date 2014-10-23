// JavaScript source code
// Server.js

var
  http = require('http'),
  express = require('express');

  app = express(),
  router = express.Router(),
  server = http.createServer(app);

// Server Configurations
  //app.use(express.static('./app'));
  app.use(express.static('./'));

  app.get('/', function(req,res){
    res.redirect('/app.html');
  });
  app.u
  app.get('/admin', function(req,res){
    res.redirect('/admin.html');
  });
  app.use(function(req,res){
    res.redirect('/');
  });

  server.listen(5000);

  console.log(
   'Express server listening on port %d in %s mode',
    server.address().port, app.settings.env
  );