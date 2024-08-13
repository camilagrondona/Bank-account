import { Router } from "express"
import passport from "passport"
import { createToken } from "../utils/jwt.js"
import { checkLogin } from "../middlewares/checkLogin.middleware.js"

const router = Router()

// Registro de usuario 

router.post("/register", passport.authenticate("register"), async (req, res) => {
    try {
        res.status(201).json({ status: "Success", user: req.user }) // el user es el que se guarda en la sesión 
    } catch (error) {
        console.log(`Error: ${error.message}`)
        res.status(500).json({ status: "Error", message: "Error interno del servidor" })
    }
})

// Login (Inicio de sesión)

router.post("/login", checkLogin, passport.authenticate("login", {session: false}), async (req, res) => {
    try {
        const token = createToken(req.user) // Creamos el token y le pasamos la sesión de usuario. 
        res.cookie("token", token, {httpOnly:true}) // Guardamos el token en una cookie. 1er parametro: nombre de la cookie (token) // 2do parámetro: pasamos la info del token // 3er parámetro: a la cookie solo se puede acceder con una petición http
        res.status(200).json({status: "Success", user: req.user}) // el user es el que se guarda en la sesión 
    } catch (error) {
        console.log(`Error: ${error.message}`)
        res.status(500).json({status: "Error", message: "Error interno del servidor"})
    }
})


export default router