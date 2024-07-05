"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const movies_1 = __importDefault(require("./routes/movies"));
const users_1 = __importDefault(require("./routes/users"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use('/api/movies', movies_1.default);
app.use('/api/users', users_1.default);
const MONGO_URI = process.env.MONGO_URI;
mongoose_1.default.connect(MONGO_URI)
    .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
    .catch(err => console.log(err));
