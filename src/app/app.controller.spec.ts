import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return root object', () => {
      expect(appController.root()).toEqual({
        status: 'ok',
        message: 'Welcome to the my-own-photo-market backend',
        api: '/api',
      });
    });
  });
});
