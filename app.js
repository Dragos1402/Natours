const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const AppError = require('./Utils/appError');
const globalErrorHandler = require('./Controllers/errorController');
const tourRouter = require('./Routes/tourRoutes.js');
const userRouter = require('./Routes/userRoutes.js');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json()); // Middleware. Functie care modifica data care vine de la user
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2) ROUTES

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 3) Handling Non-Existing Routes - Trebuie pus la finalul proiectului deoarece va da la toate rutele aceiasi eroare din cauza functiei 'all'
app.all('*',(req, res, next) => {

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));  // Daca scriem inauntru, Node va sti ca e vb de o eroare si va da skip la cellalte middleware si va trimite eroare in global error handling middleware
});

app.use(globalErrorHandler);

module.exports = app;
