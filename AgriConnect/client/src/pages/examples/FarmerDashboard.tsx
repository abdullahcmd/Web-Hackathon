import { ThemeProvider } from "../../components/ThemeProvider";
import FarmerDashboard from "../FarmerDashboard";

export default function FarmerDashboardExample() {
  return (
    <ThemeProvider>
      <FarmerDashboard />
    </ThemeProvider>
  );
}
