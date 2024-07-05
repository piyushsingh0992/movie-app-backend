"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    text: { type: String, required: true },
    movie: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Movie', required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true }
});
exports.default = (0, mongoose_1.model)('Comment', commentSchema);
