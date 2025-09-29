
'use client'

import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function TestPage() {
  const layout = [
    { i: 'a', x: 0, y: 0, w: 1, h: 1 },
    { i: 'b', x: 1, y: 0, w: 1, h: 1 },
    { i: 'c', x: 0, y: 1, w: 2, h: 2 },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 2, md: 2, sm: 1, xs: 1, xxs: 1 }}
        rowHeight={300}
        compactType="vertical"
        preventCollision={true}
      >
        <div key="a" className="bg-blue-200">Widget A</div>
        <div key="b" className="bg-green-200">Widget B</div>
        <div key="c" className="bg-red-200">Widget C</div>
      </ResponsiveGridLayout>
    </div>
  );
}
