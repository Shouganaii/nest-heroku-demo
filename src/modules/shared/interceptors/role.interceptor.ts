import { NestInterceptor, Injectable, ExecutionContext, CallHandler, HttpException, HttpStatus } from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { Result } from "src/modules/businessLayer/models/result.model";


@Injectable()
export class RoleInterceptor implements NestInterceptor {
    constructor(public roles: string[]) { }
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const payload: JwtPayload = context.switchToHttp().getRequest().user;
        let hasHole = false;
        payload.roles.forEach(role => {
            if (this.roles.includes(role)) {
                hasHole = true;
            }
        });
        if (!hasHole) {
            throw new HttpException(new Result('Acesso não autorizado', false, null, null),
                HttpStatus.FORBIDDEN);
        }
        return next.handle();
    }
}