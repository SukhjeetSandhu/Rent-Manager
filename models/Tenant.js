const mongoose = require('mongoose')

const TenantSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required']
    },
    contactNumber: { type: Number },
    emailId: { type: Number },
    period: {
        type: String,
        default: 'Month'
    },
    rent: {
        type: Number,
        required: [true, 'Rent cannot be empty']
    },
    moveInDate: {
        type: Date,
        required: [true, 'Move in date cannot be empty']
    },
    dueDate: {
        type: Date,
        required: [true, 'Due date cannot be empty']
    },
    balance: {
        type: Number,
        default: 0,
        required: [true, 'Balance cannot be empty']
    }
})

module.exports = mongoose.model('Tenant', TenantSchema)