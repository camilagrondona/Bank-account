import { movementModel } from "./models/movement.model.js"

const getAll = async (query) => {
    return await movementModel.find(query)
} // Si no viene nada en la query, trae todo sin filtrar

const getOne = async (query) => {
    return await movementModel.findOne(query) 
} 

const create = async (data) => {
    return await movementModel.create(data)
} // Le pasamos la data que recibimos

const update = async (id, data) => {
    return await movementModel.findByIdAndUpdate(id, data, {new: true})
} // 1er parámetro filtro de busqueda (id) - 2do la data que le vamos a insertar en el modelo, lo que vamos a modificar - 3ro nos devuelve la info / el valor actualizada/o

const deleteOne = async (id) => {
    return await movementModel.deleteOne({_id: id})
}

export default {
    getAll,
    getOne,
    create, 
    update,
    deleteOne
}