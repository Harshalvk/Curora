import React, { ReactNode } from "react";
import { ThemeProvider } from "./ThemeProvider";

const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider
      attribute={"class"}
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
};

export default AppProvider;
