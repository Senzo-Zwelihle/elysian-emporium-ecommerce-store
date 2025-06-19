import Footer from "@/components/store/components/shop/home/footer";
import Navigationbar from "@/components/store/components/shop/home/navigationbar";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <Navigationbar />
      {children}
      <Footer />
    </main>
  );
}
