import PropTypes from 'prop-types';
// material
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    InputAdornment,
    Stack,
    TextField,
    Typography
} from '@material-ui/core';
import {fCurrency} from "../../_helper/formatCurrentCy";
// utils

// ----------------------------------------------------------------------

CheckoutSummary.propTypes = {
    total: PropTypes.number,
    discount: PropTypes.number,
    subtotal: PropTypes.number,
    shipping: PropTypes.number,
    onEdit: PropTypes.func,
    enableEdit: PropTypes.bool,
    onApplyDiscount: PropTypes.func,
    enableDiscount: PropTypes.bool
};

export default function CheckoutSummary({
                                            total,
                                            onEdit,
                                            discount,
                                            subtotal,
                                            shipping = null,
                                            onApplyDiscount,
                                            enableDiscount = false
                                        }) {
    const displayShipping = shipping !== null ? 'Free' : '-';

    return (
        <Card sx={{mb: 3}}>
            <CardHeader
                title="Thông tin thanh toán"
            />

            <CardContent>
                <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={{color: 'text.secondary'}}>
                            Tổng tiền sản phẩm
                        </Typography>
                        <Typography variant="subtitle2">{fCurrency(subtotal)}</Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={{color: 'text.secondary'}}>
                            Giảm giá
                        </Typography>
                        <Typography variant="subtitle2">{discount ? fCurrency(-discount) : '-'}</Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={{color: 'text.secondary'}}>
                            Phí vận chuyển
                        </Typography>
                        <Typography variant="subtitle2">{shipping ? fCurrency(shipping) : displayShipping}</Typography>
                    </Stack>

                    <Divider/>

                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="subtitle1">Tổng cộng</Typography>
                        <Box sx={{textAlign: 'right'}}>
                            <Typography variant="subtitle1" sx={{color: 'error.main'}}>
                                {fCurrency(total)}
                            </Typography>
                        </Box>
                    </Stack>

                    {enableDiscount && (
                        <TextField
                            fullWidth
                            placeholder="Discount codes / Gifts"
                            value="DISCOUNT5"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Button type="button" onClick={() => onApplyDiscount(5)} sx={{mr: -0.5}}>
                                            Áp dụng
                                        </Button>
                                    </InputAdornment>
                                )
                            }}
                        />
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}
