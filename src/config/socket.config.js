const { Server } = require('socket.io')
const { productsModel } = require('../models/products.model.js')
const { chatsModel } = require('../models/chat.model.js')

let io

function initSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true
        }
    })

    io.on('connection', async (socket) => {
        console.log('New user connected')

        try {
            const products = await productsModel.find({})
            socket.emit('update-products', products)
        } catch (error) {
            console.error('Error occurred while fetching products:', error)
        }

        socket.on('get-products', async () => {
            try {
                const products = await productsModel.find({});
                socket.emit('update-products', products);
            } catch (error) {
                console.error('Error occurred while fetching products:', error);
            }
        });

        socket.on('add-product', async (product) => {
            try {
                console.log('Adding product:', product) 
                const newProduct = await productsModel.create(product)
                const updatedProducts = await productsModel.find({})
                io.emit('update-products', updatedProducts)
            } catch (error) {
                console.error('Error occurred while adding product:', error)
            }
        })

        socket.on('delete-product', async (productId) => {
            try {
                console.log('Deleting product with ID:', productId)
                const product = await productsModel.findById(productId)
                if (!product) {
                    io.to(socket.id).emit('product-not-found')
                    return
                }
                await productsModel.findByIdAndDelete(productId)
                const updatedProducts = await productsModel.find({})
                io.emit('update-products', updatedProducts)
            } catch (error) {
                console.error('Error occurred while deleting product:', error)
            }
        })

        socket.on('chat message', async (msg) => {
            console.log('Received chat message:', msg) 
            try {
                const newMessage = new chatsModel({ email: msg.user, message: msg.message })
                const savedMessage = await newMessage.save()
                console.log('Saved message:', savedMessage) 
                io.emit('chat message', msg)
            } catch (error) {
                console.error('Error occurred while saving message:', error)
            }
        })

        socket.on('disconnect', () => {
            console.log('User disconnected')
        })
    })
}

function getIO() {
    if (!io) {
        throw new Error('Socket.io not initialized')
    }
    return io
}

module.exports = { initSocket, getIO }
