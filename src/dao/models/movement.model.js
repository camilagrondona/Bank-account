import mongoose from "mongoose"

const movementCollection = "movement"

const movementSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now() // Por defecto le ponemos la fecha de ese movimiento 
    },
    description: {
        type: String,
        default: "" // Le ponemos por defecto un string vacío, es opcional
    },
    amount: {
        type: Number,
        required: true
    },
    type: { // Tipo de movimiento (transferencia, extracción o depósito)
        type: String, 
        required: true
    },
    originAccountId: {
        type: String,
        required: true
    },
    destinationAccountId: {
        type: String
    },
    userId: { // Para poder filtrar los movimientos por el id del usuario 
        type: String
    }
})

export const movementModel = mongoose.model(movementCollection, movementSchema)