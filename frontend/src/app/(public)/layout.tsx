import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchSettings, str } from "@/lib/settings";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await fetchSettings();

  const socialLinks: Record<string, string> = {
    social_github:    str(settings.social_github),
    social_linkedin:  str(settings.social_linkedin),
    social_facebook:  str(settings.social_facebook),
    social_twitter:   str(settings.social_twitter),
    social_instagram: str(settings.social_instagram),
    social_youtube:   str(settings.social_youtube),
  };

  return (
    <>
      <TopBar phone={str(settings.contact_phone)} socialLinks={socialLinks} />
      <Navbar />
      <main className="pt-[100px] flex-1">{children}</main>
      <Footer />
    </>
  );
}
