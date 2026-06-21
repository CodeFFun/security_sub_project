import { IProductCategory, ProductCategoryModel } from "../model/product-category";

export interface IProductCategoryRepository {
    createProductCategory(data: Partial<IProductCategory>): Promise<IProductCategory>;
    getProductCategoryById(id: string): Promise<IProductCategory | null>;
    getAllProductCategories(): Promise<IProductCategory[]>;
    getAllProductCategoriesByShopId(shopId: string): Promise<IProductCategory[]>;
    updateProductCategory(id: string, updateData: Partial<IProductCategory>): Promise<IProductCategory | null>;
    deleteProductCategory(id: string): Promise<boolean>;
}

export class ProductCategoryRepository implements IProductCategoryRepository {
    async createProductCategory(data: Partial<IProductCategory>): Promise<IProductCategory> {
        const category = new ProductCategoryModel(data);
        return await category.save();
    }

    async getProductCategoryById(id: string): Promise<IProductCategory | null> {
        return await ProductCategoryModel.findById(id).populate('shopId');
    }

    async getAllProductCategories(): Promise<IProductCategory[]> {
        return await ProductCategoryModel.find().populate('shopId');
    }

    async getAllProductCategoriesByShopId(shopId: string): Promise<IProductCategory[]> {
        return await ProductCategoryModel.find({ shopId }).populate('shopId');
    }

    async updateProductCategory(id: string, updateData: Partial<IProductCategory>): Promise<IProductCategory | null> {
        return await ProductCategoryModel.findByIdAndUpdate(id, updateData, { new: true }).populate('shopId');
    }

    async deleteProductCategory(id: string): Promise<boolean> {
        const result = await ProductCategoryModel.findByIdAndDelete(id);
        return result ? true : false;
    }
}
