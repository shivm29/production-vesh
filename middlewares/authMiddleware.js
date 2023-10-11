import JWT from 'jsonwebtoken'
import userModel from '../models/userModel.js'

// Protected routes token base
// if the token is not provided or the provided token is wrong, next will not be implemented

export const requireSignIn = async (req, res, next) => {
    try {
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET)
        // passes the decoded data of user in req.user which is later used in isAdmin middleware
        req.user = decode;
        next()
    } catch (error) {
        console.log(error)
    }
}

export const isAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);

        if (user.role !== 1) {
            return res.status(200).send({
                success: false,
                message: 'Unauthorized access'
            })
        }
        else {
            next();
        }

    }
    catch (error) {
        console.log(error)
        res.status(401).send({
            success: false,
            message: 'Error in admin middleware',
        })
    }
}

//  middleware is a piece of software or code that sits between the client and the server and is responsible for handling specific tasks or operations related to incoming HTTP requests.

// In the case of a server-side application, when a client sends an HTTP request to the server, the request goes through a series of middleware functions before reaching the final route handler (controller) that responds to the request

// Similarly, the response from the route handler goes through the middleware functions before being sent back to the client.