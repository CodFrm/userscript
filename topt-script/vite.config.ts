import { defineConfig } from "vite";
import monkey from "vite-plugin-monkey";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    monkey({
      entry: "src/main.ts",
      userscript: {
        name: "topt 动态密码",
        description: "安装后会在脚本猫菜单页中定时刷新动态密码，点击即可复制",
        namespace: "https://scriptcat.org/",
        background: true,
      },
    }),
  ],
});

/* ==UserConfig==
otpauth:
  migration:
    title: otpauth迁移
    description: google authenticator导出成二维码，再使用二维码识别，一行一张
    type: textarea
 ==/UserConfig== */
