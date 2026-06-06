import { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PlayListSidebar from "@/components/playlist-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { usePublicPlaylistSSE } from "@/hooks/use-public-playlist-sse";

function SongsLayout() {
  const [notification, setNotification] = useState(null);

  const handleNotification = useCallback((data) => {
    const { action, playlist } = data;
    let message = '';
    
    switch(action) {
      case 'created': 
        message = `Playlist mới "${playlist.name}" vừa được tạo!`; 
        break;
      case 'made_public': 
        message = `Playlist "${playlist.name}" vừa được chuyển sang public!`; 
        break;
      case 'made_private': 
        message = `Playlist "${playlist.name}" không còn public nữa!`; 
        break;
      case 'deleted': 
        message = `Playlist public "${playlist.name}" đã bị xóa!`; 
        break;
      default:
        break;
    }

    if (message) {
      setNotification(message);
      setTimeout(() => setNotification(null), 5000);
    }
  }, []);

  usePublicPlaylistSSE(handleNotification);

  return (
    <>
      <Navbar />
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-5">
          <div className="bg-blue-600 text-white px-6 py-4 rounded-lg shadow-xl font-medium">
            🔔 {notification}
          </div>
        </div>
      )}

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