import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Icons from "@/components/icons";
import PlaylistCreateDialog from "@/components/dialogs/playlist-create-dialog";
import { deletePlaylist, getPublicPLaylists, getUserPLaylists } from "@/services/music";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import PLaylistEditDialog from "./dialogs/playlist-edit-dialog";

const PLAYLISTS_CHANGED_EVENT = "playlists:changed";

function getPLaylistPath(playlist) {
  return `/songs?playlist=${playlist.id}`;
}

function upsertPlaylist(playlists, nextPlaylist) {
  const hasPlaylist = playlists.some(
    (playlist) => String(playlist.id) === String(nextPlaylist.id),
  );

  if(!hasPlaylist) {
    return [...playlists, nextPlaylist];
  }

  return playlists.map((playlist) =>
    String(playlist.id) === String(nextPlaylist.id) ? nextPlaylist : playlist,
  );
}

function PlaylistMenuItem({
  playlist,
  isActive,
  editablePlaylist,
  onDeleted,
  onUpdated,
}) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link to={getPLaylistPath(playlist)}>
          <Icons.listMusic />
          <span>{playlist.name}</span>
        </Link>
      </SidebarMenuButton>
      {editablePlaylist ? (
        <PLaylistEditDialog
          playlist={editablePlaylist}
          onDeleted={onDeleted}
          onUpdated={onUpdated}
        />
      ) : null}
    </SidebarMenuItem>
  );
}

