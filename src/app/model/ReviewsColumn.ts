import {RecieverColumn} from './RecieverColumn';

export interface ReviewsColumn {
  id: number;
  rate: number;
  name: string;
  parent?: string;
  childJson?: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  reciever: RecieverColumn;
}
