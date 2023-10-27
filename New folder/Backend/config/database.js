const mongoose = require("mongoose")


const dbConnection = async()=>{
    try {
        let conn = await mongoose.connect(process.env.MONGOOSE_URL)
        console.log(`Database are connected Successfully..!`)
    } catch (error) {
        console.log(`error in Database`)
    }
}

module.exports = dbConnection