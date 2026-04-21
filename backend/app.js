const express = require('express');
const cors = require('cors');

const systemRoutes = require('./src/routes/system.routes');
const authRoutes = require('./src/routes/auth.routes');
const productsRoutes = require('./src/routes/products.routes');
const categoriesRoutes = require('./src/routes/categories.routes');
const addressesRoutes = require('./src/routes/addresses.routes');
const cartRoutes = require('./src/routes/cart.routes');
const ordersRoutes = require('./src/routes/orders.routes');
const notFoundHandler = require('./src/middleware/notFound.middleware');
const errorHandler = require('./src/middleware/errorHandler.middleware');
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

const app = express();

app.use(
    cors({
        origin: CORS_ORIGIN,
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', systemRoutes);
app.use('/', authRoutes);
app.use('/', productsRoutes);
app.use('/', categoriesRoutes);
app.use('/', addressesRoutes);
app.use('/', cartRoutes);
app.use('/', ordersRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

