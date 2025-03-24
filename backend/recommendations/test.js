// test.js
import { getRecommendations } from "./recommendations.js";

const savedPosts = [
    { id: 1, district: "XIV", type: "new", price: "medium", rooms: 3 },
    { id: 2, district: "XIII", type: "brick", price: "low", rooms: 2 },
];

const viewedPosts = [
    { id: 4, district: "XIV", type: "new", price: "high", rooms: 4 },
    { id: 5, district: "XIII", type: "panel", price: "low", rooms: 2 },
];

const allPosts = [
    { id: 6, district: "XIV", type: "new", price: "medium", rooms: 3 },
    { id: 7, district: "XIII", type: "brick", price: "low", rooms: 2 },
    { id: 8, district: "XIII", type: "panel", price: "low", rooms: 2 },
    { id: 9, district: "XIV", type: "new", price: "high", rooms: 4 },
    { id: 10, district: "XV", type: "house", price: "high", rooms: 5 },
    { id: 11, district: "XIV", type: "new", price: "medium", rooms: 3 },
];

console.log(getRecommendations(savedPosts, viewedPosts, allPosts));
