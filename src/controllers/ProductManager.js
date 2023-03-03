import {promises as fs} from "fs";
import { nanoid } from "nanoid";

class ProductManager {
    constructor() {
        this.path = "./src/models/products.json";
    };

    readProducts = async () => {
        let products = await fs.readFile(this.path, "utf-8");
        return JSON.parse(products);
    };

    writeProducts = async (product) => {
        await fs.writeFile(this.path, JSON.stringify(product));
    };

    exist = async (id) => {
        let products = await this.readProducts();
        return products.find(prod => prod.id === id);
    };

    addProducts = async (product) => {
        let oldProducts = await this.readProducts();
        product.id = nanoid();
        let allProducts = [...oldProducts, product];
        await this.writeProducts(allProducts);
        return "Added raquet";
    };

    getProducts = async () => {
        return await this.readProducts();
    };

    getProductsById = async (id) => {
        let productById = await this.exist(id);
        if (!productById) return "Raquet not found";
        return productById;
    };

    productUpdate = async (id, product) => {
        let productById = await this.exist(id);
        if (!productById) return "Raquet not found";
        await this.deleteProducts(id);
        let oldProduct = await this.readProducts();
        let products = [{...product, id : id}, ...oldProduct];
        await this.writeProducts(products);
        return "Updated raquet";
    };

    deleteProducts = async (id) => {
        let products = await this.readProducts();
        let existingProduct = products.some(prod => prod.id === id);
        if (existingProduct) {
            let eraseProduct = products.filter(prod => prod.id != id);
            await this.writeProducts(eraseProduct);
            return "Removed raquet";
        };
        return "The raquet you want to remove does not exist";
    };
};

export default ProductManager;