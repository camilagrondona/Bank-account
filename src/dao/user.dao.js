import { userModel } from "./models/user.model.js"

const getAll = async (query) => {
    return await userModel.find(query)
} // Si no viene nada en la query, trae todo sin filtrar

const getOne = async (query) => {
    return await userModel.findOne(query) 
} // query - ej: {name: "Luis"}

const create = async (data) => {
    return await userModel.create(data)
} // Le pasamos la data que recibimos

const update = async (id, data) => {
    return await userModel.findByIdAndUpdate(id, data, {new: true})
} // 1er parámetro filtro de busqueda (id) - 2do la data que le vamos a insertar en el modelo, lo que vamos a modificar - 3ro nos devuelve la info / el valor actualizada/o

const deleteOne = async (id) => {
    return await userModel.deleteOne({_id: id})
}

export default {
    getAll,
    getOne,
    create, 
    update,
    deleteOne
}