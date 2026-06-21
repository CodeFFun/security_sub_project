import { IShopCategory, ShopCategoryModel } from "../model/shop-category.model";

export interface IShopCategoryRepository {
    createShopCategory(data: Partial<IShopCategory>): Promise<IShopCategory>;
    getShopCategoryById(id: string): Promise<IShopCategory | null>;
    getAllShopCategories(): Promise<IShopCategory[]>;
    updateShopCategory(id: string, updateData: Partial<IShopCategory>): Promise<IShopCategory | null>;
    deleteShopCategory(id: string): Promise<boolean>;
}

export class ShopCategoryRepository implements IShopCategoryRepository {
    async createShopCategory(data: Partial<IShopCategory>): Promise<IShopCategory> {
        const category = new ShopCategoryModel(data);
        return await category.save();
    }

    async getShopCategoryById(id: string): Promise<IShopCategory | null> {
        return await ShopCategoryModel.findById(id);
    }

    async getAllShopCategories(): Promise<IShopCategory[]> {
        return await ShopCategoryModel.find();
    }

    async updateShopCategory(id: string, updateData: Partial<IShopCategory>): Promise<IShopCategory | null> {
        return await ShopCategoryModel.findByIdAndUpdate(id, updateData, { new: true });
    }

    async deleteShopCategory(id: string): Promise<boolean> {
        const result = await ShopCategoryModel.findByIdAndDelete(id);
        return result ? true : false;
    }
}
