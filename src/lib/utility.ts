import { Pagination } from '../types/common';
import crypto from 'crypto';
class Utility {
  public isEmpty(val: string | any): boolean {
    return val == null || val === null || val.length === 0 || Object.keys(val).length === 0;
  }
  public pagination(page: number, limit: number): Pagination {
    return { offset: (page - 1) * limit, limit: limit };
  }
  public hash(noOfBytes: number) {
    return crypto.randomBytes(noOfBytes).toString('hex');
  }
}

export default new Utility();
