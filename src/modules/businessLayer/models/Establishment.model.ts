import { ApiProperty } from '@nestjs/swagger';
import { Address } from "./address.model";
import { CreditCard } from "./credit-card.model";
import { EstablishmentSettings } from "./Establishment-settings.model";
import { Points } from "./points.model";
import { Catalog } from "./catalog.model";

export class Establishment {
    constructor(
        public name: string,
        public password: string,
        public phone: string,
        public email: string,
        public address: Address,
        public card: CreditCard,
        public settings: EstablishmentSettings,
        public photo: string,
        public catalog: [Catalog],
        public points: [Points],
        public verified: boolean,
    ) { }
    @ApiProperty()
    _name: string;
    @ApiProperty()
    _password: string;
    @ApiProperty()
    _phone: string;
    @ApiProperty()
    _address: Address;
    @ApiProperty()
    _card: CreditCard;
    @ApiProperty()
    _settings: EstablishmentSettings;
    @ApiProperty()
    _catalog: [Catalog];
    @ApiProperty()
    _points: Points;
    @ApiProperty()
    _verified: boolean;
}