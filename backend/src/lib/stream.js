import { StreamChat } from 'stream-chat'
import "dotenv/config"
import { ApiError } from '../util/ApiError.js';

const apiKey = process.env.STEAM_API_KEY;
const apiSecret = process.env.STEAM_API_SECRET;

if(!apiKey || !apiSecret){
    throw new ApiError(400,"stream API key or secret is missing");
}

const streamClient = StreamChat.getInstance(apiKey,apiSecret);

export const upsertStreamUSer = async (userData)=> {
    try {
        await streamClient.upsertUsers([userData]);
        return userData
    } catch (error) {
        console.error("error upserting stream user:",error)
    }
};

export const generateStreamToken = (userId) =>{

}
