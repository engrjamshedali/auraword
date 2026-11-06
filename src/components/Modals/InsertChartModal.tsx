import React, { useState } from 'react';
import { X, BarChart2, TrendingUp, PieChart as PieIcon, Plus, Trash2 } from 'lucide-react';

interface InsertChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertChartHtml: (chartHtml: string) => void;
}

interface DataPoint {
  label: string;
  value: number;
}

export const InsertChartModal: React.FC<InsertChartModalProps> = ({
  isOpen,
  onClose,
  onInsertChartHtml,
}) => {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [chartTitle, setChartTitle] = useState('Quarterly Growth Metrics');
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([
    { label: 'Q1', value: 45 },
    { label: 'Q2', value: 68 },
    { label: 'Q3', value: 85 },
    { label: 'Q4', value: 110 },
  ]);

  if (!isOpen) return null;

  const handleAddPoint = () => {
    setDataPoints([...dataPoints, { label: `Item ${dataPoints.length + 1}`, value: 50 }]);
  };

  const handleUpdatePoint = (index: number, field: 'label' | 'value', val: any) => {
    const updated = [...dataPoints];
    updated[index] = { ...updated[index], [field]: val };
    setDataPoints(updated);
  };

  const handleDeletePoint = (index: number) => {
    setDataPoints(dataPoints.filter((_, idx) => idx !== index));
  };

  const generateSvgChart = () => {
    const width = 560;
    const height = 260;
    const padding = 45;
    const colors = ['#2b579a', '#2563eb', '#38bdf8', '#0ea5e9', '#6366f1', '#10b981'];

    let innerContent = '';

    if (chartType === 'bar') {
      const maxValue = Math.max(...dataPoints.map(d => d.value), 10);
      const chartWidth = width - padding * 2;
      const chartHeight = height - padding * 2;
      const barWidth = Math.min(50, chartWidth / (dataPoints.length * 1.5));
      const step = chartWidth / dataPoints.length;

      // Axes
      innerContent += `<line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#cbd5e1" stroke-width="2" />`;
      innerContent += `<line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="#cbd5e1" stroke-width="2" />`;

      dataPoints.forEach((point, idx) => {
        const barHeight = (point.value / maxValue) * chartHeight;
        const x = padding + idx * step + (step - barWidth) / 2;
        const y = height - padding - barHeight;
        const color = colors[idx % colors.length];

        innerContent += `
          <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="${color}" rx="3" />
          <text x="${x + barWidth / 2}" y="${y - 6}" font-size="11" font-family="sans-serif" font-weight="bold" fill="#334155" text-anchor="middle">${point.value}</text>
          <text x="${x + barWidth / 2}" y="${height - padding + 18}" font-size="11" font-family="sans-serif" fill="#64748b" text-anchor="middle">${point.label}</text>
        `;
      });
    } else if (chartType === 'line') {
      const maxValue = Math.max(...dataPoints.map(d => d.value), 10);
      const chartWidth = width - padding * 2;
      const chartHeight = height - padding * 2;
      const step = dataPoints.length > 1 ? chartWidth / (dataPoints.length - 1) : chartWidth;

      let pointsStr = '';
      dataPoints.forEach((point, idx) => {
        const x = padding + idx * step;
        const y = height - padding - (point.value / maxValue) * chartHeight;
        pointsStr += `${x},${y} `;
      });

      innerContent += `<line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#cbd5e1" stroke-width="2" />`;
      innerContent += `<line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="#cbd5e1" stroke-width="2" />`;
      innerContent += `<polyline fill="none" stroke="#2b579a" stroke-width="3" points="${pointsStr.trim()}" />`;

      dataPoints.forEach((point, idx) => {
        const x = padding + idx * step;
        const y = height - padding - (point.value / maxValue) * chartHeight;
        innerContent += `
          <circle cx="${x}" cy="${y}" r="5" fill="#2b579a" stroke="#ffffff" stroke-width="2" />
          <text x="${x}" y="${y - 10}" font-size="11" font-family="sans-serif" font-weight="bold" fill="#1e293b" text-anchor="middle">${point.value}</text>
          <text x="${x}" y="${height - padding + 18}" font-size="11" font-family="sans-serif" fill="#64748b" text-anchor="middle">${point.label}</text>
        `;
      });
    } else {
      // Pie chart
      const total = dataPoints.reduce((acc, p) => acc + (p.value > 0 ? p.value : 0), 0) || 1;
      let startAngle = 0;
      const cx = width / 2 - 60;
      const cy = height / 2;
      const r = 75;

      dataPoints.forEach((point, idx) => {
        const angle = (point.value / total) * 360;
        const endAngle = startAngle + angle;
        const x1 = cx + r * Math.cos((Math.PI * startAngle) / 180);
        const y1 = cy + r * Math.sin((Math.PI * startAngle) / 180);
        const x2 = cx + r * Math.cos((Math.PI * endAngle) / 180);
        const y2 = cy + r * Math.sin((Math.PI * endAngle) / 180);
        const largeArc = angle > 180 ? 1 : 0;
        const color = colors[idx % colors.length];

        innerContent += `
          <path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z" fill="${color}" stroke="#ffffff" stroke-width="2" />
        `;
        startAngle = endAngle;
      });

      // Legend
      dataPoints.forEach((point, idx) => {
        const color = colors[idx % colors.length];
        const ly = 60 + idx * 24;
        innerContent += `
          <rect x="${width - 160}" y="${ly}" width="12" height="12" fill="${color}" rx="2" />
          <text x="${width - 140}" y="${ly + 10}" font-size="11" font-family="sans-serif" fill="#334155">${point.label} (${point.value})</text>
        `;
      });
    }

    return `
      <div style="text-align: center; margin: 20px 0; padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #f8fafc;" contenteditable="false">
        <h4 style="margin: 0 0 10px 0; color: #1e293b; font-family: sans-serif; font-size: 14px; font-weight: bold;">${chartTitle}</h4>
        <svg viewBox="0 0 ${width} ${height}" style="max-width: 100%; height: auto; max-height: 260px; display: inline-block;">
          ${innerContent}
        </svg>
        <p style="margin: 8px 0 0 0; font-size: 11px; color: #64748b; font-family: sans-serif;"><em>Figure: ${chartTitle} (${chartType.toUpperCase()} representation)</em></p>
      </div>
      <p></p>
    `;
  };

  const handleInsert = () => {
    const html = generateSvgChart();
    onInsertChartHtml(html);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl border border-slate-300 overflow-hidden text-slate-800 text-sm">
        <div className="flex items-center justify-between px-5 py-3 bg-[#2b579a] text-white">
          <div className="flex items-center gap-2 font-semibold">
            <BarChart2 className="w-5 h-5" />
            <span>Insert Chart with Editable Data</span>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-1 hover:bg-white/20 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Chart Type Selector */}
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setChartType('bar')}
              className={`p-3 border rounded-lg flex items-center justify-center gap-2 font-medium text-xs transition-colors ${
                chartType === 'bar' ? 'bg-blue-50 border-[#2b579a] text-[#2b579a]' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>Column / Bar Chart</span>
            </button>
            <button
              type="button"
              onClick={() => setChartType('line')}
              className={`p-3 border rounded-lg flex items-center justify-center gap-2 font-medium text-xs transition-colors ${
                chartType === 'line' ? 'bg-blue-50 border-[#2b579a] text-[#2b579a]' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Line Trend Chart</span>
            </button>
            <button
              type="button"
              onClick={() => setChartType('pie')}
              className={`p-3 border rounded-lg flex items-center justify-center gap-2 font-medium text-xs transition-colors ${
                chartType === 'pie' ? 'bg-blue-50 border-[#2b579a] text-[#2b579a]' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <PieIcon className="w-4 h-4" />
              <span>Pie Distribution</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Chart Title:</label>
            <input
              type="text"
              value={chartTitle}
              onChange={(e) => setChartTitle(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#2b579a]"
            />
          </div>

          {/* Data Table */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-700">Data Series & Values:</span>
              <button
                type="button"
                onClick={handleAddPoint}
                className="flex items-center gap-1 text-xs text-[#2b579a] font-medium hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Data Row</span>
              </button>
            </div>
            <div className="border border-slate-200 rounded overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-600">
                  <tr>
                    <th className="p-2 text-left">Category / Label</th>
                    <th className="p-2 text-left">Numeric Value</th>
                    <th className="p-2 w-10 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dataPoints.map((point, idx) => (
                    <tr key={idx} className="border-b border-slate-100">
                      <td className="p-1.5">
                        <input
                          type="text"
                          value={point.label}
                          onChange={(e) => handleUpdatePoint(idx, 'label', e.target.value)}
                          className="w-full px-2 py-1 border border-slate-200 rounded"
                        />
                      </td>
                      <td className="p-1.5">
                        <input
                          type="number"
                          value={point.value}
                          onChange={(e) => handleUpdatePoint(idx, 'value', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 border border-slate-200 rounded"
                        />
                      </td>
                      <td className="p-1.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeletePoint(idx)}
                          className="p-1 text-slate-400 hover:text-red-500 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-5 py-3 bg-slate-50 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 border border-slate-300 rounded text-xs text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleInsert}
            className="px-5 py-1.5 bg-[#2b579a] text-white rounded text-xs font-semibold hover:bg-[#1e3f70] shadow-xs"
          >
            Insert Chart
          </button>
        </div>
      </div>
    </div>
  );
};
