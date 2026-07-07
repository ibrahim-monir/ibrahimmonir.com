import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchSettings, str } from "@/lib/settings";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await fetchSettings();

  return (
    <>
      <TopBar phone={str(settings.contact_phone)} />
      <Navbar />
      <main className="pt-[100px] flex-1">{children}</main>
      <Footer />
    </>
  );
}
