import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { APIProvider } from '@vis.gl/react-google-maps';
import Login from './pages/usuarios/login.jsx';
import Register from './pages/usuarios/register.jsx';
import RutaMapa from './pages/mapas/rutaMap.jsx';
import ListUsers from './pages/admin/listUsers.jsx';
import HomePageMapa from './pages/mapas/homePageMap.jsx';
import ListRoutes from './pages/verficador/listRutas.jsx';
import ListMunicipalities from './pages/verficador/ListMunicipalities.jsx';
import IncidentForm from './pages/mapas/IncidentForm.jsx';
import ListIncidents from './pages/verficador/listIncidentes.jsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePageMapa />
  },

  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/Listadmin",
    element: < ListUsers/>
  },
  {
    path: "/mapa",
    element: <RutaMapa />
  },
  {
    path: "/rutas",
    element: <ListRoutes />
  },
  {
    path: "/municipios",
    element: <ListMunicipalities />
  },
//del lado del admin
  {
    path: "/incidentes",
    element: <ListIncidents />
  },
  {
    path: "/reportar-incidente",
    element: <IncidentForm />
  },

//no olvidar quitar el api key de google maps
]);
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
console.log('Tu api key de google maps: ', API_KEY);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <APIProvider apiKey={API_KEY}>

      <RouterProvider router={router} />
    </APIProvider>
  </StrictMode>,
)
