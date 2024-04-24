import { GM_getValue } from "$";
import { URI } from "otpauth-migration";

const migration = GM_getValue("otpauth.migration") as string;

const totp: string[] = [];

migration.split("\n").forEach((line) => {
  if (line.trim().length > 0) {
    totp.push(...URI.toOTPAuthURIs(line));
  }
});

console.log(totp);

export default new Promise<void>((resolve) => {
  resolve();
});
