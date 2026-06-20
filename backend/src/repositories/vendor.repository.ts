import { IVendor, VendorModel } from "../model/vendor.model";

export interface IVendorRepository {
    createVendor(vendorData: Partial<IVendor>): Promise<IVendor>;
    getVendorById(id: string): Promise<IVendor | null>;
    getAllVendors(): Promise<IVendor[]>;
    getVendorsByShopId(shopId: string): Promise<IVendor[]>;
    getVendorBySlug(slug: string): Promise<IVendor | null>;
    updateVendor(id: string, updateData: Partial<IVendor>): Promise<IVendor | null>;
    deleteVendor(id: string): Promise<boolean>;
}

export class VendorRepository implements IVendorRepository {
    async createVendor(vendorData: Partial<IVendor>): Promise<IVendor> {
        const vendor = new VendorModel(vendorData);
        return await vendor.save();
    }

    async getVendorById(id: string): Promise<IVendor | null> {
        const vendor = await VendorModel.findById(id);
        return vendor;
    }

    async getAllVendors(): Promise<IVendor[]> {
        const vendors = await VendorModel.find();
        return vendors;
    }

    async getVendorsByShopId(shopId: string): Promise<IVendor[]> {
        const vendors = await VendorModel.find({ shopId: shopId });
        return vendors;
    }

    async getVendorBySlug(slug: string): Promise<IVendor | null> {
        const vendor = await VendorModel.findOne({ slug: slug });
        return vendor;
    }

    async updateVendor(id: string, updateData: Partial<IVendor>): Promise<IVendor | null> {
        const updatedVendor = await VendorModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );
        return updatedVendor;
    }

    async deleteVendor(id: string): Promise<boolean> {
        const result = await VendorModel.findByIdAndDelete(id);
        return result ? true : false;
    }
}
