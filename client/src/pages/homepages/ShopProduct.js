import {useEffect, useRef, useState} from 'react';
// material
import {Box, Button, Card, Container, Grid, IconButton, Link, Stack, styled, Typography} from '@material-ui/core';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import {API_BASE_URL, URL_PUBLIC_IMAGES} from "../../config/configUrl";
import ProductList from "../../components/product/ProductList";
import {getData} from "../../_helper/httpProvider";
import {Pages} from '@material-ui/icons';
import {useTheme} from "@material-ui/core/styles";
import Slider from 'react-slick';
import PropTypes from "prop-types";
import {PATH_PAGE} from "../../routes/paths";
import {useDispatch, useSelector} from "react-redux";
import {useSnackbar} from "notistack5";
import Label from "../../components/Label";
import {Link as RouterLink} from "react-router-dom";
import {fCurrency} from "../../_helper/formatCurrentCy";
import {MIconButton} from "../../components/@material-extend";
import {Icon} from "@iconify/react";
import closeFill from "@iconify/icons-eva/close-fill";
import {addToCart} from "../../redux/slices/cart";
import IconCart from "../../components/IconCart";
import {MotionContainer, varFadeInRight} from "../../components/animate";
import {motion} from 'framer-motion';
import {CarouselControlsArrowsBasic2} from "../../components/carousel/controls";

// ----------------------------------------------------------------------
const RootStyle = styled(Page)(({theme}) => ({
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(15),
    [theme.breakpoints.up('md')]: {
        paddingTop: theme.spacing(11)
    }
}));
// ----------------------------------------------------------------------
const RootStyleSlider = styled('div')(({theme}) => ({
    overflow: 'hidden',
    position: 'relative',
    '&:before, &:after': {
        top: 0,
        left: 0,
        zIndex: 8,
        width: 48,
        content: "''",
        height: '100%',
        display: 'none',
        position: 'absolute',
        [theme.breakpoints.up(480)]: {
            display: 'block'
        }
    },
    '&:after': {
        right: 0,
        left: 'auto',
        transform: 'scaleX(-1)'
    }
}));
const ProductImgStyle = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute'
});

// ----------------------------------------------------------------------

