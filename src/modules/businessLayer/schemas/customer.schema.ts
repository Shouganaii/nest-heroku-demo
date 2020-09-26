import * as mongoose from 'mongoose';

export const CustomerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        index: {
            unique: true
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        index: {
            unique: true
        }
    },
    photo: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    card: {
        number: {
            type: String
        },
        holder: {
            type: String
        },
        expiration: {
            type: String
        }
    },
    roles: ['customer']
});

