import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import config from './config/config';
import routes from './routes/routes';

let app = express();
app.server = http.Server(app);

// middleware
//parse application/json
app.use(bodyParser.json({
    limit: config.bodyLimit
}));

// passport config

// api routes v1
app.use('/', routes);

let port = config.port;
app.server.listen(port);
console.log('Started on port ' + port);

export default app;