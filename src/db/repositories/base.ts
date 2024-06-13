import * as mongoose from 'mongoose';

interface IRead<T> {
  findById: (id: string) => Promise<T | null>;
  findOne(cond?: Object): Promise<mongoose.Query<T | null, T>>;
  find(cond: Object, fields: Object, options: Object): Promise<mongoose.Query<Array<T> | null, T>>;
}

interface IWrite<T> {
  create: (item: T) => Promise<T>;
  update: (_id: mongoose.Types.ObjectId, item: T) => Promise<T | null>;
  delete: (_id: string) => void;
}

export class BaseRepository<T extends mongoose.Document> implements IRead<T>, IWrite<T> {
  protected _model: mongoose.Model<mongoose.Document>;

  constructor(schemaModel: mongoose.Model<mongoose.Document>) {
    this._model = schemaModel;
  }

  async create(item: T): Promise<T> {
    return (await this._model.create(item)) as T;
  }

  async createMany(item: any): Promise<T> {
    return (await this._model.insertMany(item)) as any;
  }

  async aggregate(pipeline: any[]): Promise<any[]> {
    return (await this._model.aggregate(pipeline));
  }

  async update(_id: mongoose.Types.ObjectId, item: T): Promise<T | null> {
    return await this._model.findOneAndUpdate({ _id: _id }, item, {
      new: true,
    });
  }

  async sofDelete(_id: string) {
    return await this._model.findOneAndUpdate(
      { _id: _id },
      { deleted: true },
      {new: true}
    );
  }

  async delete(_id: string) {
    await this._model.deleteOne({ _id: this.toObjectId(_id) });
  }

//   async deleteWhere(userId: string, BucketId: string, productVariantId: string) {
//     await this._model.findOneAndDelete({});
//   }

  async findById(_id: string): Promise<T | null> {
    return await this._model.findById(_id);
  }

  async findOne(cond?: Object): Promise<mongoose.Query<T | null, T>> {
    return await this._model.findOne(cond);
  }

  async find(cond: Object, fields?: Object, options?: Object): Promise<mongoose.Query<Array<T> | null, T>> {
    return await this._model.find(cond, fields, options);
  }
  async count(cond: Object): Promise<Number> {
    return await this._model.countDocuments(cond);
  }
  async distinct(key: string, cond: Object): Promise<mongoose.Query<Array<T> | null, T>> {
    return await this._model.distinct(key, cond);
  }

  async distinctCount(key: string, cond: object): Promise<number> {
    return await this._model.distinct(key, cond).countDocuments();
}

  public toObjectId(_id: string): mongoose.Types.ObjectId {
    return new mongoose.Types.ObjectId(_id);
  }
}
