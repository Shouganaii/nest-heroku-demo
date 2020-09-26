import { ApiProperty } from '@nestjs/swagger';

export class CreditCard {
    constructor(
        public holder: string,
        public number: string,
        public expiration: string,
    ) { }
    @ApiProperty()
    _holder: string;
    @ApiProperty()
    _number: string;
    @ApiProperty()
    _expiration: string;
    
}