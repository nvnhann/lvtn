import {Icon} from '@iconify/react';
import {useEffect, useState} from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import {Link as RouterLink} from 'react-router-dom';
// material
import {
    Button,
    Card,
    Checkbox,
    Container,
    Stack,
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
import {getData, postData} from '../../_helper/httpProvider';
import {API_BASE_URL} from '../../config/configUrl';
import {useSnackbar} from 'notistack5';
import {MIconButton} from '../../components/@material-extend';
import closeFill from '@iconify/icons-eva/close-fill';
import NXBListToolbar from '../../components/_dashboard/nhaxuatban/list/NXBListToolbar';
import NXBListHead from '../../components/_dashboard/nhaxuatban/list/NXBListHead';
import NXBMoreMenu from '../../components/_dashboard/nhaxuatban/list/NXBMoreMenu';
import {useSelector} from "react-redux";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    {id: 'tên', label: 'Tên', alignRight: false},
    {id: 'email', label: 'Email', alignRight: false},
    {id: 'sdt', label: 'Số điện thoại', alignRight: false},
    {id: 'dc', label: 'Địa chỉ', alignRight: false},
    {id: 'status', label: 'Trạng thái', alignRight: false},
    {id: ''},
];

// ----------------------------------------------------------------------

export default function NhaXuatBanList() {
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
    const isAdmin = useSelector(state => state.user.current?.role) === "ADMIN";

    useEffect(() => {
        (async () => {
            try {
                const res = await getData(
                    API_BASE_URL + `/nhaxuatban?search=${filterName}`,
                );
                setDatas(res.data);
                console.log(res.data);
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
            const newSelecteds = datas.map((n) => n.nxb_id);
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

    const changeActiveRole = async (id, active) => {
        console.log(id, active);
        try {
            const res = await postData(API_BASE_URL + '/nhaxuatban/active', {
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
        <Page title="NXB|HYPE">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading="Nhà xuất bản"
                    links={[
                        {name: 'Quản lý', href: PATH_DASHBOARD.root},
                        {name: 'Nhà xuất bản', href: PATH_DASHBOARD.nhaxuatban.root},
                    ]}
                    action={
                       isAdmin && <Button
                            variant="contained"
                            component={RouterLink}
                            to={PATH_DASHBOARD.nhaxuatban.new}
                            startIcon={<Icon icon={plusFill}/>}
                        >
                            Thêm nhà xuất bản
                        </Button>
                    }
                />

                <Card>
                    <NXBListToolbar
                        selected={selected}
                        filterName={filterName}
                        onFilterName={handleFilterByName}
                        setLoad={setLoad}
                        setSelected={setSelected}
                    />
                    <Scrollbar>
                        <TableContainer sx={{minWidth: 800}}>
                            <Table>
                                <NXBListHead
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
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => {
                                            const {
                                                nxb_id,
                                                nxb_ten,
                                                nxb_sdt,
                                                nxb_email,
                                                nxb_diachi,
                                                active,
                                            } = row;
                                            const isItemSelected = selected.indexOf(nxb_id) !== -1;
                                            return (
                                                <TableRow
                                                    hover
                                                    key={nxb_id}
                                                    tabIndex={-1}
                                                    role="checkbox"
                                                    selected={isItemSelected}
                                                    aria-checked={isItemSelected}
                                                >
                                                    <TableCell padding="checkbox">
                                                        {isAdmin && <Checkbox
                                                            checked={isItemSelected}
                                                            onChange={(event) => handleClick(event, nxb_id)}
                                                        />}
                                                    </TableCell>
                                                    <TableCell component="th" scope="row" padding="none">
                                                        <Stack
                                                            direction="row"
                                                            alignItems="center"
                                                            spacing={2}
                                                        >
                                                            <Typography variant="subtitle2" noWrap>
                                                                {nxb_ten}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell align="left">{nxb_email}</TableCell>
                                                    <TableCell align="left">{nxb_sdt}</TableCell>
                                                    <TableCell align="left">{nxb_diachi}</TableCell>
                                                    <TableCell align="left">
                                                        { isAdmin && <Switch
                                                            checked={active === 1}
                                                            onChange={() => {
                                                                changeActiveRole(nxb_id, !active);
                                                            }}
                                                        />}
                                                        {!isAdmin && <Typography color='lightgreen'>{active ? 'Hiện' : 'Ẩn'}</Typography>}

                                                    </TableCell>

                                                    <TableCell align="right">
                                                        {isAdmin &&  <NXBMoreMenu id={nxb_id}/>}
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
            </Container>
        </Page>
    );
}
