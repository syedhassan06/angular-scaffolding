export interface ICourseItem {
  id?: number;
  title: string;
  image: string;
  description: string;
  dayLimit: number;
  isEsignature: boolean;
  isActive: boolean | 'Active' | 'In-active';
  canExpire: boolean;
  expiryPeriodCount: number;
  expiryPeriodType: 'week' | 'month' | 'year';
  createdDate?: string;
}

export interface ICourseForm {
  formData: FormData;
  course: ICourseItem;
}

export interface ICourseStats {
  certificate_expiration_date: string;
  completion_date: string;
  course_id: number;
  created_at: string;
  deleted_at: string;
  expiration_date: string;
  id: number;
  user_course_id?: number;
  progress: number;
  registration_date: string;
  status: string;
  title: string;
  updated_at: '2019-02-12 11:22:18';
  user_id: number;
  first_name?: string;
  last_name?: string;
}

export interface ICourseLesson {
  availableLessons: ICourseAvailableLesson[];
  assignedLessons: ICourseAssignedLesson[];
}

export interface IUserCourse {
  assignedUsers: IUserAssignedCourse[];
  availableUsers: IUserAvailableCourse[];
  otherUsersAssigned: IUserAssignedCourse[];
  otherUsersAvailable: IUserAssignedCourse[];
}

export interface IUserAssignedCourse {
  email: string;
  first_name: string;
  id: number;
  last_name: string;
}

export interface IUserAvailableCourse {
  email: string;
  first_name: string;
  id: number;
  last_name: string;
}

export interface ICourseAvailableLesson {
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  title?: string;
}

export interface ICourseAssignedLesson {
  id: number;
  title: string;
  lesson_type: 'optional' | 'required';
}

export interface IAssignment {
  course_id: number;
  created_at?: string;
  description?: string;
  id: number;
  passing_marks?: number | string;
  resource_id?: number;
  status?: boolean;
  title: string;
  total_marks?: number | string;
  updated_at?: string;
  no_of_submissions?: number;
}

export interface ISubmittedAssignment {
  id?: number;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  title: string;
  assignment_id: number;
  submitted_file_name: string;
  submitted_file_path: string;
  submitted_at: string;
  marks_obtained: number;
  grade: number;
  status: number;
  commented_at: string;
  commented_by: string;
  comments: string;
}
