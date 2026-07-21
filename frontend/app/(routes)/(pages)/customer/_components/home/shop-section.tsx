"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { handleGetAllShops } from "@/lib/actions/shop-action";
import { BASE_URL } from "@/lib/api/axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type SHOP = {
  _id: string;
  categoryId: {
    _id: string;
    name: string;
  };
  shop_banner: string;
  name: string;
};

const ITEMS_PER_PAGE = 8;

export default function ShopSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [shops, setShops] = useState<SHOP[]>([]);

  const fetchShops = async () => {
    const res = await handleGetAllShops();
    if (res.success) {
      setShops(res.data);
    } else {
      console.error("Failed to fetch shops:", res.message);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const totalPages = Math.ceil(shops.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = shops.slice(startIndex, endIndex);

  return (
    <section className="w-full bg-card py-12">
      <div className="max-w-7xl mx-auto px-8">
        <div className="w-full flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-8">All Products</h2>
        <Link href="/customer/shop/allshops">
          <Button
            variant="outline"
            className="border-accent text-accent hover:bg-accent/10 bg-transparent"
            >
            SHOP ALL PRODUCTS
          </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {currentProducts.map((product) => (
            <div key={product._id} className="group cursor-pointer">
              <Link href={`/customer/shop/${product._id}`}>
                <div className="bg-secondary rounded-lg p-4 mb-4 h-48 relative overflow-hidden group-hover:shadow-lg transition-shadow">
                  <Image
                    unoptimized
                    src={BASE_URL + product.shop_banner}
                    alt={product.name}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-2 group-hover:text-accent transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {product.categoryId?.name}
                </p>
              </Link>
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => {
                    // Show first 2, last 2, and current page with neighbors
                    const showPage =
                      page <= 2 ||
                      page >= totalPages - 1 ||
                      (page >= currentPage - 1 && page <= currentPage + 1);

                    if (!showPage && page > 2 && page < totalPages - 1) {
                      return (
                        <PaginationItem key={`ellipsis-${page}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }

                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={page === currentPage}
                          onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  },
                )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.preventDefault();
                      if (currentPage < totalPages)
                        setCurrentPage(currentPage + 1);
                    }}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </section>
  );
}
