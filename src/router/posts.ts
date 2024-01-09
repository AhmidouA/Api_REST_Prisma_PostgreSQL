import express from 'express';
import { fetchPost, showPost, updatePost, deletePost, createPost } from '../controllers/PostController';

export default (router: express.Router) => {
    router.get('/posts', fetchPost)
    router.get('/post/:id', showPost)
    router.put('/post/:id', updatePost)
    router.delete('/post/:id', deletePost)
    router.post('/post/create', createPost)
    
}