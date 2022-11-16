import {Icon} from '@iconify/react';
import {useEffect, useState} from 'react';
// material
import {
    Card,
    Checkbox,
    Container,
    Grid,
    IconButton,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    TableRow,
    Typography,
} from '@material-ui/core';
// routes
import {PATH_DASHBOARD} from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {getData, putData} from '../../_helper/httpProvider';
import {API_BASE_URL} from '../../config/configUrl';
import {useSnackbar} from 'notistack5';
import {MIconButton} from '../../components/@material-extend';
import closeFill from '@iconify/icons-eva/close-fill';
import KhuyenMaiNewForm from "../../components/_dashboard/khuyenmai/KhuyenMaiNewForm";
import KhuyenMaiListToolbar from "../../components/_dashboard/khuyenmai/list/KhuyenMaiListToolbar";
import KhuyenMaiListHead from "../../components/_dashboard/khuyenmai/list/KhuyenMaiListHead";
import {formatDate} from "../../_helper/formatDate";
import {useSelector} from "react-redux";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    {id: 'id', label: 'Sách', alignRight: false},
    {id: 'tên', label: 'Tên sản phẩm', alignRight: false},
    {id: 'phan_tram', label: 'Phần trăm giảm', alignRight: false},
    {id: 'ngay_bd', label: 'Ngày bắt đầu', alignRight: false},
    {id: 'ngay_kt', label: 'Ngày kết thúc', alignRight: false},
    {id: 'trang_thai', label: 'Trạng thái', alignRight: false},
    {id: ''},
];

// ----------------------------------------------------------------------

