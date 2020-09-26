
import { ApiProperty } from "@nestjs/swagger";

export class CustomerDto {
    constructor(
        public name: string,
        public email: string,
        public password: string,
    ) { }

    @ApiProperty({
        example: 'customer', description: 'O nome do cliente'
    })
    _name: string

    @ApiProperty({
        example: 'customer@gmail.com.br', description: 'O email do cliente'
    })
    _email: string

    @ApiProperty({
        example: '123456', description: 'A senha do cliente'
    })
    _password: string
}