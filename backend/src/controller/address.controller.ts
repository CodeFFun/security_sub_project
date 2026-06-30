import { AddressService } from "../services/address.service";
import { CreateAddressDTO, UpdateAddressDTO } from "../dtos/address.dto";
import { Request, Response } from "express";
import z from "zod";

let addressService = new AddressService();

export class AddressController {
    async createAddress(req: Request, res: Response) {
        try{
            const userId = req.user?._id;
            if (!userId) {
                return res.status(401).json(
                    { success: false, message: "Unauthorized" }
                );
            }
            const parsedData = CreateAddressDTO.safeParse(req.body); 
            if (!parsedData.success) { 
                return res.status(400).json(
                    { success: false, message: z.prettifyError(parsedData.error) }
                )
            }
            const addressData: Partial<CreateAddressDTO> = parsedData.data;
            const newAddress = await addressService.createAddress(addressData, userId);
            return res.status(201).json(
                { success: true, message: "Address Created", data: newAddress }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    async getAllAddressesOfAUser(req: Request, res: Response) {
        try{
            const userId = req.user?._id;
            if (!userId) {
                return res.status(401).json(
                    { success: false, message: "Unauthorized" }
                );
            }
            const addresses = await addressService.getAllAddressesOfAUser(userId);
            return res.status(200).json(
                { success: true, message: "Addresses retrieved", data: addresses }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    async getAddressById(req: Request, res: Response) {
        try{
            const addressId = req.params.id;
            const address = await addressService.getAddressById(addressId);
            return res.status(200).json(
                { success: true, message: "Address retrieved", data: address }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    async updateAddress(req: Request, res: Response) {
        try{
            const userId = req.user?._id;
            if (!userId) {
                return res.status(401).json(
                    { success: false, message: "Unauthorized" }
                );
            }
            const addressId = req.params.id;
            const parsedData = UpdateAddressDTO.safeParse(req.body);
            if (!parsedData.success) { 
                return res.status(400).json(
                    { success: false, message: z.prettifyError(parsedData.error) }
                )
            }
            const updateData: Partial<UpdateAddressDTO> = parsedData.data;
            const updatedAddress = await addressService.updateAddress(addressId, userId, updateData);
            return res.status(200).json(
                { success: true, message: "Address updated", data: updatedAddress }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }
    async deleteAddress(req: Request, res: Response) {
        try{
            const addressId = req.params.id;
            const isDeleted = await addressService.deleteAddress(addressId);
            return res.status(200).json(
                { success: true, message: "Address deleted", data: isDeleted }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }
}