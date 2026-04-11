import { RouteObject } from 'react-router-dom';
import HomePage from '../pages/home/page';
import AdminPage from '../pages/admin/page';
import SupplierPage from '../pages/supplier/page';
import CzechPage from '../pages/czech/page';
import NotFound from '../pages/NotFound';

const routes: RouteObject[] = [
  { path: '/', element: <HomePage /> },
  { path: '/admin', element: <AdminPage /> },
  { path: '/proveedor', element: <SupplierPage /> },
  { path: '/praga', element: <CzechPage /> },
  { path: '*', element: <NotFound /> },
];

export default routes;
