import TopBar from "../../components/TopBar";
import Navbar from "../../components/Navbar";
import Hero from "../../components/Hero";
import CategoryIcons from "../../components/CategoryIcons";
import BestSelling from "../../components/BestSelling";
import Categories from "../../components/Categories";
import NewArrivals from "../../components/NewArrivals";
import BrandStory from "../../components/BrandStory";
import Testimonials from "../../components/Testimonials";
import Footer from "../../components/Footer";
import MobileBottomNav from "../../components/MobileBottomNav";

export default function Home() {
  return (
    <main className="min-h-screen bg-white pb-24 lg:pb-0">
      <TopBar />
      <Navbar />
      <Hero />
      <CategoryIcons />
      <BestSelling />
      <Categories />
      <NewArrivals />
      <BrandStory />
      <Testimonials />
      <Footer />
      <MobileBottomNav />
    </main>
  );
}