import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import {PATH_DASHBOARD} from "../../routes/paths";
import Page from "../../components/Page";
import {Avatar, Box, Button, Card, Container, List, ListItem, Stack, Switch, Typography} from "@material-ui/core";
import {useEffect, useState} from "react";
import {API_BASE_URL} from "../../config/configUrl";
import {randomIntFromInterval} from "../../_helper/helper";
import {fDate} from "../../utils/formatTime";
import {Rating} from "@material-ui/lab";
import {getData, putData} from "../../_helper/httpProvider";
import {MIconButton} from "../../components/@material-extend";
import {Icon} from "@iconify/react";
import closeFill from "@iconify/icons-eva/close-fill";
import {useSnackbar} from "notistack5";
import {useSelector} from "react-redux";



export default function BinhLuan(){
    const [comment, setComment] = useState([]);
    const [pageURL, setPageURL] = useState(1);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [load, setLoad] = useState(0);
    const isAdmin = useSelector(state => state.user.current?.role) === "ADMIN";


    useEffect(()=>{
        (async () => {
            const res = await getData(API_BASE_URL + `/binhluan-getall?pageURL=${pageURL}`);
            setComment(res.data);
            console.log(res.data)
        })()
    }, [pageURL,load])

    const changeActiveRole = async (id, active) => {
        try {
            const res = await putData(API_BASE_URL + '/api/binhluan-active', {
                id: id,
                active: active,
            });
            setLoad((e) => e + 1);
            enqueueSnackbar(res.data, {
                variant: 'success',
                action: (key) => (
                    <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                        <Icon icon={closeFill}/>
                    </MIconButton>
                ),
            });
        } catch (error) {
            console.log(error);
        }
    };
    return <>
        <Page title="Bình luận">
            <Container >
                <HeaderBreadcrumbs
                    heading="Bình luận"
                    links={[
                        {name: 'Quản lý', href: PATH_DASHBOARD.root},
                        {name: 'Bình luận', href: PATH_DASHBOARD.binhluan.root},
                        {name: 'danh sách'},
                    ]}
                />
                <Card>
                    <List disablePadding>
                        {comment?.data?.map((e, idx) => (
                            <ListItem key={idx}>
                                <ListItem
                                    disableGutters
                                    sx={{
                                        mb: 5,
                                        alignItems: 'flex-start',
                                        flexDirection: {xs: 'column', sm: 'row'}
                                    }}
                                >
                                    <Box
                                        sx={{
                                            mr: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            mb: {xs: 2, sm: 0},
                                            minWidth: {xs: 160, md: 240},
                                            textAlign: {sm: 'center'},
                                            flexDirection: {sm: 'column'}
                                        }}
                                    >
                                        <Avatar
                                            src={`/static/avatar_${randomIntFromInterval(1, 20)}.jpg`}
                                            sx={{
                                                mr: {xs: 2, sm: 0},
                                                mb: {sm: 2},
                                                width: {md: 64},
                                                height: {md: 64}
                                            }}
                                        />

                                        <Typography variant="subtitle2" noWrap>
                                            {e.fullname}
                                        </Typography>
                                        <Typography variant="caption" sx={{color: 'text.secondary'}} noWrap>
                                            {fDate(e.bl_thoigian)}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant='h5'>{e.sp_ten}</Typography>
                                        <Rating size="small" value={e.bl_danhgia} readOnly/>
                                        <Typography variant="body2">{e.bl_noidung}</Typography>

                                    </Box>
                                    <Box>
                                        {isAdmin && <Switch
                                            checked={e.bl_trangthai === 1}
                                            onChange={() => {
                                                changeActiveRole(e.bl_id, !e.bl_trangthai);
                                            }}
                                        />}
                                        {!isAdmin && <Typography
                                            color='lightgreen'>{e.bl_trangthai ? 'Hiện' : 'Ẩn'}</Typography>}
                                    </Box>
                                </ListItem>
                            </ListItem>
                        ))}
                    </List>
                    <Stack direction='row' justifyContent='center' sx={{my: 2}}>
                        <Button onClick={() => setPageURL(e => e + 1)} variant='contained'>Xem thêm</Button>
                    </Stack>
                </Card>
            </Container>
        </Page>
    </>
}