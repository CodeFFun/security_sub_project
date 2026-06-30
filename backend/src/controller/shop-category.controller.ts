import { ShopCategoryService } from "../services/shop-category.service";
import { CreateShopCategoryDTO, UpdateShopCategoryDTO } from "../dtos/shop-category.dtos";
import { Request, Response } from "express";
import z from "zod";

let shopCategoryService = new ShopCategoryService();

export class ShopCategoryController {
    async createShopCategory(req: Request, res: Response) {
        try {
            const parsedData = CreateShopCategoryDTO.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json({
                    success: false,
                    message: z.prettifyError(parsedData.error)
                });
            }
            const newCategory = await shopCategoryService.createShopCategory(parsedData.data);
            return res.status(201).json({
                success: true,
                message: "Shop category created",
                data: newCategory
            });
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }

    async getShopCategoryById(req: Request, res: Response) {
        try {
            const categoryId = req.params.id;
            const category = await shopCategoryService.getShopCategoryById(categoryId);
            return res.status(200).json({
                success: true,
                message: "Shop category retrieved",
                data: category
            });
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }

    async getAllShopCategories(req: Request, res: Response) {
        try {
            const categories = await shopCategoryService.getAllShopCategories();
            return res.status(200).json({
                success: true,
                message: "Shop categories retrieved",
                data: categories
            });
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }

    async updateShopCategory(req: Request, res: Response) {
        try {
            const categoryId = req.params.id;
            const parsedData = UpdateShopCategoryDTO.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json({
                    success: false,
                    message: z.prettifyError(parsedData.error)
                });
            }
            const updatedCategory = await shopCategoryService.updateShopCategory(categoryId, parsedData.data);
            return res.status(200).json({
                success: true,
                message: "Shop category updated",
                data: updatedCategory
            });
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }

    async deleteShopCategory(req: Request, res: Response) {
        try {
            const categoryId = req.params.id;
            await shopCategoryService.deleteShopCategory(categoryId);
            return res.status(200).json({
                success: true,
                message: "Shop category deleted"
            });
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }
}
