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
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../profiles/user.types';
import { apiRoutes } from 'src/app/common/path-builder/api.routes';
import { TagUiResponseDto } from './dto/tag-ui-response.dto';
import { TagResponseDto } from './dto/tag-response.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller()
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  // Public UI-friendly endpoints
  @Get()
  @ApiOperation({ summary: 'Get all tags in the short format' })
  async findAllTagsUi(): Promise<TagUiResponseDto[]> {
    const result = await this.tagsService.findAll();

    return result.map((tag) => tag.toUi());
  }

  @Get(apiRoutes.TAGS.NAME)
  @ApiOperation({ summary: 'Get tag by name in the short format' })
  async findTagByName(
    @Param('name') name: string,
  ): Promise<TagUiResponseDto | null> {
    const tag = await this.tagsService.findByName(name);

    return tag ? tag.toUi() : null;
  }

  @Get(apiRoutes.TAGS.ID)
  @ApiOperation({ summary: 'Get tag by id in the short format' })
  async findTagById(@Param('id') id: string): Promise<TagUiResponseDto | null> {
    const tag = await this.tagsService.findById(+id);

    return tag ? tag.toUi() : null;
  }

  // Admin endpoints
  @Roles(UserRole.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a new tag' })
  @ApiBody({ type: CreateTagDto })
  async createTag(@Body() newTag: CreateTagDto): Promise<TagResponseDto> {
    const tag = await this.tagsService.create(newTag.name);

    return tag.toJSON();
  }

  @Roles(UserRole.ADMIN)
  @Get(apiRoutes.TAGS.AS_ADMIN)
  async findAllTags(): Promise<TagResponseDto[]> {
    const result = await this.tagsService.findAll();

    return result.map((tag) => tag.toJSON());
  }

  @Roles(UserRole.ADMIN)
  @Patch(apiRoutes.TAGS.NAME)
  async updateTagByName(
    @Param('name') name: string,
    @Body() newTag: UpdateTagDto['name'],
  ): Promise<TagResponseDto | null> {
    const updatedTag = await this.tagsService.updateByName(name, newTag);

    return updatedTag ? updatedTag.toJSON() : null;
  }

  @Roles(UserRole.ADMIN)
  @Patch(apiRoutes.TAGS.ID)
  async updateTag(
    @Param('id') id: string,
    @Body() newTag: UpdateTagDto['name'],
  ): Promise<TagResponseDto | null> {
    const updatedTag = await this.tagsService.updateById(+id, newTag);

    return updatedTag ? updatedTag.toJSON() : null;
  }

  @Roles(UserRole.ADMIN)
  @Delete(apiRoutes.TAGS.NAME)
  async removeTagByName(
    @Param('name') name: string,
  ): Promise<TagResponseDto | null> {
    const deletedTag = await this.tagsService.removeByName(name);

    return deletedTag ? deletedTag.toJSON() : null;
  }

  @Roles(UserRole.ADMIN)
  @Delete(apiRoutes.TAGS.ID)
  async removeTagById(@Param('id') id: string): Promise<TagResponseDto | null> {
    const deletedTag = await this.tagsService.removeById(+id);

    return deletedTag ? deletedTag.toJSON() : null;
  }
}
