import UserModel from '../dao/models/user.model.js';
import { isValidPassword } from '../utils/bcrypt.js';
import { generateToken } from '../utils/jwt.js';


export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ status: "error", message: "Email y contraseña son obligatorios." });
    }

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ status: "error", message: "Credenciales inválidas (email)." });
        }

        if (!isValidPassword(user, password)) {
            return res.status(401).json({ status: "error", message: "Credenciales inválidas (contraseña)." });
        }

        
        const userForToken = {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            role: user.role,
            cart: user.cart 
        };
        const token = generateToken(userForToken);

        
        res.cookie('coderCookieToken', token, {
            maxAge: 60 * 60 * 1000, 
            httpOnly: true 
        });

        res.status(200).json({
            status: "success",
            message: "Inicio de sesión exitoso",
            payload: { user: userForToken, token }
        });

    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};


export const getCurrentUser = (req, res) => {
    
    if (req.user) {
        res.status(200).json({
            status: "success",
            message: "Usuario autenticado",
            payload: req.user
        });
    } else {
        res.status(401).json({ status: "error", message: "No autenticado o token inválido/expirado." });
    }
};

export const logoutUser = (req, res) => {
    res.clearCookie('coderCookieToken');
    res.status(200).json({ status: "success", message: "Sesión cerrada exitosamente" });
};