export class CreateEstablishmentSettingsDto {
    constructor(
        public gorjeta: string,
        public embalagem: string,
        public couvert: string,
        public openingHours: string,
        public closingTime: string,
        public workingDays: [],
    ) { }
}