import { Test, TestingModule } from '@nestjs/testing';
import { ImageTagsController } from './image-tags.controller';
import { ImageTagsService } from './image-tags.service';

describe('ImageTagsController', () => {
  let controller: ImageTagsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageTagsController],
      providers: [ImageTagsService],
    }).compile();

    controller = module.get<ImageTagsController>(ImageTagsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
