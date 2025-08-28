
export interface IFavoriteFields {
  [key: string]: string;
}

export interface IFavorite {
  id?: string;
  userId: string;
  coupleId: string;
  category: string;
  fields: IFavoriteFields;
  link?: string;
  createdAt: Date;
}
export interface IFavoriteResponse {
  id: string;
  userId: string;
  coupleId: string;
  category: string;
  fields: IFavoriteFields;
  link?: string;
  createdAt: Date;
}
