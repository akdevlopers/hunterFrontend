import Image from "next/image";
import { FaHeart, FaStar } from "react-icons/fa";

const products = [
  {
    id: 1,
    name: "Oversized Hoodie",
    price: "$89",
    image: "/images/product1.jpg",
  },
  {
    id: 2,
    name: "Streetwear Jacket",
    price: "$120",
    image: "/images/product2.jpg",
  },
  {
    id: 3,
    name: "Cargo Pants",
    price: "$75",
    image: "/images/product3.jpg",
  },
  {
    id: 4,
    name: "Graphic T-Shirt",
    price: "$55",
    image: "/images/product4.jpg",
  },
];

export default function Products() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">
          <p className="uppercase tracking-[4px] text-orange-500 font-semibold">
            Trending
          </p>

          <h2 className="text-4xl font-bold mt-3">
            Best Selling Products
          </h2>

          <p className="text-gray-500 mt-3">
            Premium quality streetwear designed for every season.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 group"
            >
              <div className="relative h-80 overflow-hidden">

                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition duration-700"
                />

                <button className="absolute top-4 right-4 bg-white p-3 rounded-full shadow hover:bg-orange-500 hover:text-white transition">
                  <FaHeart />
                </button>

              </div>

              <div className="p-6">

                <div className="flex text-orange-400 mb-2">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>

                <h3 className="font-bold text-xl">
                  {product.name}
                </h3>

                <p className="text-orange-500 font-bold text-2xl mt-2">
                  {product.price}
                </p>

                <button className="mt-5 w-full bg-black text-white py-3 rounded-full hover:bg-orange-500 transition">
                  Add to Cart
                </button>

              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}