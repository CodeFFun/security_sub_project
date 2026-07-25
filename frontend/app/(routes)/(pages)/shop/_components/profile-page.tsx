"use client"

import {  useEffect, useState } from "react"
import { Sidebar } from "./sidebar"
import { Profile } from "../../customer/profile/_components/profilepage"
import { NotificationMainbar } from "../../customer/profile/_components/notification-mainbar"
import ShopForm from "./shop_settings/shop-form"
import AddressForm from "./address_settings/address-form"
import ProductForm from "./product_settings/product-form"
import ProductList from "./product_settings/product-list"
import Shop from "./shop_settings/shop"
import CategoryForm from "./category_settings/category-form"
import SubscriptionsListPage from "./subs_settings/subscription-list-page"
import OrdersListPage from "./order_settings/order-list-page"
import InvoicesPage from "./invoices_settings/invoices-page"

export default function ProfilePage({user}:{user: any}) {
  const [activeTab, setActiveTab] = useState("")
  useEffect(() => {
    const storedActiveTab = sessionStorage.getItem("activeTab")
    if (storedActiveTab) {
      setActiveTab(storedActiveTab)
    }else{
      setActiveTab("My Profile")
    }
  }, [])
  useEffect(() => {
      sessionStorage.setItem("activeTab", activeTab)
  }, [activeTab])

  return (
    <div className="flex min-h-screen bg-secondary">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "My Profile" && <Profile user={user} />}
      {activeTab === "Notification" && <NotificationMainbar />}
      {activeTab === "Create Shop" && <ShopForm/>}
      {activeTab === "My Shops" && <Shop/>}
      {activeTab === "Addresses" && <AddressForm/>}
      {activeTab === "Add Product" && <ProductForm/>}
      {activeTab === "All Products" && <ProductList />}
      {activeTab === "Product Category" && <CategoryForm />}
      {activeTab === "Active Subs" && <SubscriptionsListPage />}
      {activeTab === "Orders" && <OrdersListPage />}
      {activeTab === "Invoices" && <InvoicesPage />}
    </div>

  )
}
