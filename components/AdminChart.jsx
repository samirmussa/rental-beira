// components/AdminChart.jsx
'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Importa dinamicamente sem SSR
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function AdminChart({ imoveisPopulares }) {
  const series = imoveisPopulares.map(i => i.curtidas);
  const options = {
    chart: { type: 'bar', height: 350 },
    plotOptions: { bar: { horizontal: false, columnWidth: '55%' } },
    dataLabels: { enabled: false },
    xaxis: {
      categories: imoveisPopulares.map(i => i.titulo.length > 20 ? i.titulo.substring(0, 20) + '...' : i.titulo),
    },
    colors: ['#10b981'],
    title: { text: 'Imóveis Mais Curtidos', align: 'center' },
    tooltip: {
      y: { formatter: val => `${val} curtidas` }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Imóveis Mais Curtidos</CardTitle>
        <CardDescription>Top imóveis com mais curtidas</CardDescription>
      </CardHeader>
      <CardContent>
        <Chart
          options={options}
          series={[{ name: 'Curtidas', data: series }]}
          type="bar"
          height={350}
        />
      </CardContent>
    </Card>
  );
}