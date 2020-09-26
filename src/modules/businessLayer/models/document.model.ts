import { ApiProperty } from '@nestjs/swagger';

export class Document {
    constructor(
        public id: string,
    ) { }
    @ApiProperty()
    _id: string
}