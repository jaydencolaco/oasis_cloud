import AdminPage from "@/components/Admin/AdminPage";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="pt-16">
        <AdminPage />
      </div>
    </div>
  );
}
