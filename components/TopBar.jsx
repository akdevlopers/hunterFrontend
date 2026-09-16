export default function TopBar() {
  const items = Array(8).fill(
    "HUNT YOUR WEAR • OWN YOUR STREET • WEAR IT DIFFERENT• HUNTER CLOTHING"
  );

  return (
    <div className="bg-[#111111] text-white py-2 sm:py-2.5 overflow-hidden border-b border-white/10">
      <div className="animate-marquee flex items-center gap-12 sm:gap-16 whitespace-nowrap text-[10px] sm:text-xs font-black tracking-[2.5px] uppercase">
        {items.map((text, index) => (
          <span key={index} className="flex items-center gap-12 sm:gap-16">
            <span>{text}</span>
            <span className="text-gray-500">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}