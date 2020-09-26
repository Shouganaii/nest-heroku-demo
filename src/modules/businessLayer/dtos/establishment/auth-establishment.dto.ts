import { ApiProperty } from '@nestjs/swagger';
export class AuthEstablishmentDto {
    @ApiProperty({
        example: 'establishment@gmail.com.br', description: 'Email do estabelecimento'
    })
    email: string;
    @ApiProperty({
        example: '123456', description: 'Senha do estabelecimento'
    })
    password: string;
}