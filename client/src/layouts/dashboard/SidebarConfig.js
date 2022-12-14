// routes
import {PATH_DASHBOARD} from '../../routes/paths';
// components
import SvgIconStyle from '../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => (
    <SvgIconStyle
        src={`/static/icons/navbar/${name}.svg`}
        sx={{width: '100%', height: '100%'}}
    />
);

const ICONS = {
    user: getIcon('ic_user'),
    role: getIcon('ic_role'),
    tacgia: getIcon('ic_new'),
    danhmuc: getIcon('ic_category'),
    ngonngu: getIcon('ic_translate'),
    book: getIcon('ic_book'),
    phieunhap: getIcon('ic_addbook'),
    giamgia: getIcon('ic_discount'),
    order: getIcon('ic_order'),
    store: getIcon('ic_store'),
    thongke: getIcon('ic_analytics'),
    comment: getIcon('ic_comment')
};

const sidebarConfig = [
    // ----------------------------------------------------------------------
    {
        items: [
            {
                title: 'Thống kê',
                path: PATH_DASHBOARD.thongke.root,
                icon: ICONS.thongke
            },
            {
                title: 'Cửa hàng',
                path: PATH_DASHBOARD.store.root,
                icon: ICONS.store
            },
            {
                title: 'user',
                path: PATH_DASHBOARD.user.list,
                icon: ICONS.user,
            },
            {
                title: 'Sách',
                path: PATH_DASHBOARD.book.root,
                icon: ICONS.book,
            },
            {
                title: 'Bình luận',
                path: PATH_DASHBOARD.binhluan.root,
                icon: ICONS.comment,
            },
            {
                title: 'Nhập hàng',
                path: PATH_DASHBOARD.phieunhap.root,
                icon: ICONS.phieunhap,
            },
            {
                title: 'Đơn hàng',
                path: PATH_DASHBOARD.hoadon.root,
                icon: ICONS.order
            },
            {
                title: 'Khuyến mãi',
                path: PATH_DASHBOARD.khuyenmai.root,
                icon: ICONS.giamgia,
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
        ],
    },
];

export default sidebarConfig;
