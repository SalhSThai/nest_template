import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';

import { catchError, Observable } from 'rxjs';

@Injectable()
export class PrismaKnownErrorInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler<any>): Observable<any> {
    return next.handle().pipe(
      catchError((e) => {
        // chat error here

        throw e;
      }),
    );
  }
}
