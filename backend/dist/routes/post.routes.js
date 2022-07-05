"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const post_controller_1 = require("../controllers/post.controller");
const post_controller_2 = require("../controllers/post.controller");
const auth_middleware_1 = require("../middlewares/auth/auth.middleware");
// Constants
const router = (0, express_1.Router)();
router.get('/single/:id', post_controller_2.getPost);
router.put('/single/:id', auth_middleware_1.authUser, post_controller_1.editPost);
router.delete('/single/:id', auth_middleware_1.authUser, post_controller_2.deletePost);
router.get('/all', post_controller_2.getPosts);
router.post('/add', auth_middleware_1.authUser, post_controller_1.addPost);
// Export default
exports.default = router;
