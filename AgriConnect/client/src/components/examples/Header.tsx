import { Header } from "../Header";
import { ThemeProvider } from "../ThemeProvider";
import { AuthProvider } from "../../lib/auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../../lib/queryClient";

export default function HeaderExample() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <Header />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
