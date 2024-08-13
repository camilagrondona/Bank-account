import { request, response } from "express"
import joi from "joi"

export const checkLogin = async (req = request, res = response, next) => {
    try {
        const schema = joi.object({
            email: joi.string().email().required().messages({
                "string.email": "El email debe ser válido",
                "any.required": "El email es obligatorio"
            }), // Validamos las propiedades de los distintos objetos. En este caso le decimos que el mail debe ser un string, de tipo email y que es obligatorio. 
            password: joi.string().min(3).required().messages({
                "string.min": "La contraseña debe tener al menos 3 caracteres",
                "any.required": "La contraseña es obligatoria"
            }), // Mínimo de 3 caracteres 
        })
        const {error} = schema.validate(req.body) // Del schema que acabo de crear, valida los datos que recibimos en el body. 
        if(error) {
            return res.status(400).json({error: error.details[0].message}) // Si hay un error, pasamos el detalle del error por mesaje (en la posición 0 porque queremos que nos muestre el primer valor)
        }
        next() // Si pasa las validaciones, continúa con el login
    } catch (error) {
        console.log(`Error: ${error.message}`)
        res.status(500).json({status: "Error", message: "Error interno del servidor"})
    }
}