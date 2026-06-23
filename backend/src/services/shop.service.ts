import { CreateShopDTO, UpdateShopDTO } from "../dtos/shop.dtos";
import { ShopRepository } from "../repositories/shop.repository";
import { HttpError } from "../errors/http-error";

let shopRepository = new ShopRepository();

export class ShopService {
    async getShopById(id: string) {
        const shop = await shopRepository.getShopById(id);
        if (!shop) {
            throw new HttpError(404, "Shop not found");
        }
        return shop;
    }

    async getAllShopsOfAUser(userId: string) {
        if(!userId){
            throw new HttpError(400, "User ID is required");
        }
        const shops = await shopRepository.getAllShopsOfAUser(userId);
        return shops;
    }
    
    async createShop(shopData: Partial<CreateShopDTO>) {
        const newShop = await shopRepository.createShop(shopData);
        return newShop;
    }

    async getAllShops() {
        const shops = await shopRepository.getAllShops();
        return shops;
    }
    
    async updateShop(id: string, userId: string, updateData: Partial<UpdateShopDTO>) {
        if(!id){
            throw new HttpError(400, "Shop ID not found");
        }
        if(!userId){
            throw new HttpError(400, "User ID is required");
        }
        const updatedShop = await shopRepository.updateShop(id,userId, updateData);
        if (!updatedShop) {
            throw new HttpError(404, "Shop not found or you don't have permission to update it");
        }
        return updatedShop;
    }
    async deleteShop(id: string) {
        if(!id){
            throw new HttpError(400, "Shop ID not found");
        }
        const isDeleted = await shopRepository.deleteShop(id);
        if (!isDeleted) {
            throw new HttpError(404, "Shop not found");
        }
        return isDeleted;
    }
}