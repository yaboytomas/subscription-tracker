import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    
    name:{
        type: String, 
        required: [true, 'Subscription name is requiered.'],
        trim: true,
        minLength: 2,
        maxLength: 100,
    },

    price: {
        type: String,
        required: [true, 'Subscription price is requiered.'],
        min: [0, "Price must be greater than 0"],
    },

    currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP'],
        default: 'CLP',
    },
    
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'annually'],

    },

    catergory: {
        type: String,
        enum: ['news', 'sports', 'entertainment', 'technology', 'politics', 'finance', 'health', 'fashion', 'food', 'travel', 'lifestyle', 'other'],
        requierd: [true, 'Subscription category is requiered.'],
    },
    
    paymentMethod: {
        type: String,
        enum: ['credit card', 'debit card', 'paypal', 'cash'],
        requierd: [true, 'Subscription payment method is requiered.'],
    },

    status: {
        type: String,
        enum: ['active', 'cancelled', 'expired'],
        default: 'active',
    },

    // valdition for start date before entered
    startDate: {
        type: Date,
        required: [true, 'Subscription start date is required.'],
        default: Date.now,
        validate: {
            validator: function(v) {
                return v < Date.now();
            },
            message: 'Start date must be in the past.'
        }
    },
    renewalDate: {
        type: Date,
        required: [true, 'Subscription renewal date is required.'],
        default: Date.now,
        validate: {
            validator: function(v) {
                return v > this.startDate;
            },
            message: 'Renewal date must be after the start date.'
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required.'],
        index: true,
    }

}, {timestamps: true});

// auto calculate renewal date based on frequency
subscriptionSchema.pre('save', function(next) {
    if (this.renewalDate) {
        const renewalPeriods = {    
            daily: 1,
            weekly: 7,
            monthly: 30,
            annually: 365,
        };
        
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }

    // auto calculate status if renewal date is in the past
    if (this.renewalDate < Date.now()) {
        this.status = 'expired';
    }

    next();

});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;