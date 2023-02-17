import { Controller, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  async signup(@Request() req) {
    const collection = 'user';
    const data = req.body;

    return await this.authService.signup(req, collection, data);
  }

  @Post('signin')
  async signin(@Request() req) {
    const collection = 'user';
    const data = req.body;

    return await this.authService.signin(req, collection, data);
  }

  @Post('verifyToken')
  async verifyToken(@Request() req) {
    return await this.authService.verifyToken(req);
  }
}
