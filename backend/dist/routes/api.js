"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = __importDefault(require("./user.routes"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const post_routes_1 = __importDefault(require("./post.routes"));
// Export the base-router
const baseRouter = (0, express_1.Router)();
// Setup routers
baseRouter.use('/users', user_routes_1.default);
baseRouter.use('/auth', auth_routes_1.default);
baseRouter.use('/posts', post_routes_1.default);
// Export default.
exports.default = baseRouter;
