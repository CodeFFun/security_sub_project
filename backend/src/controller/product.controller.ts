import { ProductService } from "../services/product.service";
import { CreateProductDTO, UpdateProductDTO } from "../dtos/product.dtos";
import { Request, Response } from "express";
import z, { success } from "zod"
import { Types } from "mongoose";

const productService = new ProductService()

export class ProductController{
    async createProduct(req:Request, res:Response){
        try{
            const shopId = req.params.shopId;
            if(!shopId){
                return res.status(404).json(
                    { success: false, message: "Shop Id is Required" }
                );
            }
            const parseedData = CreateProductDTO.safeParse(req.body);
            if(!parseedData.success){
                console.log(z.prettifyError(parseedData.error))
                return res.status(400).json(
                    { success: false, message: z.prettifyError(parseedData.error) }
                );
            }
            const productData: Partial<CreateProductDTO> = parseedData.data;
            productData.shopId = shopId as unknown as Types.ObjectId;
            const newProduct = await productService.createProduct(productData);
            return res.status(201).json(
                { success: true, message: "Product Created", data: newProduct }
            );

        }catch(e: Error | any){
            return res.status(e.statusCode ?? 500).json(
                { success: false, message: e.message || "Internal Server Error" }
            );
        }
    }

    async getProductById(req:Request, res:Response){
        try {
            const productId = req.params.productId;
            if(!productId){
                return res.status(404).json(
                    { success: false, message: "Shop Id is Required" }
                );
            }
            const product = await productService.getProductById(productId);
            if(!product){
                return res.status(404).json({
                    success:false, message:"Product Not Found"
                })
            }
            return res.status(200).json(
                { success: true, message: "Product Found", data: product }
            );

        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    async getProductsByShopId(req:Request, res:Response){
        try {
            const shopId = req.params.shopId;
            if(!shopId){
                return res.status(404).json(
                    { success: false, message: "Shop Id is Required" }
                );
            }
            const products = await productService.getProductsByShopId(shopId);
            return res.status(200).json(
                { success: true, message: "Products Retrieved", data: products }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    async getProductByName(req:Request, res:Response){
        try {
            const shopId = req.params.shopId;
            const name = req.query.name as string;
            if(!shopId){
                return res.status(404).json(
                    { success: false, message: "Shop Id is Required" }
                );
            }
            const product = await productService.getProductByName(shopId, name);
            if(!product){
                return res.status(404).json({
                    success:false, message:"Product Not Found"
                })
            }
            return res.status(200).json(
                { success: true, message: "Product Found", data: product }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    async updateProduct(req:Request, res:Response){
        try{
            const productId = req.params.productId;
            if(!productId){
                return res.status(404).json(
                    { success: false, message: "Product Id is Required" }
                );
            }
            const parsedData = UpdateProductDTO.safeParse(req.body);
            if(!parsedData.success){
                return res.status(400).json(
                    { success: false, message: z.prettifyError(parsedData.error) }
                );
            }
            const updateData: Partial<UpdateProductDTO> = parsedData.data;
            const updatedProduct = await productService.updateProduct(productId, updateData);
            return res.status(200).json(
                { success: true, message: "Product Updated", data: updatedProduct }
            );
        }catch(e: Error | any){
            return res.status(e.statusCode ?? 500).json(
                { success: false, message: e.message || "Internal Server Error" }
            );
        }
    }

    async deleteProduct(req:Request, res:Response){
        try{
            const productId = req.params.productId;
            if(!productId){
                return res.status(404).json(
                    { success: false, message: "Product Id is Required" }
                );
            }
            await productService.deleteProduct(productId);
            return res.status(200).json(
                { success: true, message: "Product Deleted" }
            );
        }catch(e: Error | any){
            return res.status(e.statusCode ?? 500).json(
                { success: false, message: e.message || "Internal Server Error" }
            );
        }
    }
}