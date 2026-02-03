import { IsNumber } from 'class-validator';

export class CreateImageTagDto {
  @IsNumber()
  imageId: number;

  @IsNumber()
  tagId: number;
}
