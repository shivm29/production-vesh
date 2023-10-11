// This file contains the functions/controllers  related to authentication and are called when user is on any authentication related route like /register or /login
import { hash } from 'bcrypt';
import { comparePassword, hashPassword } from '../helpers/authHelper.js';
import userModel from '../models/userModel.js'
import JWT from 'jsonwebtoken';

// POST || Register

export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer } = await req.body

        // validation messages 
        if (!name) {
            return res.send({ message: 'Name is required' });
        }
        if (!email) {
            return res.send({ message: 'Email is required' });
        }
        if (!password) {
            return res.send({ message: 'Password is required' });
        }
        if (!phone) {
            return res.send({ message: 'Phone is required' });
        }

        if (!address) {
            return res.send({ message: 'Address is required' });
        }
        if (!answer) {
            return res.send({ message: 'Answer is required' });
        }

        // check if user already exists ?
        const existingUser = await userModel.findOne({ email })

        // if user already exists
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: 'User already registered, please login'
            })
        }

        // register user 
        const hashedPassword = await hashPassword(password);
        // save user in the database 
        const user = new userModel({
            name, email, password: hashedPassword, phone, address, answer
        }).save()

        res.status(201).send({
            success: true,
            message: 'User registered successfully'
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in registeration',
            error
        })
    }
}

// POST || Login 

export const loginController = async (req, res) => {
    try {
        const { email, password } = await req.body;

        if (!email) return res.status(404).send({ error: 'Invalid email or password' })
        if (!password) return res.status(404).send({ error: 'Invalid email or password' })

        const existingUser = await userModel.findOne({ email })

        if (!existingUser) {
            return res.status(404).send({
                success: false,
                message: 'User do not exist register to signin'
            })
        }

        const match = await comparePassword(password, existingUser.password)

        if (!match) {
            return res.status(200).send({
                success: false,
                message: 'Invalid credentials'
            })
        }

        // JWT token  
        const token = await JWT.sign({ _id: existingUser._id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        })

        res.status(201).send({
            success: true,
            message: 'Logged in successfully',
            user: {
                name: existingUser.name,
                email: existingUser.email,
                phone: existingUser.phone,
                address: existingUser.address,
                role: existingUser.role
            },
            token,
        })

    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in login',
            error
        })
    }
}

// forgot password
export const forgotPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body

        if (!email) {
            res.status(400).send({
                message: 'Email is required'
            })
        }
        if (!answer) {
            res.status(400).send({
                message: 'Password recovery answer is required'
            })
        }
        if (!newPassword) {
            res.status(400).send({
                message: 'New password is required'
            })
        }

        // check
        const user = await userModel.findOne({ email, answer })
        // validation
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Wrong Email or Answer'
            })
        }

        const hashed = await hashPassword(newPassword)
        await userModel.findByIdAndUpdate(user._id, { password: hashed })

        res.status(200).send({
            success: true,
            message: 'Password changed sucessfully'
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error
        })
    }
}

export const updateProfileController = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;
        const user = await userModel.findById(req.user._id);
        //password
        if (password && password.length < 6) {
            return res.json({ error: "Passsword is required and 6 character long" });
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            {
                name: name || user.name,
                password: hashedPassword || user.password,
                phone: phone || user.phone,
                address: address || user.address,
            },
            { new: true }
        );
        res.status(200).send({
            success: true,
            message: "Profile Updated SUccessfully",
            updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error WHile Update profile",
            error,
        });
    }
};
