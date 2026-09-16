import Image from "next/image";

const collections = [
  {
    title: "Oversized",
    image: "/images/oversized.jpg",
  },
  {
    title: "Hoodies",
    image: "/images/hoodie.jpg",
  },
  {
    title: "Sneakers",
    image: "/images/sneakers.jpg",
  },
];

export default function Collections() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">
          <p className="text-orange-500 uppercase tracking-[4px] font-semibold">
            Collections
          </p>

          <h2 className="text-4xl font-bold mt-2">
            Shop By Collection
          </h2>

          <p className="text-gray-500 mt-4">
            Discover premium streetwear curated for every style.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {collections.map((item) => (
            <div
              key={item.title}
              className="group relative h-[500px] overflow-hidden rounded-3xl cursor-pointer"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition duration-700"
              />

              <div className="absolute inset-0 bg-black/35 group-hover:bg-black/50 transition"></div>

              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-3xl font-bold">
                  {item.title}
                </h3>

                <button className="mt-4 bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-black hover:text-white transition">
                  Shop Now
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}