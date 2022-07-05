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
exports.singIn = exports.singUp = void 0;
const user_schema_1 = __importDefault(require("../../schema/user.schema"));
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const singUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    const User = mongoose_1.default.model('Users', user_schema_1.default);
    const userExists = yield User.findOne({ email: email });
    if (userExists) {
        return res.status(304).json({ "message": "User already exists." });
    }
    const hashedPassword = yield bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    newUser.save(function (err) {
        if (err)
            return res.status(424).json({ message: err });
    });
    return res.status(200).json(newUser);
});
exports.singUp = singUp;
const singIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const User = mongoose_1.default.model('Users', user_schema_1.default);
    const selectedUser = yield User.findOne({ email: email });
    if (selectedUser === null) {
        return res.status(404).json({ "message": "email is incorrect" });
    }
    const matches = yield bcrypt.compare(password, selectedUser.password);
    if (!matches) {
        return res.status(404).json({ "message": "password is incorrect" });
    }
    const token = jwt.sign({ id: selectedUser._id, email }, process.env.JWT_TOKEN, {
        expiresIn: process.env.JWT_EXPIRY,
    });
    return res.status(200).json({ "token": token, "message": "signed in successfully" });
});
exports.singIn = singIn;
