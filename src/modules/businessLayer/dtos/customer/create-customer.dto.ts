import { ApiProperty } from '@nestjs/swagger';
export class CreateCustomerDto {

    @ApiProperty({
        example: 'customer', description: 'O nome do cliente'
    })
    name: string;
    @ApiProperty({
        example: 'customer@gmail.com.br', description: 'O email do cliente'
    })
    email: string;
    @ApiProperty({
        example: '123456', description: 'A senha do cliente'
    })
    password: string;
}