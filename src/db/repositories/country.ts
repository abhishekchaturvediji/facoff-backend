import type { ICountry } from '../models/mongoose/country';
import { BaseRepository } from './base';
import CountryShema from '../models/mongoose/country';

export default class CodesRepository extends BaseRepository<ICountry> {
  constructor() {
    super(CountryShema);
  }
}

