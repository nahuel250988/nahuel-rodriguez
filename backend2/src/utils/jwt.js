import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

export const generateToken = (user) => {
    
    const token = jwt.sign({ user }, JWT_PRIVATE_KEY, { expiresIn: '1h' });
    return token;
};

export const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ status: "error", error: "No autenticado" });
    }

    const token = authHeader.split(' ')[1]; 

    jwt.verify(token, JWT_PRIVATE_KEY, (error, credentials) => {
        if (error) {
            return res.status(403).send({ status: "error", error: "No autorizado (token inválido)" });
        }
        req.user = credentials.user; 
        next();
    });
};