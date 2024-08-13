import passport from "passport"
import local from "passport-local"
import jwt from "passport-jwt"
import userServices from "../services/user.services.js"
import accountServices from "../services/account.services.js"
import { createHash, isValidPassword } from "../utils/hashPassword.js"
import { cookieExtractor } from "../utils/cookieExtractor.js"

const LocalStrategy = local.Strategy
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

// Función que inicializa los middlewares de passport donde creamos todas nuestras estrategias

export const initializePassport = () => {
    // Estrategia local de registro
    passport.use(
        "register",
        new LocalStrategy({ passReqToCallback: true, usernameField: "email" },
            async (req, username, password, done) => {
                try {
                    const { name, lastName } = req.body
                    const user = await userServices.getOneUser({ email: username }) // Busco el usuario mediante el email que recibimos en la query, que a su vez es el username de la estrategia local
                    if (user) return done(null, false, { Message: "El usuario ya existe" }) // Manejo del error si ya existe un usuario 

                    // Si no existe el usuario, creamos la cuenta 
                    const accountUser = await accountServices.createAccount({ name, lastName }) // le pasamos los datos del usuario. Como aún no lo hemos creado, no tenemos su id, por eso aún no se lo pasamos.  

                    // Creamos un nuevo usuario
                    const newUser = {
                        name,
                        lastName,
                        email: username,
                        password: createHash(password),
                        account: accountUser._id // acá obtenemos el id 
                    }
                    // Registro de usuario 
                    const createUser = await userServices.registerUser(newUser)

                    // Actualizamos la cuenta 
                    await accountServices.updateAccount(accountUser._id, { userId: createUser._id }) // Necesitamos que la cuenta y el id del usuario queden vinculados, por eso actualizamos la información. 

                    return done(null, createUser)
                } catch (error) {
                    return done(error)
                }
            })
    )

    // Estrategia local de login (inicio de sesión)
    passport.use(
        "login",
        new LocalStrategy({ usernameField: "email" },
            async (username, password, done) => {
                try {
                    const user = await userServices.getOneUser({ email: username }) // Buscamos al usuario para ver si existe por email 
                    if (!user || !isValidPassword(user, password)) return done(null, false, { message: "Usuario o contraseña no válido" }) // Si no existe el usuario o si la contraseña/ el usuario no son correctos, devolvemos el done en null (porque no es error del sistema), un false (porque no le pasamos ningún user) y el mensaje de error. 
                    return done(null, user) // En caso contrario, pasamos el usuario 
                } catch (error) {
                    done(error)
                }
            })
    )

    passport.use(
        "jwt",
        new JWTStrategy(
            {
                jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
                secretOrKey: "codigoSecreto",
            },
            async (jwt_payload, done) => {

                try {
                    return done(null, jwt_payload)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    //Serialización de usuario
    passport.serializeUser((user, done) => {
        done(null, user.id) // Acá no usamos el _id porque está tomando el id que viene del token
    })
    // Deserialización de usuario
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userServices.getOneUser({ _id: id })
            done(null, user)
        } catch (error) {
            done(error)
        }
    })
}

