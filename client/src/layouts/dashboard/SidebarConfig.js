// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Label from '../../components/Label';
import SvgIconStyle from '../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => (
  <SvgIconStyle
    src={`/static/icons/navbar/${name}.svg`}
    sx={{ width: '100%', height: '100%' }}
  />
);

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  booking: getIcon('ic_booking'),
  role: getIcon('ic_role'),
  tacgia: getIcon('ic_new'),
  danhmuc: getIcon('ic_category'),
  ngonngu: getIcon('ic_translate'),
  book: getIcon('ic_book'),
  phieunhap: getIcon('ic_addbook'),
};

const sidebarConfig = [
  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    items: [
      // MANAGEMENT : USER
      {
        title: 'user',
        path: PATH_DASHBOARD.user.list,
        icon: ICONS.user,
      },
      {
        title: 'Quyền',
        path: PATH_DASHBOARD.role.root,
        icon: ICONS.role,
      },
      {
        title: 'Sách',
        path: PATH_DASHBOARD.book.root,
        icon: ICONS.book,
      },
      {
        title: 'Nhập hàng',
        path: PATH_DASHBOARD.phieunhap.root,
        icon: ICONS.phieunhap,
      },
      {
        title: 'Nhà xuất bản',
        path: PATH_DASHBOARD.nhaxuatban.root,
        icon: ICONS.tacgia,
      },
      {
        title: 'Nhà cung cấp',
        path: PATH_DASHBOARD.nhacungcap.root,
        icon: ICONS.tacgia,
      },
      {
        title: 'Tác giả',
        path: PATH_DASHBOARD.tacgia.root,
        icon: ICONS.user,
      },

      {
        title: 'Danh mục',
        path: PATH_DASHBOARD.danhmuc.root,
        icon: ICONS.danhmuc,
      },
      {
        title: 'Thể loại',
        path: PATH_DASHBOARD.theloai.root,
        icon: ICONS.danhmuc,
      },
      {
        title: 'Ngôn ngữ',
        path: PATH_DASHBOARD.ngonngu.root,
        icon: ICONS.ngonngu,
      },

      // MANAGEMENT : E-COMMERrootCE
      {
        title: 'e-commerce',
        path: PATH_DASHBOARD.eCommerce.root,
        icon: ICONS.cart,
        children: [
          { title: 'shop', path: PATH_DASHBOARD.eCommerce.shop },
          { title: 'product', path: PATH_DASHBOARD.eCommerce.productById },
          { title: 'list', path: PATH_DASHBOARD.eCommerce.list },
          { title: 'create', path: PATH_DASHBOARD.eCommerce.newProduct },
          { title: 'edit', path: PATH_DASHBOARD.eCommerce.editById },
          { title: 'checkout', path: PATH_DASHBOARD.eCommerce.checkout },
          { title: 'invoice', path: PATH_DASHBOARD.eCommerce.invoice },
        ],
      },

      // MANAGEMENT : BLOG
      {
        title: 'blog',
        path: PATH_DASHBOARD.blog.root,
        icon: ICONS.blog,
        children: [
          { title: 'posts', path: PATH_DASHBOARD.blog.posts },
          { title: 'post', path: PATH_DASHBOARD.blog.postById },
          { title: 'new post', path: PATH_DASHBOARD.blog.newPost },
        ],
      },
    ],
  },

  // APP
  // ----------------------------------------------------------------------
  {
    subheader: 'app',
    items: [
      {
        title: 'mail',
        path: PATH_DASHBOARD.mail.root,
        icon: ICONS.mail,
        info: <Label color="error">2</Label>,
      },
      { title: 'chat', path: PATH_DASHBOARD.chat.root, icon: ICONS.chat },
      {
        title: 'calendar',
        path: PATH_DASHBOARD.calendar,
        icon: ICONS.calendar,
      },
      {
        title: 'kanban',
        path: PATH_DASHBOARD.kanban,
        icon: ICONS.kanban,
      },
    ],
  },
];

export default sidebarConfig;
