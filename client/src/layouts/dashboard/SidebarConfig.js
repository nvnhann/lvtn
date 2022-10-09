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
    giamgia: getIcon('ic_discount')
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
            },{
                title: 'Giảm giá',
                path: PATH_DASHBOARD.giamgia.root,
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
