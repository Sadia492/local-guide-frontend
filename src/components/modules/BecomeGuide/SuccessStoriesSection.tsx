import { Star } from "lucide-react";

const featuredGuides = [
  {
    name: "Maria Rodriguez",
    city: "Barcelona",
    specialty: "Food & Wine",
    earnings: "$42,580",
    rating: 4.9,
    image: "https://i.pravatar.cc/150?img=8",
  },
  {
    name: "Kenji Tanaka",
    city: "Tokyo",
    specialty: "Traditional Arts",
    earnings: "$38,920",
    rating: 4.8,
    image: "https://i.pravatar.cc/150?img=9",
  },
  {
    name: "Sophie Dubois",
    city: "Paris",
    specialty: "Art History",
    earnings: "$51,230",
    rating: 4.9,
    image: "https://i.pravatar.cc/150?img=10",
  },
];

export default function SuccessStoriesSection() {
  return (
    <section className="mb-20">
      <h2 className="text-3xl font-bold text-center mb-12">
        Meet Our Successful Guides
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {featuredGuides.map((guide, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <img
                  src={guide.image}
                  alt={guide.name}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <h3 className="text-xl font-semibold">{guide.name}</h3>
                  <p className="text-gray-600">{guide.city}</p>
                </div>
              </div>
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                  {guide.specialty}
                </span>
              </div>
              <div className="flex justify-between items-center text-gray-700">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                  <span className="font-semibold">{guide.rating}</span>
                </div>
                <div className="text-lg font-bold text-green-600">
                  {guide.earnings}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
