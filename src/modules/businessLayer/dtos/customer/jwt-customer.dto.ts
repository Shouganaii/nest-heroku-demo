export class JwtPayloadDto {

    constructor(private name: string,
        private email: string,
        private photo: string,
        private roles: [string]) { }

}