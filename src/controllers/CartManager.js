import {promises as fs} from "fs";
import { nanoid } from "nanoid";
import ProductManager from "./ProductManager.js";

const allProducts = new ProductManager;

class CartManager {
    constructor() {
        this.path = "./src/models/carts.json";
    };

    readCarts = async () => {
        let carts = await fs.readFile(this.path, "utf-8");
        return JSON.parse(carts);
    };

    writeCarts = async (cart) => {
        await fs.writeFile(this.path, JSON.stringify(cart));
    };

    exist = async (id) => {
        let carts = await this.readCarts();
        return carts.find(carts => carts.id === id);
    };

    addCart = async () => {
        let oldCarts = await this.readCarts();
        let id = nanoid();
        let cartsConcat = [{id : id, products : []}, ...oldCarts];
        await this.writeCarts(cartsConcat);
        return "Added cart";
    };

    getCartsById = async (id) => {
        let cartById = await this.exist(id);
        if (!cartById) return "Cart not found";
        return cartById;
    };

    addProductInCart = async (cartId, productId) => {
        let cartById = await this.exist(cartId);
        if (!cartById) return "Cart not found";
        let productById = await allProducts.exist(productId);
        if (!productById) return "Raquet not found";

        let allCarts = await this.readCarts();
        let cartFilter = allCarts.filter((cart) => cart.id != cartId);

        if (cartById.products.some((prod) => prod.id === productId)){
            let moreProductInCart = cartById.products.find((prod) => prod.id === productId);
            moreProductInCart.quantity++;
            let cartsConcat = [cartById, ...cartFilter];
            await this.writeCarts(cartsConcat);
            return "Raquet added to cart";
        };

        cartById.products.push({id : productById.id, quantity : 1})

        let cartsConcat = [cartById, ...cartFilter];
        await this.writeCarts(cartsConcat);
        return "New raquet added to cart";
    };
};

export default CartManager;