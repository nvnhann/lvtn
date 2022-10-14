import PropTypes from 'prop-types';
import {paramCase} from 'change-case';
import {Link as RouterLink} from 'react-router-dom';
// material
import {Box, Card, IconButton, Link, Stack, Typography} from '@material-ui/core';
import {styled} from '@material-ui/core/styles';
import {PATH_PAGE} from "../../routes/paths";
import Label from "../Label";
import {fCurrency} from "../../_helper/formatCurrentCy";
import {URL_PUBLIC_IMAGES} from "../../config/configUrl";
import IconCart from "../IconCart";
import {useDispatch} from "react-redux";
import {addToCart} from "../../redux/slices/cart";
import {useSnackbar} from "notistack5";
import {MIconButton} from "../@material-extend";
import {Icon} from "@iconify/react";
import closeFill from "@iconify/icons-eva/close-fill";
// routes
//


// ----------------------------------------------------------------------

const ProductImgStyle = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute'
});

// ----------------------------------------------------------------------

ProductCard.propTypes = {
    product: PropTypes.object
};

export default function ProductCard({product}) {
    const {sp_ten, sp_hinhanh, ctpn_gia, status, sp_giakhuyenmai, sp_id} = product;
    const linkTo = `${PATH_PAGE.productDetail}/${sp_id}`;
    const dispatch = useDispatch();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    return (
        <Card>
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
                <ProductImgStyle alt={sp_ten} src={URL_PUBLIC_IMAGES + sp_hinhanh[sp_hinhanh.length - 1]?.ha_hinh}/>
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
                            {!!sp_giakhuyenmai && fCurrency(ctpn_gia)}
                        </Typography>
                        &nbsp;
                        {!!sp_giakhuyenmai ? fCurrency(sp_giakhuyenmai) : fCurrency(ctpn_gia)}
                    </Typography>
                    <IconButton onClick={() => {
                        dispatch(addToCart({id_sp: sp_id, so_luong: 1}));
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
                    </IconButton>
                < /Stack>
            </Stack>
        </Card>
    );
}
