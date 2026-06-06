import { useEffect } from 'react';
import { config } from '@/config';

export function usePublicPlaylistSSE(onNotification) {
  useEffect(() => {
    const eventSource = new EventSource(`${config.apiUrl}/playlists/public/new`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'connected') {
          console.log(data.message);
        } else if (data.type === 'public_playlist_new') {
          onNotification(data);
        }
      } catch (error) {
        console.error("Lỗi khi xử lý dữ liệu SSE:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("Lỗi kết nối SSE:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [onNotification]);
}