import { Query } from 'express-serve-static-core';

export interface ParamsID extends Query {
  id?: string;
}
