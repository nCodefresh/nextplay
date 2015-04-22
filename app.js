var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var multer       = require('multer');
var routes       = require('./routes/index');
var users        = require('./routes/users');
var trivia       = require('./routes/photos');
var config       = require('./config');
var moment       = require('moment');

function getDate(){
  var d = moment();
  var ret  = moment().format('MM_Do_YYYY_h_mm_ss');

  return ret;
}

var app = express();

app.enable('trust proxy');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//multi part handling
app.use(multer({ dest: './uploads/',
 rename: function (fieldname, filename, req , res) {
   var ip = req.headers['x-forwarded-for'] ||
     req.connection.remoteAddress ||
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
   var remoteIp = ip.split(':');

   ip = remoteIp[remoteIp.length - 1];
   ip = ip.split('.').join('_');

   console.log('remote ip' + remoteIp[remoteIp.length - 1]);
   console.log('renaming ' + filename + ',ip:' + ip);

   return filename + ip + getDate()+ ".png";
  },
  onFileUploadStart: function(file) {
    console.log(file.originalname + ' is starting ...');
  },
  onFileUploadComplete: function(file) {
    console.log(file.fieldname + ' uploaded to  ' + file.path);
    done=true;
  }
}));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public', 'static')));
app.use(express.static(path.join(__dirname, config.photoLib)));
app.use('/', routes);
app.use('/trivia', trivia);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
