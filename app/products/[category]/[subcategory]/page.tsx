import Footer from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import ProductsSubCategoryGrid from "@/components/Products/ProdSubCategoryGrid";

export interface SubCatPageProps {
  params: {
    category: string;
    subcategory: string;
  };
}

export default async function Page({ params }: SubCatPageProps) {
  const newparams = await params;

  return (
    <div>
      <Navbar />
      <div className="pt-16">
        <ProductsSubCategoryGrid params={newparams} />
      </div>
      <Footer />
    </div>
  );
}
