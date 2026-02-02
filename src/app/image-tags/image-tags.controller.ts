import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ImageTagsService } from './image-tags.service';
import { CreateImageTagDto } from './dto/create-image-tag.dto';
import { UpdateImageTagDto } from './dto/update-image-tag.dto';

@Controller('image-tags')
export class ImageTagsController {
  constructor(private readonly imageTagsService: ImageTagsService) {}

  @Post()
  create(@Body() createImageTagDto: CreateImageTagDto) {
    return this.imageTagsService.create(createImageTagDto);
  }

  @Get()
  findAll() {
    return this.imageTagsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imageTagsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImageTagDto: UpdateImageTagDto) {
    return this.imageTagsService.update(+id, updateImageTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imageTagsService.remove(+id);
  }
}
