import { Router } from "express";
import CartManager from "../controllers/CartManager.js";

const cartRouter = Router();
const carts = new CartManager;

cartRouter.post("/", async (req, res) => {
    const cart = await carts.addCart();
    if (cart) {
        res.status(200).send({message: 'Cart added'});
    };
    res.status(500).send({error: 'Something went wrong. Please try later'});
});

cartRouter.get("/", async (req, res) => {
    try {
        const cart = await carts.readCarts();
        res.status(200).send(cart);
    } catch (error) {
        res.status(500).send({error: 'Something went wrong. Please try later'});
    };
});

cartRouter.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const cart = await carts.getCartsById(id)
        if (!cart) {
            res.status(404).send({error: 'Cart not found'});
        } else {
            res.status(200).send(cart);
        }
    } catch (error) {
        res.status(500).json({error: 'Something went wrong. Please try later'});
    };
});

cartRouter.post("/:cid/products/:pid", async (req, res) => {
    let cartId = req.params.cid;
    let productId = req.params.pid;
    if (!productId) {
        res.status(404).send({error: 'Product not found'});
    };
    res.status(200).send(await carts.addProductInCart(cartId, productId));
});

export default cartRouter;