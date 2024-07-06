const ProductDao = require('../dao/MONGO/productsDao.Mongo.js') 
const ProductsRepository = require('../repositories/product.repository.js')
const CartsDao = require('../dao/MONGO/cartDao.Mongo.js')
const CartsRepository = require('../repositories/cart.repository.js')

const productService = new ProductsRepository(new ProductDao())
const cartService = new CartsRepository(new CartsDao())

module.exports = {
    productService,
    cartService,
    usersModel: require('../models/users.model.js') 
}
