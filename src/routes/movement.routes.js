import { Router } from "express"
import movementDao from "../dao/movement.dao.js"

const router = Router()

router.get("/user/:uid", async (req, res) => {
    try {
        const {uid} = req.params // Extramos el user id por parámetro
        const movements = await movementDao.getAll({userId: uid}) // Traemos todos los movimientos que coincidan con el userId, es decir, que pertenezcan a ese usuario
        res.status(200).json({status: "Success", movements}) // Damos la respuesta y mostramos los movimientos
    } catch (error) {
        console.log(`Error: ${error.message}`)
        res.status(500).json({status: "Error", message: "Error interno del servidor"})
    }
})

export default router 