'use client'

import { useState, useEffect } from 'react'
import { handleGetPaymentsByUserId } from '@/lib/actions/payment-action'
import { Shop } from '../../../shop/_components/shop_settings/shop-list'
import {Subscription} from '../../../shop/_components/subs_settings/subscription-list-page'

export interface Payment{
  _id:string,
  amount:number,
  orderId:[{
    _id: string
    shopId: Shop
    orderItemsId: string[]
    subscriptionId: Subscription
  }]
  createdAt: string
}

export default function SubTabPage() {
  const [subscriptionPayments, setSubscriptionPayments] = useState<Payment[]>([])

  const fetchPayments = async () => {
    const res = await handleGetPaymentsByUserId();
    console.log(res)
    if(res.success){
      // Filter payments that have subscriptionId but NOT orderItemsId
      const filteredPayments = res.data.filter((payment: Payment) => 
        payment.orderId.some(order => 
          order.subscriptionId && (!order.orderItemsId || order.orderItemsId.length === 0)
        )
      )
      setSubscriptionPayments(filteredPayments)
    }
  }

  useEffect(() => {
    fetchPayments()
  },[])

  return (
    <div className="min-h-screen bg-secondary py-8 w-full">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-foreground mb-8">My Subscription</h1>

        <div className="bg-card rounded-lg border border-border">
          <div className="grid grid-cols-5 gap-4 px-6 py-4 bg-secondary border-b border-border font-semibold text-muted-foreground text-sm">
            <div>Product Name</div>
            <div>Delivery Date</div>
            <div>Quantity</div>
            <div>Price</div>
            <div>Shop Name</div>
          </div>

          <div className="divide-y divide-border">
            {subscriptionPayments.length === 0 ? (
              <div className="px-6 py-8 text-center text-muted-foreground">
                No subscription orders yet
              </div>
            ) : (
              subscriptionPayments.flatMap((payment) => 
                payment.orderId
                  .filter((order: any) => 
                    order.subscriptionId && (!order.orderItemsId || order.orderItemsId.length === 0)
                  )
                  .map((order: any, orderIndex: number) => (
                    <div
                      key={`${payment._id}-${order._id || orderIndex}`}
                      className="grid grid-cols-5 gap-4 px-6 py-4 items-center hover:bg-secondary/50 transition-colors"
                    >
                      <div className="font-medium text-foreground">
                        {order?.subscriptionId?.subscription_planId?.productId?.[0]?.name || 'N/A'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order?.subscriptionId?.subscription_planId?.quantity || 'N/A'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Rs.{payment.amount}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order?.shopId?.name || 'N/A'}
                      </div>
                    </div>
                  ))
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
