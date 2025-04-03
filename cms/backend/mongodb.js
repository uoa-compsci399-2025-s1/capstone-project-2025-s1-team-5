import mongoose from "mongoose";

if (!DATABASE_URI) {
    throw new Error("Please define the database uri in env")
}

const connectToDatabase = async () => {
    try {
        await mongoose.connect(DATABASE_URI)
    } catch (error) {
        console.error('Error regarding connecting to database', error)
    }
}

export default connectToDatabase