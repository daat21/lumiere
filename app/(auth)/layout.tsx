import { ModeToggle } from "@/components/darkmode";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ModeToggle className="absolute top-5 right-5" />
      {children}
    </>
  );
}
