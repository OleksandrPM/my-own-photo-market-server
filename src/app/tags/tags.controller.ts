import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Controller()
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  create(@Body() newTag: CreateTagDto) {
    return this.tagsService.create(newTag);
  }

  @Get()
  findAll() {
    return this.tagsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagsService.findOne(+id);
  }

  @Get('name/:name')
  findByName(@Param('name') name: string) {
    return this.tagsService.findByName(name);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() tag: UpdateTagDto) {
    return this.tagsService.update(+id, tag);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagsService.remove(+id);
  }
}
