import { ApiProperty } from '@nestjs/swagger';
export class EstablishmentSettings {
    constructor(
        public gorjeta: number,
        public embalagem: number,
        public couvert: number,
        public openingHours: string,
        public closingTime: string,
        public workingDays: [],
        public location: any,
    ) { }
    @ApiProperty()
    _gorjeta: string;
    @ApiProperty()
    _embalagem: string;
    @ApiProperty()
    _couvert: number;
    @ApiProperty()
    _openingHours: Date;
    @ApiProperty()
    _closingTime: Date;
    @ApiProperty()
    _workingDays: [string];
    @ApiProperty()
    _location: any;
}