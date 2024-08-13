import userDao from "../dao/user.dao.js"

const registerUser = async (userData) => {
    return await userDao.create(userData)
}

const getOneUser = async (query) => {
    return await userDao.getOne(query)
}

export default { registerUser, getOneUser }