export interface Subsection {
  _id:     string;
  title:   string;
  body:    string;   
  authorID:string;
  published:boolean;
  createdAt:string;
  updatedAt:string;
  __v:     number;
}

export interface SubsectionItem { 
  id: string; 
  title: string 
}

export interface LinkItem { 
  id: string; 
  title: string; 
  url: string 
}
export interface ModuleDetail {
  subsections: SubsectionItem[];
  links:       LinkItem[];
}