import mongoose, { Schema } from "mongoose";
import { IModule, IProgramme, IQuestion, IQuiz, ISubsection, IUser, RoleType } from "./models";

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
        avatar: {
            type: String,
            required: false,
            default: "default"
        },
        colorPref: {
            type: String,
            required: true,
            enum: ['light', 'dark', 'system'],
            default: "system",
        },
        country: {
            type: String,
            required: true
        },
        programme: {
            type: String,
        }, 
        role: {
            type: String,
            enum: Object.values(RoleType),
            default: RoleType.user,
            required: true
        }
    },
    {timestamps: true}
)

const moduleSchema: Schema<IModule> = new Schema(
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      subsectionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subsection" }],
      quizIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }]
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


const questionSchema: Schema<IQuestion> = new Schema(
    {
        question: {
            type: String,
            required: true
        },
        options: {
            type: [String], 
            required: true
        },
        correctAnswer: {
            type: String,
            required: true
        }
    },
);

const quizSchema: Schema<IQuiz> = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, 
    {timestamps: true}
);



const Question = mongoose.model<IQuestion>('Question', questionSchema);
const newModule = mongoose.model<IModule>('newModule', moduleSchema);
const Programme = mongoose.model<IProgramme>('Programme', programmeSchema);
const User = mongoose.model<IUser>('User', userSchema);
const Subsection = mongoose.model<ISubsection>('Subsection', subsectionSchema);
const Quiz = mongoose.model<IQuiz>('Quiz', quizSchema);


export { Programme, User, Subsection, newModule, Question, Quiz}