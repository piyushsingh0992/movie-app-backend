"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post('/register', userController_1.register);
router.post('/login', userController_1.login);
router.get('/me', authMiddleware_1.authMiddleware, userController_1.getUserProfile);
router.get('/favorites', authMiddleware_1.authMiddleware, userController_1.getUserFavorites);
router.post('/favorites/:id', authMiddleware_1.authMiddleware, userController_1.addFavorite);
router.delete('/favorites/:id', authMiddleware_1.authMiddleware, userController_1.removeFavorite);
exports.default = router;
