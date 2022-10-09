import {Icon} from '@iconify/react';
import {useRef, useState} from 'react';
import personFill from '@iconify/icons-eva/person-fill';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
// material
import {alpha} from '@material-ui/core/styles';
import {Box, Button, Divider, MenuItem, Typography} from '@material-ui/core';
// routes
import {PATH_PAGE} from '../../routes/paths';
// components
import {MIconButton} from '../../components/@material-extend';
import MyAvatar from '../../components/MyAvatar';
import MenuPopover from '../../components/MenuPopover';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from "../../redux/slices/user";

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
    {
        label: 'Thông tin tài khoản',
        icon: personFill,
        linkTo: PATH_PAGE.profile,
    },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
    const anchorRef = useRef(null);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.current);

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleLogout = async () => {
        try {
            dispatch(logout());
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <MIconButton
                ref={anchorRef}
                onClick={handleOpen}
                sx={{
                    padding: 0,
                    width: 44,
                    height: 44,
                    ...(open && {
                        '&:before': {
                            zIndex: 1,
                            content: "''",
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            position: 'absolute',
                            bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                        },
                    }),
                }}
            >
                <MyAvatar/>
            </MIconButton>

            <MenuPopover
                open={open}
                onClose={handleClose}
                anchorEl={anchorRef.current}
                sx={{width: 220}}
            >
                <Box sx={{my: 1.5, px: 2.5}}>
                    <Typography variant="subtitle1" noWrap>
                        {user?.fullname}
                    </Typography>
                    <Typography variant="body2" sx={{color: 'text.secondary'}} noWrap>
                        {user?.email}
                    </Typography>
                </Box>

                <Divider sx={{my: 1}}/>

                {MENU_OPTIONS.map((option) => (
                    <MenuItem
                        key={option.label}
                        to={option.linkTo}
                        component={RouterLink}
                        onClick={handleClose}
                        sx={{typography: 'body2', py: 1, px: 2.5}}
                    >
                        <Box
                            component={Icon}
                            icon={option.icon}
                            sx={{
                                mr: 2,
                                width: 24,
                                height: 24,
                            }}
                        />

                        {option.label}
                    </MenuItem>
                ))}

                <Box sx={{p: 2, pt: 1.5}}>
                    <Button
                        fullWidth
                        color="inherit"
                        variant="outlined"
                        onClick={handleLogout}
                    >
                        Đăng xuất
                    </Button>
                </Box>
            </MenuPopover>
        </>
    );
}
