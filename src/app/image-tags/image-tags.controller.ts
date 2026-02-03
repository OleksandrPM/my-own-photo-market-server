import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ImageTagsService } from './image-tags.service';
import { CreateImageTagDto } from './dto/create-image-tag.dto';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('image-tags')
export class ImageTagsController {
  constructor(private readonly imageTagsService: ImageTagsService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createImageTagDto: CreateImageTagDto) {
    return this.imageTagsService.create(
      createImageTagDto.imageId,
      createImageTagDto.tagId,
    );
  }

  @Get()
  findAll() {
    return this.imageTagsService.findAll();
  }

  @Get('image/:imageId/tag/:tagId')
  findOne(@Param('imageId') imageId: string, @Param('tagId') tagId: string) {
    return this.imageTagsService.findOne(Number(imageId), Number(tagId));
  }

  @Get('image/:imageId')
  findAllByImage(@Param('imageId') imageId: string) {
    return this.imageTagsService.findAllByImage(Number(imageId));
  }

  @Get('tag/:tagId')
  findAllByTag(@Param('tagId') tagId: string) {
    return this.imageTagsService.findAllByTag(Number(tagId));
  }
}
