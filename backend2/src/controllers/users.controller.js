
import UserModel from '../dao/models/user.model.js';
import { createHash } from '../utils/bcrypt.js';
import CartModel from '../dao/models/cart.model.js'; 


export const getUsers = async (req, res) => {
    try {
        const users = await UserModel.find({});
        res.status(200).json({ status: "success", payload: users });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};


export const getUserById = async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await UserModel.findById(uid);
        if (!user) {
            return res.status(404).json({ status: "error", message: "Usuario no encontrado" });
        }
        res.status(200).json({ status: "success", payload: user });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};


export const createUser = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password, role } = req.body;

        if (!first_name || !last_name || !email || !age || !password) {
            return res.status(400).json({ status: "error", message: "Todos los campos son obligatorios." });
        }

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ status: "error", message: "El email ya está registrado." });
        }

        const hashedPassword = createHash(password);

        
        const newCart = await CartModel.create({}); 

        const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
            cart: newCart._id, 
            role: role || 'user'
        };

        const result = await UserModel.create(newUser);
        res.status(201).json({ status: "success", message: "Usuario creado exitosamente", payload: result });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};


export const updateUser = async (req, res) => {
    try {
        const { uid } = req.params;
        const { first_name, last_name, email, age, password, role } = req.body;

        const userDataToUpdate = { first_name, last_name, email, age, role };

        if (password) {
            userDataToUpdate.password = createHash(password); 
        }

        const updatedUser = await UserModel.findByIdAndUpdate(uid, userDataToUpdate, { new: true, runValidators: true });
        if (!updatedUser) {
            return res.status(404).json({ status: "error", message: "Usuario no encontrado" });
        }
        res.status(200).json({ status: "success", message: "Usuario actualizado exitosamente", payload: updatedUser });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};


export const deleteUser = async (req, res) => {
    try {
        const { uid } = req.params;
        const deletedUser = await UserModel.findByIdAndDelete(uid);
        if (!deletedUser) {
            return res.status(404).json({ status: "error", message: "Usuario no encontrado" });
        }
        
        await CartModel.findByIdAndDelete(deletedUser.cart);
        res.status(200).json({ status: "success", message: "Usuario eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};