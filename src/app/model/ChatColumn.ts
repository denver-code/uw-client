import {UserColumn} from './UserColumn';
import {NotificationColumn} from './NotificationColumn';

export interface ChatColumn {
  id: number;
  chat?: string;
  agreementProvide?: number;
  agreementRequest?: number;
  completeProvide: number;
  completeRequest: number;
  createdAt: string;
  updatedAt: string;
  provide?: UserColumn;
  request?: UserColumn;
  notification?: NotificationColumn;
}
