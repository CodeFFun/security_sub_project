'use client'

import { MoreVertical, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Image from 'next/image'
import { BASE_URL } from '@/lib/api/axios'

export interface Shop {
  _id: string
  name: string
  pickup_info: string
  accepts_subscription: boolean
  addressId: {
    _id: string
    label: string
    line1: string
    city: string
    country: string
  }
  categoryId:{
    _id: string
    name: string
  }
  shop_banner: string | null
}

interface ShopListProps {
  shops?: Shop[]
  onDelete?: (id: string) => void
  onEdit?: (id: string) => void
}

export default function ShopList({ shops,onDelete, onEdit }: ShopListProps) {
  if (shops?.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No shops added yet. Create your first shop above.</p>
      </div>
    )
  }

  return (
    <div className="mt-12 w-full px-10">
      <h2 className="text-xl font-semibold text-foreground mb-6">Your Shops</h2>
      
      {/* Table Header */}
      <div className="grid grid-cols-5 gap-8 px-4 py-3 bg-secondary border border-border rounded-t-lg font-semibold text-foreground text-sm">
        <div>Shop</div>
        <div>Pickup Type</div>
        <div>Subscription</div>
        <div>Address</div>
        <div className="text-right">Actions</div>
      </div>

      {/* Table Body */}
      <div className="border-b border-l border-r border-border divide-y divide-border">
        {shops?.map((shop) => (
          <div
            key={shop._id}
            className="grid grid-cols-5 gap-8 px-4 py-4 items-center hover:bg-secondary transition-colors"
          >
            {/* Shop Image and Name */}
            <div className="flex items-center gap-3">
              {shop.shop_banner ? (
                <Image
                unoptimized
                  src={`${BASE_URL}${shop.shop_banner}`}
                  alt={shop.name}
                  className="w-10 h-10 rounded-full object-cover"
                  width={0}
                  height={0}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-secondary"></div>
              )}
              <p className="font-medium text-foreground truncate">{shop.name}</p>
            </div>

            {/* Pickup Type */}
            <div>
              <p className="text-sm text-muted-foreground">{shop.pickup_info}</p>
            </div>

            {/* Subscription Status */}
            <div>
              <div className="flex items-center gap-2">
                {shop.accepts_subscription ? (
                  <>
                    <Check className="w-5 h-5 text-accent" />
                    <span className="text-sm text-accent">Yes</span>
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5 text-destructive" />
                    <span className="text-sm text-destructive">No</span>
                  </>
                )}
              </div>
            </div>

            {/* Address */}
            <div>
              <p className='font-bold'>{shop.addressId.label}</p>
              <p className="text-sm text-muted-foreground truncate">{shop.addressId.line1}</p>
            </div>

            {/* Three Dot Menu */}
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit?.(shop._id)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete?.(shop._id)}
                    className="text-destructive"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
