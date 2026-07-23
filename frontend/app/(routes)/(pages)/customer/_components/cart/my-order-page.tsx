'use client'

import { useState, useEffect } from 'react'
import { handleGetPaymentsByUserId } from '@/lib/actions/payment-action'
import { CartItem } from './cart-page'

export interface Payment{
  _id: string
  amount: number
  orderId: CartItem[]
  createdAt: string
}

export default function MyOrderPage() {
  const [orderPayments, setOrderPayments] = useState<Payment[]>([])

  const fetchPayments = async () => {
    const res = await handleGetPaymentsByUserId();
    console.log(res)
    if(res.success){
      // Filter payments that have orderItemsId (cart orders, not subscription orders)
      const filteredPayments = res.data.filter((payment: Payment) => 
        payment.orderId.some((order: any) => 
          order.orderItemsId && order.orderItemsId.length > 0
        )
      )
      setOrderPayments(filteredPayments)
    }
  }

  useEffect(() => {
    fetchPayments()
  },[])

  return (
    <div className="min-h-screen bg-secondary py-8 w-full">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-foreground mb-8">My Orders</h1>

        <div className="bg-card rounded-lg border border-border">
          <div className="grid grid-cols-5 gap-4 px-6 py-4 bg-secondary border-b border-border font-semibold text-foreground text-sm">
            <div>Product Name</div>
            <div>Order Date</div>
            <div>Quantity</div>
            <div>Price</div>
            <div>Shop Name</div>
          </div>

          <div className="divide-y divide-border">
            {orderPayments.length === 0 ? (
              <div className="px-6 py-8 text-center text-muted-foreground">
                No orders yet
              </div>
            ) : (
              orderPayments.flatMap((payment) => 
                payment.orderId
                  .filter((order: any) => order.orderItemsId && order.orderItemsId.length > 0)
                  .flatMap((order: any) => 
                    order.orderItemsId.map((orderItem: any, itemIndex: number) => (
                      <div
                        key={`${payment._id}-${order._id}-${itemIndex}`}
                        className="grid grid-cols-5 gap-4 px-6 py-4 items-center hover:bg-secondary transition-colors"
                      >
                        <div className="font-medium text-foreground">
                          {orderItem?.productId?.name || 'N/A'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {orderItem?.quantity || 'N/A'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Rs.{orderItem?.productId?.price ? (orderItem.quantity * orderItem.productId.price) : payment.amount}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {order?.shopId?.name || 'N/A'}
                        </div>
                      </div>
                    ))
                  )
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
