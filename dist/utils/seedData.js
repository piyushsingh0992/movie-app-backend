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
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const Movie_1 = __importDefault(require("../models/Movie"));
const User_1 = __importDefault(require("../models/User"));
const Comment_1 = __importDefault(require("../models/Comment"));
dotenv_1.default.config();
const MONGO_URI = process.env.MONGO_URI || "";
mongoose_1.default.set("strictQuery", true);
mongoose_1.default
    .connect(MONGO_URI)
    .then(() => {
    console.log("MongoDB connected");
    seedDatabase();
})
    .catch((err) => console.error(err));
const seedDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Clear existing data
        yield Movie_1.default.deleteMany({});
        yield User_1.default.deleteMany({});
        yield Comment_1.default.deleteMany({});
        // Add movies
        const movies = [
            {
                name: "3 Idiots",
                description: "Two friends are searching for their long lost companion.",
                runningTime: "171 min",
                imageUrl: "https://upload.wikimedia.org/wikipedia/en/d/df/3_idiots_poster.jpg",
            },
            {
                name: "Dangal",
                description: "Former wrestler Mahavir Singh Phogat and his two wrestler daughters struggle towards glory.",
                runningTime: "161 min",
                imageUrl: "https://upload.wikimedia.org/wikipedia/en/9/99/Dangal_Poster.jpg",
            },
            {
                name: "PK",
                description: "An alien on Earth loses the only device he can use to communicate with his spaceship.",
                runningTime: "153 min",
                imageUrl: "https://upload.wikimedia.org/wikipedia/en/c/c3/PK_poster.jpg",
            },
            {
                name: "Bajrangi Bhaijaan",
                description: "An Indian man with a magnanimous heart takes a mute Pakistani girl back to her homeland.",
                runningTime: "163 min",
                imageUrl: "https://upload.wikimedia.org/wikipedia/en/d/dd/Bajrangi_Bhaijaan_Poster.jpg",
            },
            {
                name: "Sultan",
                description: "Sultan Ali Khan, a wrestler, gives up the sport after the death of his son.",
                runningTime: "170 min",
                imageUrl: "https://upload.wikimedia.org/wikipedia/en/1/1f/Sultan_film_poster.jpg",
            },
            {
                name: "Baahubali: The Beginning",
                description: "In ancient India, an adventurous and daring man becomes involved in a decades-old feud.",
                runningTime: "159 min",
                imageUrl: "https://upload.wikimedia.org/wikipedia/en/5/5f/Baahubali_The_Beginning_poster.jpg",
            },
            {
                name: "Kabir Singh",
                description: "Kabir Singh is a brilliant yet hostile surgeon who spirals into self-destruction.",
                runningTime: "172 min",
                imageUrl: "https://upload.wikimedia.org/wikipedia/en/d/dc/Kabir_Singh.jpg",
            },
            {
                name: "Padmaavat",
                description: "Queen Padmavati is married to a noble king and they live in a prosperous fortress.",
                runningTime: "164 min",
                imageUrl: "https://upload.wikimedia.org/wikipedia/en/7/73/Padmaavat_poster.jpg",
            },
            {
                name: "Tanhaji",
                description: "Tanhaji Malusare, a military chieftain in the army of Maratha king Chhatrapati Shivaji Maharaj.",
                runningTime: "135 min",
                imageUrl: "https://upload.wikimedia.org/wikipedia/en/3/3f/Tanaji_film_poster.jpg"
            },
            {
                name: "Andhadhun",
                description: "A series of mysterious events change the life of a blind pianist.",
                runningTime: "139 min",
                imageUrl: "https://upload.wikimedia.org/wikipedia/en/8/8d/Andhadhun_%28soundtrack%29.jpg"
            },
        ];
        const insertedMovies = yield Movie_1.default.insertMany(movies);
        console.log("Movies added");
        // Add users
        const users = [
            {
                username: "admin",
                password: yield bcrypt_1.default.hash("admin123", 10),
                role: "admin",
                favorites: [],
            },
            {
                username: "user1",
                password: yield bcrypt_1.default.hash("user123", 10),
                role: "user",
                favorites: [],
            },
            {
                username: "user2",
                password: yield bcrypt_1.default.hash("user123", 10),
                role: "user",
                favorites: [],
            },
            {
                username: "user3",
                password: yield bcrypt_1.default.hash("user123", 10),
                role: "user",
                favorites: [],
            },
        ];
        const insertedUsers = yield User_1.default.insertMany(users);
        console.log("Users added");
        // Add comments
        const comments = [
            {
                text: "Great movie!",
                movie: insertedMovies[0]._id,
                user: insertedUsers[1]._id,
            },
            {
                text: "Loved it!",
                movie: insertedMovies[1]._id,
                user: insertedUsers[2]._id,
            },
            {
                text: "Fantastic!",
                movie: insertedMovies[2]._id,
                user: insertedUsers[3]._id,
            },
            {
                text: "Amazing story!",
                movie: insertedMovies[3]._id,
                user: insertedUsers[1]._id,
            },
            {
                text: "Incredible visuals!",
                movie: insertedMovies[4]._id,
                user: insertedUsers[2]._id,
            },
            {
                text: "Highly recommended!",
                movie: insertedMovies[5]._id,
                user: insertedUsers[3]._id,
            },
            {
                text: "Worth watching!",
                movie: insertedMovies[6]._id,
                user: insertedUsers[1]._id,
            },
            {
                text: "A must see!",
                movie: insertedMovies[7]._id,
                user: insertedUsers[2]._id,
            },
            {
                text: "Brilliant!",
                movie: insertedMovies[8]._id,
                user: insertedUsers[3]._id,
            },
            {
                text: "Superb!",
                movie: insertedMovies[9]._id,
                user: insertedUsers[1]._id,
            },
        ];
        yield Comment_1.default.insertMany(comments);
        console.log("Comments added");
        mongoose_1.default.disconnect();
        console.log("MongoDB disconnected");
    }
    catch (error) {
        console.error("Error seeding database:", error);
        mongoose_1.default.disconnect();
    }
});
