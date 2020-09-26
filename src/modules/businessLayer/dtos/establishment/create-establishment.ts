export class CreateEstablishmentDto {
    constructor(
        public name: string,
        public phone: string,
        public email: string,
        public password: string
    ) { }
}