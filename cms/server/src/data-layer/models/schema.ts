import mongoose, { Schema } from "mongoose";
import { IUser } from "./models";

const userSchema: Schema<IUser> = new Schema(
    {
        first_name: {
            type: String,
            required: true
        },
        last_name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        }, 
        password: {
            type: String,
            required: true
        },
        programme: {
            type: String,
        }, 
        role: {
            type: String,
            required: true
        }
    },
    {timestamps: true}
)

const User = mongoose.model<IUser>('User', userSchema);

export default User