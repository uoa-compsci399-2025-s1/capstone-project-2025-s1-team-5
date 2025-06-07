export interface Subsection {
  _id:     string;
  title:   string;
  body:    string;   
  authorID:string;
  published:boolean;
  createdAt:string;
  updatedAt:string;
  __v:     number;
  iconKey?: string
}

export interface SubsectionItem { 
  id: string; 
  title: string;
  iconKey?: string
}

export interface LinkItem { 
  id: string; 
  title: string; 
  url: string;
  iconKey?: string
}
export interface ModuleDetail {
  subsections: SubsectionItem[];
  links:       LinkItem[];
  quizzes: QuizItem[];
}

export interface QuestionItem {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}
export interface QuizItem {
  id: string;
  title: string;
  description: string;
  questions: QuestionItem[];
  iconKey?: string;
}

export type UserAnswer = {
  selectedOption: string | null;
  showResult:     boolean;
  isCorrect:      boolean | null;
};
