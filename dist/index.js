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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
app.server = _http2.default.Server(app);
app.disable('x-powered-by');

// middleware
app.use((0, _cors2.default)({ origin: '*' }));

//parse application/json
app.use(_bodyParser2.default.json({
    limit: _config2.default.bodyLimit
}));

// passport config

// api routes v1
app.use('/', _routes2.default);

var port = _config2.default.port;
app.server.listen(port);
console.log('Server started on port ' + port + '. Press CTRL-C to exit.');

exports.default = app;
//# sourceMappingURL=index.js.map