import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

import { LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {

  constructor( 
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
      private readonly jwtSrv: JwtService ) {}

  async create(createUserDto: CreateUserDto) {
    try {

      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData, 
        password: bcrypt.hashSync(password, 10)  
      });
      await this.userRepository.save(user);

      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({id: user.id})
      };

    } catch(error) {
      this.handleDBErrors(error);
    }
    
  }

  async login(loginUserDto: LoginUserDto) {
    try{

      const {password, email} = loginUserDto;

      const user = await this.userRepository.findOne({where: {email}, select: {email: true, password: true, id: true}});

      if (!user) {
        throw new UnauthorizedException('Credentials are not valid *');
      }

      if (!bcrypt.compareSync(password, user.password)) {
        throw new UnauthorizedException('Credentials are not valid **');
      }

      return {
        ...user,
        token: this.getJwtToken({id: user.id})
      };
      

    } catch(error) {
      this.handleDBErrors(error);
    }
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtSrv.sign(payload);
    return token;
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(`${error.detail}`);
    }
    console.log(error);

    throw new InternalServerErrorException('Please check server logs');
  }

  
}
