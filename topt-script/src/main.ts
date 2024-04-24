import {
  GM_getValue,
  GM_registerMenuCommand,
  GM_setClipboard,
  GM_unregisterMenuCommand,
} from "$";
import { URI } from "otpauth-migration";
import * as OTPAuth from "otpauth";

const migration = GM_getValue("otpauth.migration") as string;

const totpList: OTPAuth.TOTP[] = [];

migration.split("\n").forEach((line) => {
  if (line.trim().length > 0) {
    totpList.push(
      ...URI.toOTPAuthURIs(line).map((uri) => {
        const url = new URL(uri);
        return new OTPAuth.TOTP({
          issuer:
            url.searchParams.get("issuer") ||
            decodeURIComponent(
              url.pathname.substring(url.pathname.lastIndexOf("/") + 1)
            ),
          algorithm: url.searchParams.get("algorithm") || "SHA1",
          digits: parseInt(url.searchParams.get("digits") || "6"),
          period: parseInt(url.searchParams.get("period") || "30"),
          secret: url.searchParams.get("secret") || "",
        });
      })
    );
  }
});

export default new Promise<void>(() => {
  const menuId: string[] = [];
  // 每分钟的0秒与30秒时刷新
  const refresh = () => {
    // 移除上次注册的菜单
    menuId.forEach((id) => GM_unregisterMenuCommand(id));
    totpList.forEach((totp) => {
      // 注册新的菜单
      menuId.push(
        GM_registerMenuCommand(totp.issuer, () => {
          GM_setClipboard(totp.generate(), "text");
        })
      );
    });
  };
  // 计算下一次刷新的时间
  const next = () => {
    const now = new Date();
    const seconds = now.getSeconds();
    const next = seconds < 30 ? 30 : 60;
    return new Date(now.getTime() + (next - seconds) * 1000);
  };
  // 定时器
  const timer = () => {
    refresh();
    setTimeout(timer, next().getTime() - new Date().getTime());
  };
  // 启动定时器
  timer();

  // 屏蔽resolve表示脚本不会自身停止
  // resolve();
});
