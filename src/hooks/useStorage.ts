import { StorageService } from "@/services/storage.service";

const storageService = new StorageService();

export function useStorage() {
  return {
    getFromStorage: storageService.getFromStorage.bind(storageService),
    saveToStorage: storageService.saveToStorage.bind(storageService),
    removeFromStorage: storageService.removeFromStorage.bind(storageService),
    clearStorage: storageService.clearStorage.bind(storageService),
    getFromSessionStorage: storageService.getFromSessionStorage.bind(storageService),
    saveToSessionStorage: storageService.saveToSessionStorage.bind(storageService),
    removeFromSessionStorage: storageService.removeFromSessionStorage.bind(storageService),
    clearSessionStorage: storageService.clearSessionStorage.bind(storageService),
    getDataFromAnyStorage: storageService.getDataFromAnyStorage.bind(storageService),
  };
}
