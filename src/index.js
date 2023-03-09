import express from "express";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/carts.routes.js";
import fileDirName from "./utils/fileDirName.js";
import handlebars from "express-handlebars";
import * as path from "path";
import ProductManager from "./controllers/ProductManager.js";

const app = express();

const { __dirname } = fileDirName(import.meta)
const product = new ProductManager();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));

app.get("/", async (req, res) => {
    const allProducts = await product.getProducts();
    res.render("home", {
        title: "Slam Tennis",
        products: allProducts
    });
});

app.get("/realtimeproducts", async (req, res) => {
    try {
        res.render("realtimeproducts", {
            title: "Realtime Products",
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    };
});

app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use(express.static(__dirname + '/public'));

const Port = 8080;
app.listen(Port, () => {
    console.log(`Santi's Server ${Port}`);
});