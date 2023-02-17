import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,

  ) { }

  async use(req /*: Request */, res: Response, next: NextFunction) {
    const user = await this.authService.verifyToken(req);
    req.user = user;
    next();
  }
}
