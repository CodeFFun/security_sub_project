import { ShopService } from "../services/shop.service";
import { CreateShopDTO, UpdateShopDTO } from "../dtos/shop.dtos";
import { Request, Response } from "express";
import z from "zod";

let shopService = new ShopService();

export class ShopController {
    async getShopById(req: Request, res: Response) {
        try {
            const shopId = req.params.id;
            const shop = await shopService.getShopById(shopId);
            return res.status(200).json(
                { success: true, message: "Shop retrieved", data: shop }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    async getAllShopsOfAUser(req: Request, res: Response) {
        try {
            const userId = req.user?._id;
            if(!userId){
                return res.status(400).json(
                    { success: false, message: "User ID is required" }
                );
            }
            const shops = await shopService.getAllShopsOfAUser(userId);
            return res.status(200).json(
                { success: true, message: "Shops retrieved", data: shops }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    async createShop(req: Request, res: Response) {
        try {
            const userId = req.user?._id;
            if (!userId) {
                return res.status(400).json(
                    { success: false, message: "User ID not found in request" }
                );
            }
            let {accepts_subscription} = req.body;
            if(accepts_subscription === 'true' || accepts_subscription === true){
                accepts_subscription = true;
            }else{
                accepts_subscription = false;
            }
            req.body.accepts_subscription = accepts_subscription;
            const parsedData = CreateShopDTO.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json(
                    { success: false, message: z.prettifyError(parsedData.error) }
                );
            }
            if(req.file){
                parsedData.data.shop_banner = `/uploads/${req.file.filename}`;;
            }
            parsedData.data.userId = userId;
            const newShop = await shopService.createShop(parsedData.data);
            return res.status(201).json(
                { success: true, message: "Shop created", data: newShop }
            );
        } catch (error: Error | any) {
            console.error('CREATE SHOP ERROR:', error);
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    async getAllShops(req: Request, res: Response) {
        try {
            const shops = await shopService.getAllShops();
            return res.status(200).json(
                { success: true, message: "Shops retrieved", data: shops }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    async updateShop(req: Request, res: Response) {
        try {
            const shopId = req.params.id;
            const userId = req.user?._id;
            if (!userId) {
                return res.status(400).json(
                    { success: false, message: "User ID not found in request" }
                );
            }
            let {accepts_subscription} = req.body;
            if(accepts_subscription === 'true' || accepts_subscription === true){
                accepts_subscription = true;
            }else{
                accepts_subscription = false;
            }
            req.body.accepts_subscription = accepts_subscription;
            const parsedData = UpdateShopDTO.safeParse(req.body);
            if (!parsedData.success) {
                console.log(z.prettifyError(parsedData.error))
                return res.status(400).json(
                    { success: false, message: z.prettifyError(parsedData.error) }
                );
            }
            if(req.file){
                parsedData.data.shop_banner = `/uploads/${req.file.filename}`;;
            }
            const updatedShop = await shopService.updateShop(shopId, userId, parsedData.data);
            return res.status(200).json(
                { success: true, message: "Shop updated", data: updatedShop }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }
    async deleteShop(req: Request, res: Response) {
        try {
            const shopId = req.params.id;
            const isDeleted = await shopService.deleteShop(shopId);
            return res.status(200).json(
                { success: true, message: "Shop deleted", data: isDeleted }
            );
        }
        catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }
}