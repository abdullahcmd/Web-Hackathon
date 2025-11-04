import { ThemeProvider } from "../../components/ThemeProvider";
import { AuthProvider } from "../../lib/auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../../lib/queryClient";
import Login from "../Login";

export default function LoginExample() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <Login />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