export default function ShopProduct() {
    const {themeStretch} = useSettings();
    const [load, setLoad] = useState(true);
    const [products, setProducts] = useState([]);
    const [products1, setProducts1] = useState([]);
    const [products2, setProducts2] = useState([]);
    const [page, setPage] = useState(1);
    const theme = useTheme();
    const PRIMARY_MAIN = theme.palette.primary.main;

    const carouselRef = useRef();
    const [currentIndex, setCurrentIndex] = useState(theme.direction === 'rtl' ? products.length - 1 : 0);

    const handlePrevious = () => {
        carouselRef.current.slickPrev();
    };

    const handleNext = () => {
        carouselRef.current.slickNext();
    };

    //################################################################################################################

    const carouselRef1 = useRef();
    const [currentIndex1, setCurrentIndex1] = useState(theme.direction === 'rtl' ? products1.length - 1 : 0);

    const handlePrevious1 = () => {
        carouselRef1.current.slickPrev();
    };

    const handleNext1 = () => {
        carouselRef1.current.slickNext();
    };
    //################################################################################################################

    const settings = {
        slidesToShow: 3,
        centerMode: true,
        centerPadding: '60px',
        rtl: Boolean(theme.direction === 'rtl'),
        responsive: [
            {
                breakpoint: 1024,
                settings: {slidesToShow: 2}
            },
            {
                breakpoint: 600,
                settings: {slidesToShow: 2}
            },
            {
                breakpoint: 480,
                settings: {slidesToShow: 1, centerPadding: '0'}
            }
        ]
    };
// ----------------------------------------------------------------------
    const ProductCard = ({
                             product
                             , isActive
                         }) => {
        const {sp_ten, sp_hinhanh, status, sp_giakhuyenmai, sp_id, gia_ban, gb_soluong} = product;
        const linkTo = `${PATH_PAGE.productDetail}/${sp_id}`;
        const dispatch = useDispatch();
        const {enqueueSnackbar, closeSnackbar} = useSnackbar();
        const {cartItem} = useSelector(state => state.cart);
        const CartItemQuantity = cartItem.filter(e => e.id_sp === sp_id)[0];
        return (
            <Card sx={{m: 1}}>
                <Box sx={{pt: '100%', position: 'relative'}}>
                    {status && (
                        <Label
                            variant="filled"
                            color={(status === 'sale' && 'error') || 'info'}
                            sx={{
                                top: 16,
                                right: 16,
                                zIndex: 9,
                                position: 'absolute',
                                textTransform: 'uppercase'
                            }}
                        >
                            {status}
                        </Label>
                    )}
                    <ProductImgStyle alt={sp_ten}
                                     src={URL_PUBLIC_IMAGES + sp_hinhanh[sp_hinhanh.length - 1]?.ha_hinh}/>
                </Box>

                <Stack spacing={2} sx={{p: 3}}>

                    <Link to={linkTo} color="inherit" component={RouterLink}>
                        <Typography variant="subtitle2" noWrap>
                            {sp_ten}
                        </Typography>
                    </Link>

                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="subtitle1">
                            <Typography
                                component="span"
                                variant="body1"
                                sx={{
                                    color: 'text.disabled',
                                    textDecoration: 'line-through'
                                }}
                            >
                                {!!sp_giakhuyenmai && fCurrency(gia_ban)}
                            </Typography>
                            &nbsp;
                            {!!sp_giakhuyenmai ? fCurrency(sp_giakhuyenmai) : fCurrency(gia_ban)}
                        </Typography>
                        {gb_soluong > 0 && (<IconButton onClick={() => {

                            if (CartItemQuantity?.so_luong && CartItemQuantity.so_luong > gb_soluong) return enqueueSnackbar('Số lượng sản phẩm đạt tối đa!', {
                                variant: 'error',
                                action: (key) => (
                                    <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                                        <Icon icon={closeFill}/>
                                    </MIconButton>
                                ),
                            });

                            dispatch(addToCart({
                                id_sp: sp_id,
                                so_luong: 1,
                                sp_gia: sp_giakhuyenmai ? sp_giakhuyenmai : gia_ban
                            }));

                            enqueueSnackbar('Đã thêm sách vào giỏ hàng!', {
                                variant: 'success',
                                action: (key) => (
                                    <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                                        <Icon icon={closeFill}/>
                                    </MIconButton>
                                ),
                            });
                        }}>
                            <IconCart/>
                        </IconButton>)}
                        {gb_soluong === 0 &&
                            (
                                <Box><Typography align="center" color="error">Hết hàng</Typography></Box>)}
                    </Stack>
                </Stack>
            </Card>
        );
    }

    useEffect(() => {
        (async () => {
            const _products = await getData(API_BASE_URL + `/sachbanchay`);
            const _products1 = await getData(API_BASE_URL + `/sachmoinhat`);
            const _products2 = await getData(API_BASE_URL + `/api/books?pageURL=${page}`);
            setProducts(_products.data);
            setProducts1(_products1.data);
            setProducts2(_products2.data);
            setLoad(false);
        })()
    }, [load, page]);


    return (
        <RootStyle title="HYBE">
            <Container maxWidth={themeStretch ? false : 'lg'}>

                <Box sx={{
                    backgroundColor: PRIMARY_MAIN,
                    width: '25rem',
                    p: '.75rem',
                    my: '.5rem',
                    clipPath: 'polygon(0 0, 79% 0, 100% 100%, 0% 100%)',
                    borderRadius: '5px'
                }}>
                    <Typography sx={{fontWeight: 600}} color='primary.contrastText'>Sản phẩm bán chạy</Typography>
                </Box>
                <RootStyleSlider>
                    <Slider ref={carouselRef} {...settings}>
                        {products?.map((el, index) => (
                            <ProductCard product={el}/>
                        ))}
                    </Slider>
                    <CarouselControlsArrowsBasic2 onNext={handleNext} onPrevious={handlePrevious}/>
                </RootStyleSlider>

                <Box sx={{
                    backgroundColor: PRIMARY_MAIN,
                    width: '25rem',
                    p: '.75rem',
                    my: '.5rem',
                    clipPath: 'polygon(0 0, 79% 0, 100% 100%, 0% 100%)',
                    borderRadius: '5px'
                }}>
                    <Typography sx={{fontWeight: 600}} color='primary.contrastText'>Sản phẩm mới nhất</Typography>
                </Box>
                <RootStyleSlider>
                    <Slider ref={carouselRef1} {...settings}>
                        {products1?.map((el, index) => (
                            <ProductCard product={el}/>
                        ))}
                    </Slider>
                    <CarouselControlsArrowsBasic2 onNext={handleNext1} onPrevious={handlePrevious1}/>
                </RootStyleSlider>

                <Box sx={{
                    backgroundColor: PRIMARY_MAIN,
                    width: '25rem',
                    p: '.75rem',
                    my: '.5rem',
                    clipPath: 'polygon(0 0, 79% 0, 100% 100%, 0% 100%)',
                    borderRadius: '5px'
                }}>
                    <Typography sx={{fontWeight: 600}} color='primary.contrastText'>Tất cả sản phẩm</Typography>
                </Box>
                <ProductList products={products2} isLoad={load}/>
                <Box mt={4} display='flex' justifyContent='center'>
                    <Button variant='contained' onClick={() => setPage(e => e + 1)}>Xem thêm</Button>
                </Box>
            </Container>
        </RootStyle>
    );
}
