"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CategoryList, { type Category } from "./category-list";
import { handleGetAllShopsOfAUser } from "@/lib/actions/shop-action";
import {
  handleCreateProductCategory,
  handleDeleteProductCategory,
  handleGetAllProductCategories,
  handleupdateProductCategory,
} from "@/lib/actions/product-category-action";
import { toast } from "sonner";
// import { handleGetAllProductCategoriesOfAShop } from '@/lib/actions/product-category-action'

export default function CategoryForm() {
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [shops, setShops] = useState<{ _id: string; name: string }[]>([]);
  const [selectedShops, setSelectedShops] = useState<string[]>([]);
  const [listFilterShop, setListFilterShop] = useState<string | null>(null);
  const [editCategory, setEditCategory] = useState({
    id: "",
    name: "",
    description: "",
  });

  const fetchShops = async () => {
    const res = await handleGetAllShopsOfAUser();
    console.log(res);
    if (res.success) {
      setShops(res.data);
    }
  };
  const fetchProductCategories = async () => {
    const res = await handleGetAllProductCategories();
    console.log(res);
    if (res.success) {
      setCategories(res.data);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchShops();
  }, []);

  useEffect(() => {
    fetchProductCategories();
  }, []);


  if (!mounted) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isUpdate) {
      const formData = {
        name: editCategory.name,
        description: editCategory.description,
      };
      const res = await handleupdateProductCategory(editCategory.id, formData);
      if(res.success) {
        toast.success("Category updated successfully");
      }
      setIsUpdate(false);
      setEditCategory({ id: "", name: "", description: "" });
      setSelectedShops([]);
      fetchProductCategories();
    } else {
      if (!name || !description) {
        alert("Please fill in all fields");
        return;
      }
      
      if (selectedShops.length === 0) {
        alert("Please select at least one shop");
        return;
      }

      // Add new category
      const formData = {
        name,
        description,
      };
      const res = await Promise.all(selectedShops.map(shopId => handleCreateProductCategory({ ...formData, shopId })));
      if(res.every(r => r.success)) {
        toast.success("Category created successfully");
      } else {        
        toast.error("Failed to create category");
      }
      setName("");
      setDescription("");
      setSelectedShops([]);
      fetchProductCategories();
    }
  };

  const handleEditCategory = (id: string) => {
    setIsUpdate(true);
    const category = categories.find((c) => c._id === id);
    if (category) {
      setEditCategory({
        id: category._id,
        name: category.name,
        description: category.description,
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const res = await handleDeleteProductCategory(id);
    if (res.success) {
      toast.success("Category deleted successfully");
      fetchProductCategories();
    } else {
      toast.error("Failed to delete category");
    }
  };

  const handleCancel = () => {
    setIsUpdate(false);
    setEditCategory({ id: "", name: "", description: ""});
    setName("");
    setDescription("");
    setSelectedShops([]);
  }

  const handleShopToggle = (shopId: string) => {
    setSelectedShops((prev) => (prev.includes(shopId) ? prev.filter(id => id !== shopId) : [...prev, shopId]) );
  }

  const handleListFilterShop = (shopId: string) => {
    setListFilterShop((prev) => (prev === shopId ? null : shopId));
  };

  return (
    <div className="mx-auto px-4 py-8 w-full">
      <div className="bg-card rounded-lg border border-border p-8 mb-8">
        <div className="mb-8">
          <div className="bg-secondary rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-1">
              Category Information
            </h2>
            <p className="text-sm text-muted-foreground">
              Create and manage product categories
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label
                htmlFor="name"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Category Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g., Electronics"
                value={isUpdate ? editCategory.name : name}
                onChange={(e) =>
                  isUpdate
                    ? setEditCategory({ ...editCategory, name: e.target.value })
                    : setName(e.target.value)
                }
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="description"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe the category"
              value={isUpdate ? editCategory.description : description}
              onChange={(e) =>
                isUpdate
                  ? setEditCategory({
                      ...editCategory,
                      description: e.target.value,
                    })
                  : setDescription(e.target.value)
              }
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className={`mb-6 ${isUpdate ? "hidden" : ""}`}>
            <Label className="block text-sm font-medium text-foreground mb-4">
              Select Shops
            </Label>
            <div className="grid grid-cols-4 gap-6">
              {shops.map((shop) => (
                <div key={shop._id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`select-shop-${shop._id}`}
                    checked={selectedShops.includes(shop._id)}
                    onChange={() => handleShopToggle(shop._id)}
                    className="w-4 h-4 text-accent rounded border-border cursor-pointer"
                  />
                  <label
                    htmlFor={`select-shop-${shop._id}`}
                    className="ml-3 text-sm text-foreground cursor-pointer"
                  >
                    {shop.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 flex gap-4">
            <Button
              type="submit"
              className="bg-accent hover:opacity-90 text-accent-foreground font-medium py-2 px-6 rounded-lg transition-colors"
            >
              {isUpdate ? "Update Category" : "Add Category"}
            </Button>
            {isUpdate && (
              <Button
                type="button"
                onClick={handleCancel}
                className="bg-secondary hover:opacity-70 text-foreground font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>

      <CategoryList
        shops={shops}
        categories={categories}
        onDelete={handleDeleteCategory}
        onEdit={handleEditCategory}
        filterShop={listFilterShop}
        onFilterShopChange={handleListFilterShop}
      />
    </div>
  );
}

