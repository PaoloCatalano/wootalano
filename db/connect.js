import mongoose from "mongoose";

const db = (url) => mongoose.connect(url);

export default db;
