import { Outlet } from "react-router-dom";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PlayListSidebar from "@/components/playlist-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

function SongsLayout() {
  return (
    <>
      <Navbar />
      <SidebarProvider
        className="min-h-0 flex-1"
        style={{
          "--sidebar-width": "100%"
        }}
      >
        <main className="grid flex-1 grid-cols-[minmax(240px,25%)_1fr] gap-6 muted/30 p-6">
          <aside className="min-w-0">
            <PlayListSidebar />
          </aside>

          <section className="min-w-0 rounded-xl border bg-background p-6">
            <Outlet />
          </section>
        </main>
      </SidebarProvider>

      <Footer companyName="Your company" year={new Date().getFullYear()} />
    </>
  )
}

export default SongsLayout;