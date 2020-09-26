/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { AuthGuard } from "@nestjs/passport";
import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtAuthGuard extends AuthGuard() {
    canActivate(context: ExecutionContext) {
        //aqui eu posso ver todo o contexto da aplicação
        console.log(context)
        return super.canActivate(context);
    }
    handleRequest(err, user, info) {
        if (err || !user) {
            throw err || new UnauthorizedException
        }
        return user;
    }
}