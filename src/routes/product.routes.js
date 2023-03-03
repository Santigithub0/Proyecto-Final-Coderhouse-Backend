import { Router } from "express";
import ProductManager from "../controllers/ProductManager.js";
import {uploader} from '../utils/uploader.js';

const productRouter = Router();
const Products = new ProductManager;

function validation(product) {
    const keys = ["title", "description", "price", "thumbnail", "code", "stock"];
    const productKeys = Object.keys(product);

    return(
        keys.every((key) => productKeys.includes(key)) && productKeys.every((key) => keys.includes(key))
    );
};

productRouter.get("/", async (req, res) => {
    const products = await Products.readProducts();
    try {
        if(!products) {
            res.status(404).send({error: 'Product not found'});
        };
        res.status(200).send(await Products.getProducts());
    } catch (error) {
        res.status(500).send({error: 'Something went wrong. Please try later'});
    };
});

productRouter.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const carts = await Products.getProductsById(id);
        if(!carts) {
            res.status(404).send({error: `Cart with id ${id} not found`});
            return;
        };
        res.status(200).send(await Products.getProductsById(id));
    } catch (error) {
        res.status(500).json({error: 'Something went wrong. Please try later'});
    };
});

productRouter.post("/", uploader.single('file'), async (req, res) => {
    const newProduct = req.body;
    const validate = validation(newProduct);
    try {
        if(!validate) {
            res.status(400).send({error: 'Invalid data'});
            return;
        };
        if(!newProduct) {
            res.status(404).send({error: 'Nonexistent product'});
            return;
        };
        res.status(200).send(await Products.addProducts(newProduct));
    } catch (error) {
        res.status(500).send({error: 'Something went wrong. Please try later'});
    };
});

productRouter.put("/:id", async (req, res) => {
    const productUpdate = req.body;
    try {
        const validate = validation(productUpdate);
        if(!validate) res.status(400).send({error: 'Invalid data'});
        const id = req.params.id;
        res.status(200).send(await Products.productUpdate(id, productUpdate));
    } catch (error) {
        res.status(500).json({error: 'Something went wrong. Please try later'});
    };
});

productRouter.delete("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const validate = await Products.getProductsById(id);
        if(!validate) {
            res.status(404).send({error: 'Product not found'});
            return;
        };
        await Products.deleteProducts(id);
        res.status(200).send({message: 'Product deleted'});
    } catch (error) {
        res.status(500).json({error: 'Something went wrong. Please try later'});
    };
});

export default productRouter;