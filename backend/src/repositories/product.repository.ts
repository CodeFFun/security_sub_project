import { IProduct, ProductModel } from "../model/product.model";

export interface IProductRepository {
    createProduct(productData: Partial<IProduct>): Promise<IProduct>;
    getProductById(id: string): Promise<IProduct | null>;
    getProductsByShopId(shopId: string): Promise<IProduct[]>;
    getProductByName(shopId:string, name: string): Promise<IProduct | null>;
    updateProduct(id: string, updateData: Partial<IProduct>): Promise<IProduct | null>;
    deleteProduct(id: string): Promise<boolean>;
}

export class ProductRepository implements IProductRepository {
    async createProduct(productData: Partial<IProduct>): Promise<IProduct> {
        const product = new ProductModel(productData);
        return await product.save();
    }

    async getProductById(id: string): Promise<IProduct | null> {
        const product = await ProductModel.findById(id);
        return product;
    }

    async getProductsByShopId(shopId: string): Promise<IProduct[]> {
        const products = await ProductModel.find({ shopId: shopId }).populate("categoryId");
        return products;
    }

    async getProductByName(shopId:string, name: string): Promise<IProduct | null> {
        const product = await ProductModel.findOne({ shopId:shopId,name: name });
        return product;
    }

    async updateProduct(id: string, updateData: Partial<IProduct>): Promise<IProduct | null> {
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );
        return updatedProduct;
    }

    async deleteProduct(id: string): Promise<boolean> {
        const result = await ProductModel.findByIdAndDelete(id);
        return result ? true : false;
    }
}
