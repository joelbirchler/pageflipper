var express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server),
  path = require('path');  


//
// Configuration
//

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.enable('trust proxy');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var flippers = {};

//
// Express routes
//

app.get('/', function(req, res){  
  var options = { 
    gist: req.query.gist,
    file: req.query.file || 'gistfile1.txt',
    offset: req.query.offset || 0,
    timer: req.query.timer
  };
  
  var ns = options.ns = options.gist + "-" + options.file;
  if (!flippers[ns]) { 
    flippers[ns] = { page: 0 };
  }
  options.page = flippers[ns].page;
  
  res.render('index', options);
});


//
// Socket.io
//

io.sockets.on('connection', function(socket) {
  socket.on('flip', function(data) {
    flippers[data.ns].page = data.page;
    socket.broadcast.emit('flip', data);
  });
});

server.listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});
