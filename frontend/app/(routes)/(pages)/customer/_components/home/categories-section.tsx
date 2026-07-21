'use client'

import { useState, useEffect } from 'react'
import {
  Droplets, Zap, Wind, Refrigerator, Lock, Trees,
  Paintbrush, Hammer, Bug, Sparkles, Wrench, type LucideIcon,
} from 'lucide-react'
import { handleGetAllShopCategory } from '@/lib/actions/shop-category-action'

type CATEGORY = {
  _id: string;
  name: string;
}

// Map a trade category to a fitting icon by keyword, with a sensible fallback.
function iconForCategory(name: string): LucideIcon {
  const n = name.toLowerCase()
  if (n.includes('plumb')) return Droplets
  if (n.includes('electric')) return Zap
  if (n.includes('hvac') || n.includes('climate') || n.includes('air')) return Wind
  if (n.includes('appliance')) return Refrigerator
  if (n.includes('lock') || n.includes('security')) return Lock
  if (n.includes('landscap') || n.includes('lawn') || n.includes('garden')) return Trees
  if (n.includes('paint') || n.includes('drywall')) return Paintbrush
  if (n.includes('carpen') || n.includes('handyman')) return Hammer
  if (n.includes('pest')) return Bug
  if (n.includes('clean')) return Sparkles
  return Wrench
}

export default function CategoriesSection() {
  const [categories, setCategories] = useState<CATEGORY[]>([])

  const getAllCategories = async () => {
    const res = await handleGetAllShopCategory()
    if (res.success) {
      setCategories(res.data)
    }
  }

  useEffect(() => {
    getAllCategories()
  }, [])

  return (
    <section className="w-full bg-secondary py-12">
      <div className="max-w-7xl mx-auto px-8">
        <h2 className="text-3xl font-bold text-foreground mb-8">Categories</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((category) => {
            const Icon = iconForCategory(category.name)
            return (
              <div
                key={category._id}
                className="flex flex-col items-center text-center cursor-pointer group"
              >
                <div className="w-full aspect-square bg-card rounded-lg mb-3 flex items-center justify-center border border-border group-hover:border-accent group-hover:shadow-md transition-all">
                  <Icon
                    size={40}
                    strokeWidth={1.75}
                    className="text-primary group-hover:text-accent transition-colors dark:text-foreground"
                  />
                </div>
                <p className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-accent transition-colors">
                  {category.name}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
