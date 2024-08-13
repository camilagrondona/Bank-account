import { Router } from "express"
import accountServices from "../services/account.services.js"
import passport from "passport"

const router = Router()

// Depósitos 

router.put("/deposit", passport.authenticate("jwt", {session:true}), async (req, res) => {
    try {
        const {amount, alias, number} = req.body // Desestructuramos del body la información que necesitamos para los depósitos: el monto, el alias y el número de cuenta. Esto se debe a que los depósitos se pueden hacer mediante el alias o el nro de cta.
        const queryAccount = alias ? {alias} : {number} // Para hacer la consulta, si viene el alias se realiza una query con el alias, y sino con el nro. 
        const findAccount = await accountServices.getOneAccount(queryAccount) // corroboramos que la cuenta existe para manejar el error, la busca tanto por alias como por nro al pasarle la constante queryAccount.
        if(!findAccount) return res.status(404).json({status: "Error", message: "Cuenta no encontrada"}) // Si no encuentra la cuenta por el query que le enviamos, devuelve mensaje de error. 
        const account = await accountServices.depositAccount(queryAccount, amount)
        res.status(200).json({status: "Success", account}) // Devolvemos la cuenta con la información actualizada.
    } catch (error) {
        console.log(`Error: ${error.message}`)
        res.status(500).json({status: "Error", message: "Error interno del servidor"})
    }
})

// Extracciones 

router.put("/extract", passport.authenticate("jwt", {session:true}), async (req, res) => {
    try {
        const {amount, alias, number} = req.body // Desestructuramos del body la información que necesitamos para la extracción.
        const queryAccount = alias ? {alias} : {number} // Para hacer la consulta, si viene el alias se realiza una query con el alias, y sino con el nro. 
        const findAccount = await accountServices.getOneAccount(queryAccount) // Corroboramos que la cuenta existe para manejar el error, la busca tanto por alias como por nro al pasarle la constante queryAccount.
        if(!findAccount) return res.status(404).json({status: "Error", message: "Cuenta no encontrada"}) // Si no encuentra la cuenta por el query que le enviamos, devuelve mensaje de error.
        if(findAccount.balance < amount) return res.status(400).json({status: "Error", message: "Saldo insuficiente"}) // Si el saldo de la cuenta es menor al monto que queremos extraer, devolvemos el mensaje de saldo insuficiente.  
        const account = await accountServices.extractAccount(queryAccount, amount)
        res.status(200).json({status: "Success", account}) // Devolvemos la cuenta con la información actualizada.
    } catch (error) {
        console.log(`Error: ${error.message}`)
        res.status(500).json({status: "Error", message: "Error interno del servidor"})
    }
})

// Transferencias 

router.put("/transfer", passport.authenticate("jwt", {session:true}), async (req, res) => {
    try {
        const {amount, alias, number, description} = req.body // Desestructuramos del body la información que necesitamos para la transferencia.
        const user = req.user // De la sesión me traigo los datos de usuario de la cuenta de origen. 
        const queryAccount = alias ? {alias} : {number} // Para hacer la consulta, si viene el alias se realiza una query con el alias, y sino con el nro (cuenta de destino). 
        const originAccount = await accountServices.getOneAccount({userId: user.id}) // Busco la cuenta de origen mediante el id de la sesión. Acá no usamos el _id porque está tomando el id que viene del token
        const destinationAccount = await accountServices.getOneAccount(queryAccount) // Corroboramos que la cuenta de destino existe para manejar el error, la busca tanto por alias como por nro al pasarle la constante queryAccount.
        if(!destinationAccount || !originAccount) return res.status(404).json({status: "Error", message: "Cuenta no encontrada"}) // Si no encuentra alguna de las cuentas, devuelve mensaje de error.
        if(originAccount.balance < amount) return res.status(400).json({status: "Error", message: "Saldo insuficiente"}) // Si el saldo de la cuenta de origen es menor al monto que queremos transferir, devolvemos el mensaje de saldo insuficiente.  
        const account = await accountServices.transferBalance({alias: originAccount.alias}, queryAccount, amount, description) // Buscamos la cuenta de origen por alias, la cuenta de destino por query, la descripción y el monto que queremos transferir. 
        res.status(200).json({status: "Success", account}) // Devolvemos la cuenta con la información actualizada.
    } catch (error) {
        console.log(`Error: ${error.message}`)
        res.status(500).json({status: "Error", message: "Error interno del servidor"})
    }
})

export default router