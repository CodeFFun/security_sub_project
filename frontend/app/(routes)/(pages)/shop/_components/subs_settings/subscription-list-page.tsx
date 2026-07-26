'use client'

import  { useState, useEffect } from 'react'
import { Trash2 } from 'lucide-react'
import { Shop } from '../shop_settings/shop-list'
import { handleGetAllShopsOfAUser } from '@/lib/actions/shop-action'
import { handleDeleteSubscription, handleGetAllSubscriptionOfAShop } from '@/lib/actions/subscription-action'

export interface Subscription {
  _id: string
  userId: {
    _id: string
    username: string
  }
  shopId: {
    _id: string
    name: string
  }
  subscription_planId: {
    _id: string
    frequency: number
    price_per_cycle: number
    active: boolean
    productId: Array<{
      _id: string
      name: string
    }>
    quantity: number
  }
  status: 'active' | 'paused' | 'cancelled' | 'completed'
  start_date: string
  remaining_cycle: number
}



export default function SubscriptionsListPage() {
  const [orders, setOrders] = useState<Subscription[]>([])
  const [selectedShop, setSelectedShop] = useState<string | null>(null)
  const [shops, setShops] = useState<Shop[]>([])

  const getShops = async () => {
    const res = await handleGetAllShopsOfAUser()
    if(res.success){
      setShops(res.data)
    }
  }
  const getSubs = async () => {
    const res = await handleGetAllSubscriptionOfAShop(selectedShop!)
    console.log(res)
    if(res.success){
      setOrders(res.data)
    }
  }

  useEffect(() => {
    getShops()
  }, [])
  useEffect(() => {
    if(selectedShop !== null){
        getSubs()
    }
  }, [selectedShop])

  // Filter orders based on selected shop
  const filteredOrders = selectedShop === null
    ? orders
    : orders.filter((order) => {
        const shop = shops.find((s) => s._id === selectedShop)
        return shop ? order.shopId._id === selectedShop : true
      })


  const handleDeleteOrder = async (id: string) => {
    const res = await handleDeleteSubscription(id)
    if(res.success){
        getSubs()
    }
  }

  const handleShopFilter = (shopId: string) => {
    setSelectedShop((prev) => (prev === shopId ? null : shopId))
  }

  return (
    <div className="w-full bg-secondary min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Subscription Orders</h1>
        </div>

        {/* Shop Filter */}
        <div className="mb-8 p-6 bg-card rounded-lg border border-border">
          <div className="text-sm font-medium text-foreground mb-4">
            Filter by Shop
          </div>
          <div className="grid grid-cols-4 gap-6">
            {shops.map((shop) => (
              <div key={shop._id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`shop-filter-${shop._id}`}
                  checked={selectedShop === shop._id}
                  onChange={() => handleShopFilter(shop._id)}
                  className="w-4 h-4 text-accent rounded border-border cursor-pointer"
                />
                <label
                  htmlFor={`shop-filter-${shop._id}`}
                  className="ml-3 text-sm text-foreground cursor-pointer"
                >
                  {shop.name}
                </label>
              </div>
            ))}
          </div>
          {selectedShop && (
            <button
              onClick={() => setSelectedShop(null)}
              className="mt-4 text-sm text-accent hover:opacity-70 underline"
            >
              Clear Filter
            </button>
          )}
        </div>

        {/* Orders Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-4 px-6 py-4 bg-secondary border-b border-border font-semibold text-sm text-foreground">

            <div>Subscription ID</div>
            <div>Product Name</div>
            <div>Quantity</div>
            <div>Price</div>
            <div>User Name</div>
            <div>Delivery Date</div>
          </div>

          {/* Table Body */}
          {filteredOrders.length === 0 ? (
            <div className="px-6 py-8 text-center text-muted-foreground">
              No subscription orders found.
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order._id}
                className="grid grid-cols-6 gap-4 px-6 py-4 border-b border-border hover:bg-secondary/50 transition-colors items-center"
              >
                {/* Subscription ID */}
                <div className="text-sm font-medium text-foreground">
                  {order._id}
                </div>
                {/* Product Name */}
                <div className="text-sm text-muted-foreground">
                  {order.subscription_planId.productId[0].name}
                </div>
                {/* Quantity */}
                <div className="text-sm text-muted-foreground">
                  {order.subscription_planId.quantity}
                </div>

                {/* Price */}
                <div className="text-sm text-muted-foreground">
                  ${order.subscription_planId.price_per_cycle}
                </div>

                {/* User Name */}
                <div className="text-sm text-muted-foreground">
                  {order.userId.username}
                </div>

                {/* Delivery Date */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {new Date(new Date(order.start_date).getTime() + order.subscription_planId.frequency * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleDeleteOrder(order._id)}
                    className="text-destructive hover:opacity-70 hover:bg-destructive/10 p-2 rounded transition-colors"
                    title="Delete order"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        <div className="mt-6 text-sm text-muted-foreground">
          Showing {filteredOrders.length} of {orders.length} orders
          {selectedShop && ` (filtered by shop)`}
        </div>
      </div>
    </div>
  )
}
