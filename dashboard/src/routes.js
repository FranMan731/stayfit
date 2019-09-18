// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import DirectionsRun from "@material-ui/icons/DirectionsRun";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.jsx";
import UserProfile from "views/UserProfile/UserProfile.jsx";
import Ejercicios from "views/Ejercicios/Ejercicios.jsx";

const dashboardRoutes = [
  {
    path: "/",
    name: "Usuarios",
    rtlName: "ملف تعريفي للمستخدم",
    icon: Person,
    component: UserProfile,
    layout: "/usuarios"
  },
  {
    path: "/",
    name: "Ejercicios",
    rtlName: "ملف تعريفي للمستخدم",
    icon: DirectionsRun,
    component: Ejercicios,
    layout: "/ejercicios"
  }
];

export default dashboardRoutes;
