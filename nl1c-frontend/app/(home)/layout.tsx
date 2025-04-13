import NavigationBar1 from "@/app/ui/home/NavigationBar_1";
import NavigationBar from "@/app/ui/home/NavigationBar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        backgroundImage: "url('/waterBG.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
      }}
    >
      <NavigationBar1 />
      <div>_</div>
      <NavigationBar />
      {children}
    </div>
  );
}
