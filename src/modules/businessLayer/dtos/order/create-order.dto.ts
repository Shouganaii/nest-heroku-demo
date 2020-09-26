import { OrderCatalog } from "../../models/order-catalog.model";


export class CreateOrderDto {
    constructor(
        public establishment: string,
        public customer: string,
        public orders: OrderCatalog[],
        public isClosed: boolean,
        public isPaid: boolean,
        public point: number,
    ) { }

}