import prisma from '../../config/db.config'
import express from 'express'

export const createUser = async (req: express.Request, res: express.Response) => {
    const {name, email, password} = req.body;

    try {
        // Attempt to find the user by email
        const findUser = await prisma.user.findUnique({
            where: {email: email}
        });

        if (findUser) {
            // User with the email already exists
            return res.json({status: 400, message: 'Email Already Taken, Please choose another email'});
        }

        // Create a new user
        const newUser = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: password   
            }
        });

        return res.json({status: 200, data: newUser, message: 'User created'});
    } catch (error) {
        // Handle any potential errors
        console.error('Error creating user:', error);
        return res.status(500).json({status: 500, message: 'Internal Server Error'});
    }
};

