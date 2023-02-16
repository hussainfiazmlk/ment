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
    const user = await this.findUser(req, collection, condition);

    if (user['returnRecord']) throw new ConflictException('User Already Exit');

    data['password'] = await bcrypt.hash(data['password'], 10);
    const newUser = await this.crudService.create(req, collection, data);

    return this.sendTokenWithData(newUser.data);
  };

  signin = async (req: object, collection: string, data: object) => {
    const condition = { email: data['email'] };

    const user = await this.findUser(req, collection, condition);
    if (!user['returnRecord']) throw new UnauthorizedException('Invalid Email or Password');
    const isPasswordMatch = await bcrypt.compare(data['password'], user.data[0]['password']);
    if (!isPasswordMatch) throw new UnauthorizedException('Invalid Email or Password');

    return this.sendTokenWithData(user.data[0]);
  };

  private findUser = async (req: object, collection: string, condition: object) => {
    const response = await this.crudService.read(req, collection, condition);

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
