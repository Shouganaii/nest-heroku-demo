/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/modules/shared/interfaces/jwt-payload.interface';


@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService
    ) { }

    async login(user: any) {
        const payload = { username: user.username, sub: user.userId };
        return {
            access_token: this.jwtService.sign(payload)
        };
    }
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