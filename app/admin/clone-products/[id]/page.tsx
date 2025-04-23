import CloneProducts from "@/components/Admin/CloneProducts";
import { Navbar } from "@/components/Navbar";

export default async function Page({ params }: any) {
  const { id } = await params;
  return (
    <div>
      <Navbar />
      <div className="pt-16">
        <CloneProducts id={id} />
      </div>
    </div>
  );
}
