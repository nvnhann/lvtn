import {Card, Container, styled} from "@material-ui/core";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import OrderShipping from "./OrderShipping";
import {PATH_PAGE} from "../../routes/paths";
import {useSelector} from "react-redux";

const RootStyle = styled(Page)(({theme}) => ({
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(15),
    [theme.breakpoints.up('md')]: {
        paddingTop: theme.spacing(11)
    }
}));
export default function OrderProfile() {
    const user = useSelector(state => state.user.current);
    return <>
        <RootStyle title='Profile'>
            <Container>
                <HeaderBreadcrumbs
                    heading="Trang cá nhân"
                    links={[
                        {name: 'Shipper', href: PATH_PAGE.profile},
                        {name: user?.fullname}
                    ]}
                />

                <Card
                    sx={{
                        mb: 3,
                        height: 280,
                        position: 'relative'
                    }}
                >
                    <OrderShipping/>
                </Card>


            </Container>
        </RootStyle>
    </>
}