//criar usuario,ativar usuario

import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { UpdateCustomerDto } from '../dtos/customer/update-customer.dto';
import { CreditCard } from '../models/credit-card.model';
import { Customer } from 'src/modules/businessLayer/models/customer.model';
import { CustomerDto } from '../dtos/customer/customer-dto.dto';

@Injectable()
export class CustomerService {
    constructor(@InjectModel('Customer') private readonly model: any) { }

    async create(data: CustomerDto): Promise<CustomerDto> {
        const customer = new this.model(data);
        return await customer.save();
    }

    async checkCustomerEmail(data: string): Promise<any> {
        const customer = this.model.find({ email: data })
        console.log(customer)
    }
    async findAll(): Promise<Customer[]> {
        return await this.model.find({}, 'name email')
            .sort('name')
            .exec();
    }

    async find(idCustomer: string): Promise<Customer[]> {
        return await this.model.find({ _id: idCustomer })
            .populate('name')
            .exec();
    }


    async update(idCustomer: string, data: UpdateCustomerDto): Promise<Customer[]> {
        return this.model.findOneAndUpdate({ _id: idCustomer }, data);
    }
    async saveOrUpdateCreditCard(idCustomer: string, data: CreditCard): Promise<Customer[]> {
        const options = { upsert: true }
        return await this.model.findOneAndUpdate({ _id: idCustomer }, {
            $set: {
                card: data
            }
        }, options)
    }
    async authenticate(email: string, password: string): Promise<any> {
        const customer = await this.model.findOne({ email: email, password: password }, 'name email photo roles active')
            .exec();
        return customer;
    }
    async findUserInfo(idCustomer: string) {
        return await this.model.find({ _id: idCustomer })
    }
    async updateCustomer(idCustomer: string, data: string, field: string): Promise<any> {
        switch (field) {
            case 'name':
                return await this.model.findOneAndUpdate({ _id: idCustomer }, { name: data }, { new: true });
            case 'email':
                return await this.model.findOneAndUpdate({ _id: idCustomer }, { email: data }, { new: true });
            case 'password':
                return await this.model.findOneAndUpdate({ _id: idCustomer }, { password: data }, { new: true });
            default:
                break;
        }

    }
}