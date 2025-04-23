import Footer from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import ProductsGrid from "@/components/Products/ProductsGrid";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="pt-16">
        <ProductsGrid />
      </div>
      <Footer />
    </div>
  );
}
