import { ApiProperty } from '@nestjs/swagger';

export class Catalog {
    constructor(
        public name: string,
        public description: string,
        public value: string,
        public category: string,
        public photo: string,
    ) { }
    @ApiProperty()
    _name: string;
    @ApiProperty()
    _description: string;
    @ApiProperty()
    _value: number;
    @ApiProperty()
    _category: string;
    @ApiProperty()
    _photo: string;

}