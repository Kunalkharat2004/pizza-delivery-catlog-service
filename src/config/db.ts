import mongoose from "mongoose";
import config from "config";

export const initDB = async ()=>{
try{
    const MONGO_URI = config.get("db.uri");
    await mongoose.connect(MONGO_URI as string);
}catch(err:unknown){
    throw err;
}
}