import type { ICodes } from '../models/mongoose/codes';
import { BaseRepository } from './base';
import CodesSchema from '../models/mongoose/codes';
import lodash from 'lodash';

export default class CodesRepository extends BaseRepository<ICodes> {
  constructor() {
    super(CodesSchema);
  }
  async add<T>(hash: string, type: string, userId: string, email: string): Promise<T | null> {
    const code = (await this._model.create(
      lodash.omitBy({ code: hash, type: type, userId: userId, email: email }, lodash.isNil)
    )) as unknown as T;
    return code['_id'];
  }
  async deactiveCode<ICodes>(hash: string): Promise<ICodes | null> {
    return (await this._model.findOneAndDelete({ code: hash })) as ICodes;
  }
  async deactiveOldCodes<ICodes>(email: string, type: string): Promise<ICodes | null> {
    return (await this._model.deleteMany({ email: email, type: type })) as unknown as ICodes;
  }
}
