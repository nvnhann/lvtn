import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@material-ui/core';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { getData } from 'src/_helper/httpProvider';
import { API_BASE_URL } from 'src/config/configUrl';
import PhieuNhapListHead from 'src/components/_dashboard/phieunhap/list/PhieuNhapListHead';
import PhieuNhapToolbar from 'src/components/_dashboard/phieunhap/list/PhieuNhapToolbar';
import { fCurrency } from 'src/_helper/formatCurrentCy';
import { formatDateTime } from 'src/_helper/formatDate';
import PhieuNhapMoreMenu from 'src/components/_dashboard/phieunhap/list/PhieuNhapMoreMenu';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'pn_id', label: 'Mã Phiếu Nhập', alignRight: false },
  { id: 'pn_idnv', label: 'Mã Nhân Viên', alignRight: false },
  { id: 'pn_tennv', label: 'Tên Nhân Viên', alignRight: false },
  { id: 'pn_ncc', label: 'Nhà Cung Cấp', alignRight: false },
  { id: 'pn_tongtien', label: 'Tổng Tiền', alignRight: false },
  { id: 'pn_ngaynhap', label: 'Ngày Nhập', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function BookList() {
  const { themeStretch } = useSettings();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [_datas, setDatas] = useState([]);
  const [load, setLoad] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const res = await getData(
          API_BASE_URL + `/phieunhap?search=${filterName}`,
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
      const newSelecteds = _datas.map((n) => n.pn_id);
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

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - _datas.length) : 0;

  const isUserNotFound = _datas.length === 0;

  return (
    <Page title="PN | HYPE">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Nhập hàng"
          links={[
            { name: 'Quản lý', href: PATH_DASHBOARD.root },
            { name: 'Sách', href: PATH_DASHBOARD.phieunhap.root },
            { name: 'Nhập hàng' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.phieunhap.new}
              startIcon={<Icon icon={plusFill} />}
            >
              Phiếu nhập mới
            </Button>
          }
        />

        <Card>
          <PhieuNhapToolbar
            selected={selected}
            filterName={filterName}
            onFilterName={handleFilterByName}
            setLoad={setLoad}
            setSelected={setSelected}
          />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <PhieuNhapListHead
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
                      const {
                        pn_id,
                        pn_idnv,
                        fullname,
                        ncc_ten,
                        pn_tongtien,
                        pn_ngaylapphieu,
                      } = row;
                      const isItemSelected = selected.indexOf(pn_id) !== -1;
                      return (
                        <TableRow
                          hover
                          key={pn_id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell
                            align="center"
                            component="th"
                            scope="row"
                            padding="none"
                          >
                            <Typography variant="subtitle2" noWrap>
                              {pn_id}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">{pn_idnv}</TableCell>
                          <TableCell align="left">{fullname}</TableCell>
                          <TableCell align="left">{ncc_ten}</TableCell>
                          <TableCell align="left">
                            {fCurrency(pn_tongtien)}
                          </TableCell>
                          <TableCell align="left">
                            {formatDateTime(pn_ngaylapphieu)}
                          </TableCell>

                          <TableCell align="right">
                            <PhieuNhapMoreMenu id={pn_id} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
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
  );
}
