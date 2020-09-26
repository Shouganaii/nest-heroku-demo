import { ApiProperty } from '@nestjs/swagger';
export class CreateCatalogDto {
    constructor(
        public name: string,
        public description: string,
        public category: string,
        public value: number,
        public photo: string,
    ) { }
    @ApiProperty()
    _name: string;
    @ApiProperty()
    _description: string;
    @ApiProperty()
    _category: string;
    @ApiProperty()
    _value: string;
    @ApiProperty()
    _photo: string;
}