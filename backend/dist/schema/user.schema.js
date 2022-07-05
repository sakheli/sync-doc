"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const post_schema_1 = __importDefault(require("./post.schema"));
const { Schema } = mongoose_1.default;
const userSchema = new Schema({
    username: String,
    email: String,
    password: String,
    recoveryEmail: String,
    dateCreated: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false },
    posts: [post_schema_1.default]
});
exports.default = userSchema;
