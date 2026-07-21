import CategoriesSection from "./home/categories-section"
import DiscountSection from "./home/discount-section.tsx"
import ShopSection from "./home/shop-section"

export const metadata = {
  title: 'Home - Shop',
  description: 'Browse our flash sale, categories, and all products',
}

export default function CustomerHome() {
  return (
    <main className="w-full min-h-screen bg-secondary">
      <DiscountSection />
      <CategoriesSection />
      <ShopSection />
    </main>
  )
}
