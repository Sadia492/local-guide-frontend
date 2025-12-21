// components/modules/Home/DynamicCategories.tsx
import { getListings } from "@/services/listing/listing.service";
import Link from "next/link";
import {
  Utensils,
  Camera,
  Landmark,
  Music,
  ShoppingBag,
  Mountain,
  Palette,
  Wine,
  Castle,
  Compass,
  TreePine,
  Tent,
  Dumbbell,
  Coffee,
  Building,
  Globe,
  Theater,
  Car,
  Bike,
  Ship,
  Plane,
} from "lucide-react";

// Icon mapping for common categories
const ICON_MAPPING: Record<string, any> = {
  food: Utensils,
  photography: Camera,
  history: Landmark,
  culture: Landmark,
  nightlife: Music,
  music: Music,
  jazz: Music,
  shopping: ShoppingBag,
  adventure: Mountain,
  outdoor: Mountain,
  hiking: Mountain,
  nature: TreePine,
  art: Palette,
  museum: Landmark,
  culinary: Utensils,
  drinks: Wine,
  wine: Wine,
  market: ShoppingBag,
  boutique: ShoppingBag,
  architecture: Building,
  heritage: Castle,
  walking: Compass,
  camping: Tent,
  sports: Dumbbell,
  cafe: Coffee,
  city: Building,
  cultural: Globe,
  entertainment: Theater,
  transport: Car,
  cycling: Bike,
  cruise: Ship,
  air: Plane,
};

const DEFAULT_ICON = Compass;

export async function Categories() {
  const listings = await getListings();

  // Count tours by category
  const categoryMap = new Map<string, number>();

  listings.forEach((tour) => {
    if (tour.category) {
      const category = tour.category.trim();
      const currentCount = categoryMap.get(category) || 0;
      categoryMap.set(category, currentCount + 1);
    }
  });

  // Convert to array and sort by count (descending)
  const categories = Array.from(categoryMap.entries())
    .map(([name, count]) => {
      const IconComponent = getIconForCategory(name);
      return {
        name,
        count,
        icon: IconComponent,
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 12); // Limit to top 12 categories

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore by Interest
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find experiences that match your passion
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/explore?category=${encodeURIComponent(category.name)}`}
              className="group bg-gray-50 hover:bg-blue-50 rounded-2xl p-6 text-center cursor-pointer transition-all hover:shadow-lg block"
            >
              <div className="bg-white group-hover:bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                <category.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500">
                {category.count} tour{category.count !== 1 ? "s" : ""}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function getIconForCategory(categoryName: string): any {
  const lowerCategory = categoryName.toLowerCase();

  for (const [key, icon] of Object.entries(ICON_MAPPING)) {
    if (lowerCategory.includes(key)) {
      return icon;
    }
  }

  return DEFAULT_ICON;
}
