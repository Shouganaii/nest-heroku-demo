/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
//criar usuario,ativar usuario
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from '../models/order.model';
import { OrderCatalog } from '../models/order-catalog.model';

@Injectable()
export class OrderService {
    constructor(
        @InjectModel('Order') private orderModel,
        @InjectModel('Establishment') private establishment
    ) { }
    async verifyPoint(idEstablishment: string): Promise<any> {
        return await this.establishment.findOne({ _id: idEstablishment }, 'points');
    }
    async verifyPointNumber(idEstablishment: string, idPoint: string): Promise<any> {
        const point: any = await this.establishment.find({
            _id: idEstablishment
        }, 'points');
        const achaArrayFull = point[0].points;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const filtrado = achaArrayFull.filter((obj, i, array) => {
            return obj._id == idPoint;
        });
        return filtrado;
    }
    async getCatalog(establish: string): Promise<any> {
        return await this.establishment.findOne({ _id: establish }, 'catalog');
    }
    async createOrder(idEstablishment: string, establishmentInfo: any, idCustomer: string, customerInfo: any, orders: any, idPoint: string, pointNumber: number): Promise<any> {
        return await this.orderModel.create({
            establishment: idEstablishment,
            establishment_info: establishmentInfo,
            customer: idCustomer,
            customer_info: customerInfo,
            orders,
            point_number: pointNumber,
            point: idPoint,
            isClosed: false,
            isPaid: false
        });
    }

    async newRequest(idOrder: string, orders: OrderCatalog): Promise<Order> {
        console.log(idOrder)
        return await this.orderModel.findOneAndUpdate({ _id: idOrder }, {
            $push: {
                orders: orders
            },
        }, { new: true });
    }

    async changeRequestStatus(idOrder: string, idCatalog: string, value: number): Promise<Order> {
        const result = await this.orderModel.findOneAndUpdate({ _id: idOrder, 'orders._id': idCatalog },
            {
                $set: {
                    'orders.$.confirmed': value,
                }
            });
        const { establishment } = result;
        const getActiveOrdersOfEstablishment = await this.orderModel.find({ establishment, isClosed: false, isPaid: false });
        return getActiveOrdersOfEstablishment;
    }
    async getAllActiveOrders(_id: string, profile: number) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let type: string;
        if (profile === 1) {
            type = 'establishment';
        } else {
            type = 'customer';
        }
        return await this.orderModel.find({ type: _id, isClosed: false, isPaid: false })
    }
    async getAllEstablishmentOrders(idEstablishment: string) {
        return await this.orderModel.find({ establishment: idEstablishment })
    }
    async getAllCustomerOrders(idCustomer: string) {
        return await this.orderModel.find({ customer: idCustomer })
    }
    async getLastOrder(customer: string, establishment: string) {
        return await this.orderModel.find({ establishment, customer }).sort({ x: -1 });
    }
    async getOrderOpen(establishment: string, point: string, customer: string, idOrder: string) {
        const result = await this.orderModel.findOne({
            _id: idOrder,
            establishment: establishment,
            customer: customer,
            point: point,
            isPaid: false,
            isClosed: false
        });
        console.log(result)
        return result;
    }
    async getOrderById(orderId: string) {
        const result = await this.orderModel.findOne({ _id: orderId });
        return result;
    }
    async endOrder(orderId: string, method: string) {
        const result = await this.orderModel.findOneAndUpdate({ _id: orderId }, {
            payment_method: method,
            isClosed: true
        }, { new: true });
        return result;
    }
    async confirmPayment(orderId: string, establishmentId: string, customerId: string) {
        const result = await this.orderModel.findOneAndUpdate({
            _id: orderId,
            establishment: establishmentId,
            customer: customerId
        }, {
            isPaid: true
        });
        return result;
    }
    async cancelOrder(orderId: string, establishmentId: string, customerId: string) {
        const result = await this.orderModel.findOneAndUpdate({
            _id: orderId,
            establishment: establishmentId,
            customer: customerId
        }, {
            isCanceled: true
        }, { new: true });
        return result;
    }


}
