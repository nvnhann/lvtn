import {Box, Button, FormControlLabel, Grid, Radio, RadioGroup, styled, Typography} from "@material-ui/core";
import CheckoutAddressInfor from "./CheckoutAddressInfor";
import {onBackStep, onGotoStep} from "../../redux/slices/product";
import {useDispatch, useSelector} from "react-redux";
import CheckoutSummary from "./CheckoutSummary";
import {Icon} from "@iconify/react";
import arrowIosBackFill from "@iconify/icons-eva/arrow-ios-back-fill";
import {Form, FormikProvider, useFormik} from "formik";
import checkmarkCircle2Fill from "@iconify/icons-eva/checkmark-circle-2-fill";
import {LoadingButton} from "@material-ui/lab";
import {postData} from "../../_helper/httpProvider";
import {API_BASE_URL} from "../../config/configUrl";

const OptionStyle = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 2.5),
    justifyContent: 'space-between',
    borderRadius: theme.shape.borderRadius,
    transition: theme.transitions.create('all'),
    border: `solid 1px ${theme.palette.grey[500_32]}`
}));
//---------------------------------------------------------------------------
const DELIVERY_OPTIONS = [
    {
        value: 0,
        title: 'Thanh toán khi nhận hàng (phí vận chuyển 30,000đ)',
    }
];
//---------------------------------------------------------------------------

export default function CheckoutPayment() {
    const dispatch = useDispatch();
    const {totalPrice, shipping, address, product} = useSelector(state => state.product.checkout);


    const handleBackStep = () => {
        dispatch(onBackStep());
    };

    const handleGotoStep = (step) => {
        dispatch(onGotoStep(step));
    };

    const formik = useFormik({
        initialValues: {
            delivery: totalPrice,
            shipping: 3000,
            payment: ''
        },
        onSubmit: async (values, {setErrors, setSubmitting}) => {
            try {
                let _values = {};
                _values.hd_tenkh = address.dc_tenkh;
                _values.hd_idkh = address.dc_idkh;
                _values.hd_sdt = address.dc_sdt;
                _values.hd_email = address.dc_email;
                _values.hd_tongtien = totalPrice;
                _values.hd_tienvc = shipping;
                _values.hd_diachi = address.dc_diachi;
                _values.product = product;
                await postData(API_BASE_URL + '/hoadon', _values);
                // handleNextStep();
                console.log(_values)
            } catch (error) {
                console.error(error);
                setSubmitting(false);
                setErrors(error.message);
            }
        }
    });
    const {isSubmitting, handleSubmit, values, setFieldValue} = formik;

    return (
        <>
            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>

                            <RadioGroup
                                name="delivery"
                                value={Number(values.delivery)}
                                onChange={(event) => {
                                    const {value} = event.target;
                                    setFieldValue('delivery', Number(value));
                                }}
                            >
                                {DELIVERY_OPTIONS.map((delivery) => {
                                    const {value, title} = delivery;
                                    return (
                                        <Grid key={value} item xs={12} md={6}>
                                            <OptionStyle
                                                sx={{
                                                    ...(values.delivery === value && {
                                                        boxShadow: (theme) => theme.customShadows.z8
                                                    })
                                                }}
                                            >
                                                <FormControlLabel
                                                    value={value}
                                                    checked={value === 0}
                                                    control={<Radio checkedIcon={<Icon icon={checkmarkCircle2Fill}/>}/>}
                                                    label={
                                                        <Box sx={{ml: 1}}>
                                                            <Typography variant="subtitle2">{title}</Typography>
                                                        </Box>
                                                    }
                                                    sx={{py: 3, flexGrow: 1, mr: 0}}
                                                />
                                            </OptionStyle>
                                        </Grid>
                                    );
                                })}
                            </RadioGroup>

                            <Button
                                type="button"
                                size="small"
                                color="inherit"
                                onClick={handleBackStep}
                                startIcon={<Icon icon={arrowIosBackFill}/>}
                                sx={{mt: 3}}
                            >
                                Trở về
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <CheckoutAddressInfor onBackStep={handleBackStep}/>
                            <CheckoutSummary
                                total={totalPrice + 30000}
                                enableDiscount
                                subtotal={totalPrice}
                                shipping={30000}
                                onEdit={() => handleGotoStep(0)}
                                enableEdit={true}
                            />
                            <LoadingButton fullWidth size="large" type="submit" variant="contained"
                                           loading={isSubmitting}>
                                Thanh toán
                            </LoadingButton>
                        </Grid>
                    </Grid>
                </Form>
            </FormikProvider>
        </>
    )
}