/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) { }

    createToken(name, email, photo, roles: any) {
        const user: JwtPayload = {
            name: name,
            email: email,
            photo: photo,
            roles: roles,
        };
        return this.jwtService.sign(user);
    }

    async validateUser(payload: JwtPayload): Promise<any> {
        return payload;
    }
}