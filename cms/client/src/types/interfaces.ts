export interface Module {
  _id: string;
  id?: string; // Alternative ID field for API compatibility
  title: string;
  description: string;
  subsectionIds: string[];
  quizIds?: string[];
  linkIds?: string[];
  updatedAt?: string;
  createdAt?: string;
  iconKey?: string;
}

export interface Subsection {
  _id: string;
  title: string;
  body: string;
  authorID: string;
}

export interface Question {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  quizId?: string;
}

export interface Quiz {
  _id: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface ModulesResponse {
  modules: Module[];
  total: number;
}

export interface Programme {
  _id: string;
  name: string;
  description: string;
  link: string;
}
export interface Link {
  _id: string;
  title: string;
  link: string;
}
