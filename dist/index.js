'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _config = require('./config/config');

var _config2 = _interopRequireDefault(_config);

var _routes = require('./routes/routes');

var _routes2 = _interopRequireDefault(_routes);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LocalStrategy = require('passport-local').Strategy;

var app = (0, _express2.default)();
app.server = _http2.default.Server(app);
app.disable('x-powered-by')

// middleware
app.use(cors({credentials: true, origin: 'https://billyderringer.github.io'}))
app.options('https://billyderringer.github.io', cors())

//parse application/json
app.use(_bodyParser2.default.json({
    limit: _config2.default.bodyLimit
}));

// passport config
app.use(_passport2.default.initialize());
var Teacher = require('./model/teacher');
_passport2.default.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, Teacher.authenticate()));
_passport2.default.serializeUser(Teacher.serializeUser());
_passport2.default.deserializeUser(Teacher.deserializeUser());

// api routes
app.use('/api/v1/', _routes2.default);

var port = _config2.default.port;
app.server.listen(port);
console.log('Server started on port ' + port + '. Press CTRL-C to exit.');

exports.default = app;
//# sourceMappingURL=index.js.map