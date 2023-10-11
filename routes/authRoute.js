// This file contains the routes related to authentication e.g. /register & /login 
import express from 'express'
import { forgotPasswordController, loginController, registerController, updateProfileController } from '../controllers/authController.js'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';

// create a new router
const router = express.Router();

// routing 
// REGISTER | METHOD : POST
router.post('/register', registerController)

// LOGIN | METHOD : POST
router.post('/login', loginController)

// Forgot password || POST
router.post('/forgot-password', forgotPasswordController)

// protected route auth
router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({
        ok: true
    })
})
// admin protected route auth
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({
        ok: true
    })
})

// update Profile
router.put('/profile', requireSignIn, updateProfileController)

export default router