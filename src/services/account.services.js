import accountDao from "../dao/account.dao.js"
import movementDao from "../dao/movement.dao.js"

const getOneAccount = async (query) => {
    return await accountDao.getOne(query)
}

const createAccount = async (userData) => {
    // Desestructuramos los datos del usuario que estamos recibiendo del userData (parámetro q recibimos)
    const {name, lastName, _id = null} = userData
    // Creamos un número de cuenta con un número aleatorio 
    const accountNumber = Math.floor(Math.random() * 1000000000)
    // Generamos el alias
    const alias = `${name.toLowerCase()}.${lastName.toLowerCase()}.${accountNumber.toString().slice(-4)}`
    // Objeto con los datos de la cuenta
    const accountData = {
        alias,
        number: accountNumber.toString(), // lo pasamos a string para evitar los problemas de longitud que pueda tener 
        userId: _id // cuando creamos la cuenta el id va a estar como null porque se va a crear después, lo modificamos y ahí lo insertamos. 
    }
    return await accountDao.create(accountData) // creamos la cuenta con la data 
}

// Necesitamos hacer una actualización para que se asocie el userId con la cuenta que creamos

const updateAccount = async (accountId, accountData) => {
    return await accountDao.update(accountId, accountData) // data es la información que vamos a modificar
}

// Depósitos

const depositAccount = async (query, amount) => {
    const account = await accountDao.getOne(query) // Buscamos la cuenta a la que vamos a hacer el depósito por query (puede ser por alias o por nro de cuenta)
    await movementDao.create({amount, type: "deposit", originAccountId: account._id, userId: account.userId}) // Creamos un movimiento nuevo y registramos el monto y tipo de operación, la cuenta de origen y el id del usuario que la realiza. 
    return accountDao.update(account._id, {balance: account.balance + amount}) // actualizamos el saldo de la cuenta por el id, y después le decimos que el saldo actual es el anterior + el monto que estamos depositando
}

// Extracciones 

const extractAccount = async (query, amount) => {
    const account = await accountDao.getOne(query) // Buscamos la cuenta a la que vamos a hacer la extracción por query
    await movementDao.create({amount: amount * -1, type: "extract", originAccountId: account._id, userId: account.userId}) // Creamos un movimiento nuevo y registramos el monto y tipo de operación, la cuenta de origen y el id del usuario que la realiza. El amount así en -1 lo registra en negativo para que reste del saldo. 
    return accountDao.update(account._id, {balance: account.balance - amount}) // actualizamos el saldo de la cuenta por el id, y después le decimos que el saldo actual es el anterior - el monto que estamos extrayendo 
}

// Transferencias

const transferBalance = async (originQuery, destinationQuery, amount, description) => {
    const originAccount = await accountDao.getOne(originQuery) // buscamos la cuenta de origen (usamos originQuery ya que lo va a poder buscar por alias o por nro de cuenta, por eso es una query)
    const destinationAccount = await accountDao.getOne(destinationQuery) // buscamos la cuenta de destino

    // Registro de movimientos

    // Cuenta de origen: 

    await movementDao.create({
        amount: amount * -1,
        type: "transfer",
        userId: originAccount.userId,
        originAccountId: originAccount._id,
        destinationAccountId: destinationAccount._id,
        description
    })

        // Cuenta de destino: 
    
        await movementDao.create({
            amount: amount,
            type: "transfer",
            userId: destinationAccount.userId,
            originAccountId: originAccount._id,
            destinationAccountId: destinationAccount._id,
            description
        })

    const originAccountUpdate = await accountDao.update(originAccount._id, {balance: originAccount.balance - amount}) // actualizamos la información de la cuenta de origen. Primero, asociamos el id de la cuenta y luego actualizamos el saldo restando el valor que hemos transferido 
    const destinationAccountUpdate = await accountDao.update(destinationAccount._id, {balance: destinationAccount.balance + amount}) // igual que el anterior, pero suma el dinero que recibe
    return {originAccountUpdate, destinationAccountUpdate} // Devolvemos las cuentas actualizadas 
}

export default {createAccount, updateAccount, depositAccount, getOneAccount, extractAccount, transferBalance}