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
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller()
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  // Admin
  @Roles(UserRole.ADMIN)
  @Post()
  createTag(@Body() newTag: CreateTagDto) {
    return this.tagsService.create(newTag);
  }

  // Public
  @Get()
  findAllTags() {
    return this.tagsService.findAll();
  }

  // Public
  @Get('name/:name')
  findTagByName(@Param('name') name: string) {
    return this.tagsService.findByName(name);
  }

  // Public
  @Get(':id')
  findTagById(@Param('id') id: string) {
    return this.tagsService.findById(+id);
  }

  // Admin
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  updateTag(@Param('id') id: string, @Body() tag: UpdateTagDto) {
    return this.tagsService.update(+id, tag);
  }

  // Admin
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  removeTag(@Param('id') id: string) {
    return this.tagsService.remove(+id);
  }
}
