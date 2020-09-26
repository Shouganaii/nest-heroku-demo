import * as mongoose from 'mongoose';

export const EstablishmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
       
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
   
    },
    address: {
        zipcode: {
            type: String
        },
        street: {
            type: String
        },
        number: {
            type: String
        },
        complement: {
            type: String
        },
        neighborhood: {
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String
        },
        country: {
            type: String
        }
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
    settings: {
        gorjeta: {
            type: Number
        },
        embalagem: {
            type: Number
        },
        couvert: {
            type: Number
        },
        openingHours: {
            type: String
        },
        closingTime: {
            type: String
        },
        workingDays: [],
        location: {
            coordinates: []
        }
    },
    photo: {
        type: String,
    },
    catalog: [{
        name: {
            type: String,
            required: true
        },
        description: {
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
        photo: {
            type: String,
        }
    }],
    points: [{
        num: {
            type: Number,
        },
        active: {
            type: Boolean
        },
        ocupied: {
            type: Boolean
        }
    }],
    verified: {
        type: Boolean
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
});

