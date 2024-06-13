import type { IAdmin } from '../models/mongoose/admin';
import { BaseRepository } from './base';
import AdminSchema from '../models/mongoose/admin';

export default class CodesRepository extends BaseRepository<IAdmin> {
  constructor() {
    super(AdminSchema);
  }
}

