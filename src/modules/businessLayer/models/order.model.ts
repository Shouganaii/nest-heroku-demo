export class Order {
    constructor(
        public establishment: string,
        public customer: string,
        public orders: any,
        public isClosed: boolean,
        public isPaid: boolean,
        public point: number,
    ) {}
}