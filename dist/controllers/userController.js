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
exports.getUserFavorites = exports.getUserProfile = exports.removeFavorite = exports.addFavorite = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = require("mongoose");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, role } = req.body;
    try {
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = new User_1.default({ username, password: hashedPassword, role });
        yield newUser.save();
        res.status(201).json(newUser);
    }
    catch (error) {
        const errMsg = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ message: errMsg });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield User_1.default.findOne({ username });
        if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, username: user.username, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
        res.status(200).json({ user, token });
    }
    catch (error) {
        const errMsg = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ message: errMsg });
    }
});
exports.login = login;
const addFavorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    try {
        yield User_1.default.updateOne({ _id: req.user.id }, { $addToSet: { favorites: new mongoose_1.Types.ObjectId(req.params.id) } });
        const user = yield User_1.default.findById(req.user.id);
        res.status(200).json(user);
    }
    catch (error) {
        const errMsg = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ message: errMsg });
    }
});
exports.addFavorite = addFavorite;
const removeFavorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    try {
        yield User_1.default.updateOne({ _id: req.user.id }, { $pull: { favorites: new mongoose_1.Types.ObjectId(req.params.id) } });
        const user = yield User_1.default.findById(req.user.id);
        res.status(200).json(user);
    }
    catch (error) {
        const errMsg = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ message: errMsg });
    }
});
exports.removeFavorite = removeFavorite;
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield User_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id).select('-password');
        res.status(200).json(user);
    }
    catch (error) {
        const errMsg = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ message: errMsg });
    }
});
exports.getUserProfile = getUserProfile;
const getUserFavorites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    try {
        const user = yield User_1.default.findById(req.user.id).populate({
            path: 'favorites',
            populate: {
                path: 'comments',
                populate: {
                    path: 'user',
                    model: 'User',
                    select: 'username'
                }
            }
        });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(user.favorites);
    }
    catch (error) {
        const errMsg = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ message: errMsg });
    }
});
exports.getUserFavorites = getUserFavorites;
