import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import {PATH_DASHBOARD} from "../../routes/paths";
import {
    Card,
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    TableRow,
    Typography
} from "@material-ui/core";
import Page from "../../components/Page";
import useSettings from "../../hooks/useSettings";
import {useEffect, useState} from "react";
import HoaDonListToolbar from "../../components/_dashboard/Hoadon/list/HoaDonListToolbar";
import {getData} from "../../_helper/httpProvider";
import {API_BASE_URL} from "../../config/configUrl";
import Scrollbar from "../../components/Scrollbar";
import HoaDonListHead from "../../components/_dashboard/Hoadon/list/HoaDonListHead";
import SearchNotFound from "../../components/SearchNotFound";
import {fCurrency} from "../../_helper/formatCurrentCy";
import {formatDateTime} from "../../_helper/formatDate";
import HoaDonMoreMenu from "../../components/_dashboard/Hoadon/list/HoaDonMoreMenu";

//------------------------------------------------------------------------------------------------------------
const TABLE_HEAD = [
    {id: 'id', label: 'ID Đơn hàng', alignRight: false},
    {id: 'ho_ten', label: 'Họ tên', alignRight: false},
    {id: 'sdt', label: 'Số điện thoại', alignRight: false},
    {id: 'tong_don', label: 'Tổng đơn', alignRight: false},
    {id: 'hinh_thuc_thanh_toan', label: 'HTTT', alignRight: false},
    {id: 'ngay_tao', label: 'Ngày tạo', alignRight: false},
    {id: 'trang_thai', label: 'Trạng thái', alignRight: false},
    {id: ''},
];
//------------------------------------------------------------------------------------------------------------
export default function HoaDon() {
    const {themeStretch} = useSettings();
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [_datas, setDatas] = useState([]);
    const [load, setLoad] = useState(0);
    const [activeStep, setActiveStep] = useState(0);


    useEffect(() => {
        (async () => {
            try {
                const res = await getData(API_BASE_URL + `/hoadon?search=${filterName}&&trangthai=${activeStep}`);
                setDatas(res.data);
                console.log(res.data)
            } catch (e) {
                console.log(e);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [load, activeStep]);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = _datas.map((n) => n.hd_id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
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

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - _datas.length) : 0;

    const isOrdersNotFound = _datas.length === 0;


    return (
        <>
            <Page title="Đơn hàng">
                <Container maxWidth={themeStretch ? false : 'lg'}>
                    <HeaderBreadcrumbs
                        heading="Đơn hàng"
                        links={[
                            {name: 'Quản lý', href: PATH_DASHBOARD.root},
                            {name: 'Đơn hàng', href: PATH_DASHBOARD.hoadon.root},
                            {name: 'danh sách'},
                        ]}
                    />
                    <Card>
                        <HoaDonListToolbar
                            selected={selected}
                            filterName={filterName}
                            onFilterName={handleFilterByName}
                            setLoad={setLoad}
                            setSelected={setSelected}
                            activeStep={activeStep}
                            setActiveStep={setActiveStep}
                        />
                        <Scrollbar>
                            <TableContainer sx={{minWidth: 800}}>
                                <Table>
                                    <HoaDonListHead
                                        order={order}
                                        orderBy={orderBy}
                                        headLabel={TABLE_HEAD}
                                        rowCount={_datas.length}
                                        numSelected={selected.length}
                                        onRequestSort={handleRequestSort}
                                        onSelectAllClick={handleSelectAllClick}
                                    />
                                    <TableBody>
                                        {_datas
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row) => {
                                                let {
                                                    hd_id,
                                                    hd_tenkh,
                                                    hd_sdt,
                                                    hd_tongtien,
                                                    hd_hinhthucthanhtoan,
                                                    hd_ngaytao,
                                                    trangthai
                                                } = row;

                                                const hd_trangthai = trangthai[trangthai.length - 1].tt_trangthai;
                                                let hd_ngaytt = trangthai[trangthai.length - 1].tt_ngaycapnhat
                                                const isItemSelected = selected.indexOf(hd_id) !== -1;

                                                return (
                                                    <TableRow
                                                        hover
                                                        key={hd_id}
                                                        tabIndex={-1}
                                                        role="checkbox"
                                                        selected={isItemSelected}
                                                        aria-checked={isItemSelected}
                                                    >
                                                        <TableCell>#{hd_id}</TableCell>
                                                        <TableCell>{hd_tenkh}</TableCell>
                                                        <TableCell>{hd_sdt}</TableCell>
                                                        <TableCell
                                                            sx={{width: '7rem'}}>{fCurrency(hd_tongtien)}</TableCell>
                                                        <TableCell>{hd_hinhthucthanhtoan}</TableCell>
                                                        <TableCell>{formatDateTime(hd_ngaytao)}</TableCell>
                                                        <TableCell>
                                                            {hd_trangthai === 0 &&
                                                                <Typography color='lightseagreen'>Chờ xác
                                                                    nhận</Typography>}
                                                            {hd_trangthai === 1 &&
                                                                <>
                                                                    <Typography color='lightgreen'>Đã xác
                                                                        nhận</Typography>
                                                                    <Typography
                                                                        variant='subtitle2'> {formatDateTime(hd_ngaytt)}</Typography>
                                                                </>}
                                                            {hd_trangthai === 2 &&
                                                                <Typography color='blueviolet'>Đã lấy hàng</Typography>}
                                                            {hd_trangthai === 3 &&
                                                                <>
                                                                    <Typography color='hotpink'>Đã giao
                                                                        hàng </Typography>
                                                                    <Typography
                                                                        variant='subtitle2'> {formatDateTime(hd_ngaytt)}</Typography>
                                                                </>}
                                                            {hd_trangthai === 4 &&
                                                                <Typography color='error'>Đã hủy</Typography>}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <HoaDonMoreMenu hoadon={row} status={hd_trangthai}
                                                                            setLoad={setLoad}/>
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
                                    {isOrdersNotFound && (
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
                            count={_datas.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Card>
                </Container>
            </Page>
        </>
    )
}