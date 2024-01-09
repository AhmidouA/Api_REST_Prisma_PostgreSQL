import express from 'express';
import { createUser } from '../controllers/UserController';

export default (router: express.Router) => {
    router.post('/user/signup', createUser)
}