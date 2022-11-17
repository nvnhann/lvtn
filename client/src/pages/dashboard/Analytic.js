import Page from '../../components/Page';
import {Box, Card, Container, Grid, Stack, TextField, Typography} from '@material-ui/core';
import { useEffect, useState } from 'react';
import { getData } from '../../_helper/httpProvider';
import { API_BASE_URL } from '../../config/configUrl';
import AnalyticUser from '../../components/_dashboard/analystic/AnalyticUser';
import AnalyticNhap from '../../components/_dashboard/analystic/AnalyticNhap';
import AnalyticHoaDon from '../../components/_dashboard/analystic/AnalyticHoaDon';
import DoThi from '../../components/_dashboard/analystic/DoThi';
import {DateRangePicker} from "@material-ui/lab";

export default function Analytic() {
  const [thongke, setThongke] = useState([]);
  const [year, setYear] = useState('');
  const currentDate = new Date();
  const [dateSelect,setDateSlect] = useState(["2021-01-01", currentDate.getFullYear()+'-'+(currentDate.getUTCMonth() +1 )+'-'+currentDate.getDate()]);

  useEffect(() => {
    (async () => {
      const _res = await getData(API_BASE_URL + `/thongke?year=${year}&&startdate=${dateSelect[0]}&&enddate=${dateSelect[1]}`);
      setThongke(_res.data);
      console.log(_res.data);
    })();
  }, [year, dateSelect]);

  return (
    <>
      <Page title="Thống kê">
        <Container>
          <Box sx={{ pb: 5 }}>
            <Typography variant="h4" sx={{my:2}}>Thống kê</Typography>
            <DateRangePicker
                startText="Ngày bắt đầu"
                endText="Ngày kết thúc"
                onChange={(newValue) => setDateSlect( newValue)}
                value={dateSelect}
                renderInput={(startProps, endProps) => (
                    <>
                      <TextField {...startProps} />
                      <Box sx={{mx: 2}}>đến</Box>
                      <TextField {...endProps} />
                    </>
                )}
            />
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <AnalyticNhap
                total={thongke?.thongke?.soluong_nhapvao}
                text={'Số lượng sách đã nhập'}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <AnalyticNhap
                total={thongke?.thongke?.soluong_banra}
                text={'Số lượng sách đã bán'}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <AnalyticNhap
                  total={thongke?.thongke?.ton_kho}
                  text={'Tồn kho'}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <AnalyticNhap
                total={thongke?.thongke?.tongtien_nhapvao}
                text={'Tổng tiền đã nhập'}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <AnalyticNhap
                total={thongke?.thongke?.tongtien_banra}
                text={'Tổng tiền đã bán'}
              />
            </Grid>



            <Grid item xs={12} sm={6} md={4}>
              <AnalyticNhap
                total={thongke?.thongke?.donhang_thanhcong}
                text={'Đơn hàng thành công'}
              />
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ p: 2 }}>
                <Stack direction="col" >
                  <Box width="50%">
                    <Typography variant="h5" align='center'>Thể loại bán chạy</Typography>
                    {thongke?.the_loai?.map((e, idx) => {
                      if (idx < 10) return <Typography>{idx+1}. {e.tl_ten}</Typography>;
                    })}
                  </Box>

                  <Box width="50%">
                    <Typography variant="h5" align='center'>Tác giả bán chạy</Typography>
                    {thongke?.tac_gia?.map((e, idx) => {
                      if (idx < 10) return <Typography>{e.tg_ten}</Typography>;
                    })}
                  </Box>
                </Stack>
              </Card>
            </Grid>

            <Grid item xs={12} md={12}>
              {thongke?.theo_nam && (
                <DoThi
                  theo_nam={thongke.theo_nam}
                  num_year={thongke.num_year}
                  year={year}
                  setYear={setYear}
                />
              )}
            </Grid>
          </Grid>
        </Container>
      </Page>
    </>
  );
}
