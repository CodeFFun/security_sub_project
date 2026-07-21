"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { handleGetAllShops } from "@/lib/actions/shop-action";
import { BASE_URL } from "@/lib/api/axios";
import Link from "next/link";

type SUBSCRIPTION_SHOP = {
  _id: string;
  categoryId: {
    _id: string;
    name: string;
  };
  shop_banner: string;
  name: string;
  accepts_subscription: boolean;
};

export default function DiscountSection() {
  const [subscriptionShops, setSubscriptionShops] = useState<
    SUBSCRIPTION_SHOP[]
  >([]);
  const fetchShops = async () => {
    const res = await handleGetAllShops();
    const filteredShops = res.data.filter(
      (shop: SUBSCRIPTION_SHOP) => shop.accepts_subscription === true,
    );
    setSubscriptionShops(filteredShops);
    console.log("Subscription Shops:", filteredShops);
  };

  useEffect(() => {
    fetchShops();
  }, []);

  return (
    <section className="w-full bg-card py-8">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Automatic Restock
            </h2>
            <p className="text-accent font-semibold">
              Shops that automatically restock your favorite products
            </p>
          </div>
          <Link href="/customer/shop/allshops">
          <Button
            variant="outline"
            className="border-accent text-accent hover:bg-accent/10 bg-transparent"
            >
            SHOP ALL PRODUCTS
          </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          {subscriptionShops.map((product) => (
            <div  className="flex flex-col" key={product._id}>
            <Link
              href={`/customer/shop/${product._id}`}
              className="group cursor-pointer"
            >
                <div className="bg-secondary rounded-lg p-4 mb-4 h-48 relative shrink-0">
                  <Image
                    src={BASE_URL + product.shop_banner}
                    unoptimized
                    alt={product.name}
                    height={0}
                    width={0}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  {product.categoryId?.name}
                </p>
                <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-3 grow">
                  {product.name}
                </h3>
            </Link>
              </div>
          ))}
        </div>
      </div>
    </section>
  );
}
