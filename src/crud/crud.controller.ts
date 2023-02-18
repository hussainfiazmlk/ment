import { Request, Controller, Delete, Get, Patch, Post, HttpCode } from '@nestjs/common';
import { CrudService } from './crud.service';

@Controller('api/v1')
export class CrudController {
  constructor(private readonly crudService: CrudService) { }

  @Post(':collection')
  async create(@Request() req) {
    const { collection } = req.params;
    const data = req.body;
    data['createdBy'] = req['user']['_id'];

    return await this.crudService.create(collection, data, req);
  }

  @Get(':collection/:id?')
  async read(@Request() req) {
    const { collection, id } = req.params;

    const condition = {};
    if (id) {
      condition['_id'] = id;
    }

    const query = req.query;

    return await this.crudService.read(collection, condition, req, query);
  }

  @Patch(':collection/:id')
  async update(@Request() req) {
    const { collection, id } = req.params;

    const condition = {};
    condition['_id'] = id;

    const data: object = req.body;
    data['updatedAt'] = Date.now();
    data['updatedBy'] = req['user']['_id'];

    return await this.crudService.update(collection, condition, data, req);
  }

  @Delete(':collection/:id')
  @HttpCode(204)
  async softDelete(@Request() req) {
    const { collection, id } = req.params;

    const condition = {};
    condition['_id'] = id;

    const data = {};
    data['archieve'] = true;
    data['updatedAt'] = Date.now();
    data['updatedBy'] = req['user']['_id'];

    return await this.crudService.update(collection, condition, data, req);
  }

  @Delete('admin/:collection/:id')
  @HttpCode(204)
  async PermanentlyDelete(@Request() req) {
    const { collection, id } = req.params;

    const condition = {};
    condition['_id'] = id;
    return await this.crudService.delete(collection, condition, req);
  }
}
