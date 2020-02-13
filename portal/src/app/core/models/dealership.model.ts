import { ILearner } from './user.model';
export interface IDealer {
  id?: number;
  name?: string;
  is_active?: boolean | number;
  dealer_group_id?: boolean | number;
}

export interface IDealerGroup {
  id?: number;
  name?: string;
  is_active?: boolean | number;
}

export interface IAssociateLearner {
  assignedUsers: IAssociate[];
  availableUsers: IAssociate[];
}

export interface IAssociate {
  email: string;
  first_name: string;
  id: number;
  last_name: string;
}

export interface IDealershipLearner {
  id: number;
  is_active: number;
  name: string;
  email: string;
  users: ILearner[];
}
