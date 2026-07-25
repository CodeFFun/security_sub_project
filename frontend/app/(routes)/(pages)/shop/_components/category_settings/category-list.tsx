'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical } from 'lucide-react'
import { handleGetAllProductCategoriesOfAShop } from '@/lib/actions/product-category-action'


export interface Category {
  _id: string
  name: string
  description: string
  shopId: string[]
}

interface CategoryListProps {
  shops: {_id:string, name:string}[]
  categories: Category[]
  onDelete: (id: string) => void
  onEdit: (id: string) => void
  filterShop: string | null
  onFilterShopChange: (shopId: string) => void
}

export default function CategoryList({
  shops,
  categories,
  onDelete,
  onEdit,
  filterShop,
  onFilterShopChange,
}: CategoryListProps) {
  const [filteredCategories, setFilteredCategories] = useState<Category[] | null>(categories)

  const fetchCategoriesByShop = async () => {
    const res = await handleGetAllProductCategoriesOfAShop(filterShop!)
    console.log(res)
    if (res.success) {
      setFilteredCategories(res.data)
    }
  }

  useEffect(() => {
    if (filterShop) {
      fetchCategoriesByShop()
    } else {
      setFilteredCategories(null)
    }
  }, [filterShop])

  const handleShopFilter = (shopId: string) => {
    onFilterShopChange(shopId)
  }

  // const filteredCategories = filterShop === null
  //   ? categories
  //   : categories.filter((category) =>
  //       category.shopId.includes(filterShop)
  //     )

  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold text-foreground mb-6">Categories</h2>
      <div className="mb-8 p-6 bg-secondary rounded-lg border border-border">
        <div className="text-sm font-medium text-foreground mb-4">
          Filter by Shop
        </div>
        <div className="grid grid-cols-4 gap-6">
          {shops.map((shop) => (
            <div key={shop._id} className="flex items-center">
              <input
                type="checkbox"
                id={`filter-shop-${shop._id}`}
                checked={filterShop === shop._id}
                onChange={() => handleShopFilter(shop._id)}
                className="w-4 h-4 text-accent rounded border-border cursor-pointer"
              />
              <label
                htmlFor={`filter-shop-${shop._id}`}
                className="ml-3 text-sm text-foreground cursor-pointer"
              >
                {shop.name}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-8 px-4 py-3 bg-secondary border border-border rounded-t-lg font-semibold text-foreground text-sm">
        <div>Name</div>
        <div>Description</div>
        <div className="text-right">Actions</div>
      </div>
      <div className="border-b border-l border-r border-border divide-y divide-border">
        {filteredCategories === null || filteredCategories.length === 0 ? (
          <div className="px-4 py-8 text-center text-muted-foreground">
            {categories.length === 0
              ? 'No categories yet. Add one to get started.'
              : 'No categories match the selected shops.'}
          </div>
        ) : (
          filteredCategories.map((category) => (
            <div
              key={category._id}
              className="grid grid-cols-3 gap-8 px-4 py-4 items-center hover:bg-secondary transition-colors"
            >
              <div>
                <p className="font-medium text-foreground">{category.name}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground truncate">{category.description}</p>
              </div>

              <div className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(category._id)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(category._id)}
                      className="text-destructive"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
