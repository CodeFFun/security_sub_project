'use client'

import React, { use, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical, Trash2 } from 'lucide-react'
import { handleGetAllShopsOfAUser } from '@/lib/actions/shop-action'
import { Shop } from '../shop_settings/shop-list'
import { handleGetOrderByShopId, handleDeleteOrder as deleteOrder } from '@/lib/actions/order-action'

interface Orders {
  _id: string
  userId: {
    _id: string
    username: string
  }
  shopId: {
    _id: string
    name: string
  }
  orderItemsId: Array<{
    _id: string
    unit_price: number
    active: boolean
    productId: {
      _id: string
      name: string
    }
    quantity: number
  }>
}


export default function OrdersListPage() {
  const [orders, setOrders] = useState<Orders[]>([])
  const [filterShop, setFilterShop] = useState<string | null>(null)
  const [shops, setShops] = useState<Shop[]>([])

   const getShops = async () => {
       const res = await handleGetAllShopsOfAUser()
       if(res.success){
         setShops(res.data)
       }
   }

   const getOrders = async () => {
    const res = await handleGetOrderByShopId(filterShop!)
    console.log(res)
    if(res.success){
      setOrders(res.data)
    }
   }
  
    useEffect(() => {
      getShops()
    }, [])

    useEffect(() => {
      if(filterShop){
        getOrders()
      }
    }, [filterShop])

  const handleShopFilter = (shopId: string) => {
    setFilterShop((prev) => (prev === shopId ? null : shopId))
  }

  const handleDeleteOrder = async (id: string) => {
    const res = await deleteOrder(id)
    if(res.success){
        getOrders()
    }
  }

  const filteredOrders = filterShop === null
    ? orders.filter((order) => order.orderItemsId.length > 0)
    : orders.filter((order) => order.shopId._id === filterShop && order.orderItemsId.length > 0)

  return (
    <div className="min-h-screen bg-secondary p-8 w-full">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Orders</h1>
          <p className="text-muted-foreground">Manage and view all customer orders</p>
        </div>

        {/* Shop Filter */}
        <div className="mb-8 p-6 bg-card rounded-lg border border-border shadow-sm">
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

        {/* Orders Table */}
        <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-6 px-6 py-4 bg-secondary border-b border-border font-semibold text-sm text-foreground">
            <div>Order ID</div>
            <div>Product Name</div>
            <div>Quantity</div>
            <div>Price</div>
            <div>User Name</div>
            <div className="text-right">Actions</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {filteredOrders.length === 0 ? (
              <div className="px-6 py-12 text-center text-muted-foreground">
                {orders.length === 0
                  ? 'No orders found.'
                  : 'No orders match the selected shop.'}
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="grid grid-cols-6 gap-6 px-6 py-4 items-center hover:bg-secondary transition-colors"
                >
                  <div className="text-sm font-medium text-foreground">
                    {order._id}
                  </div>
                  <div className="text-sm text-foreground">
                    {order.orderItemsId[0]?.productId.name }
                  </div>
                  <div className="text-sm text-foreground">
                    {order.orderItemsId[0]?.quantity || 'N/A'}
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    Rs.{order.orderItemsId[0]?.unit_price || 'N/A'}
                  </div>
                  <div className="text-sm text-foreground">
                    {order.userId.username}
                  </div>
                  <div className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleDeleteOrder(order._id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
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

        {/* Summary */}
        <div className="mt-6 text-sm text-muted-foreground">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      </div>
    </div>
  )
}
