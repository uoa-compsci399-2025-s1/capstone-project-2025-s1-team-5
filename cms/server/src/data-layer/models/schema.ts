import mongoose, { Schema } from "mongoose";
import {
  ILink,
  IModule,
  IProgramme,
  IQuestion,
  IQuiz,
  ISubsection,
  IUser,
  RoleType,
} from "./models";
import sanitizeHtml from "sanitize-html";

const userSchema: Schema<IUser> = new Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: false,
      default: "default",
    },
    colorPref: {
      type: String,
      required: true,
      enum: ["light", "dark", "system"],
      default: "system",
    },
    country: {
      type: String,
      required: true,
    },
    programme: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(RoleType),
      default: RoleType.user,
      required: true,
    },
  },
  { timestamps: true },
);

const moduleSchema: Schema<IModule> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    iconKey:  { type: String, required: false },

    sortOrder: {
      type: Number,
      required: true,
      default: 0,
    },

    subsectionIds: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Subsection" },
    ],
    quizIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }],
    linkIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Link" }],
  },
  { timestamps: true },
);

const programmeSchema: Schema<IProgramme> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: { type: String, required: false },
    link: { type: String, required: true },
  },
  { timestamps: true },
);

const subsectionSchema: Schema<ISubsection> = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    iconKey:  { type: String, required: false },
    authorID: {
      type: String,
      required: true,
    },
    published: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const questionSchema: Schema<IQuestion> = new Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
});

const quizSchema: Schema<IQuiz> = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    iconKey:  { type: String, required: false },
    questions: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const linkSchema: Schema<ILink> = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    iconKey:  { type: String, required: false },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

//CLEAN HTML code
function clean(raw: string): string {
  return sanitizeHtml(raw, {
    allowedTags: [
      "p",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "strong",
      "em",
      "img",
      "iframe",
      "ul",
      "ol",
      "li",
    ],
    allowedAttributes: {
      p: ["style"],
      h1: ["style"],
      h2: ["style"],
      h3: ["style"],
      h4: ["style"],
      h5: ["style"],
      h6: ["style"],
      img: ["src", "alt", "width", "height"],
      iframe: ["src", "frameborder", "allow", "allowfullscreen"],
    },
  });
}

subsectionSchema.pre("save", function (next) {
  if (this.isModified("body")) {
    this.body = clean(this.body);
  }
  next();
});

subsectionSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() as any;
  if (update.body) {
    update.body = clean(update.body);
    this.setUpdate(update);
  }
  next();
});

const Question = mongoose.model<IQuestion>("Question", questionSchema);
const newModule = mongoose.model<IModule>("newModule", moduleSchema);
const Programme = mongoose.model<IProgramme>("Programme", programmeSchema);
const User = mongoose.model<IUser>("User", userSchema);
const Subsection = mongoose.model<ISubsection>("Subsection", subsectionSchema);
const Quiz = mongoose.model<IQuiz>("Quiz", quizSchema);
const Link = mongoose.model<ILink>("Link", linkSchema);

export { Programme, User, Subsection, newModule, Question, Quiz, Link };
