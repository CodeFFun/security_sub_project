import { ProductCategoryService } from "../services/product-category.service";
import { CreateProductCategoryDTO, UpdateProductCategoryDTO } from "../dtos/product-category.dtos";
import { Request, Response } from "express";
import z from "zod";

let productCategoryService = new ProductCategoryService();

export class ProductCategoryController {
    async createProductCategory(req: Request, res: Response) {
        try {
            const parsedData = CreateProductCategoryDTO.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json({
                    success: false,
                    message: z.prettifyError(parsedData.error)
                });
            }
            const newCategory = await productCategoryService.createProductCategory(parsedData.data);
            return res.status(201).json({
                success: true,
                message: "Product category created",
                data: newCategory
            });
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }

    async getProductCategoryById(req: Request, res: Response) {
        try {
            const categoryId = req.params.id;
            const category = await productCategoryService.getProductCategoryById(categoryId);
            return res.status(200).json({
                success: true,
                message: "Product category retrieved",
                data: category
            });
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }

    async getAllProductCategories(req: Request, res: Response) {
        try {
            const shopId = req.params.shopId as string;
            const categories = await productCategoryService.getAllProductCategories();
            return res.status(200).json({
                success: true,
                message: "Product categories retrieved",
                data: categories
            });
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }

    async getAllProductCategoriesByShopId(req: Request, res: Response) {
        try {            
            const shopId = req.params.shopId as string;
            const categories = await productCategoryService.getAllProductCategoriesByShopId(shopId);
            return res.status(200).json({
                success: true,
                message: "Product categories retrieved",
                data: categories
            });
        }
        catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }

    async updateProductCategory(req: Request, res: Response) {
        try {
            const categoryId = req.params.id;
            const parsedData = UpdateProductCategoryDTO.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json({
                    success: false,
                    message: z.prettifyError(parsedData.error)
                });
            }
            const updatedCategory = await productCategoryService.updateProductCategory(categoryId, parsedData.data);
            return res.status(200).json({
                success: true,
                message: "Product category updated",
                data: updatedCategory
            });
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }

    async deleteProductCategory(req: Request, res: Response) {
        try {
            const categoryId = req.params.id;
            await productCategoryService.deleteProductCategory(categoryId);
            return res.status(200).json({
                success: true,
                message: "Product category deleted"
            });
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }
}
