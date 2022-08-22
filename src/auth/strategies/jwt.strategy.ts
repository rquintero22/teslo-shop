import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        configSrv: ConfigService
    ) {
       
        super({
            secretOrKey: configSrv.get<string>('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }

    async validate(payload: JwtPayload): Promise<User> {
        const {email} = payload;
        const user = await this.userRepository.findOneBy({email});

        if(!user) {
            throw new UnauthorizedException('Token not valid!');
        }

        if (!user.isActive) {
            throw new UnauthorizedException('User is inactive, talk with an admin');
        }

        return user;
    }

}
