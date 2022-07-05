"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPost = exports.getPosts = exports.deletePost = exports.editPost = exports.getPost = void 0;
const post_schema_1 = __importDefault(require("../schema/post.schema"));
const mongoose_1 = __importDefault(require("mongoose"));
const getPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const Post = mongoose_1.default.model('Posts', post_schema_1.default);
    const post = yield Post.findById(id);
    console.log(req.headers['authorization']);
    return res.status(200).json(post);
});
exports.getPost = getPost;
const editPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, content, tags } = req.body;
    const Post = mongoose_1.default.model('Posts', post_schema_1.default);
    yield Post.updateOne({ _id: id }, { title, content, tags });
    return res.status(200).json({ "message": "Post updated successfully" });
});
exports.editPost = editPost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const Post = mongoose_1.default.model('Posts', post_schema_1.default);
    yield Post.findByIdAndDelete(id);
    return res.status(200).json({ "message": "Post deleted successfully" });
});
exports.deletePost = deletePost;
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Post = mongoose_1.default.model('Posts', post_schema_1.default);
    const posts = yield Post.find({});
    return res.status(200).json(posts);
});
exports.getPosts = getPosts;
const addPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, tags } = req.body;
    const Post = mongoose_1.default.model('Posts', post_schema_1.default);
    const newPost = new Post({ title, content, tags });
    newPost.save(function (err) {
        if (err)
            return res.status(424).json({ message: err });
    });
    return res.status(200).json(newPost);
});
exports.addPost = addPost;
