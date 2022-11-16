import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { Card, CardHeader, TextField } from '@material-ui/core';
import { BaseOptionChart } from '../../charts';
import { fCurrency } from '../../../_helper/formatCurrentCy';
//

// ----------------------------------------------------------------------

export default function DoThi({ theo_nam, num_year, year, setYear }) {
  const chartOptions = merge(BaseOptionChart(), {
    xaxis: {
      categories: [
        'Một',
        'Hai',
        'Ba',
        'Bốn',
        'Năm',
        'Sáu',
        'Bảy',
        'Tám',
        'Chín',
        'Mười',
        'Mười một',
        'Mười hai',
      ],
    },
    tooltip: {
      y: {
        formatter: (val) => fCurrency(val),
      },
    },
  });

  return (
    <Card>
      <CardHeader
        title="Thống kê theo năm"
        action={
          <TextField
            select
            fullWidth
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
            }}
            SelectProps={{ native: true }}
            sx={{
              '& fieldset': { border: '0 !important' },
              '& select': {
                pl: 1,
                py: 0.5,
                pr: '24px !important',
                typography: 'subtitle2',
              },
              '& .MuiOutlinedInput-root': {
                borderRadius: 0.75,
                bgcolor: 'background.neutral',
              },
              '& .MuiNativeSelect-icon': {
                top: 4,
                right: 0,
                width: 20,
                height: 20,
              },
            }}
          >
            {num_year.map((option, idx) => (
              <option key={idx} value={option.nam}>
                {option.nam}
              </option>
            ))}
          </TextField>
        }
      />
      <ReactApexChart
        type="line"
        series={theo_nam}
        options={chartOptions}
        height={364}
      />
    </Card>
  );
}
