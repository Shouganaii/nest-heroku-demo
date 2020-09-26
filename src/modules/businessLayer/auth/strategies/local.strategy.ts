import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { JwtPayload } from 'src/modules/shared/interfaces/jwt-payload.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super();
    }

    async validate(name: string, email: string, photo: string, roles: [string]): Promise<any> {
        const user: JwtPayload = {
            name: name,
            email: email,
            photo: photo,
            roles: roles,
        };
        const signedUser = await this.authService.validateUser(user);
        if (!signedUser) {
            throw new UnauthorizedException();
        }
        return signedUser;
    }
}