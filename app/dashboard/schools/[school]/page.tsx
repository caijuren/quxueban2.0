import SchoolDetail from './SchoolDetail';

export function generateStaticParams() {
  return [
    { school: 'shishi' },
    { school: 'shangwai' },
    { school: 'puwai' },
    { school: 'huayao-jiading' },
    { school: 'huaishao' },
    { school: 'taoliyuan' },
    { school: 'duikou' },
    { school: 'nanxiang-zhongxue' },
    { school: 'yiguanzhi' },
    { school: 'gongbanzhong' },
    { school: 'shangzhong' },
    { school: 'huaer' },
    { school: 'fufu' },
    { school: 'jiaofu-jiading' },
    { school: 'jiading-yizhong' },
    { school: 'shida-jiading' },
    { school: 'jiading-shiyan' },
    { school: 'jiading-erzhong' },
    { school: 'anting-gaozhong' },
  ];
}

export default function SchoolPage({ params }: { params: { school: string } }) {
  return <SchoolDetail school={params.school} />;
}
