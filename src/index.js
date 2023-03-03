import express from "express";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/carts.routes.js";
import fileDirName from "./utils/fileDirName.js";

const app = express();
const Port = 8080;
const { __dirname } = fileDirName(import.meta)

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use(express.static(__dirname + '/public'));

app.listen(Port, () => {
    console.log(`Santi's Server ${Port}`);
});