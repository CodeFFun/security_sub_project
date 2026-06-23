import { CreateShopCategoryDTO, UpdateShopCategoryDTO } from "../dtos/shop-category.dtos";
import { ShopCategoryRepository } from "../repositories/shop-category.repository";
import { HttpError } from "../errors/http-error";

let shopCategoryRepository = new ShopCategoryRepository();

export class ShopCategoryService {
    async createShopCategory(data: CreateShopCategoryDTO) {
        const newCategory = await shopCategoryRepository.createShopCategory(data);
        return newCategory;
    }

    async getShopCategoryById(id: string) {
        if (!id) {
            throw new HttpError(400, "Category ID is required");
        }
        const category = await shopCategoryRepository.getShopCategoryById(id);
        if (!category) {
            throw new HttpError(404, "Shop category not found");
        }
        return category;
    }

    async getAllShopCategories() {
        const categories = await shopCategoryRepository.getAllShopCategories();
        return categories;
    }

    async updateShopCategory(id: string, updateData: UpdateShopCategoryDTO) {
        if (!id) {
            throw new HttpError(400, "Category ID is required");
        }
        const updatedCategory = await shopCategoryRepository.updateShopCategory(id, updateData);
        if (!updatedCategory) {
            throw new HttpError(404, "Shop category not found");
        }
        return updatedCategory;
    }

    async deleteShopCategory(id: string) {
        if (!id) {
            throw new HttpError(400, "Category ID is required");
        }
        const isDeleted = await shopCategoryRepository.deleteShopCategory(id);
        if (!isDeleted) {
            throw new HttpError(404, "Shop category not found");
        }
        return isDeleted;
    }
}
