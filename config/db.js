const mongoose = require('mongoose')

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(
            'mongodb+srv://ginni:Ginni123Kang@rentmanagement.q0ohp.mongodb.net/RentManagement?retryWrites=true&w=majority',
            {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true
            })

            console.log('Mongo Db Connected')
    } catch (err) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectDb