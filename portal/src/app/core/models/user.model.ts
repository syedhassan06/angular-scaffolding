export interface IUserPrivilege {
  id: number;
  role: string;
}
export interface IUser {
  id?: number;
  user_id?: number;
  email: string;
  token: string;
  api_key: string;
  username: string;
  first_name: string;
  last_name: string;
  bio: string;
  image: string;
  terms_of_use?: String;
  terms_of_use_checked?: 0;
  roles: any[];
  login_role: string;
  is_active: boolean;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IUserForm {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  cpassword?: string;
  role_id: Array<any>;
}

export interface IResetPassword {
  password_confirmation: string;
  password: string;
  key: string;
}

export enum USER_ROLE {
  'Admin' = 1,
  'Manager' = 2,
  'Learner' = 3
}

export interface ILearner {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  name?: string;
}

export type IUserRole = typeof USER_ROLE;
