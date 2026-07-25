import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Product } from "./product-list";
import { handleUpdateProduct } from "@/lib/actions/product-action";
import { toast } from "sonner";

export function ProductEditForm({open, onClose, selectedProduct, categories}: {open: boolean, onClose: () => void, selectedProduct: Product | null, categories: { _id: string; name: string }[]}) {
    const [productName, setProductName] = useState('')
      const [basePrice, setBasePrice] = useState( ''
      )
      const [stockQuantity, setStockQuantity] = useState( ''
      )
      const [discountPrice, setDiscountPrice] = useState('')
      const [productDescription, setProductDescription] = useState('')
      

    useEffect(() => {
        console.log(categories)
        if (selectedProduct) {
          setProductName(selectedProduct.name)
          setBasePrice(selectedProduct.base_price.toString())
          setStockQuantity(selectedProduct.stock_quantity.toString())
          setDiscountPrice(selectedProduct.discount.toString())
          setProductDescription(selectedProduct.description || '')
        }
    }, [selectedProduct])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const id = selectedProduct?._id
        const formData = {
          name: productName,
          base_price: parseFloat(basePrice),
          stock_quantity: parseInt(stockQuantity, 10),
          discount: discountPrice ? parseFloat(discountPrice) : 0,
          description: productDescription,
        }
        const res = await handleUpdateProduct(id as string, formData)
        console.log(res)
        if(res.success){
            onClose()
            toast.success("Product updated successfully")
        }
    }

    const handleCancel = () => {
        onClose()
    }
   
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>Update your product information</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div>
              <Label
                htmlFor="productName"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Product Name
              </Label>
              <Input
                id="productName"
                type="text"
                placeholder="Enter product name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Label
                htmlFor="basePrice"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Base Price
              </Label>
              <Input
                id="basePrice"
                type="number"
                placeholder="Enter base price"
                value={basePrice}
                onChange={(e) => {
                  setBasePrice(e.target.value);
                }}
                step="0.01"
                min="0"
                className="w-full"
              />
            </div>

            {/* Stock Quantity */}
            <div>
              <Label
                htmlFor="stockQuantity"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Stock Quantity
              </Label>
              <Input
                id="stockQuantity"
                type="number"
                placeholder="Enter stock quantity"
                value={stockQuantity}
                onChange={(e) => {
                  setStockQuantity(e.target.value);
                }}
                min="0"
                className="w-full"
              />
            </div>
            <div>
              <Label
                htmlFor="discountPrice"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Discount Price
              </Label>
              <Input
                id="discountPrice"
                type="number"
                placeholder="Enter discount price"
                value={discountPrice}
                onChange={(e) => {
                  setDiscountPrice(e.target.value);
                }}
                step="0.01"
                min="0"
                className="w-full"
              />
            </div>
          </div>
          <div className="mb-6">
            <Label
              htmlFor="productDescription"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Product Description
            </Label>
            <Textarea
              id="productDescription"
              placeholder="Enter product description"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              className="w-full"
            />
          </div>
          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              type="submit"
              className="bg-accent hover:opacity-90 text-accent-foreground"
            >
              Update Product
            </Button>
            <Button
              onClick={() => handleCancel}
              className="bg-destructive hover:opacity-90 text-destructive-foreground"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
