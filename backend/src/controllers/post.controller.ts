import { Request, Response } from 'express';
import postSchema from '../schema/post.schema';
import mongoose from 'mongoose';


export const getPost = async (req: Request, res: Response) => {
    const { id } = req.params;
    const Post = mongoose.model('Posts', postSchema);
    const post = await Post.findById(id);
    console.log(req.headers['authorization']);

    return res.status(200).json(post);
}


export const editPost = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, content, tags } = req.body;
    const Post = mongoose.model('Posts', postSchema);

    await Post.updateOne({ _id: id }, { title, content, tags });
    
    return res.status(200).json({"message": "Post updated successfully"});
}

export const deletePost = async (req: Request, res: Response) => {
    const { id } = req.params;
    const Post = mongoose.model('Posts', postSchema);
    await Post.findByIdAndDelete(id);
    
    return res.status(200).json({"message": "Post deleted successfully"});
}

export const getPosts = async (req: Request, res: Response) => {
    const Post = mongoose.model('Posts', postSchema);
    const posts = await Post.find({});
    
    return res.status(200).json(posts);
}

export const addPost = async (req: Request, res: Response) => {
    const { title, content, tags } = req.body;
    const Post = mongoose.model('Posts', postSchema);

    const newPost = new Post({ title, content, tags });

    newPost.save(function (err) {
        if (err) return res.status(424).json({message: err});
    });
    
    return res.status(200).json(newPost);
}



