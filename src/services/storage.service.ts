import { BaseService } from "./base.service";
import { AppConstants } from "@/constants/app-constants";
import { Encryption } from "@/utils/encryption";

export class StorageService extends BaseService {
  /**
   * Get an item from localStorage (encrypted)
   */
  async getFromStorage(key: string): Promise<any> {
    try {
      if (typeof window === "undefined") return null;
      const encrypted = localStorage.getItem(key) || "";
      if (!encrypted) return null;

      const decrypted = Encryption.decrypt(encrypted);
      return this.getValueAsObject(decrypted);
    } catch (error) {
      console.error("Error getting from storage:", error);
      return null;
    }
  }

  /**
   * Save an item to localStorage (encrypted)
   */
  async saveToStorage(key: string, val: any): Promise<void> {
    try {
      if (typeof window === "undefined") return;
      const rawString = typeof val !== "string" ? JSON.stringify(val) : val;
      const encrypted = Encryption.encrypt(rawString);
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error("Error saving to storage:", error);
    }
  }

  /**
   * Remove an item from localStorage
   */
  async removeFromStorage(key: string): Promise<void> {
    try {
      if (typeof window === "undefined") return;
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from storage:", error);
    }
  }

  /**
   * Clear all localStorage
   */
  async clearStorage(): Promise<void> {
    try {
      if (typeof window === "undefined") return;
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  }

  /**
   * Get an item from sessionStorage (encrypted)
   */
  async getFromSessionStorage(key: string): Promise<any> {
    try {
      if (typeof window === "undefined") return null;
      const encrypted = sessionStorage.getItem(key) || "";
      if (!encrypted) return null;

      const decrypted = Encryption.decrypt(encrypted);
      return this.getValueAsObject(decrypted);
    } catch (error) {
      console.error("Error getting from session storage:", error);
      return null;
    }
  }

  /**
   * Save an item to sessionStorage (encrypted)
   */
  async saveToSessionStorage(key: string, val: any): Promise<void> {
    try {
      if (typeof window === "undefined") return;
      const rawString = typeof val !== "string" ? JSON.stringify(val) : val;
      const encrypted = Encryption.encrypt(rawString);
      sessionStorage.setItem(key, encrypted);
    } catch (error) {
      console.error("Error saving to session storage:", error);
    }
  }

  /**
   * Remove an item from sessionStorage
   */
  async removeFromSessionStorage(key: string): Promise<void> {
    try {
      if (typeof window === "undefined") return;
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from session storage:", error);
    }
  }

  /**
   * Clear all sessionStorage
   */
  async clearSessionStorage(): Promise<void> {
    try {
      if (typeof window === "undefined") return;
      sessionStorage.clear();
    } catch (error) {
      console.error("Error clearing session storage:", error);
    }
  }

  /**
   * Get data from either localStorage or sessionStorage based on remember me flag
   */
  async getDataFromAnyStorage(key: string): Promise<any> {
    const remMe = await this.getFromStorage(AppConstants.DATABASE_KEYS.REMEMBER_PWD);
    if (remMe) {
      return this.getFromStorage(key);
    } else {
      return this.getFromSessionStorage(key);
    }
  }

  /**
   * Helper: Attempt to JSON.parse the string; if it fails, return the raw string
   */
  private getValueAsObject(val: string): any {
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  }
}
