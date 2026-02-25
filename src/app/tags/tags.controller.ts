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
  createTag(@Body() newTag: CreateTagDto['name']) {
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
  @Get('id/:id')
  findTagById(@Param('id') id: string) {
    return this.tagsService.findById(+id);
  }

  // Admin
  @Roles(UserRole.ADMIN)
  @Patch('name/:name')
  updateTagByName(
    @Param('name') name: string,
    @Body() newTag: UpdateTagDto['name'],
  ) {
    return this.tagsService.updateByName(name, newTag);
  }

  // Admin
  @Roles(UserRole.ADMIN)
  @Patch('id/:id')
  updateTag(@Param('id') id: string, @Body() newTag: UpdateTagDto['name']) {
    return this.tagsService.updateById(+id, newTag);
  }

  //  Admin
  @Roles(UserRole.ADMIN)
  @Delete('name/:name')
  removeTagByName(@Param('name') name: string) {
    return this.tagsService.removeByName(name);
  }

  // Admin
  @Roles(UserRole.ADMIN)
  @Delete('id/:id')
  removeTagById(@Param('id') id: string) {
    return this.tagsService.removeById(+id);
  }
}
