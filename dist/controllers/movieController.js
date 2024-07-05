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
exports.deleteComment = exports.addComment = exports.addMovie = exports.getMovieById = exports.getMovies = void 0;
const Movie_1 = __importDefault(require("../models/Movie"));
const Comment_1 = __importDefault(require("../models/Comment"));
const mongoose_1 = require("mongoose");
const User_1 = __importDefault(require("../models/User"));
const getMovies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movies = yield Movie_1.default.find().populate({
            path: 'comments',
            populate: {
                path: 'user',
                model: 'User',
                select: 'username'
            }
        });
        res.status(200).json(movies);
    }
    catch (error) {
        const errMsg = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ message: errMsg });
    }
});
exports.getMovies = getMovies;
const getMovieById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movie = yield Movie_1.default.findById(req.params.id)
            .populate({
            path: 'comments',
            populate: {
                path: 'user',
                model: 'User',
                select: 'username'
            }
        });
        if (!movie) {
            res.status(404).json({ message: 'Movie not found' });
            return;
        }
        const usersWhoLiked = yield User_1.default.find({ favorites: req.params.id }).select('username');
        res.status(200).json({ movie, usersWhoLiked });
    }
    catch (error) {
        const errMsg = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ message: errMsg });
    }
});
exports.getMovieById = getMovieById;
const addMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, runningTime, imageUrl } = req.body;
    const newMovie = new Movie_1.default({ name, description, runningTime, imageUrl });
    try {
        yield newMovie.save();
        res.status(201).json(newMovie);
    }
    catch (error) {
        const errMsg = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ message: errMsg });
    }
});
exports.addMovie = addMovie;
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { text } = req.body;
    const { id } = req.params;
    if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    const newComment = new Comment_1.default({ text, movie: id, user: req.user.id });
    try {
        const savedComment = yield newComment.save();
        const movie = yield Movie_1.default.findById(id);
        if (movie) {
            movie.comments.push(savedComment._id);
            yield movie.save();
            const populatedComment = yield Comment_1.default.findById(savedComment._id).populate({
                path: 'user',
                model: 'User',
                select: 'username'
            });
            res.status(201).json(populatedComment);
        }
        else {
            res.status(404).json({ message: 'Movie not found' });
        }
    }
    catch (error) {
        const errMsg = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ message: errMsg });
    }
});
exports.addComment = addComment;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { movieId, commentId } = req.params;
    try {
        yield Comment_1.default.findByIdAndDelete(commentId);
        yield Movie_1.default.updateOne({ _id: movieId }, { $pull: { comments: new mongoose_1.Types.ObjectId(commentId) } });
        res.status(200).json({ message: 'Comment deleted' });
    }
    catch (error) {
        const errMsg = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ message: errMsg });
    }
});
exports.deleteComment = deleteComment;
