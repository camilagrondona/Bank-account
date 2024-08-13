import express from "express"
import handlebars from "express-handlebars"
import session from "express-session"
import cookieParser from "cookie-parser"
import passport from "passport"

import _dirname from "./dirname.js"
import viewRoutes from "./routes/views.routes.js"

import { connectDB } from "./config/mongoDb.config.js"
import apiRoutes from "./routes/index.routes.js"
import {initializePassport} from "./config/passport.config.js"

connectDB()

const PORT = 3001
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.engine("handlebars", handlebars.engine())
app.set("views", _dirname + "/views")
app.set("view engine", "handlebars")
app.use(express.static("public"))

app.use(session({
  secret: "codigoSecreto",
  resave: true,
  saveUninitialized: true
}))

app.use(cookieParser())

app.use(passport.initialize())
app.use(passport.session())

initializePassport() // La importamos después de los middlewares de passport, ya que se lee en cascada 

app.use("/", viewRoutes)

app.use("/api", apiRoutes)

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`)
})
