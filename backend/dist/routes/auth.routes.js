"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth/auth.controller");
// Constants
const router = (0, express_1.Router)();
router.post('/signup', auth_controller_1.singUp);
router.post('/signin', auth_controller_1.singIn);
// Export default
exports.default = router;
