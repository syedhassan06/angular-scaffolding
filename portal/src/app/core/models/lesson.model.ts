export interface IQuiz {
  question: string;
  options?: IQuizOption[];
}

export interface IQuizOption {
  value: string;
  status: boolean;
}

export interface ILesson {
  id?: number;
  title: string;
  resource_id: number;
}
