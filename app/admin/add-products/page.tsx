import AddProducts from "@/components/Admin/AddProducts";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="pt-16">
        <AddProducts />
      </div>
    </div>
  );
}
