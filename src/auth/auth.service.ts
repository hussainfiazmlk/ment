import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as Cryptr from 'cryptr';

import { CrudService } from 'src/crud/crud.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly crudService: CrudService,
    private readonly jwtService: JwtService
  ) { }


  signup = async (req: object, collection: string, data: object) => {
    const condition = { email: data['email'] };
    const user = await this.findUser(collection, condition);

    if (user['returnRecord']) throw new ConflictException('User Already Exit');

    data['password'] = await bcrypt.hash(data['password'], 10);
    const newUser = await this.crudService.create(collection, data, req);

    return this.sendTokenWithData(newUser.data);
  };

  signin = async (req: object, collection: string, data: object) => {
    const condition = { email: data['email'] };

    const user = await this.findUser(collection, condition);
    if (!user['returnRecord']) throw new UnauthorizedException('Invalid Email or Password');
    const isPasswordMatch = await bcrypt.compare(data['password'], user.data[0]['password']);
    if (!isPasswordMatch) throw new UnauthorizedException('Invalid Email or Password');

    return this.sendTokenWithData(user.data[0]);
  };

  verifyToken = async (req: object) => {
    try {
      // 1) Getting token and check it's there
      const token: string = req['headers']['authorization'].split(' ')[1];

      if (!token) {
        throw new UnauthorizedException();
      }

      // 2) Verification token
      const cryptr = new Cryptr(process.env.JWT_SECRET);
      const decoded = this.jwtService.verify(cryptr.decrypt(token));

      // 3) Check if user still exists
      const condtion = { _id: decoded.user._id };
      const currentUser = await this.findUser('user', condtion);

      if (!currentUser['returnRecord']) {
        throw new UnauthorizedException();
      }

      // 4) Check if user changed password after the token was issued
      if (decoded.user.password !== currentUser.data[0]['password']) {
        throw new UnauthorizedException();
      }

      return decoded.user;
    } catch (error) {
      throw new UnauthorizedException();
    }
  };

  private findUser = async (collection: string, condition: object) => {
    const response = await this.crudService.read(collection, condition);

    return response;
  };

  private sendTokenWithData = (user: object): { token: string; data: object; } => {
    let token = this.jwtService.sign({ user });
    const cryptr = new Cryptr(process.env.JWT_SECRET);
    token = cryptr.encrypt(token);
    user['password'] = undefined;
    return { token, data: user };
  };
}
