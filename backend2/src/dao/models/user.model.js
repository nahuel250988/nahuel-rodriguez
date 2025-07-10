import mongoose from 'mongoose';

const userCollection = 'users';

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    password: { type: String, required: true }, 
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts' 
    },
    role: { type: String, default: 'user', enum: ['user', 'admin', 'premium'] } 
});


userSchema.pre('find', function() {
    this.populate('cart');
});

userSchema.pre('findOne', function() {
    this.populate('cart');
});

const UserModel = mongoose.model(userCollection, userSchema);

export default UserModel;