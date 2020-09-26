import { ApiProperty } from '@nestjs/swagger';


export class EstablishmentAccount {
    constructor(
        public name: string,
        public password: string,
        public phone: string,
        public email: string,
        public photo: string,
    ) { }
    @ApiProperty()
    _name: string;
    @ApiProperty()
    _password: string;
    @ApiProperty()
    _phone: string;
    @ApiProperty()
    _email: string;
    @ApiProperty()
    _photo: string;


}