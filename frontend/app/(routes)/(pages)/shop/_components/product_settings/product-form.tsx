"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { handleGetAllShopsOfAUser } from "@/lib/actions/shop-action";
import { handleCreateProduct } from "@/lib/actions/product-action";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { handleGetAllProductCategories } from "@/lib/actions/product-category-action";
import { Badge } from "@/components/ui/badge";

export default function ProductForm() {
  const [productName, setProductName] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [selectedShops, setSelectedShops] = useState<string[]>([]);
  const [shops, setShops] = useState<{ _id: string; name: string }[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    [],
  );

  const fetchShops = async () => {
    const res = await handleGetAllShopsOfAUser();
    if (res.success) {
      setShops(res.data);
    }
  };
  const fetchCategories = async () => {
    const res = await handleGetAllProductCategories();
    console.log(res.data);
    if (res.success) {
      setCategories(res.data);
    }
  };

  useEffect(() => {
    fetchShops();
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productName || !basePrice || !stockQuantity) {
      alert("Please fill in all fields");
      return;
    }

    if (selectedShops.length === 0) {
      alert("Please select at least one shop");
      return;
    }
    const formData = {
      name: productName,
      base_price: parseFloat(basePrice),
      stock_quantity: parseInt(stockQuantity, 10),
      discount: discountPrice ? parseFloat(discountPrice) : 0,
      description: productDescription,
      categoryId: selectedOptions,
    };
    const results = await Promise.all(
      selectedShops.map((shopId) => handleCreateProduct(shopId, formData)),
    );
    const allSuccess = results.every((res) => res.success);
    if (allSuccess) {
      toast.success("Product created successfully in all selected shops!");
    } else {
      toast.error("Some products could not be created. Please try again.");
    }
  };

  const handleClearForm = () => {
    setProductName("");
    setBasePrice("");
    setStockQuantity("");
    setDiscountPrice("");
    setProductDescription("");
    setSelectedShops([]);
  };

  const handleShopToggle = (shopId: string) => {
    setSelectedShops((prev) =>
      prev.includes(shopId)
        ? prev.filter((id) => id !== shopId)
        : [...prev, shopId],
    );
  };
  const toggleOption = (value: string) => {
    setSelectedOptions((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
    console.log(selectedOptions);
  };

  return (
    <div className="bg-card rounded-lg p-8 shadow-sm border border-border w-full">
      <div className="mb-8">
        <div className="bg-secondary rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-1">
            Product Information
          </h2>
          <p className="text-sm text-muted-foreground">
            Please complete your product information
          </p>
        </div>
      </div>
      <div className="mb-8">
        <Label className="block text-sm font-medium text-foreground mb-4">
          Select Shops
        </Label>
        <div className="grid grid-cols-4 gap-6">
          {shops.map((shop) => (
            <div key={shop._id} className="flex items-center">
              <input
                type="checkbox"
                id={`shop-${shop._id}`}
                checked={selectedShops.includes(shop._id)}
                onChange={() => handleShopToggle(shop._id)}
                className="w-4 h-4 text-accent rounded border-border cursor-pointer"
              />
              <label
                htmlFor={`shop-${shop._id}`}
                className="ml-3 text-sm text-foreground cursor-pointer"
              >
                {shop.name}
              </label>
            </div>
          ))}
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div>
            <Label
              htmlFor="productName"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Product Name
            </Label>
            <Input
              id="productName"
              type="text"
              placeholder="Enter product name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Label
              htmlFor="basePrice"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Base Price
            </Label>
            <Input
              id="basePrice"
              type="number"
              placeholder="Enter base price"
              value={basePrice}
              onChange={(e) => {
                setBasePrice(e.target.value);
              }}
              step="0.01"
              min="0"
              className="w-full"
            />
          </div>

          {/* Stock Quantity */}
          <div>
            <Label
              htmlFor="stockQuantity"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Stock Quantity
            </Label>
            <Input
              id="stockQuantity"
              type="number"
              placeholder="Enter stock quantity"
              value={stockQuantity}
              onChange={(e) => {
                setStockQuantity(e.target.value);
              }}
              min="0"
              className="w-full"
            />
          </div>
          <div>
            <Label
              htmlFor="discountPrice"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Discount Price
            </Label>
            <Input
              id="discountPrice"
              type="number"
              placeholder="Enter discount price"
              value={discountPrice}
              onChange={(e) => {
                setDiscountPrice(e.target.value);
              }}
              step="0.01"
              min="0"
              className="w-full"
            />
          </div>
        </div>
        <div className="mb-6">
          <Label
            htmlFor="productDescription"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Product Description
          </Label>
          <Textarea
            id="productDescription"
            placeholder="Enter product description"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            className="w-full"
          />
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
        <div className="flex gap-4">
          <Button
            type="submit"
            className="bg-accent hover:opacity-90 text-accent-foreground"
          >
            Add Product
          </Button>
          <Button
            type="button"
            onClick={handleClearForm}
            className="bg-muted hover:opacity-70 text-foreground"
          >
            Clear Form
          </Button>
        </div>
      </form>
    </div>
  );
}
