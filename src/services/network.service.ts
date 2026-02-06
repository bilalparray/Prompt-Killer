import { BaseService } from "./base.service";

export interface NetworkStatus {
  connected: boolean;
  connectionType?: string;
}

export class NetworkService extends BaseService {
  async getCurrentStatus(): Promise<NetworkStatus> {
    if (typeof window === "undefined") {
      return { connected: true };
    }

    return {
      connected: navigator.onLine,
      connectionType: (navigator as any).connection?.effectiveType,
    };
  }

  onStatusChange(callback: (status: NetworkStatus) => void): () => void {
    if (typeof window === "undefined") {
      return () => {};
    }

    const handleOnline = () => {
      callback({ connected: true });
    };

    const handleOffline = () => {
      callback({ connected: false });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }
}
