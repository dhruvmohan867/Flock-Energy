import express from 'express';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';
import notFound from './middlewares/notFound.js';
import setupSwagger from './config/swagger.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

setupSwagger(app);

app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
