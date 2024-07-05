"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const movieSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    runningTime: { type: String, required: true },
    imageUrl: { type: String, required: true },
    comments: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Comment' }]
});
exports.default = (0, mongoose_1.model)('Movie', movieSchema);
