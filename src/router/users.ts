import express from 'express';
import { createUser, updateUser, fetchUsers, showUser, deleteOne } from '../controllers/UserController';

export default (router: express.Router) => {
    router.get('/users', fetchUsers)
    router.get('/user/:id', showUser)
    router.put('/user/:id', updateUser)
    router.delete('/user/:id', deleteOne)
    router.post('/user/signup', createUser)
    
}