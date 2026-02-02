import { Injectable } from '@nestjs/common';
import { CreateImageTagDto } from './dto/create-image-tag.dto';
import { UpdateImageTagDto } from './dto/update-image-tag.dto';

@Injectable()
export class ImageTagsService {
  create(createImageTagDto: CreateImageTagDto) {
    return 'This action adds a new imageTag';
  }

  findAll() {
    return `This action returns all imageTags`;
  }

  findOne(id: number) {
    return `This action returns a #${id} imageTag`;
  }

  update(id: number, updateImageTagDto: UpdateImageTagDto) {
    return `This action updates a #${id} imageTag`;
  }

  remove(id: number) {
    return `This action removes a #${id} imageTag`;
  }
}
