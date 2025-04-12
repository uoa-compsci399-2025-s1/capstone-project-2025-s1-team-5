import mongoose, { Schema } from "mongoose";
import { IModule, IProgramme, ISubsection, IUser } from "./models";

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

const moduleSchema: Schema<IModule> = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        subsectionIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Subsection",
                required: true
            }
        ]
    },
    { timestamps: true }
);

const programmeSchema: Schema<IProgramme> = new Schema(
    {
        name: {
            type: String,
            required: true
        }
    },
    {timestamps: true}
)

const subsectionSchema: Schema<ISubsection> = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        body: {
            type: String,
            required: true
        },
        authorID: {
            type: String,
            required: true
        },
        published: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const newModule = mongoose.model<IModule>('newModule', moduleSchema);
const Programme = mongoose.model<IProgramme>('Programme', programmeSchema);
const User = mongoose.model<IUser>('User', userSchema);
const Subsection = mongoose.model<ISubsection>('Subsection', subsectionSchema);

export { Programme, User, Subsection, newModule }