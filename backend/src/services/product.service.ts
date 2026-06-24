import { HttpError } from "../errors/http-error";
import { IProduct } from "../model/product.model";
import { ProductRepository } from "../repositories/product.repository";

const productRepo = new ProductRepository();

export class ProductService{
    async createProduct(productData: Partial<IProduct>){
        return await productRepo.createProduct(productData);
    };
    async getProductById(id: string){
        if(!id) return new HttpError(400, "Product Id is Required");
        return await productRepo.getProductById(id);
    };
    async getProductsByShopId(shopId: string){
        if(!shopId) return new HttpError(400, "Shop Id is Required");
        return await productRepo.getProductsByShopId(shopId);
    }
    async getProductByName(shopId:string,name: string){
        if(!shopId) return new HttpError(400, "Shop Id is Required");
        return await productRepo.getProductByName(shopId, name);
    }
    async updateProduct(id: string, updateData: Partial<IProduct>){
        if(!id) return new HttpError(400, "Product Id is Required");
        return await productRepo.updateProduct(id, updateData);
    }
    async deleteProduct(id: string){
        if(!id) return new HttpError(400, "Product Id is Required");
        return await productRepo.deleteProduct(id);
    }
}

