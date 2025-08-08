import mongoose from "mongoose"

export const dbConnect = async () =>{
    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        console.log(`mongodb conncected : ${db.connection.host}`)
    } catch (error) {
        console.log("error connecting to database",error)
        process.exit(1)
    }
}