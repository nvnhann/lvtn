import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@material-ui/core';
// redux
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { API_BASE_URL } from 'src/config/configUrl';
import { getData } from 'src/_helper/httpProvider';
import NXBNewForm from 'src/components/_dashboard/nhaxuatban/NXBNewForm';

// ----------------------------------------------------------------------

export default function RoleCreate() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { id } = useParams();
  const isEdit = pathname.includes('edit');
  const [current, setCurrent] = useState();

  useEffect(() => {
    (async () => {
      const res = await getData(API_BASE_URL + `/nhaxuatban/${id}`);
      setCurrent(res.data[0]);
    })();
  }, [id]);

  return (
    <Page title="NXB | Hype">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Tạo nhà xuất bản' : 'Chỉnh sửa'}
          links={[
            { name: 'Quản lý', href: PATH_DASHBOARD.root },
            { name: 'Nhà xuất bản', href: PATH_DASHBOARD.nhaxuatban.root },
            { name: !isEdit ? 'Thêm nhà xuất bản' : id },
          ]}
        />

        <NXBNewForm isEdit={isEdit} current={current} id={id} />
      </Container>
    </Page>
  );
}
