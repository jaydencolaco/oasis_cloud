import Footer from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import NewProductsPage from "@/components/Products/NewProductPage";

export default async function Page({ params }: any) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  console.log(decodedId);
  const mainId: string = decodedId
    .split("_")
    .map((str: string) => str.toUpperCase())
    .join(" ");
  console.log(mainId);
  return (
    <div className="">
      <Navbar />
      <div className="pt-16">
        {/* <ProductsPage id={id} /> */}
        <NewProductsPage id={mainId} />
      </div>
      <Footer />
    </div>
  );
}
