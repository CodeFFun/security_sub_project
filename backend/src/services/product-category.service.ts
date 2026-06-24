import { CreateProductCategoryDTO, UpdateProductCategoryDTO } from "../dtos/product-category.dtos";
import { ProductCategoryRepository } from "../repositories/product-category.repository";
import { HttpError } from "../errors/http-error";

let productCategoryRepository = new ProductCategoryRepository();

export class ProductCategoryService {
    async createProductCategory(data: CreateProductCategoryDTO) {
        const newCategory = await productCategoryRepository.createProductCategory(data);
        return newCategory;
    }

    async getProductCategoryById(id: string) {
        if (!id) {
            throw new HttpError(400, "Category ID is required");
        }
        const category = await productCategoryRepository.getProductCategoryById(id);
        if (!category) {
            throw new HttpError(404, "Product category not found");
        }
        return category;
    }

    async getAllProductCategories() {
        const categories = await productCategoryRepository.getAllProductCategories();
        return categories;
    }

    async getAllProductCategoriesByShopId(shopId: string) {
        if (!shopId) {
            throw new HttpError(400, "Shop ID is required");
        }
        const categories = await productCategoryRepository.getAllProductCategoriesByShopId(shopId);
        return categories;
    }

    async updateProductCategory(id: string, updateData: UpdateProductCategoryDTO) {
        if (!id) {
            throw new HttpError(400, "Category ID is required");
        }
        const updatedCategory = await productCategoryRepository.updateProductCategory(id, updateData);
        if (!updatedCategory) {
            throw new HttpError(404, "Product category not found");
        }
        return updatedCategory;
    }

    async deleteProductCategory(id: string) {
        if (!id) {
            throw new HttpError(400, "Category ID is required");
        }
        const isDeleted = await productCategoryRepository.deleteProductCategory(id);
        if (!isDeleted) {
            throw new HttpError(404, "Product category not found");
        }
        return isDeleted;
    }
}
