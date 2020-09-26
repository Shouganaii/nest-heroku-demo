import { ApiProperty } from '@nestjs/swagger';

export class Address {
    constructor(
        public zipCode: string,
        public street: string,
        public number: string,
        public complement: string,
        public neighborhood: string,
        public city: string,
        public state: string,
        public country: string,
    ) { }
    @ApiProperty()
    _zipCode: string;
    @ApiProperty()
    _street: string;
    @ApiProperty()
    _number: string;
    @ApiProperty()
    _complement: string;
    @ApiProperty()
    _neighborhood: string;
    @ApiProperty()
    _city: string;
    @ApiProperty()
    _state: string;
    @ApiProperty()
    _country: string;
}