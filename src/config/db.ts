import mongoose from "mongoose";
import config from "config";
import logger from "./logger";
export const initDB = async ()=>{
try{
    const MONGO_URI = config.get("db.uri");
    await mongoose.connect(MONGO_URI as string);
    logger.info("Successfully connected to MongoDB");
}catch(err:unknown){
    throw err;
}
}