"use client";

import React from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import { ThemeProvider, useTheme } from "@/lib/theme-context";

function getAntdTheme(isDark: boolean) {
  const darkTokens = {
    colorPrimary: "#5b2eff",
    colorSuccess: "#00d4aa",
    colorWarning: "#ffb020",
    colorError: "#ff5c6c",
    colorInfo: "#5b2eff",
    borderRadius: 8,
    colorBgContainer: "#12122a",
    colorBgElevated: "#1a1a3e",
    colorBorder: "#2a2a4a",
    colorText: "#f0f0ff",
    colorTextSecondary: "#9494b8",
    colorTextTertiary: "#6b6b8a",
    fontFamily:
      '"Plus Jakarta Sans", "Noto Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  };

  const lightTokens = {
    colorPrimary: "#5b2eff",
    colorSuccess: "#00a87d",
    colorWarning: "#e89400",
    colorError: "#e5445a",
    colorInfo: "#5b2eff",
    borderRadius: 8,
    colorBgContainer: "#ffffff",
    colorBgElevated: "#fafaff",
    colorBorder: "#e0e0f0",
    colorText: "#1a1a2e",
    colorTextSecondary: "#5a5a7a",
    colorTextTertiary: "#9e9eb8",
    fontFamily:
      '"Plus Jakarta Sans", "Noto Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  };

  return {
    token: isDark ? darkTokens : lightTokens,
    components: {
      Card: isDark
        ? {
            colorBgContainer: "#12122a",
            colorBorderSecondary: "#2a2a4a",
          }
        : {
            colorBgContainer: "#ffffff",
            colorBorderSecondary: "#e0e0f0",
          },
      Menu: {
        itemBg: "transparent",
        subMenuItemBg: "transparent",
      },
    },
  };
}

function AntdThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <AntdRegistry>
      <ConfigProvider theme={getAntdTheme(isDark)} locale={zhCN}>
        {children}
      </ConfigProvider>
    </AntdRegistry>
  );
}

export default function ThemeProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <AntdThemeWrapper>{children}</AntdThemeWrapper>
    </ThemeProvider>
  );
}
