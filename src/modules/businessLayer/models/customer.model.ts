import { ApiProperty } from "@nestjs/swagger";

export class Customer {
    @ApiProperty({
        example: '507f1f77bcf86cd799439011', description: 'O id do cliente'
    })
    id: string
    @ApiProperty({
        example: 'customer', description: 'O nome do cliente'
    })
    name: string

    @ApiProperty({
        example: 'customer@gmail.com.br', description: 'O email do cliente'
    })
    email: string

    @ApiProperty({
        example: '123456', description: 'A senha do cliente'
    })
    password: string
}