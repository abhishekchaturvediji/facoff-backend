import { Query } from 'express-serve-static-core';
import { ParamsID } from './base';
export interface UserDetails extends ParamsID {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  photo?: string;
  fcmToken?: string;
  latitude?: string;
  longitude?: string;
  country?: string;
  dob?: string;
  gender?: string;
  username?: string;
}

export interface GetUsers extends Query {
  isArchived: string;
  page: string;
  limit: string;
  orderBy: string;
  order: string;
  search?: string;
}

export interface Pagination {
  offset: number;
  limit: number;
}

export interface updateProfile{
  firstName : string,
  lastName : string,
  oldPassword: string;
  password: string;
}

export interface changePassword {
  oldPassword: string;
  password: string;
}
export interface TokenUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  photo: string;
  country : string
}

export interface VerifyHash extends Query {
  hash?: string;
  password?: string;
  email?: string;
}

export interface DDList extends ParamsID {
  search?: string;
  limit?: string;
  page?: string;
}

export interface ChangeEmail {
  newEmail: string;
}

export interface getUserForGame {
  type?: string;
  value? : string
}


export interface login {
  email?: string;
  value? : string
}


export interface page {
  page?: number;
  limit? : number
}


export interface id {
  id: string;
}
