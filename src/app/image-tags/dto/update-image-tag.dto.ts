import { PartialType } from '@nestjs/mapped-types';
import { CreateImageTagDto } from './create-image-tag.dto';

export class UpdateImageTagDto extends PartialType(CreateImageTagDto) {}
