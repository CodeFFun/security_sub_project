import { useEffect, useState } from "react";
import { Shop as ShopInterface } from "./shop-list";
import ShopEditForm from "./shop-edit-form";
import ShopList from "./shop-list";
import { getAllShopsOfAUser } from "@/lib/api/shop";
import { getAllAddressOfAUser } from "@/lib/api/address";
import { handleDeleteShop, handleUpdateShop } from "@/lib/actions/shop-action";
import { toast } from "sonner";
import { handleGetAllShopCategory } from "@/lib/actions/shop-category-action";

export default function Shop(){
    const [shops, setShops] = useState<ShopInterface[]>([])
    const [selectedShop, setSelectedShop] = useState<ShopInterface | null>(null)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [addresses, setAddresses] = useState<{"_id":string, "label":string, "city":string, "line1":string}[]>([])
    const [categories, setCategories] = useState<{"_id":string, "name":string}[]>([])

    const fetchCategories = async () => {
        try {
          const res = await handleGetAllShopCategory()
          console.log('Fetched categories:', res)
          if (res.success) {
            setCategories(res.data)
          }
        } catch (err) {
          console.error('Failed to fetch categories:', err)
        }
      }

    const fetchAddresses = async () => {
        try {
          const res = await getAllAddressOfAUser()
          console.log('Fetched addresses:', res)
          if (res.success) {
            setAddresses(res.data)
          }
        } catch (err) {
          console.error('Failed to fetch addresses:', err)
        }
      }

    const fetchData = async () => {
        const res = await getAllShopsOfAUser()
        console.log(res)
        if (res.success) {
        setShops(res.data)
        }
  }
  useEffect(() => {
    fetchAddresses()
    fetchData()
    fetchCategories()
  },[])

  const handleEdit = (id: string) => {
    const shop = shops.find((s) => s._id === id)
    if (shop) {
      setSelectedShop(shop)
      setEditDialogOpen(true)
    }
  }

  const handleDelete = async (id: string) => {
    const res = await handleDeleteShop(id)
    if(res.success){
        toast.success("Shop deleted successfully")
        fetchData()
    } else {
        toast.error("Failed to delete shop")
    }
  }

  const handleSaveEdit =async(id:string, updatedShop: any) => {
    const res = await handleUpdateShop(id, updatedShop)
    if(res.success){
        toast.success("Shop updated successfully")
        setEditDialogOpen(false)
        fetchData()
    }
  }
    return (
         <div className="w-full min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <ShopList
          shops={shops}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
      <ShopEditForm
        addresses={addresses}
        categories={categories}
        shop={selectedShop}
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleSaveEdit}
      />
    </div>
    )
}