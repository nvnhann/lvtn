import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import {PATH_DASHBOARD} from "../../routes/paths";
import Page from "../../components/Page";
import {Card, Container} from "@material-ui/core";

export default function BinhLuan(){
    return <>
        <Page title="Đơn hàng">
            <Container >
                <HeaderBreadcrumbs
                    heading="Đơn hàng"
                    links={[
                        {name: 'Quản lý', href: PATH_DASHBOARD.root},
                        {name: 'Bình luận', href: PATH_DASHBOARD.binhluan.root},
                        {name: 'danh sách'},
                    ]}
                />
                <Card>
                </Card>
            </Container>
        </Page>
    </>
}