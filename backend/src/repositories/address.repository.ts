import { IAddress, AddressModel } from "../model/address.model";

export interface IAddressRepository {
    getAddressById(id: string): Promise<IAddress | null>;
    createAddress(addressData: Partial<IAddress>): Promise<IAddress>;
    getAllAddressesOfAUser(userId: string): Promise<IAddress[]>;
    updateAddress(id: string, userId: string, updateData: Partial<IAddress>): Promise<IAddress | null>;
    deleteAddress(id: string): Promise<boolean>;
}

export class AddressRepository implements IAddressRepository {
    async getAddressById(id: string): Promise<IAddress | null> {
        const address = await AddressModel.findById(id);
        return address;
    }
    async createAddress(addressData: Partial<IAddress>): Promise<IAddress> {
        const address = new AddressModel(addressData);
        return await address.save();
    }
    async getAllAddressesOfAUser(userId: string): Promise<IAddress[]> {
        return await AddressModel.find({ userId });
    }
    async updateAddress(id: string, userId: string, updateData: Partial<IAddress>): Promise<IAddress | null> {
        const updateAddress = AddressModel.findByIdAndUpdate(
            {_id: id, userId}, updateData, { new: true }
        );
        return updateAddress;
    }
    async deleteAddress(id: string): Promise<boolean> {
        return await AddressModel.findByIdAndDelete(id).then(result => result ? true : false);
    }
}