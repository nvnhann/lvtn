import {Icon} from '@iconify/react';
import fileFill from '@iconify/icons-eva/file-fill';

// routes
import {PATH_AUTH, PATH_DASHBOARD, PATH_PAGE,} from '../../routes/paths';

// ----------------------------------------------------------------------

const ICON_SIZE = {
    width: 22,
    height: 22,
};

const menuConfig = [
    {
        title: 'Tất cả sản phẩm',
        path: '/pages',
        icon: <Icon icon={fileFill} {...ICON_SIZE} />,
        children: [
            {
                subheader: 'Other',
                items: [
                    {title: 'About us', path: PATH_PAGE.about},
                    {title: 'Contact us', path: PATH_PAGE.contact},
                    {title: 'FAQs', path: PATH_PAGE.faqs},
                    {title: 'Pricing', path: PATH_PAGE.pricing},
                    {title: 'Payment', path: PATH_PAGE.payment},
                    {title: 'Maintenance', path: PATH_PAGE.maintenance},
                    {title: 'Coming Soon', path: PATH_PAGE.comingSoon},
                ],
            },
            {
                subheader: 'Authentication',
                items: [
                    {title: 'Login', path: PATH_AUTH.loginUnprotected},
                    {title: 'Register', path: PATH_AUTH.registerUnprotected},
                    {title: 'Reset password', path: PATH_AUTH.resetPassword},
                    {title: 'Verify code', path: PATH_AUTH.verify},
                ],
            },
            {
                subheader: 'Error',
                items: [
                    {title: 'Page 404', path: PATH_PAGE.page404},
                    {title: 'Page 500', path: PATH_PAGE.page500},
                ],
            },
            {
                subheader: 'Dashboard',
                items: [{title: 'Dashboard', path: PATH_DASHBOARD.root}],
            },
        ],
    },
];

export default menuConfig;
