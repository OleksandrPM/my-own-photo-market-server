import { Test, TestingModule } from '@nestjs/testing';
import { ApiController } from './api.controller';

describe('ApiController', () => {
  let controller: ApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
    }).compile();

    controller = module.get<ApiController>(ApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('root', () => {
    it('should return API root object', () => {
      expect(controller.root()).toEqual({
        status: 'ok',
        message: 'Welcome to the API root endpoint',
        version: '1.0.0',
        endpoints: {
          tags: '/api/tags',
          images: '/api/images',
          auth: '/api/auth',
          users: '/api/users',
        },
      });
    });
  });
});
