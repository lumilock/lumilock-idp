import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * Interceptor to parse formData to json
 * Exemple: From { isActive: 'true' } to { isActive: true }
 */
@Injectable()
export class FileFormDataInterceptor implements NestInterceptor {
  constructor(private dataName: string) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const data = request?.body?.[this.dataName];
    const jsonData = data ? JSON.parse(data) : {};
    Object.keys(jsonData).forEach((key) => {
      request.body[key] = jsonData[key];
    });
    delete request.body[this.dataName];
    return next.handle();
  }
}
