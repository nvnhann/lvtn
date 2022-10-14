import {Icon} from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import minusFill from '@iconify/icons-eva/minus-fill';
import roundAddShoppingCart from '@iconify/icons-ic/round-add-shopping-cart';
import {Form, FormikProvider, useField, useFormik} from 'formik';
// material
import {styled} from '@material-ui/core/styles';
import {Box, Button, Divider, FormHelperText, Stack, Typography} from '@material-ui/core';
import {MIconButton} from "../@material-extend";
import {addToCart} from "../../redux/slices/cart";
import {useDispatch} from "react-redux";
import {onGotoStep} from "../../redux/slices/product";
import {fCurrency} from "../../_helper/formatCurrentCy";
// redux

// ----------------------------------------------------------------------


const RootStyle = styled('div')(({theme}) => ({
    padding: theme.spacing(3),
    [theme.breakpoints.up(1368)]: {
        padding: theme.spacing(5, 8)
    }
}));

// ----------------------------------------------------------------------

const Incrementer = (props) => {
    const [field, , helpers] = useField(props);
    // eslint-disable-next-line react/prop-types
    const {available} = props;
    const {value} = field;
    const {setValue} = helpers;

    const incrementQuantity = () => {
        setValue(value + 1);
    };
    const decrementQuantity = () => {
        setValue(value - 1);
    };

    return (
        <Box
            sx={{
                py: 0.5,
                px: 0.75,
                border: 1,
                lineHeight: 0,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                borderColor: 'grey.50032'
            }}
        >
            <MIconButton size="small" color="inherit" disabled={value <= 1} onClick={decrementQuantity}>
                <Icon icon={minusFill} width={16} height={16}/>
            </MIconButton>
            <Typography
                variant="body2"
                component="span"
                sx={{
                    width: 40,
                    textAlign: 'center',
                    display: 'inline-block'
                }}
            >
                {value}
            </Typography>
            <MIconButton size="small" color="inherit" disabled={value >= available} onClick={incrementQuantity}>
                <Icon icon={plusFill} width={16} height={16}/>
            </MIconButton>
        </Box>
    );
};

export default function ProductDetailsSumary(props) {
    const {product} = props;
    const dispatch = useDispatch();
    const {
        sp_id,
        sp_masp,
        sp_ten,
        sp_mota,
        sp_chieudai,
        sp_chieurong,
        ctpn_gia,
        sp_giakhuyenmai,
        tl_ten,
        nxb_ten,
        ncc_ten,
        tg_ten,
        nn_ten,
        ctpn_soluong
    } = product;


    const handleBuyNow = () => {
        dispatch(onGotoStep(0));
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            quantity: ctpn_soluong < 1 ? 0 : 1
        },
        onSubmit: async (values, {setSubmitting}) => {
            try {

                setSubmitting(false);
            } catch (error) {
                setSubmitting(false);
            }
        }
    });


    const {values, touched, errors, getFieldProps, handleSubmit} = formik;
    const isMaxQuantity = values.quantity >= ctpn_soluong;

    const handleAddCart = () => {
        dispatch(addToCart({
            id_sp: sp_id,
            so_luong: values.quantity,
            sp_gia: sp_giakhuyenmai ? sp_giakhuyenmai : ctpn_gia
        }));
    };


    return (
        <RootStyle>
            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Typography variant="h5" paragraph>
                        {sp_ten}
                    </Typography>
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

                    <Divider sx={{borderStyle: 'dashed'}}/>

                    <Stack spacing={3} sx={{my: 3}}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="subtitle1" sx={{mt: 0.5}}>
                                Tác giả
                            </Typography>
                            <Typography variant="subtitle2" sx={{mt: 0.5}}>
                                {tg_ten}
                            </Typography>
                        </Stack>

                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="subtitle1" sx={{mt: 0.5}}>
                                Nhà xuất bản
                            </Typography>
                            <Typography variant="subtitle2" sx={{mt: 0.5}}>
                                {nxb_ten}
                            </Typography>
                        </Stack>

                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="subtitle1" sx={{mt: 0.5}}>
                                Nhà cung cấp
                            </Typography>
                            <Typography variant="subtitle2" sx={{mt: 0.5}}>
                                {ncc_ten}
                            </Typography>
                        </Stack>

                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="subtitle1" sx={{mt: 0.5}}>
                                Thể loại
                            </Typography>
                            <Typography variant="subtitle2" sx={{mt: 0.5}}>
                                {tl_ten}
                            </Typography>
                        </Stack>

                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="subtitle1" sx={{mt: 0.5}}>
                                Ngôn ngữ
                            </Typography>
                            <Typography variant="subtitle2" sx={{mt: 0.5}}>
                                {nn_ten}
                            </Typography>
                        </Stack>

                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="subtitle1" sx={{mt: 0.5}}>
                                Kích thướt
                            </Typography>
                            <Typography variant="subtitle2" sx={{mt: 0.5}}>
                                {`${sp_chieudai} x ${sp_chieurong}`}
                            </Typography>
                        </Stack>

                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="subtitle1" sx={{mt: 0.5}}>
                                Số lượng
                            </Typography>
                            <div>
                                <Incrementer name="quantity" available={ctpn_soluong}/>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        mt: 1,
                                        display: 'block',
                                        textAlign: 'right',
                                        color: 'text.secondary'
                                    }}
                                >
                                    Có sẵn: {ctpn_soluong}
                                </Typography>

                                <FormHelperText error>{touched.soluong && errors.soluong}</FormHelperText>
                            </div>
                        </Stack>
                    </Stack>
                    <Divider sx={{borderStyle: 'dashed'}}/>

                    <Stack spacing={2} direction={{xs: 'column', sm: 'row'}} sx={{mt: 5}}>
                        <Button
                            fullWidth
                            disabled={isMaxQuantity}
                            size="large"
                            type="button"
                            color="warning"
                            variant="contained"
                            startIcon={<Icon icon={roundAddShoppingCart}/>}
                            onClick={handleAddCart}
                            sx={{whiteSpace: 'nowrap'}}
                        >
                            Thêm giỏ hàng
                        </Button>
                        <Button fullWidth size="large" type="submit" variant="contained">
                            Mua ngay
                        </Button>
                    </Stack>
                </Form>
            </FormikProvider>
        </RootStyle>
    );
}
