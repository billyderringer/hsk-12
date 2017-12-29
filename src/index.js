import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import config from './config/config';
import routes from './routes/routes';
import cors from 'cors';

let app = express();
app.server = http.Server(app);
app.disable('x-powered-by');

// middleware
app.use(cors({origin: '*'}));

//parse application/json
app.use(bodyParser.json({
    limit: config.bodyLimit
}));

// passport config

// api routes v1
app.use('/v1/', routes);

let port = config.port;
app.server.listen(port);
console.log('Server started on port ' + port + '. Press CTRL-C to exit.');



export default app;