import express from 'express';
import dotenv from 'dotenv';
import connectDB from './dao/db/index.js';
import usersRouter from './routes/users.router.js';
import sessionsRouter from './routes/sessions.router.js';
import initializePassport from './config/passport.config.js';
import passport from 'passport';
import cookieParser from 'cookie-parser'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;


connectDB();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 


initializePassport();
app.use(passport.initialize());


app.use('/api/users', usersRouter);
app.use('/api/sessions', sessionsRouter);


app.get('/', (req, res) => {
    res.send('¡Bienvenido al Backend 2 de Coderhouse!');
});


app.listen(PORT, () => {
    console.log(`Servidor iniciando en el puerto ${PORT}`);
});