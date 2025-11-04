import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/lib/auth";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";
import CreateAccount from "@/pages/CreateAccount";
import AdminDashboard from "@/pages/AdminDashboard";
import FarmerDashboard from "@/pages/FarmerDashboard";
import FarmerAdviceChat from "@/pages/FarmerAdviceChat";
import FarmerCommunity from "@/pages/FarmerCommunity";

function AppRouter() {
  return (
    <Switch>
      {/* Login and Account Creation */}
      <Route path="/create-account" component={CreateAccount} />
      <Route path="/login" component={Login} />

      {/* Dashboards */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/farmer" component={FarmerDashboard} />
      <Route path="/farmer/advice" component={FarmerAdviceChat} />
      <Route path="/farmer/community" component={FarmerCommunity} />

      {/* Redirect base route to login */}
      <Route path="/">
        <Redirect to="/login" />
      </Route>

      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <AppRouter />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

// import { Switch, Route, useLocation, Redirect } from "wouter";
// import { queryClient } from "./lib/queryClient";
// import { QueryClientProvider } from "@tanstack/react-query";
// import { Toaster } from "@/components/ui/toaster";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { ThemeProvider } from "@/components/ThemeProvider";
// import { AuthProvider, useAuth } from "@/lib/auth";
// import NotFound from "@/pages/not-found";
// import Login from "@/pages/Login";
// import CreateAccount from "@/pages/CreateAccount";
// import AdminDashboard from "@/pages/AdminDashboard";
// import FarmerDashboard from "@/pages/FarmerDashboard";

// function Router() {
//   const { user, isLoading } = useAuth();
//   const [location] = useLocation();

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
//           <p className="text-muted-foreground">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <Switch>
//         <Route path="/create-account" component={CreateAccount} />
//         <Route>
//           <Login />
//         </Route>
//       </Switch>
//     );
//   }

//   return (
//     <Switch>
//       <Route path="/">
//         {user.role === "admin" ? <Redirect to="/admin" /> : <Redirect to="/farmer" />}
//       </Route>
//       <Route path="/admin">
//         {user.role === "admin" ? <AdminDashboard /> : <Redirect to="/farmer" />}
//       </Route>
//       <Route path="/farmer" component={FarmerDashboard} />
//       <Route component={NotFound} />
//     </Switch>
//   );
// }

// function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <AuthProvider>
//         <ThemeProvider>
//           <TooltipProvider>
//             <Toaster />
//             <Router />
//           </TooltipProvider>
//         </ThemeProvider>
//       </AuthProvider>
//     </QueryClientProvider>
//   );
// }

// export default App;