function PlaylistSidebar() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [playlistRefreshKey, setPlaylistRefreshKey] = useState(0);
  const [publicPLaylists, setPublicPLaylists] = useState([]);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [isPublicLoading, setIsPublicLoading] = useState(true);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [publicError, setPublicError] = useState("");
  const [userError, setUserError] = useState("");

  const privatePlaylists = useMemo(
    () => userPlaylists.filter((playlist) => !playlist.is_public),
    [userPlaylists],
  );
  const userPlaylistById = useMemo(
    () => new Map(userPlaylists.map((playlist) => [String(playlist.id), playlist])),
    [userPlaylists],
  );
  const currentPlaylistId = new URLSearchParams(location.search).get("playlist");
  const isAllSongsActive = location.pathname === "/songs" && !currentPlaylistId;

  useEffect(() => {
    function handlePlaylistsChanged() {
      setPlaylistRefreshKey((currentKey) => currentKey + 1);
    }

    window.addEventListener(PLAYLISTS_CHANGED_EVENT, handlePlaylistsChanged);

    return () => {
      window.removeEventListener(
        PLAYLISTS_CHANGED_EVENT,
        handlePlaylistsChanged,
      );
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function loadPublicPlaylists() {
      try {
        setIsPublicLoading(true);
        setPublicError("");
        const playlists = await getPublicPLaylists();

        if(isMounted) {
          setPublicPLaylists(playlists);
        }
      } catch (error) {
        if(isMounted) {
          setPublicError(error.message);
        }
      } finally {
        if(isMounted) {
          setIsPublicLoading(false);
        }
      }
    }

    loadPublicPlaylists();

    return () => {
      isMounted = false;
    };
  }, [playlistRefreshKey]);

  useEffect(() => {
    let isMounted = true;

    async function loadUserPlaylists() {
      if(isAuthLoading) {
        return;
      }

      if(!isAuthenticated) {
        setUserPlaylists([]);
        setUserError("");
        setIsUserLoading(false);
        return;
      }

      try {
        setIsUserLoading(true);
        setUserError("");
        const playlists = await getUserPLaylists();

        if(isMounted) {
          setUserPlaylists(playlists);
        }
      } catch (error) {
        if(isMounted) {
          setUserError(error.message);
        }
      } finally {
        if(isMounted) {
          setIsUserLoading(false);
        }
      }
    }

    loadUserPlaylists();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, isAuthLoading, playlistRefreshKey]);

  function handlePlaylistCreated(createdPLaylist) {
    setUserPlaylists((currentPlaylists) =>
      upsertPlaylist(currentPlaylists, createdPLaylist),
    );

    if(createdPLaylist.is_public) {
      setPublicPLaylists((currentPlaylists) =>
        upsertPlaylist(currentPlaylists, createdPLaylist),
      );
    }

    navigate(getPLaylistPath(createdPLaylist));
  }

  function handlePlaylistUpdated(updatedPlaylist) {
    setUserPlaylists((currentPlaylists) =>
      upsertPlaylist(currentPlaylists, updatedPlaylist),
    );
    setPublicPLaylists((currentPlaylists) => {
      if(!updatedPlaylist.is_public) {
        return currentPlaylists.filter(
          (playlist) => String(playlist.id) !== String(updatedPlaylist.id),
        );
      }

      return upsertPlaylist(currentPlaylists, updatedPlaylist);
    });
  }

  function handlePlaylistDeleted(deletedPlaylistId) {
    setUserPlaylists((currentPlaylists) =>
      currentPlaylists.filter(
        (playlist) => String(playlist.id) !== String(deletePlaylist.id),
      ),
    );
    setPublicPLaylists((currentPlaylists) =>
      currentPlaylists.filter(
        (playlist) => String(playlist.id) !== String(deletePlaylist.id),
      ),
    );

    if(currentPlaylistId === String(deletedPlaylistId)) {
      navigate("/songs");
    }
  }

  return (
    <Sidebar
      collapsible="none"
      className="h-full w-full rounded-xl border bg-background"
    >
      <SidebarHeader>
        <div className="px-4 py-3">
          <h2 className="text-base font-semibold">Playlists</h2>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Public</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key="all-songs">
                <SidebarMenuButton asChild isActive={isAllSongsActive}>
                  <Link to="/songs">
                    <Icons.listMusic />
                    <span>Tất cả bài hát</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {isPublicLoading ? (
                <>
                  <SidebarMenuSkeleton showIcon />
                  <SidebarMenuSkeleton showIcon />
                </>
              ) : null}
              {!isPublicLoading && publicPLaylists.map((playlist) => {
                const editablePlaylist = userPlaylistById.get(String(playlist.id));

                return (
                  <PlaylistMenuItem
                    key={playlist.id}
                    playlist={playlist}
                    isActive={currentPlaylistId === String(playlist.id)}
                    editablePlaylist={editablePlaylist}
                    onDeleted={handlePlaylistDeleted}
                    onUpdated={handlePlaylistUpdated}
                  />
                );
              })}
              {publicError ? (
                <SidebarMenuItem>
                  <p className="px-2 py-1 text-xs text-destructive">
                    {publicError}
                  </p>
                </SidebarMenuItem>
              ) : null}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Riêng tư</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isUserLoading || isAuthLoading ? (
                <>
                  <SidebarMenuSkeleton showIcon />
                  <SidebarMenuSkeleton showIcon />
                </>
              ) : null}

              {!isUserLoading && !isAuthLoading && privatePlaylists.map((playlist) => (
                <PlaylistMenuItem
                  key={playlist.id}
                  playlist={playlist}
                  isActive={currentPlaylistId === String(playlist.id)}
                  editablePlaylist={playlist}
                  onDeleted={handlePlaylistDeleted}
                  onUpdated={handlePlaylistUpdated}
                />
              ))}

              {!isUserLoading && !isAuthLoading && isAuthenticated && privatePlaylists.length === 0 ? (
                <SidebarMenuItem>
                  <p className="px-2 py-1 text-xs text-muted-foreground">
                    Chưa có playlist riêng tư.
                  </p>
                </SidebarMenuItem>
              ) : null}
              
              {!isAuthenticated && !isAuthLoading ? (
                <SidebarMenuItem>
                  <p className="px-2 py-1 text-xs text-muted-foreground">
                    Đăng nhập để xem playlist của bạn.
                  </p>
                </SidebarMenuItem>
              ) : null}

              {userError ? (
                <SidebarMenuItem>
                  <p className="px-2 py-1 text-xs text-muted-foreground">
                    {userError}
                  </p>
                </SidebarMenuItem>
              ) : null}

              {isAuthenticated && !isAuthLoading ? (
                <SidebarMenuItem>
                  <PlaylistCreateDialog onCreated={handlePlaylistCreated} />
                </SidebarMenuItem>
              ) : null}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default PlaylistSidebar;