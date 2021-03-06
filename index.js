import  path  from 'path';
import  express  from 'express';
import  config  from 'config';
import bodyParser from 'body-parser';
import  mongoose  from './services/mongoose';
import authRoutes from './routes/auth';
import feedRoutes from './routes/feed';
import jwtAuth from './services/passport';

const app = express();

app.use(jwtAuth.initialize());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
    let contype = req.headers['content-type'];
    if (contype && !((contype.includes('application/json') || contype.includes('multipart/form-data'))))
        return res.status(415).send({ error: 'Unsupported Media Type (' + contype + ')' });
    next();
});

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true, parameterLimit: 50000 }));

app.use('/user', authRoutes);
app.use('/feed', feedRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Fond.');
    error.statusCode = 404;
    throw error;
});
  
app.use((error, req, res, next) => {
    console.log(error.message);
    res.status(error.statusCode || 500).json({ message: error.message, data: error.data });
});

const PORT = process.env.PORT || config.get('port');
const server = app.listen(PORT);

import socket from './services/socket';

const io = socket.init(server);
    io.on('connection', socket => {
      console.log('Client connected');
 });