import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import MainLayout from '../layouts/main';
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// components
import LoadingScreen from '../components/LoadingScreen';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();
  const isDashboard = pathname.includes('/dashboard');

  return (
    <Suspense
      fallback={
        <LoadingScreen
          sx={{
            ...(!isDashboard && {
              top: 0,
              left: 0,
              width: 1,
              zIndex: 9999,
              position: 'fixed',
            }),
          }}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: <Login />,
        },
        {
          path: 'register',
          element: <Register />,
        },
        { path: 'verify', element: <VerifyCode /> },
      ],
    },

    // Dashboard Routes
    {
      path: 'dashboard',
      element: <DashboardLayout />,
      children: [
        {
          path: 'user',
          children: [
            {
              path: '/',
              element: <UserList />,
            },
            { path: 'list', element: <UserList /> },
            { path: 'new', element: <UserCreate /> },
            { path: '/:id/edit', element: <UserCreate /> },
          ],
        },
        {
          path: 'book',
          children: [
            {
              path: '/',
              element: <BookList />,
            },
            {
              path: '/new',
              element: <BookCreate />,
            },
            {
              path: '/:id/edit',
              element: <BookCreate />,
            },
          ],
        },
        {
          path: 'phieunhap',
          children: [
            {
              path: '/',
              element: <PhieuNhapList />,
            },
            {
              path: '/new',
              element: <PhieuNhapCreate />,
            },
            {
              path: '/:id/edit',
              element: <PhieuNhapCreate />,
            },
            {
              path: '/:id/detail',
              element: <PhieuNhapDetail />,
            },
          ],
        },
        {
          path: 'role',
          children: [
            {
              path: '/',
              element: <RoleList />,
            },
            {
              path: '/new',
              element: <RoleCreate />,
            },
            {
              path: '/:id/edit',
              element: <RoleCreate />,
            },
          ],
        },
        {
          path: 'nhaxuatban',
          children: [
            {
              path: '/',
              element: <NhaXuatBanList />,
            },
            {
              path: '/new',
              element: <NhaXuatBanCreate />,
            },
            {
              path: '/:id/edit',
              element: <NhaXuatBanCreate />,
            },
          ],
        },
        {
          path: 'nhacungcap',
          children: [
            {
              path: '/',
              element: <NhaCungCapList />,
            },
            {
              path: '/new',
              element: <NhaCungCapCreate />,
            },
            {
              path: '/:id/edit',
              element: <NhaCungCapCreate />,
            },
          ],
        },
        {
          path: 'tacgia',
          children: [
            {
              path: '/',
              element: <TacGiaList />,
            },
          ],
        },
        {
          path: 'danhmuc',
          children: [
            {
              path: '/',
              element: <DanhMucList />,
            },
          ],
        },
        {
          path: 'theloai',
          children: [
            {
              path: '/',
              element: <TheLoaiList />,
            },
          ],
        },
        {
          path: 'ngonngu',
          children: [
            {
              path: '/',
              element: <NgonNguList />,
            },
          ],
        },
      ],
    },

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '500', element: <Page500 /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    {
      path: '/',
      element: <MainLayout />,
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

// IMPORT COMPONENTS

// Authentication
const Login = Loadable(lazy(() => import('../pages/authentication/Login')));
const Register = Loadable(
  lazy(() => import('../pages/authentication/Register')),
);

const VerifyCode = Loadable(
  lazy(() => import('../pages/authentication/VerifyCode')),
);

const UserList = Loadable(lazy(() => import('../pages/dashboard/UserList')));

const UserCreate = Loadable(
  lazy(() => import('../pages/dashboard/UserCreate')),
);
//-------------------------role-------------------------------------
const RoleList = Loadable(lazy(() => import('../pages/dashboard/RoleList')));
const RoleCreate = Loadable(
  lazy(() => import('../pages/dashboard/RoleCreate')),
);

//--------------------------nhaxuatban-------------------------------------------
const NhaXuatBanList = Loadable(
  lazy(() => import('../pages/dashboard/NhaXuatBan')),
);
const NhaXuatBanCreate = Loadable(
  lazy(() => import('../pages/dashboard/NXBCreate')),
);

//--------------------------nhacungcap-------------------------------------------
const NhaCungCapList = Loadable(
  lazy(() => import('../pages/dashboard/NhaCungCap')),
);
const NhaCungCapCreate = Loadable(
  lazy(() => import('../pages/dashboard/NCCCreate')),
);
//--------------------------Danh Muc-------------------------------------------
const DanhMucList = Loadable(lazy(() => import('../pages/dashboard/DanhMuc')));
//--------------------------Tác giả-------------------------------------------
const TacGiaList = Loadable(lazy(() => import('../pages/dashboard/TacGia')));
//--------------------------Thể loại-------------------------------------------
const TheLoaiList = Loadable(lazy(() => import('../pages/dashboard/TheLoai')));
//--------------------------Ngôn ngữ-------------------------------------------
const NgonNguList = Loadable(lazy(() => import('../pages/dashboard/NgonNgu')));
//--------------------------Sách-------------------------------------------
const BookList = Loadable(lazy(() => import('../pages/dashboard/Book')));

const BookCreate = Loadable(
  lazy(() => import('../pages/dashboard/BookCreate')),
);

//--------------------------Phiếu nhập-------------------------------------------

const PhieuNhapList = Loadable(
  lazy(() => import('../pages/dashboard/PhieuNhap')),
);

const PhieuNhapCreate = Loadable(
  lazy(() => import('../pages/dashboard/PhieuNhapCreate')),
);

const PhieuNhapDetail = Loadable(
  lazy(() => import('../pages/dashboard/PhieuNhapDetail')),
);

//-------------------------------------------------------------------------------

const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
