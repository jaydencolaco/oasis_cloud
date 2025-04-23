import EditProducts from "@/components/Admin/EditProducts";
import { Navbar } from "@/components/Navbar";

export default async function Page({ params }: any) {
  const { id } = await params;
  const mainId = id
    .split("_")
    .map((word: string) => word.toUpperCase())
    .join(" ");
  return (
    <div>
      <Navbar />
      <div className="pt-16">
        <EditProducts id={mainId} />
      </div>
    </div>
  );
}
