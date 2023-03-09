import { Server } from "socket.io";
import ProductManager from "../controllers/ProductManager.js";

const filemanager = new ProductManager("./src/models/products.json");

const socketConfiguraton = (httpServer) => {
    const io = new Server(httpServer);

    io.on("connection", async (socket) => {
        console.log(`user connected: ${socket.id}`);

        const products = await filemanager.getData();

        socket.emit("newProduct", products);

        socket.on("addProduct", async (product) => {

            await filemanager.postData(product);

            const products = await filemanager.getData();

            io.sockets.emit("newProduct", products);

            socket.broadcast.emit("newProduct", products);
        });

        socket.on("deleteProduct", async (id) => {

            await filemanager.deleteDataById(id);

            const products = await filemanager.getData();

            io.sockets.emit("newProduct", products);

            socket.broadcast.emit("newProduct", products);
        });
    });
};

export default socketConfiguraton;