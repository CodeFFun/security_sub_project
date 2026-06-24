import { AddressRepository } from "../repositories/address.repository";
import { HttpError } from "../errors/http-error";
import { CreateAddressDTO, UpdateAddressDTO } from "../dtos/address.dto";
import { Types } from "mongoose";

let addressRepository = new AddressRepository();

export class AddressService {
    async getAddressById(id: string) {
        const address = await addressRepository.getAddressById(id);
        if (!address) {
            throw new HttpError(404, "Address not found");
        }
        return address;
    }

    async createAddress(addressData: Partial<CreateAddressDTO>, userId: Types.ObjectId) {
        const newAddress = await addressRepository.createAddress({ ...addressData, userId });
        return newAddress;
    }

    async getAllAddressesOfAUser(userId: string) {
        if(!userId){
            throw new HttpError(400, "User ID is required");
        }
        const addresses = await addressRepository.getAllAddressesOfAUser(userId);
        return addresses;
    }

    async updateAddress(id: string, userId: string, updateData: Partial<UpdateAddressDTO>) {
        if(!id){
            throw new HttpError(400, "Address ID not found");
        }
        if(!userId){
            throw new HttpError(400, "User ID is required");
        }
        const updatedAddress = await addressRepository.updateAddress(id, userId, updateData);
        if (!updatedAddress) {
            throw new HttpError(404, "Address not found or you don't have permission to update it");
        }
        return updatedAddress;
    }

    async deleteAddress(id: string) {
        if(!id){
            throw new HttpError(400, "Address ID not found");
        }
        const isDeleted = await addressRepository.deleteAddress(id);
        if (!isDeleted) {
            throw new HttpError(404, "Address not found");
        }
        return isDeleted;
    }

}