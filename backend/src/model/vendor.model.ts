import mongoose, { Document, Schema } from "mongoose";
import { VendorType } from "../types/vendor.type";

const VendorSchema: Schema = new Schema<VendorType>(
    {
        fullName: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String },
        verified: { type: Boolean, default: false },
        timezone: { type: String },
        shopId: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
    },
    {
        timestamps: true,
    }
);

export interface IVendor extends VendorType, Document {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export const VendorModel = mongoose.model<IVendor>("Vendor", VendorSchema);
