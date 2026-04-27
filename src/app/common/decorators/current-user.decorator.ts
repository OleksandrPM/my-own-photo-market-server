import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from 'src/app/product/profiles/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context
      .switchToHttp()
      .getRequest<{
        user: { id: UserEntity['id'] };
        role: UserEntity['role'];
      }>();

    return request.user;
  },
);
