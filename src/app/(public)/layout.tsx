import { Footer } from "@/components/shared/Footer";
import { Navbar } from "@/components/shared/Navbar";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar></Navbar>
      <main className="min-h-[calc(100vh-167px)]">{children}</main>
      <Footer></Footer>
    </>
  );
}
