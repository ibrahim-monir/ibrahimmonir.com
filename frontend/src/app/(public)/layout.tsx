import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchSettings, str } from "@/lib/settings";
import { fetchServiceNavItems } from "@/lib/services";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [settings, services] = await Promise.all([fetchSettings(), fetchServiceNavItems()]);

  return (
    <>
      <TopBar phone={str(settings.contact_phone)} />
      <Navbar services={services} />
      <main className="pt-[100px] flex-1">{children}</main>
      <Footer />
    </>
  );
}
