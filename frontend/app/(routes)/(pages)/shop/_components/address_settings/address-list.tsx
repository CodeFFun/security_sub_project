'use client';

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical } from 'lucide-react'

export type Address = {
  _id: string
  label: string
  country: string
  state: string
  city: string
  line1: string
}

interface AddressListProps {
  addresses: Address[]
  onDelete?: (id: string) => void
  onEdit?: (id: string) => void
}

export default function AddressList({
  addresses,
  onDelete,
  onEdit,
}: AddressListProps) {
  if (addresses.length === 0) {
    return null
  }

  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold text-foreground mb-6">
        Your Addresses
      </h2>
      <div className="grid grid-cols-6 gap-6 px-4 py-3 bg-secondary border border-border rounded-t-lg font-semibold text-foreground text-sm">
        <div>Label</div>
        <div>Country</div>
        <div>State</div>
        <div>City</div>
        <div>Full Address Line</div>
        <div className="text-right">Actions</div>
      </div>
      <div className="border-b border-l border-r border-border divide-y divide-border">
        {addresses.map((address) => (
          <div
            key={address._id}
            className="grid grid-cols-6 gap-6 px-4 py-4 items-center hover:bg-secondary transition-colors"
          >
            <div>
              <p className="font-medium text-foreground">{address.label}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{address.country}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{address.state}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{address.city}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{address.line1}</p>
            </div>
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit?.(address._id)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete?.(address._id)}
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
