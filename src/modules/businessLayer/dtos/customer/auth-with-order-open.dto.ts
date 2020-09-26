import { ApiProperty } from '@nestjs/swagger';
export class AuthWithOrderOpenDto {

    @ApiProperty({
        example: 'customer@gmail.com.br', description: 'O email do cliente'
    })
    email: string;
    @ApiProperty({
        example: '123456', description: 'A senha do cliente'
    })
    password: string;
    @ApiProperty({
        example: '507f1f77bcf86cd799439011', description: 'O id do estabelecimento'
    })
    id_establishment: string;
    @ApiProperty({
        example: '507f1f77bcf86cd799439011', description: 'O id do point,dentro do estabelecimento'
    })
    id_point: string;
    @ApiProperty({
        example: '507f1f77bcf86cd799439011', description: 'O id da comanda'
    })
    id_order: string;
}