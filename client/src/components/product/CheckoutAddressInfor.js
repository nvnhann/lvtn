import {Button, Card, CardContent, CardHeader} from "@material-ui/core";
import {useSelector} from "react-redux";
import {Icon} from "@iconify/react";
import editFill from "@iconify/icons-eva/edit-fill";

export default function CheckoutAddressInfor({onBackStep}) {
    const {address} = useSelector(state => state.product.checkout);
    return (
        <Card sx={{mb: 3}}>
            <CardHeader
                title="Billing Address"
                action={
                    <Button size="small" type="button" startIcon={<Icon icon={editFill}/>} onClick={onBackStep}>
                        Chỉnh sửa
                    </Button>
                }
            />
            <CardContent>

            </CardContent>
        </Card>
    )
}