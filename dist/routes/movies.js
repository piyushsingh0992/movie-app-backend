"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const movieController_1 = require("../controllers/movieController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/', movieController_1.getMovies);
router.get('/:id', movieController_1.getMovieById);
router.post('/', authMiddleware_1.adminMiddleware, movieController_1.addMovie);
router.post('/:id/comments', authMiddleware_1.authMiddleware, movieController_1.addComment);
router.delete('/:movieId/comments/:commentId', authMiddleware_1.adminMiddleware, movieController_1.deleteComment);
exports.default = router;
