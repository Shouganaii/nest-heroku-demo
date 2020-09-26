import { ApiProperty } from '@nestjs/swagger';
export class UpdateCustomerDto {
    constructor(
        public name: string,
        public email: string,
        public password: string,
        public photo: string,
    ) { }
    @ApiProperty()
    _name: string;
    @ApiProperty()
    _document: string;
    @ApiProperty()
    _email: string;
    @ApiProperty()
    _password: string;
}