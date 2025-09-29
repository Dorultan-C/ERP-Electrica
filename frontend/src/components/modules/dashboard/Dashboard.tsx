'use client'

import { useState, useEffect, ComponentType } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { allWidgets } from '@/data/dashboard';
import { RightDrawer } from '@/components/ui/RightDrawer';
import { IconButton } from '@/components/ui/datalist/cells/Actions';
import BaseWidget from './components/BaseWidget';
import { CustomResizeHandle } from './components/CustomResizeHandle';
import Tooltip from '@/components/ui/Tooltip';

const ResponsiveGridLayout = WidthProvider(Responsive);

const widgetComponents: { [key: string]: ComponentType } = {};

function Dashboard() {
  const [layout, setLayout] = useState<ReactGridLayout.Layout[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [activeWidgets, setActiveWidgets] = useState(['stats', 'quick-actions', 'chart']);
  const [loadedWidgets, setLoadedWidgets] = useState(false);

  useEffect(() => {
    async function loadWidgets() {
      widgetComponents.stats = (await import('./components/StatsWidget')).default;
      widgetComponents['quick-actions'] = (await import('./components/QuickActionsWidget')).default;
      widgetComponents.chart = (await import('./components/ChartWidget')).default;
      setLoadedWidgets(true);
    }
    loadWidgets();
  }, []);

  useEffect(() => {
    if (!loadedWidgets) return;
    const savedLayout = localStorage.getItem('dashboardLayout');
    if (savedLayout) {
      setLayout(JSON.parse(savedLayout));
    } else {
      const defaultLayout = allWidgets.map((widget, index) => ({
        i: widget.id,
        x: index % 2,
        y: Math.floor(index / 2),
        w: widget.w || 1,
        h: widget.h || 1,
      }));
      setLayout(defaultLayout);
    }
  }, [loadedWidgets]);

  const onLayoutChange = (newLayout: ReactGridLayout.Layout[]) => {
    if (isEditable) {
      setLayout(newLayout);
    }
  };

  const onHeightChange = (widgetId: string, pixelHeight: number) => {
    const rowHeight = 10;
    const marginY = 10; // Default vertical margin for react-grid-layout
    const h = Math.ceil((pixelHeight + marginY) / (rowHeight + marginY));

    setLayout((prevLayout) => {
      const newLayout = prevLayout.map((item) => {
        if (item.i === widgetId && item.h !== h) {
          return { ...item, h };
        }
        return item;
      });

      if (JSON.stringify(prevLayout) !== JSON.stringify(newLayout)) {
        return newLayout;
      }
      return prevLayout;
    });
  };

  const onToggleWidget = (widgetId: string) => {
    const newActiveWidgets = activeWidgets.includes(widgetId)
      ? activeWidgets.filter((id) => id !== widgetId)
      : [...activeWidgets, widgetId];
    setActiveWidgets(newActiveWidgets);
  };

  if (!loadedWidgets) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <div className="flex items-center space-x-2 flex-shrink-0">
          {isEditable ? (
            <button
              onClick={() => {
                setIsEditable(false);
                localStorage.setItem('dashboardLayout', JSON.stringify(layout));
              }}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Done
            </button>
          ) : (
            <Tooltip content="Edit widgets position">
              <IconButton
                onClick={() => setIsEditable(true)}
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 5.732z" /></svg>}
                size="md"
              />
            </Tooltip>
          )}
          <Tooltip content="Add Widgets">
            <IconButton
              onClick={() => setIsDrawerOpen(true)}
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>}
              size="md"
            />
          </Tooltip>
        </div>
      </div>
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 2, md: 2, sm: 1, xs: 1, xxs: 1 }}
        rowHeight={10}
        onLayoutChange={onLayoutChange}
        resizeHandle={isEditable ? <CustomResizeHandle /> : null}
        isResizable={isEditable}
        compactType="vertical"
        preventCollision={true}>
        {allWidgets
          .filter((widget) => activeWidgets.includes(widget.id))
          .map((widget) => {
            const WidgetComponent = widgetComponents[widget.id];
            const l = layout.find((l) => l.i === widget.id);
            return (
              <div key={widget.id} data-grid={l} className="flex">
                <BaseWidget onHeightChange={(h) => onHeightChange(widget.id, h)} className="flex-grow">
                  {WidgetComponent ? <WidgetComponent /> : <div>Widget not found</div>}
                </BaseWidget>
              </div>
            );
          })}
      </ResponsiveGridLayout>
      <RightDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Customize Widgets">
        <div className="p-6">
          <ul>
            {allWidgets.map((widget) => (
              <li key={widget.id} className="flex items-center justify-between py-2">
                <span className="text-gray-700 dark:text-gray-300">{widget.name}</span>
                <input
                  type="checkbox"
                  checked={activeWidgets.includes(widget.id)}
                  onChange={() => onToggleWidget(widget.id)}
                />
              </li>
            ))}
          </ul>
        </div>
      </RightDrawer>
    </div>
  );
}

export default Dashboard;