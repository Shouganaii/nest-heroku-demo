import { ApiProperty } from '@nestjs/swagger';
export class AuthDto {
    @ApiProperty({
        example: 'customer@gmail.com.br', description: 'Email do cliente'
    })
    email: string;
    @ApiProperty({
        example: '123456', description: 'Senha do cliente'
    })
    password: string;
}