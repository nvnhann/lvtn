import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Button,
  Card,
  Checkbox,
  Container,
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
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { getData, putData } from '../../_helper/httpProvider';
import { API_BASE_URL } from '../../config/configUrl';
import { useSnackbar } from 'notistack5';
import { MIconButton } from '../../components/@material-extend';
import closeFill from '@iconify/icons-eva/close-fill';
import NCCListToolbar from '../../components/_dashboard/nhacungcap/list/NCCListToolbar';
import NCCListHead from '../../components/_dashboard/nhacungcap/list/NCCListHead';
import { useSelector } from 'react-redux';
import NCCMoreMenu from '../../components/_dashboard/nhacungcap/list/NCCMoreMenu';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'tên', label: 'Tên', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'sdt', label: 'Số điện thoại', alignRight: false },
  { id: 'dc', label: 'Địa chỉ', alignRight: false },
  { id: 'status', label: 'Trạng thái', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function CungCapList() {
  const { themeStretch } = useSettings();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [datas, setDatas] = useState([]);
  const [load, setLoad] = useState(0);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const isAdmin = useSelector((state) => state.user.current?.role) === 'ADMIN';

  useEffect(() => {
    (async () => {
      try {
        const res = await getData(
          API_BASE_URL + `/nhacungcap?search=${filterName}`,
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
      const newSelecteds = datas.map((n) => n.ncc_id);
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
    try {
      const res = await putData(API_BASE_URL + '/api/nhacungcap-active', {
        id: id,
        active: active,
      });
      setLoad((e) => e + 1);
      enqueueSnackbar(res.data, {
        variant: 'success',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        ),
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Page title="NCC|HYPE">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Nhà cung cấp"
          links={[
            { name: 'Quản lý', href: PATH_DASHBOARD.root },
            { name: 'Nhà cung cấp', href: PATH_DASHBOARD.nhaxuatban.root },
          ]}
          action={
            isAdmin && (
              <Button
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.nhacungcap.new}
                startIcon={<Icon icon={plusFill} />}
              >
                Thêm nhà cung cấp
              </Button>
            )
          }
        />

        <Card>
          <NCCListToolbar
            selected={selected}
            filterName={filterName}
            onFilterName={handleFilterByName}
            setLoad={setLoad}
            setSelected={setSelected}
          />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <NCCListHead
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
                        ncc_id,
                        ncc_ten,
                        ncc_sdt,
                        ncc_email,
                        ncc_diachi,
                        active,
                      } = row;
                      const isItemSelected = selected.indexOf(ncc_id) !== -1;
                      return (
                        <TableRow
                          hover
                          key={ncc_id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            {isAdmin && (
                              <Checkbox
                                checked={isItemSelected}
                                onChange={(event) => handleClick(event, ncc_id)}
                              />
                            )}
                          </TableCell>
                          <TableCell component="th" padding="none">
                            {ncc_ten}
                          </TableCell>
                          <TableCell align="left">{ncc_email}</TableCell>
                          <TableCell align="left" sx={{ width: '10rem' }}>
                            {ncc_sdt}
                          </TableCell>
                          <TableCell align="left">{ncc_diachi}</TableCell>
                          <TableCell align="left">
                            {isAdmin && (
                              <Switch
                                checked={active === 1}
                                onChange={() => {
                                  changeActiveRole(ncc_id, !active);
                                }}
                              />
                            )}
                            {!isAdmin && (
                              <Typography color="lightgreen">
                                {active ? 'Hiện' : 'Ẩn'}
                              </Typography>
                            )}
                          </TableCell>

                          <TableCell align="right">
                            {isAdmin && <NCCMoreMenu id={ncc_id} />}
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
                {isRoleNotFound && (
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
