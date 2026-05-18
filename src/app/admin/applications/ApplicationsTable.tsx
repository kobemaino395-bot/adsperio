'use client';

import { useMemo, useState } from 'react';

type Props = {
  headers: string[];
  rows: string[][];
};

const ISO_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;
const DATE_COL_RE = /(submittedAt|at$|At$|date|Date)/;

function looksLikeUrl(v: string): boolean {
  return /^https?:\/\/\S+$/i.test(v);
}

function formatCell(value: string, isDateCol: boolean): string {
  if (!value) return '';
  if (isDateCol && ISO_RE.test(value)) {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d.toLocaleString();
  }
  return value;
}

function dayKey(iso: string): { key: string; label: string } | null {
  if (!iso || !ISO_RE.test(iso)) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const ymd = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const today = new Date();
  const tYmd = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const yYmd = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

  let label: string;
  if (ymd === tYmd) label = 'Today';
  else if (ymd === yYmd) label = 'Yesterday';
  else label = d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  return { key: ymd, label };
}

export default function ApplicationsTable({ headers, rows }: Props) {
  const countryIdx = headers.indexOf('country');
  const submittedIdx = headers.indexOf('submittedAt');

  const countries = useMemo(() => {
    if (countryIdx < 0) return [];
    const set = new Set<string>();
    for (const r of rows) {
      const c = r[countryIdx]?.trim();
      if (c) set.add(c);
    }
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [rows, countryIdx]);

  const [filter, setFilter] = useState<string>('');

  const indexed = useMemo(
    () => rows.map((row, originalIdx) => ({ row, originalIdx })),
    [rows],
  );

  const filtered = useMemo(() => {
    if (!filter || countryIdx < 0) return indexed;
    return indexed.filter((r) => r.row[countryIdx]?.trim() === filter);
  }, [indexed, filter, countryIdx]);

  // Visible (filtered) rows are displayed newest-first
  const visible = useMemo(() => [...filtered].reverse(), [filtered]);

  type Group = { label: string; key: string; items: typeof visible };
  const groups: Group[] = useMemo(() => {
    if (submittedIdx < 0) {
      return [{ label: 'All', key: 'all', items: visible }];
    }
    const acc: Group[] = [];
    let current: Group | null = null;
    for (const item of visible) {
      const submitted = item.row[submittedIdx] ?? '';
      const dk = dayKey(submitted);
      const key = dk?.key ?? 'unknown';
      const label = dk?.label ?? 'Unknown date';
      if (!current || current.key !== key) {
        current = { key, label, items: [] };
        acc.push(current);
      }
      current.items.push(item);
    }
    return acc;
  }, [visible, submittedIdx]);

  const groupsWithRanks = useMemo(() => {
    let cursor = 0;
    return groups.map((g) => {
      const start = cursor + 1;
      cursor += g.items.length;
      return { ...g, startRank: start };
    });
  }, [groups]);

  const totalVisible = visible.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {countries.length > 0 && (
          <label className="inline-flex items-center gap-2 text-sm">
            <span className="text-xs uppercase tracking-wider text-zinc-500">Country</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-sm"
            >
              <option value="">All countries</option>
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
        )}
        <span className="text-xs text-zinc-500">
          Showing {totalVisible} of {rows.length}
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-left text-xs uppercase tracking-wider text-zinc-500">
            <tr>
              <th className="px-3 py-2">#</th>
              {headers.map((col) => (
                <th key={col} className="whitespace-nowrap px-3 py-2">{col}</th>
              ))}
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {groupsWithRanks.map((g) => (
              <GroupBlock
                key={g.key}
                group={g}
                headers={headers}
                colCount={headers.length + 2}
                startRank={g.startRank}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type GroupProps = {
  group: { label: string; key: string; items: { row: string[]; originalIdx: number }[] };
  headers: string[];
  colCount: number;
  startRank: number;
};

function GroupBlock({ group, headers, colCount, startRank }: GroupProps) {
  return (
    <>
      <tr className="bg-zinc-50/70">
        <td colSpan={colCount} className="border-t border-zinc-200 px-3 py-2 text-xs font-medium uppercase tracking-wider text-zinc-600">
          {group.label} · {group.items.length} application{group.items.length === 1 ? '' : 's'}
        </td>
      </tr>
      {group.items.map((item, i) => {
        const rankNum = startRank + i;
        return (
          <tr key={item.originalIdx} className="border-t border-zinc-100 align-top">
            <td className="px-3 py-2 text-xs text-zinc-400">{rankNum}</td>
            {item.row.map((cell, ci) => {
              const isDateCol = DATE_COL_RE.test(headers[ci] ?? '');
              const display = formatCell(cell, isDateCol);
              return (
                <td key={ci} className="max-w-[18rem] truncate px-3 py-2 text-zinc-700" title={cell}>
                  {looksLikeUrl(cell) ? (
                    <a href={cell} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {display}
                    </a>
                  ) : (
                    display
                  )}
                </td>
              );
            })}
            <td className="whitespace-nowrap px-3 py-2 text-right">
              <a href={`/admin/applications/${item.originalIdx}`} className="text-xs text-zinc-500 hover:text-zinc-900">
                Open →
              </a>
            </td>
          </tr>
        );
      })}
    </>
  );
}
