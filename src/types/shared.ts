export interface Post {
  id: number;
  title: string;
  body: string;
  userId?: number;
}

export enum ModalType {
  EDIT = 'edit',
  VIEW = 'view',
}
