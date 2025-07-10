// src/routes/users.router.js
import { Router } from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/users.controller.js';
import passport from 'passport';

const router = Router();

// Rutas protegidas con JWT
// Para getUsers, puedes permitir acceso a admin y user, o solo admin
router.get('/', passport.authenticate('jwt', { session: false }), getUsers); // Solo usuarios autenticados
router.get('/:uid', passport.authenticate('jwt', { session: false }), getUserById); // Solo usuarios autenticados

// Rutas que pueden requerir roles específicos
router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    // Ejemplo de autorización: solo administradores pueden crear usuarios
    if (req.user.role !== 'admin') {
        return res.status(403).json({ status: "error", message: "Acceso denegado: solo administradores pueden crear usuarios." });
    }
    next();
}, createUser);

router.put('/:uid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    // Ejemplo de autorización: un usuario puede actualizar su propio perfil o un admin a cualquiera
    if (req.user.role === 'admin' || req.user._id.toString() === req.params.uid) {
        return next();
    }
    return res.status(403).json({ status: "error", message: "Acceso denegado: no tienes permiso para actualizar este usuario." });
}, updateUser);

router.delete('/:uid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    // Solo administradores pueden eliminar usuarios
    if (req.user.role !== 'admin') {
        return res.status(403).json({ status: "error", message: "Acceso denegado: solo administradores pueden eliminar usuarios." });
    }
    next();
}, deleteUser);

export default router;