import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/app/common/decorators/roles.decorator';
import { ErrorResponseDto } from 'src/app/common/dto/error-response.dto';
import { apiRoutes } from 'src/app/common/path-builder/api.routes';
import { TagsService } from './tags.service';
import { TagUiResponseDto } from './dto/tag-ui-response.dto';
import { TagResponseDto } from './dto/tag-response.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { CreateTagDto } from './dto/create-tag.dto';
import { UserRole } from '../profiles/user.types';

@ApiTags('Tags')
@Controller()
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  // --------------------------------------------------
  // Public UI-friendly endpoints
  // --------------------------------------------------

  @Get()
  @ApiOperation({ summary: 'Get all tags in the short UI format' })
  @ApiOkResponse({ type: TagUiResponseDto, isArray: true })
  async findAllTagsUi(): Promise<TagUiResponseDto[]> {
    const result = await this.tagsService.findAll();
    return result.map((tag) => tag.toUi());
  }

  @Get(apiRoutes.TAGS.NAME)
  @ApiOperation({ summary: 'Get tag by name (UI format)' })
  @ApiParam({ name: 'name', example: 'nestjs' })
  @ApiOkResponse({ type: TagUiResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  async findTagByName(@Param('name') name: string): Promise<TagUiResponseDto> {
    const tag = await this.tagsService.findByName(name);

    if (!tag) {
      throw new NotFoundException(`Tag with name ${name} not found`);
    }

    return tag.toUi();
  }

  @Get(apiRoutes.TAGS.ID)
  @ApiOperation({ summary: 'Get tag by id (UI format)' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ type: TagUiResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  async findTagById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TagUiResponseDto> {
    const tag = await this.tagsService.findById(id);

    if (!tag) {
      throw new NotFoundException(`Tag with id ${id} not found`);
    }

    return tag.toUi();
  }

  // --------------------------------------------------
  // Admin endpoints
  // --------------------------------------------------

  @Roles(UserRole.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create new tags (admin)' })
  @ApiBody({ type: CreateTagDto, isArray: true })
  @ApiCreatedResponse({ type: TagResponseDto, isArray: true })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  async createTags(@Body() newTags: CreateTagDto[]): Promise<TagResponseDto[]> {
    const names = newTags.map((dto) => dto.name);

    const tags = await this.tagsService.createMany(names);

    return tags.map((tag) => tag.toJSON());
  }

  @Roles(UserRole.ADMIN)
  @Get(apiRoutes.TAGS.AS_ADMIN)
  @ApiOperation({ summary: 'Get all tags (admin format)' })
  @ApiOkResponse({ type: TagResponseDto, isArray: true })
  async findAllTags(): Promise<TagResponseDto[]> {
    const result = await this.tagsService.findAll();

    return result.map((tag) => tag.toJSON());
  }

  @Roles(UserRole.ADMIN)
  @Patch(apiRoutes.TAGS.NAME)
  @ApiOperation({ summary: 'Update tag by name' })
  @ApiParam({ name: 'name', example: 'old-name' })
  @ApiOkResponse({ type: TagResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  async updateTagByName(
    @Param('name') name: string,
    @Body() dto: UpdateTagDto,
  ): Promise<TagResponseDto> {
    const updatedTag = await this.tagsService.updateByName(name, dto.name);

    if (!updatedTag) {
      throw new NotFoundException(`Tag with name ${name} not found`);
    }

    return updatedTag.toJSON();
  }

  @Roles(UserRole.ADMIN)
  @Patch(apiRoutes.TAGS.ID)
  @ApiOperation({ summary: 'Update tag by id' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ type: TagResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  async updateTagById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTagDto,
  ): Promise<TagResponseDto> {
    const updatedTag = await this.tagsService.updateById(id, dto.name);

    if (!updatedTag) {
      throw new NotFoundException(`Tag with id ${id} not found`);
    }

    return updatedTag.toJSON();
  }

  @Roles(UserRole.ADMIN)
  @Delete(apiRoutes.TAGS.NAME)
  @ApiOperation({ summary: 'Delete tag by name' })
  @ApiParam({ name: 'name', example: 'obsolete-tag' })
  @ApiOkResponse({ type: TagResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  async removeTagByName(@Param('name') name: string): Promise<TagResponseDto> {
    const deletedTag = await this.tagsService.removeByName(name);

    if (!deletedTag) {
      throw new NotFoundException(`Tag with name ${name} not found`);
    }

    return deletedTag.toJSON();
  }

  @Roles(UserRole.ADMIN)
  @Delete(apiRoutes.TAGS.ID)
  @ApiOperation({ summary: 'Delete tag by id' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ type: TagResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  async removeTagById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TagResponseDto> {
    const deletedTag = await this.tagsService.removeById(id);

    if (!deletedTag) {
      throw new NotFoundException(`Tag with id ${id} not found`);
    }

    return deletedTag.toJSON();
  }
}
