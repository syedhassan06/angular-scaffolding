export * from './user.model';
export * from './lesson.model';
export * from './resource.model';
export * from './course.model';
export * from './dealership.model';

export interface IHttpResponse {
  data?: any;
  success?: boolean;
  error?: boolean;
  message?: string;
  errors?: any[] | boolean;
  status_code?: number;
  status?: boolean;
}

export interface IModalSetting {
  title?: string;
  content?: string;
  data?: {};
  cancelButtonText?: string;
  confirmButtonText?: string;
}

export interface ILoaderState {
  show: boolean;
}

export enum STATUS {
  'Active' = 1,
  'In-active' = 0
}

export type IAction = 'add' | 'edit';
