import { Test, TestingModule } from '@nestjs/testing';
import { ImageTagsService } from './image-tags.service';

describe('ImageTagsService', () => {
  let service: ImageTagsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageTagsService],
    }).compile();

    service = module.get<ImageTagsService>(ImageTagsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