export default function KhuyenMai() {
    const {themeStretch} = useSettings();
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [datas, setDatas] = useState([]);
    const [load, setLoad] = useState(0);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [edit, setEdit] = useState({isEdit: false, current: {}});
    const isAdmin = useSelector(state => state.user.current?.role) === "ADMIN";

    useEffect(() => {
        (async () => {
            try {
                const res = await getData(
                    API_BASE_URL + `/khuyenmai?search=${filterName}`,
                );
                setDatas(res.data);
            } catch (e) {
                console.log(e);
            }
        })();
    }, [filterName, load]);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = datas.map((n) => n.km_id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterByName = (event) => {
        setFilterName(event.target.value);
    };

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - datas.length) : 0;

    const isRoleNotFound = datas.length === 0;

    const changeActiveKhuyenMai = async (id, active) => {
        try {
            const res = await putData(API_BASE_URL + '/api/khuyenmai-active', {
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
    return (
        <Page title="Khuyen Mai">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading="Khuyến mãi"
                    links={[
                        {name: 'Quản lý', href: PATH_DASHBOARD.root},
                        {name: 'Khuyến mãi', href: PATH_DASHBOARD.khuyenmai.root},
                    ]}
                />

                <Grid container spacing={2}>
                    <Grid item xs={12} md={12}>
                        {isAdmin && <KhuyenMaiNewForm
                            isEdit={edit.isEdit}
                            current={edit.current}
                            setEdit={setEdit}
                            setLoad={setLoad}
                        />}
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Card>
                            <KhuyenMaiListToolbar
                                selected={selected}
                                filterName={filterName}
                                onFilterName={handleFilterByName}
                                setLoad={setLoad}
                                setSelected={setSelected}
                            />
                            <Scrollbar>
                                <TableContainer sx={{minWidth: 800}}>
                                    <Table>
                                        <KhuyenMaiListHead
                                            order={order}
                                            orderBy={orderBy}
                                            headLabel={TABLE_HEAD}
                                            rowCount={datas.length}
                                            numSelected={selected.length}
                                            onRequestSort={handleRequestSort}
                                            onSelectAllClick={handleSelectAllClick}
                                        />
                                        <TableBody>
                                            {datas
                                                .slice(
                                                    page * rowsPerPage,
                                                    page * rowsPerPage + rowsPerPage,
                                                )
                                                .map((row) => {
                                                    const {
                                                        km_id,
                                                        sp_masp,
                                                        sp_ten,
                                                        tl_ten,
                                                        km_phantramgiam,
                                                        km_ngaybatdau,
                                                        km_ngayketthuc,
                                                        active,
                                                        tl_id,
                                                        km_idsp
                                                    } = row;
                                                    const isItemSelected = selected.indexOf(km_id) !== -1;
                                                    return (
                                                        <TableRow
                                                            hover
                                                            key={km_id}
                                                            tabIndex={-1}
                                                            role="checkbox"
                                                            selected={isItemSelected}
                                                            aria-checked={isItemSelected}
                                                        >
                                                            <TableCell padding="checkbox">
                                                                {isAdmin && <Checkbox
                                                                    checked={isItemSelected}
                                                                    onChange={(event) =>
                                                                        handleClick(event, km_id)
                                                                    }
                                                                />}
                                                            </TableCell>
                                                            <TableCell
                                                                component="th"
                                                                scope="row"
                                                            >
                                                                {sp_masp}
                                                            </TableCell>

                                                            <TableCell
                                                                component="th"
                                                                scope="row"
                                                                padding="none"
                                                            >
                                                                {sp_ten}
                                                            </TableCell>
                                                            <TableCell
                                                                component="th"
                                                                scope="row"
                                                                padding="none"
                                                                align="center"
                                                            >
                                                                {km_phantramgiam}%
                                                            </TableCell>
                                                            <TableCell
                                                                component="th"
                                                                scope="row"
                                                                padding="none"
                                                                sx={{minWidth: '5rem'}}
                                                            >
                                                                {formatDate(km_ngaybatdau) === '1970-01-01' ? '' : formatDate(km_ngaybatdau)}
                                                            </TableCell>
                                                            <TableCell
                                                                component="th"
                                                                scope="row"
                                                                padding="none"
                                                                sx={{minWidth: '5rem'}}

                                                            >
                                                                {formatDate(km_ngayketthuc) === '1970-01-01' ? '' : formatDate(km_ngayketthuc)}
                                                            </TableCell>
                                                            <TableCell align="left">
                                                                {isAdmin && <Switch
                                                                    checked={active === 1}
                                                                    onChange={() => {
                                                                        changeActiveKhuyenMai(km_id, !active);
                                                                    }}
                                                                />}
                                                                {!isAdmin && <Typography
                                                                    color='lightgreen'>{active ? 'Hiện' : 'Ẩn'}</Typography>}
                                                            </TableCell>

                                                            <TableCell>
                                                                {isAdmin && <IconButton>
                                                                    <Icon
                                                                        icon="akar-icons:edit"
                                                                        color="#B72136"
                                                                        onClick={() =>
                                                                            setEdit({
                                                                                isEdit: true,
                                                                                current: {
                                                                                    km_phantramgiam: km_phantramgiam,
                                                                                    km_ngaybatdau: km_ngaybatdau,
                                                                                    km_ngayketthuc: km_ngayketthuc,
                                                                                    sp_idtl: {
                                                                                        tl_id: tl_id,
                                                                                        tl_ten: tl_ten
                                                                                    },
                                                                                    sp_idsp: {
                                                                                        sp_ten: sp_ten,
                                                                                        sp_id: km_idsp,
                                                                                        sp_masp: sp_masp
                                                                                    },
                                                                                    km_id: km_id
                                                                                },

                                                                            })
                                                                        }
                                                                    />
                                                                </IconButton>}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            {emptyRows > 0 && (
                                                <TableRow style={{height: 53 * emptyRows}}>
                                                    <TableCell colSpan={6}/>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                        {isRoleNotFound && (
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell align="center" colSpan={6} sx={{py: 3}}>
                                                        <SearchNotFound searchQuery={filterName}/>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        )}
                                    </Table>
                                </TableContainer>
                            </Scrollbar>

                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={datas.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
}
