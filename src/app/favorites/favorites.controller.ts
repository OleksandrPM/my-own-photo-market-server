import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { SelfOnlyGuard } from '../auth/self-only.guard';
import { SelfOrAdminGuard } from '../auth/self-or-admin.guard';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @UseGuards(SelfOnlyGuard)
  @Post()
  create(@Body() newFavorite: CreateFavoriteDto) {
    return this.favoritesService.create(
      newFavorite.userId,
      newFavorite.imageId,
    );
  }

  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }

  @UseGuards(SelfOrAdminGuard)
  @Get('user/:userId/image/:imageId')
  findOne(@Param('userId') userId: string, @Param('imageId') imageId: string) {
    return this.favoritesService.findOne(Number(userId), Number(imageId));
  }

  @UseGuards(SelfOrAdminGuard)
  @Get('user/:userId')
  findAllByUser(@Param('userId') userId: string) {
    return this.favoritesService.findAllByUser(Number(userId));
  }

  @Roles(UserRole.ADMIN)
  @Get('image/:imageId')
  findAllByImage(@Param('imageId') imageId: string) {
    return this.favoritesService.findAllByImage(Number(imageId));
  }

  // Public
  @Get('image/:imageId/count')
  countByImage(@Param('imageId') imageId: string) {
    return this.favoritesService.countByImage(Number(imageId));
  }

  @UseGuards(SelfOnlyGuard)
  @Delete('user/:userId/image/:imageId')
  remove(@Param('userId') userId: string, @Param('imageId') imageId: string) {
    return this.favoritesService.remove(Number(userId), Number(imageId));
  }
}
