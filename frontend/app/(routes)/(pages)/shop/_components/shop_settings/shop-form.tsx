"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


import { Switch } from "@/components/ui/switch";
import { ChevronDown, X } from "lucide-react";
import Image from "next/image";
import { getAllAddressOfAUser } from "@/lib/api/address";
import { handleCreateShop } from "@/lib/actions/shop-action";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { handleGetAllShopCategory } from "@/lib/actions/shop-category-action";

export default function ShopForm() {
  const [shopName, setShopName] = useState("");
  const [pickupType, setPickupType] = useState("");
  const [subscription, setSubscription] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [addresses, setAddresses] = useState<
    { _id: string; label: string; city: string; line1: string }[]
  >([]);

  const fetchAddresses = async () => {
    try {
      const res = await getAllAddressOfAUser();
      console.log("Fetched addresses:", res);
      if (res.success) {
        setAddresses(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
    }
  };

  const fetchShopCategory = async () => {
    try {
      const res = await handleGetAllShopCategory();
      if(res.success){
        setCategories(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch shop categories:", err);
    }
  };


  useEffect(() => {
    fetchAddresses();
    fetchShopCategory();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setCoverImageFile(file);
    }
  };

   const toggleOption = (value: string) => {
    setSelectedOptions((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
    console.log(selectedOptions);
  };

  const handleRemoveImage = () => {
    setCoverImage(null);
    setCoverImageFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!shopName.trim()) {
      toast.error("Shop name is required");
      return;
    }
    if (!pickupType) {
      toast.error("Please select a pickup type");
      return;
    }
    if (!selectedAddress) {
      toast.error("Please select an address");
      return;
    }

    const formData: FormData = new FormData();
    formData.append("name", shopName);
    formData.append("pickup_info", pickupType);
    formData.append("accepts_subscription", subscription.toString());
    formData.append("addressId", selectedAddress);
    formData.append("categoryId", selectedOptions[0] || "");
    if (coverImageFile) formData.append("shop_banner", coverImageFile);
    const res = await handleCreateShop(formData);
    if (res.success) {
      toast.success("Shop created successfully!");
      setShopName("");
      setPickupType("");
      setSubscription(false);
      setCoverImage(null);
      setCoverImageFile(null);
      setSelectedAddress("");
    } else {
      toast.error(res.message || "Failed to create shop");
    }
  };

 

  return (
    <div className="min-h-screen bg-background py-12 px-4 w-full">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="bg-secondary rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-1">
              Shop Information
            </h2>
            <p className="text-sm text-muted-foreground">
              Please complete your shop information
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <Label
              htmlFor="shopName"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Shop Name
            </Label>
            <Input
              id="shopName"
              placeholder="Enter your shop name"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full"
            />
          </div>
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
          <div className="flex items-center justify-between">
            <Label
              htmlFor="subscription"
              className="text-sm font-medium text-foreground"
            >
              Subscription
            </Label>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {subscription ? "Yes" : "No"}
              </span>
              <Switch
                id="subscription"
                checked={subscription}
                onCheckedChange={setSubscription}
              />
            </div>
          </div>
          <div>
            <Label className="block text-sm font-medium text-foreground mb-2">
              Cover Image
            </Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6">
              {coverImage ? (
                <div className="relative">
                  <Image
                    src={coverImage || "/placeholder.svg"}
                    alt="Cover preview"
                    className="w-full h-48 object-cover rounded-lg"
                    width={0}
                    height={0}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded-full hover:opacity-80"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-muted-foreground"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-18-8l-4 4m0 0l4 4m-4-4h16M10 38h28"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-muted-foreground">
                      <span className="font-medium text-accent">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
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
                    <p> </p>
                    {address.city}-{address.line1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        <div className="mb-8">
          <Label className="block text-sm font-medium text-foreground mb-2">
            Select Categories
          </Label>

          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <div className="flex flex-wrap gap-2">
                  {selectedOptions.length > 0 ? (
                    selectedOptions.map((id) => {
                      const category = categories.find((c) => c._id === id);
                      return (
                        <Badge key={id}>{category?.name || "Unknown"}</Badge>
                      );
                    })
                  ) : (
                    <span className="text-muted-foreground">Select categories</span>
                  )}
                </div>

                <ChevronDown className="h-4 w-4 opacity-50" />
              </button>
            </PopoverTrigger>

            <PopoverContent className="w-full p-2">
              <div className="space-y-2">
                {categories.map((option) => (
                  <label
                    key={option._id}
                    className="flex items-center gap-2 cursor-pointer rounded px-2 py-1 hover:bg-secondary"
                  >
                    <Checkbox
                      checked={selectedOptions.includes(option._id)}
                      onCheckedChange={() => toggleOption(option._id)}
                    />
                    {option.name}
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
          <div className="flex gap-4 pt-8">
            <Button type="submit" className="flex-1">
              Create Shop
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
