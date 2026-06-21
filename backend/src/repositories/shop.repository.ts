import { IShop, ShopModel } from "../model/shop.model";

export interface IShopRepository {
    getShopById(id: string): Promise<IShop | null>;
    createShop(shopData: Partial<IShop>): Promise<IShop>;
    getAllShopsOfAUser(userId: string): Promise<IShop[]>;
    getAllShops(): Promise<IShop[]>;
    updateShop(id: string, userId: string, updateData: Partial<IShop>): Promise<IShop | null>;
    deleteShop(id: string): Promise<boolean>;
}

export class ShopRepository implements IShopRepository {
    async getShopById(id: string): Promise<IShop | null> {
        return await ShopModel.findById(id).populate("addressId").populate("categoryId");
    }
    async createShop(shopData: Partial<IShop>): Promise<IShop> {
        const shop = new ShopModel(shopData);
        return await shop.save();
    }
    async getAllShops(): Promise<IShop[]> {
        return await ShopModel.find().populate("addressId").populate("categoryId");
    }
    async getAllShopsOfAUser(userId: string): Promise<IShop[]> {
        return await ShopModel.find({ userId }).populate("addressId").populate("categoryId");
    }
    async updateShop(id: string, userId: string, updateData: Partial<IShop>): Promise<IShop | null> {
        return await ShopModel.findByIdAndUpdate({ _id: id, userId }, updateData, { new: true }).populate("addressId").populate("categoryId");
    }
    async deleteShop(id: string): Promise<boolean> {
        return await ShopModel.findByIdAndDelete(id).then(result => result ? true : false);
    }
}