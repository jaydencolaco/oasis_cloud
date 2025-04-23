import Footer from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import ProductsGrid from "@/components/Products/ProdCategoryGrid";

export default async function Page({ params }: any) {
  const { category } = await params;
  return (
    <div>
      <Navbar />
      <div className="pt-16">
        <ProductsGrid category={category} />
      </div>
      <Footer />
    </div>
  );
}
