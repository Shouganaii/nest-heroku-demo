import * as mongoose from 'mongoose';

export const OrderSchema = new mongoose.Schema({
    establishment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Establishment',
        required: true
    },
    establishment_info: {
        type: Object
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    customer_info: {
        type: Object
    },
    point_number: {
        type: Number
    },
    orders: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            index: true,
            required: true,
            auto: true,
        },
        id_product: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        value: {
            type: Number,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        confirmed: {
            type: Number,
            default: 0
        }
    }],
    total: {
        type: Number
    },
    isClosed: {
        type: Boolean,
        required: true,
        default: false
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false
    },
    isCanceled: {
        type: Boolean,
        required: true,
        default: 0
    },
    point: {
        type: String,
        required: true
    },
    payment_method: { type: String }
}, {
    timestamps: true
});

