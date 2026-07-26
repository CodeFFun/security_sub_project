'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AddressList, { type Address } from './address-list'
import { handleCreateAddress, handleGetAllAddressOfAUser, handleUpdateAddress, handleDeleteAddress } from '@/lib/actions/address-action'
import { toast } from 'sonner'

export default function AddressForm() {

  const [label, setLabel] = useState('')
  const [country, setCountry] = useState('')
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [line1, setLine1] = useState('')
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isUpdate, setIsUpdate] = useState(false)
  const [editAddress, setEditAddress] = useState({
    id:'',
    label:'',
    country:'',
    state:'',
    city:'',
    line1:''
  })

  const fetchAddresses = async () => {
      const res = await handleGetAllAddressOfAUser()
      if (res.success) {
        setAddresses(res.data)
      } else {
        console.error('Failed to fetch addresses:', res.message)
      }
    }

  useEffect(() => {
    fetchAddresses()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!label || !country || !state || !city || !line1) {
      alert('Please fill in all fields')
      return
    }

    const formData = {
      label,
      country,
      state,
      city,
      line1,
    }

    const res = await handleCreateAddress(formData)
    if (res.success) {
      toast.success('Address created successfully')
      fetchAddresses()
      setLabel('')
      setCountry('')
      setState('')
      setCity('')
      setLine1('')
    } 
  }

  const handleUpdate = async () => {
    const formData = {
      label: editAddress.label,
      country: editAddress.country,
      state: editAddress.state,
      city: editAddress.city,
      line1: editAddress.line1,
    }
    const res = await handleUpdateAddress(editAddress.id, formData)
    if (res.success) {
      toast.success('Address updated successfully')
      // fetchAddresses()
    }
    setIsUpdate(false)
    setEditAddress({
      id:'',
      label:'',
      country:'',
      state:'',
      city:'',
      line1:''
    })
  }

  const deleteAddress = async (id: string) => {
    await handleDeleteAddress(id)
  }

  const handleEditAddress = (id: string) => {
    setIsUpdate(true)
    const address = addresses.find((a) => a._id === id)
    if (address) {
      setEditAddress({
        id: address._id,
        label: address.label,
        country: address.country,
        state: address.state,
        city: address.city,
        line1: address.line1,
      })
    }
  }

  return (
    <div className="mx-auto px-4 py-8 w-full">
      <div className="bg-card rounded-lg border border-border p-8 mb-8">
        <div className="mb-8">
          <div className="bg-secondary rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-1">
              Address Information
            </h2>
            <p className="text-sm text-muted-foreground">
              Add and manage your delivery addresses
            </p>
          </div>
        </div>

        <form onSubmit={isUpdate ? handleUpdate : handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label
                htmlFor="label"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Label
              </Label>
              <Input
                id="label"
                type="text"
                placeholder="e.g., Home, Office"
                value={isUpdate ? editAddress.label : label}
                onChange={(e) => isUpdate ? setEditAddress({...editAddress, label: e.target.value}) : setLabel(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <Label
                htmlFor="country"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Country
              </Label>
              <Input
                id="country"
                type="text"
                placeholder="Country name"
                value={isUpdate ? editAddress.country : country}
                onChange={(e) => isUpdate ? setEditAddress({...editAddress, country: e.target.value}) : setCountry(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <Label
                htmlFor="state"
                className="block text-sm font-medium text-foreground mb-2"
              >
                State
              </Label>
              <Input
                id="state"
                type="text"
                placeholder="State/Province"
                value={isUpdate ? editAddress.state : state}
                onChange={(e) => isUpdate ? setEditAddress({...editAddress, state: e.target.value}) : setState(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label
                htmlFor="city"
                className="block text-sm font-medium text-foreground mb-2"
              >
                City
              </Label>
              <Input
                id="city"
                type="text"
                placeholder="City name"
                value={isUpdate ? editAddress.city : city}
                onChange={(e) => isUpdate ? setEditAddress({...editAddress, city: e.target.value}) : setCity(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <Label
                htmlFor="line1"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Address Line 1
              </Label>
              <Input
                id="line1"
                type="text"
                placeholder="Full street address"
                value={isUpdate ? editAddress.line1 : line1}
                onChange={(e) => isUpdate ? setEditAddress({...editAddress, line1: e.target.value}) : setLine1(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
          <div className="pt-6">
            <Button
              type="submit"
              className="w-full md:w-auto bg-accent hover:opacity-90 text-accent-foreground font-medium py-2 px-6 rounded-lg transition-colors"
            >
              {isUpdate ? 'Update Address' : 'Add Address'}
            </Button>
          </div>
        </form>
      </div>
      <AddressList
        addresses={addresses}
        onDelete={deleteAddress}
        onEdit={handleEditAddress}
      />
    </div>
  )
}
