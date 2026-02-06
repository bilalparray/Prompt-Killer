import CryptoJS from "crypto-js";
import { environment } from "@/environments/environment";

export class Encryption {
  static encrypt(txt: string): string {
    return CryptoJS.AES.encrypt(txt, environment.encryptionKey).toString();
  }

  static decrypt(txtToDecrypt: string): string {
    return CryptoJS.AES.decrypt(txtToDecrypt, environment.encryptionKey).toString(
      CryptoJS.enc.Utf8
    );
  }
}
