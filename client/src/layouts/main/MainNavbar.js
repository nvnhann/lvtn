import {Link, NavLink as RouterLink} from 'react-router-dom';
// material
import {styled} from '@material-ui/core/styles';
import {AppBar, Badge, Box, Button, Container, Toolbar, Typography,} from '@material-ui/core';
// hooks
import useOffSetTop from '../../hooks/useOffSetTop';
// components
import Logo from '../../components/Logo';
//
import Searchbar from './Searchbar';
import AccountPopover from './AccountPopover';
import {useSelector} from 'react-redux';
import IconCart from "../../components/IconCart";
import {cartItemCount} from "../../redux/slices/cart";
import {PATH_PAGE} from "../../routes/paths";

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 88;

const ToolbarStyle = styled(Toolbar)(({theme}) => ({
    height: APP_BAR_MOBILE,
    transition: theme.transitions.create(['height', 'background-color'], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter,
    }),
    [theme.breakpoints.up('md')]: {
        height: APP_BAR_DESKTOP,
    },
}));

const ToolbarShadowStyle = styled('div')(({theme}) => ({
    left: 0,
    right: 0,
    bottom: 0,
    height: 24,
    zIndex: -1,
    margin: 'auto',
    borderRadius: '50%',
    position: 'absolute',
    width: `calc(100% - 48px)`,
    boxShadow: theme.customShadows.z8,
}));

// ----------------------------------------------------------------------

export default function MainNavbar() {
    const isOffset = useOffSetTop(100);
    const isLogined = !!useSelector((state) => state.user.current?.email);
    const cartCount = useSelector(cartItemCount);

    return (
        <AppBar sx={{boxShadow: 0, bgcolor: 'transparent'}}>
            <ToolbarStyle
                disableGutters
                sx={{
                    ...(isOffset && {
                        bgcolor: 'background.default',
                        height: {md: APP_BAR_DESKTOP - 16},
                    }),
                }}
            >
                <Container
                    maxWidth="lg"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <RouterLink to="/">
                        <Logo/>
                    </RouterLink>
                    <Typography variant="h4" sx={{ml: 2, color: 'text.primary'}}>
                        HYPE
                    </Typography>
                    <Box sx={{flexGrow: 1}}/>
                    <Searchbar/>
                    <Box mx={2} component={Link} to={PATH_PAGE.shopcart}>
                        <Badge showZero badgeContent={cartCount} color="error" max={99}>
                            <IconCart/>
                        </Badge>
                    </Box>
                    {isLogined ? (
                        <AccountPopover/>
                    ) : (
                        <Button
                            variant="contained"
                            component={Link}
                            to={'/auth/login'}
                            sx={{ml: 4}}
                        >
                            Đăng nhập
                        </Button>
                    )}
                </Container>
            </ToolbarStyle>
            {isOffset && <ToolbarShadowStyle/>}
        </AppBar>
    );
}
