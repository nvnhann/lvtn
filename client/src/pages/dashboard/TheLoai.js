import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
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
import TheLoaiNewForm from '../../components/_dashboard/theloai/TheLoaiNewForm';
import TheLoaiToolbar from '../../components/_dashboard/theloai/list/TheLoaiListToolbar';
import TheLoaiListHead from '../../components/_dashboard/theloai/list/TheLoaiListHead';
import { useSelector } from 'react-redux';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'tên', label: 'Tên danh mục', alignRight: false },
  { id: 'tên', label: 'Tên thể loại', alignRight: false },
  { id: 'status', label: 'Trạng thái', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function TheLoaiList() {
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
  const [edit, setEdit] = useState({ isEdit: false, current: {} });
  const isAdmin = useSelector((state) => state.user.current?.role) === 'ADMIN';

  useEffect(() => {
    (async () => {
      try {
        const res = await getData(
          API_BASE_URL + `/theloai?search=${filterName}`,
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
      const newSelecteds = datas.map((n) => n.tl_id);
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

  const changeActiveRole = async (id, active, iddm) => {
    try {
      const res = await putData(API_BASE_URL + '/api/theloai-active', {
        id: id,
        active: active,
        tl_iddm: iddm,
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
    <Page title="The Loai|HYPE">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Thể loại"
          links={[
            { name: 'Quản lý', href: PATH_DASHBOARD.root },
            { name: 'Thể loại', href: PATH_DASHBOARD.theloai.root },
          ]}
        />

        <Grid container spacing={2}>
          {isAdmin && (
            <Grid item xs={12} md={3}>
              <TheLoaiNewForm
                isEdit={edit.isEdit}
                current={edit.current}
                setEdit={setEdit}
                setLoad={setLoad}
              />
            </Grid>
          )}
          <Grid item xs={12} md={isAdmin ? 8 : 12}>
            <Card>
              <TheLoaiToolbar
                selected={selected}
                filterName={filterName}
                onFilterName={handleFilterByName}
                setLoad={setLoad}
                setSelected={setSelected}
              />
              <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <TheLoaiListHead
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
                          const { tl_id, tl_ten, dm_ten, active, tl_iddm } =
                            row;
                          const isItemSelected = selected.indexOf(tl_id) !== -1;
                          return (
                            <TableRow
                              hover
                              key={tl_id}
                              tabIndex={-1}
                              role="checkbox"
                              selected={isItemSelected}
                              aria-checked={isItemSelected}
                            >
                              <TableCell padding="checkbox">
                                {isAdmin && (
                                  <Checkbox
                                    checked={isItemSelected}
                                    onChange={(event) =>
                                      handleClick(event, tl_id)
                                    }
                                  />
                                )}
                              </TableCell>
                              <TableCell
                                component="th"
                                scope="row"
                                padding="none"
                              >
                                <Typography variant="subtitle2" noWrap>
                                  {dm_ten}
                                </Typography>
                              </TableCell>
                              <TableCell
                                component="th"
                                scope="row"
                                padding="none"
                              >
                                <Typography variant="subtitle2" noWrap>
                                  {tl_ten}
                                </Typography>
                              </TableCell>
                              <TableCell align="left">
                                {isAdmin && (
                                  <Switch
                                    checked={active === 1}
                                    onChange={() => {
                                      changeActiveRole(tl_id, !active, tl_iddm);
                                    }}
                                  />
                                )}
                                {!isAdmin && (
                                  <Typography color="lightgreen">
                                    {active ? 'Hiện' : 'Ẩn'}
                                  </Typography>
                                )}
                              </TableCell>

                              <TableCell>
                                {isAdmin && (
                                  <IconButton>
                                    <Icon
                                      icon="akar-icons:edit"
                                      color="#B72136"
                                      onClick={() =>
                                        setEdit({
                                          isEdit: true,
                                          current: {
                                            id: tl_id,
                                            tl_ten: tl_ten,
                                            tl_iddm: tl_iddm,
                                          },
                                        })
                                      }
                                    />
                                  </IconButton>
                                )}
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
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
