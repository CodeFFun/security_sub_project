"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import {
  handleDeleteOrder,
  handleGetOrderByUserId,
} from "@/lib/actions/order-action";
import { toast } from "sonner";
import { handleUpdateOrderItem } from "@/lib/actions/order-item-action";
import {
  handleCreatePayment,
  handleEsewaPayment,
} from "@/lib/actions/payment-action";
import crypto from "crypto";
import { esewaPayment } from "@/lib/api/payment";

export interface CartItem {
  _id: string;
  orderItemsId: {
    _id: string;
    productId: {
      _id: string;
      name: string;
    };
    quantity: number;
    unit_price: number;
  }[];
  shopId: {
    _id: string;
    name: string;
  };
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const getAllCartitems = async () => {
    const res = await handleGetOrderByUserId();
    if (res.success) {
      const filteredCartItems = res.data.filter(
        (item: CartItem) =>
          item.orderItemsId?.length > 0 && item.orderItemsId[0]?.productId,
      );
      setCartItems(filteredCartItems);
    } else {
      console.error("Failed to fetch cart items:", res.message);
    }
  };

  useEffect(() => {
    getAllCartitems();
  }, []);

  const handleToggleItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleCheckAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(cartItems.map((item) => item._id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleQuantityChange = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems((items) => {
      return items.map((item) =>
        item._id === id
          ? {
              ...item,
              orderItemsId: [
                {
                  ...item.orderItemsId[0],
                  quantity: newQuantity,
                },
              ],
            }
          : item,
      );
    });
    const item = cartItems.find((item) => item._id === id);
    if (!item?.orderItemsId?.[0]) return;
    const res = await handleUpdateOrderItem(item!.orderItemsId[0]._id, {
      quantity: newQuantity,
    });
    if (res.success) {
      getAllCartitems();
    }
  };

  const handleRemoveItem = async (id: string) => {
    console.log(id);
    const res = await handleDeleteOrder(id);
    if (res.success) {
      getAllCartitems();
      toast.success("Item removed from cart");
    } else {
      toast.error("Failed to remove item from cart");
    }
  };

  const isAllChecked =
    cartItems.length > 0 && selectedItems.size === cartItems.length;
  const isIndeterminate =
    selectedItems.size > 0 && selectedItems.size < cartItems.length;

  const totalPrice = Array.from(selectedItems).reduce((sum, id) => {
    const item = cartItems.find((i) => i._id === id);
    const value =
      sum +
      (item
        ? item.orderItemsId[0].unit_price * item.orderItemsId[0].quantity
        : 0);
    return parseFloat(value.toFixed(2));
  }, 0);

  const handleCheckout = async () => {
    const selectedCartItems = Array.from(selectedItems)
      .map((id) => cartItems.find((item) => item._id === id))
      .filter((item): item is CartItem => item !== undefined);

    const totalQuantity = selectedCartItems.reduce(
      (sum, item) => sum + (item.orderItemsId[0]?.quantity || 0),
      0,
    );
    const totalAmount = selectedCartItems.reduce(
      (sum, item) =>
        sum +
        (item.orderItemsId[0]?.unit_price || 0) *
          (item.orderItemsId[0]?.quantity || 0),
      0,
    );
    console.log(totalAmount, totalQuantity);
    console.log("Total Quantity:", totalQuantity);
    console.log("Total Amount:", totalAmount);

    const selectedCartItemsId = selectedCartItems.map((item) => item._id);
    const payment = {
      amount: totalPrice,
      orderId: selectedCartItemsId,
    };

    const res = await handleEsewaPayment(payment);
    console.log(res)
    if (res.success) {
      // After receiving the response from POST /payment/esewa/initialize
      const { esewaUrl, params } = res.data;

      // Create a temporary form
      const form = document.createElement("form");
      form.method = "POST";
      form.action = esewaUrl;

      // Add all parameters as hidden inputs
      Object.entries(params).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      });

      // Add form to page and submit
      document.body.appendChild(form);
      form.submit();
      toast.success("Payment successful");
      getAllCartitems();
    } else {
      toast.error("Payment failed");
    }
  };

  const groupedByShop = cartItems.reduce(
    (acc, item) => {
      if (!acc[item.shopId.name]) {
        acc[item.shopId.name] = [];
      }
      acc[item.shopId.name].push(item);
      return acc;
    },
    {} as Record<string, CartItem[]>,
  );

  return (
    <div className="w-full min-h-screen bg-secondary p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Your cart is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card rounded-lg p-6 border border-border flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={isAllChecked}
                  ref={(el) => {
                    if (el) {
                      el.indeterminate = isIndeterminate;
                    }
                  }}
                  onChange={(e) => handleCheckAll(e.target.checked)}
                  className="w-5 h-5 text-accent rounded cursor-pointer"
                />
                <span className="text-sm font-medium text-foreground">
                  Select All Items
                </span>
              </div>

              {Object.entries(groupedByShop).map(([shopName, items]) => (
                <div
                  key={shopName}
                  className="bg-card rounded-lg border border-border overflow-hidden"
                >
                  <div className="bg-secondary px-6 py-4 border-b border-border">
                    <h2 className="font-semibold text-foreground">{shopName}</h2>
                  </div>

                  <div className="divide-y divide-border">
                    {items.map((item) => (
                      <div
                        key={item._id}
                        className="p-6 flex items-center gap-6 hover:bg-secondary transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item._id)}
                          onChange={() => handleToggleItem(item._id)}
                          className="w-5 h-5 text-accent rounded cursor-pointer shrink-0"
                        />
                        <div className="grow">
                          <p className="text-sm text-muted-foreground mb-1">
                            {item.shopId.name}
                          </p>
                          <h3 className="font-medium text-foreground text-base">
                            {item.orderItemsId[0].productId.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-3 bg-secondary rounded-lg p-2">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item._id,
                                item.orderItemsId[0].quantity - 1,
                              )
                            }
                            className="text-foreground hover:text-accent transition-colors p-1"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium text-foreground">
                            {item.orderItemsId[0].quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item._id,
                                item.orderItemsId[0].quantity + 1,
                              )
                            }
                            className="text-foreground hover:text-accent transition-colors p-1"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="w-28 text-right">
                          <p className="font-semibold text-foreground text-lg">
                            Rs.
                            {(
                              item.orderItemsId[0].unit_price *
                              item.orderItemsId[0].quantity
                            ).toFixed(2)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 p-2 rounded transition-colors shrink-0"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg p-6 border border-border sticky top-8">
                <h2 className="text-xl font-semibold text-foreground mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium text-foreground">
                      Rs.{totalPrice}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium text-foreground">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium text-foreground">
                      Rs.{Math.round(totalPrice * 0.1)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between mb-6">
                  <span className="text-lg font-semibold text-foreground">
                    Total
                  </span>
                  <span className="text-lg font-bold text-accent">
                    Rs.{Math.round(totalPrice * 1.1)}
                  </span>
                </div>

                <Button
                  className="w-full bg-accent hover:opacity-90 text-accent-foreground py-3 rounded-lg font-medium"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>

                <p className="text-sm text-muted-foreground text-center mt-4">
                  Selected {selectedItems.size} of {cartItems.length} items
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
