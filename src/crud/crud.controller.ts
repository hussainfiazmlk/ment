import { Request, Controller, Delete, Get, Patch, Post, HttpCode } from '@nestjs/common';
import { CrudService } from './crud.service';

@Controller('api/v1')
export class CrudController {
  constructor(private readonly appService: CrudService) { }

  @Post(':collection')
  async create(@Request() req) {
    const { collection } = req.params;
    const data = req.body;

    return await this.appService.create(req, collection, data);
  }

  @Get(':collection/:id?')
  async read(@Request() req) {
    const { collection, id } = req.params;

    const condition = {};
    if (id) {
      condition['_id'] = id;
    }

    return await this.appService.read(req, collection, condition);
  }

  @Patch(':collection/:id')
  async update(@Request() req) {
    const { collection, id } = req.params;

    const condition = {};
    condition['_id'] = id;

    const data: object = req.body;
    data['updatedAt'] = Date.now()

    return await this.appService.update(req, collection, condition, data);
  }

  @Delete(':collection/:id')
  @HttpCode(204)
  async softDelete(@Request() req) {
    const { collection, id } = req.params;

    const condition = {};
    condition['_id'] = id;

    const data = {}
    data['archieve'] = true;
    data['updatedAt'] = Date.now()

    return await this.appService.update(req, collection, condition, data);
  }

  @Delete('admin/:collection/:id')
  @HttpCode(204)
  async PermanentlyDelete(@Request() req) {
    const { collection, id } = req.params;

    const condition = {};
    condition['_id'] = id;
    return await this.appService.delete(req, collection, condition);
  }
}