// src/routes/sessions.router.js
import { Router } from 'express';
import { loginUser, getCurrentUser, logoutUser } from '../controllers/sessions.controller.js';
import passport from 'passport';

const router = Router();

router.post('/login', loginUser);
router.get('/current', passport.authenticate('jwt', { session: false, failureRedirect: '/api/sessions/unauthorized' }), getCurrentUser);
router.get('/logout', logoutUser); // Simplemente borra la cookie si la usas

// Ruta para manejo de fallos en /current (si no se autentica)
router.get('/unauthorized', (req, res) => {
    res.status(401).json({ status: "error", message: "No autenticado o token inválido/expirado." });
});

export default router;