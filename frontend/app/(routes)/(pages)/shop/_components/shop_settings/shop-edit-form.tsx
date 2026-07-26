"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Shop } from "./shop-list";
import { BASE_URL } from "@/lib/api/axios";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface ShopEditFormProps {
  addresses: { _id: string; label: string; line1: string; city: string }[];
  categories: { _id: string; name: string }[];
  shop: Shop | null;
  open: boolean;
  onClose: () => void;
  onSave: (id: string, shop: any) => void;
}

export default function ShopEditForm({
  shop,
  open,
  onClose,
  onSave,
  addresses,
  categories,
}: ShopEditFormProps) {
  const [id, setId] = useState("");
  const [shopName, setShopName] = useState("");
  const [pickupType, setPickupType] = useState("");
  const [subscription, setSubscription] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null | Blob>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    if (shop) {
      setId(shop._id);
      setShopName(shop.name);
      setPickupType(shop.pickup_info);
      setSubscription(shop.accepts_subscription);
      setCoverImage(null);
      setImagePreview(
        shop.shop_banner ? `${BASE_URL}${shop.shop_banner}` : null,
      );
      setSelectedAddress(shop.addressId._id);
      setSelectedCategory(shop.categoryId?._id || "");
    }
  }, [shop]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setCoverImage(null);
    setImagePreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!shopName || !pickupType || !selectedAddress) {
      alert("Please fill in all required fields");
      return;
    }

    const formData: FormData = new FormData();
    formData.append("name", shopName);
    formData.append("pickup_info", pickupType);
    formData.append("accepts_subscription", subscription.toString());
    formData.append("addressId", selectedAddress);
    formData.append("categoryId", selectedCategory);
    if (coverImage instanceof Blob) {
      formData.append("shop_banner", coverImage);
    }
    if (coverImage === null) {
      formData.append("shop_banner", "");
    }
    if (coverImage && typeof coverImage === "string") {
      formData.append("shop_banner", "");
    }
    onSave(id, formData);
    onClose();
  };
  const currentCategory = categories.find(
    (cat) => cat._id === selectedCategory,
  );

  if (!shop) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Shop</DialogTitle>
          <DialogDescription>Update your shop information</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label
              htmlFor="shopName"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Shop Name
            </Label>
            <Input
              id="shopName"
              type="text"
              placeholder="Enter shop name"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Pickup Type */}
          <div>
            <Label
              htmlFor="pickupType"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Pickup Type
            </Label>
            <Select value={pickupType} onValueChange={setPickupType}>
              <SelectTrigger id="pickupType" className="w-full">
                <SelectValue placeholder="Select pickup type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pick Up">Pick Up</SelectItem>
                <SelectItem value="Delivery">Delivery</SelectItem>
                <SelectItem value="Both">Pick Up/Delivery</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Subscription Toggle */}
          <div>
            <Label className="block text-sm font-medium text-foreground mb-3">
              Subscription
            </Label>
            <div className="flex items-center gap-3">
              <Switch
                checked={subscription}
                onCheckedChange={setSubscription}
              />
              <span className="text-sm text-muted-foreground">
                {subscription ? "Yes" : "No"}
              </span>
            </div>
          </div>

          <div>
            <Label className="block text-sm font-medium text-foreground mb-2">
              Cover Image
            </Label>
            <div className="space-y-3">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-border transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="coverImageInput"
                />
                <label
                  htmlFor="coverImageInput"
                  className="cursor-pointer block"
                >
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </label>
              </div>

              {imagePreview && (
                <div className="relative w-fit">
                  <Image
                    unoptimized
                    src={imagePreview || "/placeholder.svg"}
                    alt="Cover preview"
                    className="h-24 w-24 object-cover rounded-lg"
                    width={96}
                    height={96}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:opacity-80"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div>
            <Label
              htmlFor="address"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Address
            </Label>
            <Select value={selectedAddress} onValueChange={setSelectedAddress}>
              <SelectTrigger id="address" className="w-full">
                <SelectValue placeholder="Select an address" />
              </SelectTrigger>
              <SelectContent>
                {addresses.map((address) => (
                  <SelectItem key={address._id} value={address._id}>
                    <p className="font-bold">{address.label}</p>
                    {address.line1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Badge className="bg-accent/10 text-accent flex items-center gap-2 w-fit">
              {currentCategory?.name || "No Category Selected"}

              {selectedCategory && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory("")}
                  className="ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </Badge>
          </div>

          <div>
            <Label className="block text-sm font-medium text-foreground mb-2">
              Category
            </Label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    <p className="font-bold">{category.name}</p>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-accent hover:opacity-90 text-accent-foreground"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
