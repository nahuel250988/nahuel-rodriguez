import passport from 'passport';
import jwt from 'passport-jwt';
import dotenv from 'dotenv';
import UserModel from '../dao/models/user.model.js';

dotenv.config();

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['coderCookieToken']; 
    }
    return token;
};

const initializePassport = () => {
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor, ExtractJWT.fromAuthHeaderAsBearerToken()]),
        secretOrKey: process.env.JWT_PRIVATE_KEY
    }, async (jwt_payload, done) => {
        try {
            
            const user = await UserModel.findById(jwt_payload.user._id);
            if (!user) {
                return done(null, false, { message: 'Usuario no encontrado en JWT.' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await UserModel.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};

export default initializePassport;