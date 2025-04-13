import { NavigationBar } from "@/components/home/navagationBar";
import { Footer } from "@/components/home/footer";
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavigationBar />
      <main className="container mx-auto px-4 py-8">{children}</main>
      <Footer />
    </>
  );
}
