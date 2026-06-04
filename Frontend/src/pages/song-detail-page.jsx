import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getSongById } from "@/services/music";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

function formatDuration(durationSeconds) {
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function SongDetailPage() {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadSong() {
      try {
        setIsLoading(true);
        setError("");
        const data = await getSongById(id);
        
        if (isMounted) {
          setSong(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSong();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <section className="space-y-6">
        <Skeleton className="h-10 w-32" />
        <div className="rounded-lg border p-6 bg-card">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <Skeleton className="h-6 w-1/4 mb-8" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !song) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-20 text-center">
        <p className="text-destructive text-lg">{error || "Không tìm thấy bài hát này."}</p>
        <Button asChild variant="outline">
          <Link to="/songs">Quay lại danh sách</Link>
        </Button>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <Link to="/songs">← Trở về</Link>
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">Chi tiết bài hát</h2>
        </div>
      </div>

      <div className="rounded-lg border p-6 bg-card text-card-foreground shadow-sm">
        <h3 className="text-3xl font-bold mb-2">{song.title}</h3>
        <p className="text-lg text-muted-foreground mb-8">Trình bày: {song.artist}</p>
        
        <div className="grid gap-6 sm:grid-cols-2 border-t pt-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Thể loại</p>
            <p className="text-base">{song.genre || "Đang cập nhật"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Thời lượng</p>
            <p className="text-base tabular-nums">{formatDuration(song.duration_seconds)}</p>
          </div>
          <div className="border-t pt-6 mt-6">
            <p className="text-sm font-medium text-muted-foreground mb-2">Nghe bài hát</p>
            {song.audio_url ? (
              <audio controls className="w-full max-w-md">
                <source src={song.audio_url} type="audio/mpeg" />
                Trình duyệt của bạn không hỗ trợ thẻ audio.
              </audio>
            ) : (
              <p className="text-sm text-muted-foreground italic">Chưa có file âm thanh cho bài hát này.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}