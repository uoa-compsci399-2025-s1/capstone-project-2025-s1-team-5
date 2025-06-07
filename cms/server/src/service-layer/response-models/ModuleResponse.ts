import { IModule } from "../../data-layer/models/models";

export interface ModulesGetResponse {
  modules: IModule[];
  total: number;
}

export interface ModuleGetResponse {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt?: Date;
  subsectionIds: string[];
}

export interface SubsectionItem {
  id: string;
  title: string;
}

export interface QuestionDTO {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizDTO {
  id: string;
  title: string;
  description: string;
  questions: QuestionDTO[];
}

interface LinkItem {
  id: string;
  title: string;
  url: string;
}
export interface ModuleResponse {
  id: string;
  title: string;
  description: string;
  iconKey?: string;
  subsections: SubsectionItem[];
  links: LinkItem[];
  quizzes: QuizDTO[];
}
