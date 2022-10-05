import { Container } from '@material-ui/core';
import { useParams } from 'react-router';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import useSettings from 'src/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/routes/paths';

export default function PhieuNhapDetail() {
  const { themeStretch } = useSettings();
  const { id } = useParams();

  return (
    <Page title="PN">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={'Phiếu nhập'}
          links={[
            { name: 'Quản lý', href: PATH_DASHBOARD.root },
            { name: 'Phiếu nhập', href: PATH_DASHBOARD.phieunhap.root },
            { name: id },
          ]}
        />
      </Container>
    </Page>
  );
}
