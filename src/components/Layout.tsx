import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import BreakingNews from "./BreakingNews";
import WhatsAppButton from "./WhatsAppButton";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 font-sans transition-colors duration-200">
      <BreakingNews />
      <Header />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
