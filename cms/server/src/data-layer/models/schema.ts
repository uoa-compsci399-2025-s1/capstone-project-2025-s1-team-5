import mongoose, { Schema } from "mongoose";
import { ILink, IModule, IProgramme, IQuestion, IQuiz, ISubsection, IUser, RoleType, IPage } from "./models";

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
      subsectionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subsection" }],
      quizIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }],
      linkIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Link" }]

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
        authorID: {
            type: String,
            required: true
        },
        published: {
            type: Boolean,
            default: false
        },
        layout: {
            sections: [{
                id: { type: String, required: true },            // 前端自己生成 uuid
                layout: { type: String, enum: ["full","split"], default: "full" },
                splitRatio: { type: [Number], default: [100] },   // full 时只用第一个
                columns: [{
                    blocks: [{
                        id: { type: String, required: true },         // block 自己生成 uuid
                        type: { type: String, enum: ["text"], default: "text" },
                        html: { type: String, default: "" },
                    }]
                }]
            }]
        },
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
        default: ""
    },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question", 
        required: true,
        default: [],
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, 
    {timestamps: true}
);

const SectionSchema = new Schema(
  {
    id: { type: String, required: true },
    layout: { type: String, enum: ["full", "split"], required: true },
    splitRatio: { type: [Number], required: false },
    columns: [
      {
        blocks: [
          {
            id: String,
            type: { type: String, enum: ["text", "image", "video"] },
            html: String,
          },
        ],
      },
    ],
  },
  { _id: false }
);

const PageSchema = new Schema<IPage>(
  {
    key: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    layout: { sections: [SectionSchema] },
  },
  { timestamps: true }
);

const linkSchema: Schema<ILink> = new Schema({
        title: {
            type: String,
            required: true
        },
        link: {
            type: String,
            required: true
        },
        createdAt: {
        type: Date,
        default: Date.now
    }
}, 
    {timestamps: true}
)



const Question = mongoose.model<IQuestion>('Question', questionSchema);
const newModule = mongoose.model<IModule>('newModule', moduleSchema);
const Programme = mongoose.model<IProgramme>('Programme', programmeSchema);
const User = mongoose.model<IUser>('User', userSchema);
const Subsection = mongoose.model<ISubsection>('Subsection', subsectionSchema);
const Quiz = mongoose.model<IQuiz>('Quiz', quizSchema);
const PageModel = mongoose.model<IPage>("Page", PageSchema);
const Link = mongoose.model<ILink>('Link', linkSchema)

export { Programme, User, Subsection, newModule, Question, Quiz, Link, PageModel}
