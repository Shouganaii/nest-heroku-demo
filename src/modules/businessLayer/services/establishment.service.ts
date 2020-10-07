/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
//criar usuario,ativar usuario
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Establishment } from '../models/Establishment.model';
import { CreditCard } from '../models/credit-card.model';
import { Address } from 'cluster';
import { Points } from '../models/points.model';
import { Catalog } from '../models/catalog.model';
import { EstablishmentAccount } from '../models/Establishment-account.model';


@Injectable()
export class EstablishmentService {
    constructor(@InjectModel('Establishment') private readonly model: any) { }

    async createEstablishment(data: Establishment): Promise<Establishment> {
        try {
            const establishment = new this.model(data);
            console.log(establishment)
            const newEst = await establishment.save();
            console.log(newEst)
            return newEst;
        } catch (error) {
            console.log(error)
        }

    }
    async createEstablishmentSettings(idEstablishment: string, data: Establishment): Promise<Establishment> {
        const options = { upsert: true, new: true };
        return await this.model.findOneAndUpdate({ _id: idEstablishment }, { settings: data }, options);
    }
    async createOrUpdateEstablishmentCard(idEstablishment: string, data: CreditCard): Promise<Establishment> {
        const options = { upsert: true, new: true };
        return await this.model.findOneAndUpdate({ _id: idEstablishment }, { card: data }, options);
    }
    async createOrUpdateAddress(idEstablishment: string, model: Address): Promise<Establishment> {
        const options = { upsert: true, new: true };
        return await this.model.findOneAndUpdate({ _id: idEstablishment }, {
            $set: {
                address: model
            },
        }, options);
    }
    async createPoint(idEstablishment: string, data: Points): Promise<Establishment> {
        const options = { upsert: true, new: true };
        return await this.model.findOneAndUpdate({ _id: idEstablishment }, {
            $push: {
                points: data
            },
        }, options);
    }
    async createCatalog(idEstablishment: string, data: Catalog, filename: string): Promise<Establishment> {
        console.log('data:', data);
        const options = { upsert: true, new: true };
        return await this.model.findOneAndUpdate({ _id: idEstablishment }, {
            $push: {
                catalog: {
                    name: data.name,
                    value: data.value,
                    description: data.description,
                    category: data.category,
                    photo: filename
                }
            },
        }, options);
    }
    async updateCatalog(idEstablishment: string, idCatalog: string, data: Catalog): Promise<any> {
        return await this.model
            .findOneAndUpdate({ _id: idEstablishment, 'catalog._id': idCatalog },
                {
                    $set: {
                        'catalog.$': data
                    }
                }, { useFindAndModify: false });
    }
    async authenticate(email: string, password: string): Promise<any> {
        const establishment = await this.model.findOne({ email: email, password: password }, 'name email photo phone address settings roles active catalog')
            .exec();
        return establishment;
    }

    async getPoints(idEstablishment: string): Promise<any> {
        return await this.model.find({ _id: idEstablishment }, 'points').sort('$.num').exec();
    }
    async getEveything(idEstablishment: string): Promise<any> {
        try {
            const res = await this.model.find({ _id: idEstablishment });
            return res
        } catch (error) {
            console.log(error)
        }
    }

    async softDeletePoint(idEstablishment: string, idPoint: string): Promise<any> {
        return await this.model.findOneAndUpdate({ _id: idEstablishment, 'points._id': idPoint },
            {
                $set: {
                    'points.$.active': false,
                }
            });
    }
    async getCatalog(idEstablishment: string): Promise<any> {
        try {
            const res = await this.model.find({ _id: idEstablishment }, 'catalog');
            return res
        } catch (error) {
            console.log(error)
        }

    }
    async getSettings(idEstablishment: string): Promise<any> {
        return await this.model.find({ _id: idEstablishment }, 'settings address');
    }
    async getAccountSettings(idEstablishment: string): Promise<any> {
        const establishment = await this.model
            .findOne({ _id: idEstablishment }, 'name email photo phone address points')
            .exec();
        return establishment;
    }
    async UpdateAccount(idEstablishment: string, establishmentAcc: EstablishmentAccount): Promise<Establishment> {
        return await this.model.findOneAndUpdate({ _id: idEstablishment }, {
            name: establishmentAcc.name,
            email: establishmentAcc.email,
            phone: establishmentAcc.phone,
        });
    }
    async UpdateAccountWithPhoto(idEstablishment: string, establishmentAcc: EstablishmentAccount, photo: string): Promise<Establishment> {
        return await this.model.findOneAndUpdate({ _id: idEstablishment }, {
            name: establishmentAcc.name,
            email: establishmentAcc.email,
            phone: establishmentAcc.phone,
            photo: photo
        });
    }
    async deleteItem(idEstablishment: string, idItem: string): Promise<any> {
        try {
            return await this.model.update({ _id: idEstablishment },
                { $pull: { "catalog": { _id: idItem } } }, function (err, data) {

                })
        } catch (error) {
            console.log(error);
        }

    }
    // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
    async getAllEstablishments(): Promise<any> {
        const establishment = await this.model
            .find({},'-password')
            .exec();
        return establishment;
    }
}