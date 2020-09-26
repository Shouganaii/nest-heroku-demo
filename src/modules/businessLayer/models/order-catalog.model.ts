import { ApiProperty } from '@nestjs/swagger';
export class OrderCatalog {
    constructor(
        public name: String,
        public value: Number,
        public category: String,
        public quantity: Number,
        public confirmed: Number,
        public id_product: String,

    ) { }
    @ApiProperty()
    _id_product: String
    @ApiProperty()
    _name: String
    @ApiProperty()
    _value: Number
    @ApiProperty()
    _category: String
    @ApiProperty()
    _quantity: Number
    @ApiProperty()
    _confirmed: Number
}