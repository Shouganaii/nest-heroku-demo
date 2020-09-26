import { ApiProperty } from '@nestjs/swagger';

export class CreatePointDto {
    // constructor(
    //     public num: number,
    //     public active: boolean,
    //     public ocupied: boolean,
    // ) { }
    @ApiProperty({
        example: 1, description: 'O número do ponto'
    })
    num: string;
    @ApiProperty({
        example: true, description: 'Se o ponto está ativo ou não'
    })
    active: boolean;
    @ApiProperty({
        example: true, description: 'Se o ponto está ocupado ou não'
    })
    ocupied: boolean;
}