import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import mongoose from 'mongoose';
import * as fs from 'fs';

import QueryService from './query.service';


@Injectable({})
export class CrudService {
  private readonly path: string;
  private readonly db: any;

  constructor() {
    this.path = `${process.cwd()}/src/schemas/`;
    this.db = mongoose.createConnection(process.env.MONGODB_URI);
    this.syncSchema();
  }

  create = async (req: object, collection: string, data: object): Promise<{ data: object; }> => {
    try {
      const model = this.db.model(collection);
      const newRecord = await model.create(data);

      return { data: newRecord };
    } catch (error) {
      this.errorHandler(error);
    }
  };

  read = async (collection: string, condition: object, req: object, query: object = {}): Promise<{ totalRecordInDb: number; returnRecord: number; data: object; }> => {
    try {
      if (condition['_id']) {
        this.isValidDocumentId(collection, condition['_id']);
      }
      const model = this.db.model(collection);

      const archieve = { archieve: false };
      condition = { ...condition, ...archieve };

      const totalRecord: number = await model.count(archieve);
      const features = new QueryService(model.find(condition), query).filter().sort().paginate();
      const allRecord = await features['query'];

      if (condition['_id'] && !allRecord.length) {
        throw new BadRequestException(`${collection} with the id ${condition['_id']} not found `);
      }

      return { totalRecordInDb: totalRecord, returnRecord: allRecord.length, data: allRecord };
    } catch (error) {
      this.errorHandler(error);
    }

  };

  update = async (req: object, collection: string, condition: object, data: object): Promise<{ data: object; }> => {
    try {

      this.isValidDocumentId(collection, condition['_id']);
      const model = this.db.model(collection);

      const updatedRecord = await model.findOneAndUpdate(condition, data, { new: true });

      if (!updatedRecord) {
        throw new BadRequestException(`${collection} with the id ${condition['_id']} not found `);
      }

      if (req['method'].toLowerCase() === 'delete') {
        return;
      }

      return { data: updatedRecord };
    } catch (error) {
      this.errorHandler(error);
    }
  };

  delete = async (req: object, collection: string, condition: object): Promise<void> => {
    try {
      this.isValidDocumentId(collection, condition['_id']);
      const model = this.db.model(collection);

      const deleteRecord = await model.findOneAndDelete(condition);

      if (!deleteRecord) throw new BadRequestException(`${collection} with the id ${condition['_id']} not found `);
    } catch (error) {
      this.errorHandler(error);
    }
  };

  private isValidDocumentId(collection: string, id: string): void {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException(`Please enter correct ${collection} id`);
    }
  }

  private errorHandler(error: object) {
    if (error['name'] === 'ValidationError')
      throw new BadRequestException(Object.values(error['errors']).map((val) => val['message']));
    else if (error['name'] === 'MissingSchemaError')
      throw new BadRequestException(error['message'].split('.')[0]);
    else throw new BadRequestException(error['message']);
  }

  private syncSchema = async (): Promise<void> => {
    try {
      fs.readdir(this.path, (err, files) => {
        if (err) {
          console.log('error in reading schema files', err);
        }

        files.forEach(async (file) => {
          const schemaJson = require(this.path + file); //eslint-disable-line
          const schemaName = file.split('.')[0];

          const documentSchema = new mongoose.Schema(schemaJson.schema, { versionKey: false });
          this.db.model(schemaName, documentSchema, schemaName);
        });
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('unable to sync schemas with db');
    }
  };
}
