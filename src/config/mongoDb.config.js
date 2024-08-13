import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://grondonacamila:4XIAX0e0VL2jCG1O@e-commerce.na6kuai.mongodb.net/coder-bank")
        console.log("Mongo connected")
    } catch (error) {
        console.log("Error al conectar Mongo")
    }
}