"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Heart, ShoppingCart } from "lucide-react";
import { useParams } from "next/navigation";
import { handleGetShopsById } from "@/lib/actions/shop-action";
import { BASE_URL } from "@/lib/api/axios";
import { handleGetProductsByShopId } from "@/lib/actions/product-action";
import { handleGetAllProductCategoriesOfAShop } from "@/lib/actions/product-category-action";
import { handleCreateOrderItem } from "@/lib/actions/order-item-action";
import { handleCreateOrder } from "@/lib/actions/order-action";
import { toast } from "sonner";
import { handleCreateSubscriptionPlan } from "@/lib/actions/subscrition-plan-action";
import { handleCreateSubscription } from "@/lib/actions/subscription-action";

type SHOP = {
  _id: string;
  name: string;
  about: string;
  shop_banner: string;
  addressId: {
    _id: string;
    city: string;
    line1: string;
  };
  categoryId: {
    _id: string;
    name: string;
  };
  accepts_subscription: boolean;
};

type PRODUCT = {
  _id: string;
  name: string;
  base_price: number;
  image: string;
  stock_quantity: number;
  discount: number;
};

export default function ShopDetail() {
  const [activeTab, setActiveTab] = useState("products");
  const id = useParams().id as string;
  const [shop, setShop] = useState<SHOP | null>(null);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    [],
  );
  const [products, setProducts] = useState<PRODUCT[]>([]);

  const fetchCategories = async () => {
    try {
      const res = await handleGetAllProductCategoriesOfAShop(id);
      if (res.success) {
        setCategories(res.data);
      } else {
        console.error("Failed to fetch categories:", res.message);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchProducts = async () => {
    const res = await handleGetProductsByShopId(id);
    console.log(res.data);
    if (res.success) {
      setProducts(res.data);
    } else {
      console.error("Failed to fetch products:", res.message);
    }
  };

  const fetchShopDetails = async () => {
    try {
      const res = await handleGetShopsById(id);
      if (res.success) {
        setShop(res.data);
      } else {
        console.error("Failed to fetch shop details:", res.message);
      }
    } catch (err) {
      console.error("Error fetching shop details:", err);
    }
  };

  useEffect(() => {
    fetchShopDetails();
    fetchProducts();
    fetchCategories();
  }, [id]);

  if (!shop) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-muted-foreground">Shop not found</p>
      </div>
    );
  }

  const addOrder = async (product: PRODUCT) => {
    const price =
      product.base_price - product.base_price * (product.discount / 100);
    const orderItem = {
      quantity: 1,
      unit_price: price,
      productId: product._id,
    };
    try {
      const orderItemRes = await handleCreateOrderItem(orderItem);
      if (orderItemRes.success) {
        const data = orderItemRes.data;
        const order = {
          orderItemsId: [data._id],
          delivery_type: "standard",
        };
        const orderRes = await handleCreateOrder(shop._id, order);
        if (orderRes.success) {
          toast.success("Product added to cart");
        } else {
          toast.error(orderRes.message || "Failed to create order");
          console.error("Failed to create order:", orderRes.message);
        }
      } else {
        toast.error(orderItemRes.message || "Failed to create order item");
        console.error("Failed to create order item:", orderItemRes.message);
      }
    } catch (err: Error | any) {
      toast.error("Error adding product to cart");
      console.error("Error creating order item:", err.message || err);
    }
  };

  const addSubs = async (product: PRODUCT) => {
    const subPlan = {
      productId: [product._id],
      active: false,
      price_per_cycle: parseInt((product.base_price - product.base_price * (product.discount / 100)).toFixed(2)),
      frequency: 7,
      quantity: 1,
    }
    try{
      const res = await handleCreateSubscriptionPlan(subPlan);
      console.log(res)
      if(res.success){
        const data = res.data;
        const subs = {
          start_date: new Date(),
          remaining_cycle: 1,
          subscription_planId: data._id,
        }
        const subRes = await handleCreateSubscription(shop._id, subs);
        if(subRes.success){
          toast.success("Product added to subscription");
        } else {
          toast.error(subRes.message || "Failed to create subscription");
          console.error("Failed to create subscription:", subRes.message); 
        }
      } else {
        toast.error(res.message || "Failed to create subscription plan");
        console.error("Failed to create subscription plan:", res.message);
      }
    }catch(err:Error | any){
      toast.error("Error adding product to subscription");
      console.error(err.message || err);
    }
  }
  return (
    <div className="w-full min-h-screen bg-card">
      <div className="relative w-full h-96">
        <Image
          unoptimized
          src={BASE_URL + shop.shop_banner}
          alt={shop.name}
          fill
          className="object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-8">
          <div className="flex items-end gap-6">
            <Image
              unoptimized
              src={BASE_URL + shop.shop_banner || "/placeholder.svg"}
              alt={shop.name}
              width={80}
              height={80}
              className="rounded-lg border-4 border-white"
            />
            <div className="text-white">
              <h1 className="text-3xl font-bold mb-2">{shop.name}</h1>
              <p className="text-sm mb-1 flex items-center gap-1">
                <span className="text-accent">●</span>{" "}
                {shop.categoryId?.name}
              </p>
              <p className="text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {shop.addressId?.line1},{" "}
                {shop.addressId?.city}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full rounded-none border-b border-border bg-card">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          <TabsContent value="products" className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <h3 className="text-sm font-semibold text-accent mb-4">
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category._id}
                      className="block w-full text-left px-4 py-2 text-sm text-muted-foreground hover:bg-secondary rounded transition-colors"
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 gap-6 align-center align-middle">
                  {products.map((product: PRODUCT) => (
                    <div
                      key={product._id}
                      className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="p-4 w-full grid grid-cols-3 h-full place-items-start gap-45">
                        <h4 className="text-lg font-medium text-foreground mb-2">
                          {product.name}
                        </h4>
                        <p className="text-lg font-semibold text-accent">
                          Rs.{" "}
                          {Math.abs(
                            product.base_price -
                              product.base_price * (product.discount / 100),
                          ).toFixed(2)}
                        </p>
                        <div>
                          <Heart
                            className={`${shop.accepts_subscription === true ? "" : "hidden"}  w-5 h-5 text-muted-foreground hover:text-destructive cursor-pointer`}
                            onClick={() => addSubs(product)}
                          />
                          <ShoppingCart
                            className="w-5 h-5 text-muted-foreground hover:text-accent cursor-pointer ml-4"
                            onClick={() => addOrder(product)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="about" className="p-8">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {shop.name}
              </h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {shop.about || "No description available for this shop."}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
