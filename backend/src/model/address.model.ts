import mongoose, { Document, Schema } from "mongoose";
import { AddressType } from "../types/address.type";



const AddressSchema: Schema = new Schema<AddressType>(
    {
        label: { type: String, required: true },
        line1: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        lat: { type: Number },
        lng: { type: Number },
        is_default: { type: Boolean, default: false },
        userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    },
    {
        timestamps: true,
    }
);

export interface IAddress extends AddressType, Document {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export const AddressModel = mongoose.model<IAddress>("Address", AddressSchema);
