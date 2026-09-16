import { FaStar } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const reviews = [
  {
    id: 1,
    name: "Nishanth Ligori",
    avatar: "NL",
    timeAgo: "5 years ago",
    rating: 5,
    review:
      "One of the best Hub for Men's Clothing....Great collection of shirts, tees, hoodies, pants, accessories and perfumes are available at nominal price... The best quality products... Trendy and Innovative Collections... Definitely you won't deny it's quality... Just loved it... World wide shipping service is available... Delivery at any place... Overall 5/5..",
  },
  {
    id: 2,
    name: "Vimal Raj",
    avatar: "VR",
    timeAgo: "2 years ago",
    rating: 5,
    review:
      "I like hunter❤️ menswear .\nI purchased phants and trackpants are quality wise top level ⚡\nFast reply and best guidence 😈 🎈 product details explaining very well 👍 💯 🤝 with clearly 🔥\nThank you @Hunter men's wear 🙏 😎\n\nTrusted 💯",
  },
  {
    id: 3,
    name: "Jaaser Shahul",
    avatar: "JS",
    timeAgo: "3 years ago",
    rating: 5,
    review:
      "Hunter Mens Clothing wear is located near Vivekanandapuram,Kanyakumari.Its Started morethan 4 years ago.They have the best Zero degree perfume also.They Had 146k followers on Instagram as of now.Its the famous men clothing around Kanyakumari District.They have the Great collection of shirts, tees, hoodies, pants, accessories and perfumes are available at nominal price.The best quality deny its quality",
  },
];

export default function Testimonials() {
  return (
    <section className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-10 sm:py-16">
      {/* Section Header */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center gap-2 mb-2">
          <FcGoogle className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Google Customer Reviews
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-black tracking-tight uppercase">
          What Our Customers Say
        </h2>
      </div>

      {/* 3-Column Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
        {reviews.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] transition-all duration-300 relative group"
          >
            <div>
              {/* Header: User Avatar & Name & Google Icon */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 text-xs font-bold tracking-wider shadow-sm">
                    {item.avatar}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-black tracking-tight leading-snug">
                      {item.name}
                    </h3>
                  </div>
                </div>
                <FcGoogle className="w-5 h-5 flex-shrink-0 opacity-80 group-hover:opacity-100 transition" />
              </div>

              {/* 5-Star Rating & Date */}
              <div className="flex items-center gap-2 mb-3.5">
                <div className="flex text-amber-400 text-xs">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <FaStar key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-[11px] text-gray-400 font-medium">
                  {item.timeAgo}
                </span>
              </div>

              {/* Review Quote */}
              <p className="text-xs sm:text-[13px] text-gray-700 leading-relaxed font-normal whitespace-pre-line">
                "{item.review}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}