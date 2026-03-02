import { useState, useEffect, useMemo } from 'react';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Tooltip } from '@mui/material';
import {
  getReconciliation,
  runMatch,
  type ReconciliationRow,
  type ReconciliationStatus,
  type PaymentType,
  type ReconciliationResponse,
} from '../services/paymentApi';

type TabKey = 'all' | ReconciliationStatus;

interface Filters {
  dateFrom: string;
  dateTo: string;
  payer: string;
  type: string;
  search: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

const formatDate = (dateStr: string | null): string | null => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
};

const formatDelta = (delta: number | null): string | null => {
  if (delta === null) return null;
  if (delta === 0) return 'exact';
  return `Δ$${delta.toFixed(2)}`;
};

// ── Sub-components ─────────────────────────────────────────────────────────────

const TypeChip = ({ type }: { type: PaymentType | null }) => {
  if (!type) return <span className="text-slate-400 text-xs">—</span>;
  const styles: Record<PaymentType, string> = {
    Check: 'bg-sky-100 text-sky-700',
    EFT: 'bg-green-100 text-green-700',
    CC: 'bg-purple-100 text-purple-700',
  };
  return (
    <span
      className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${styles[type]}`}
    >
      {type}
    </span>
  );
};

const StatusBadge = ({ status }: { status: ReconciliationStatus }) => {
  const config: Record<ReconciliationStatus, { bg: string; dot: string; label: string }> = {
    matched: { bg: 'bg-green-100 text-green-700', dot: 'bg-green-600', label: 'Matched' },
    pendingPayment: { bg: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500', label: 'Pending Payment' },
    missingEob: { bg: 'bg-red-100 text-red-700', dot: 'bg-red-600', label: 'Missing EOB' },
  };
  const { bg, dot, label } = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
};

// ── Row cell renderers ─────────────────────────────────────────────────────────

const renderDepositDate = (row: ReconciliationRow) =>
  row.status === 'pendingPayment' ? (
    <span className="text-slate-500">{formatDate(row.eobDate)}</span>
  ) : (
    <span>{formatDate(row.depositDate)}</span>
  );

const renderBankDesc = (row: ReconciliationRow) => {
  const desc = row.status !== 'pendingPayment' ? row.bankDescription : null;
  if (!desc) return <span>{row.payerName}</span>;
  return (
    <Tooltip title={desc} placement="bottom-start">
      <span className="cursor-default">{row.payerName}</span>
    </Tooltip>
  );
};

const renderDepositRef = (row: ReconciliationRow) =>
  row.status === 'pendingPayment' ? (
    <span className="text-slate-400 text-xs">— awaiting</span>
  ) : (
    <code className="font-mono text-[11px] text-slate-500">{row.depositRef}</code>
  );

const renderEobMatch = (row: ReconciliationRow) => {
  if (row.status === 'missingEob') {
    return <span className="text-slate-400 text-xs">— no EOB received</span>;
  }
  const delta = formatDelta(row.amountDelta);
  const secondary =
    row.status === 'pendingPayment'
      ? `EOB dated ${formatDate(row.eobDate)} · deposit not yet posted`
      : `EOB dated ${formatDate(row.eobDate)}${delta ? ` · ${delta}` : ''}`;
  return (
    <div>
      <code className="font-mono text-[11px] text-slate-500">{row.eobRef}</code>
      <div className="text-[11px] text-slate-400 mt-0.5">{secondary}</div>
    </div>
  );
};

const renderAction = (row: ReconciliationRow) => {
  if (row.status === 'matched') {
    return (
      <button className="px-2 py-0.5 rounded-[5px] text-[11px] font-medium border bg-slate-50 text-slate-500 border-slate-300 whitespace-nowrap cursor-pointer hover:bg-slate-100">
        View Details
      </button>
    );
  }
  if (row.status === 'missingEob') {
    return (
      <button className="px-2 py-0.5 rounded-[5px] text-[11px] font-medium border bg-blue-50 text-blue-600 border-blue-200 whitespace-nowrap cursor-pointer hover:bg-blue-100">
        Find EOB ↗
      </button>
    );
  }
  return (
    <button className="px-2 py-0.5 rounded-[5px] text-[11px] font-medium border bg-blue-50 text-blue-600 border-blue-200 whitespace-nowrap cursor-pointer hover:bg-blue-100">
      View EOB ↗
    </button>
  );
};

// ── Tabs config ────────────────────────────────────────────────────────────────

const TABS: { key: TabKey; label: string; activeBadge: string }[] = [
  { key: 'all', label: 'All', activeBadge: 'bg-blue-100 text-blue-600' },
  { key: 'missingEob', label: 'Missing EOB', activeBadge: 'bg-red-100 text-red-700' },
  { key: 'pendingPayment', label: 'Pending Payment', activeBadge: 'bg-yellow-100 text-yellow-700' },
  { key: 'matched', label: 'Matched', activeBadge: 'bg-blue-100 text-blue-600' },
];

// ── Columns definition ─────────────────────────────────────────────────────────
// Fields prefixed with _ are sort-helper values added to dgRows below.

const columns: GridColDef[] = [
  {
    field: '_dateSort',
    headerName: 'Deposit Date',
    width: 130,
    renderCell: ({ row }) => renderDepositDate(row as ReconciliationRow),
  },
  {
    field: 'payerName',
    headerName: 'Payer',
    flex: 1,
    minWidth: 150,
    renderCell: ({ row }) => renderBankDesc(row as ReconciliationRow),
  },
  {
    field: '_depositRefSort',
    headerName: 'Deposit Ref',
    width: 155,
    renderCell: ({ row }) => renderDepositRef(row as ReconciliationRow),
  },
  {
    field: '_typeSort',
    headerName: 'Type',
    width: 90,
    renderCell: ({ row }) => <TypeChip type={(row as ReconciliationRow).type} />,
  },
  {
    field: 'amount',
    headerName: 'Amount',
    width: 115,
    type: 'number',
    align: 'left',
    headerAlign: 'left',
    renderCell: ({ row }) => (
      <span className="font-medium tabular-nums">{formatCurrency((row as ReconciliationRow).amount)}</span>
    ),
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 155,
    renderCell: ({ row }) => <StatusBadge status={(row as ReconciliationRow).status} />,
  },
  {
    field: '_eobRefSort',
    headerName: 'EOB Match',
    flex: 1.5,
    minWidth: 200,
    renderCell: ({ row }) => renderEobMatch(row as ReconciliationRow),
  },
  {
    field: 'actions',
    headerName: 'Action',
    width: 120,
    sortable: false,
    renderCell: ({ row }) => renderAction(row as ReconciliationRow),
  },
];

// ── Main component ─────────────────────────────────────────────────────────────

const ReconciliationDashboard = () => {
  const [data, setData] = useState<ReconciliationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [filters, setFilters] = useState<Filters>({
    dateFrom: '',
    dateTo: '',
    payer: '',
    type: '',
    search: '',
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getReconciliation();
      setData(result);
    } catch {
      setError('Failed to load reconciliation data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await runMatch();
      await fetchData();
    } finally {
      setSyncing(false);
    }
  };

  const setFilter = (key: keyof Filters, value: string) =>
    setFilters(prev => ({ ...prev, [key]: value }));

  const payers = useMemo(() => {
    if (!data) return [];
    return [...new Set(data.rows.map(r => r.payerName))].sort();
  }, [data]);

  const tabCounts = useMemo(() => {
    if (!data) return { all: 0, matched: 0, missingEob: 0, pendingPayment: 0 };
    return {
      all: data.rows.length,
      matched: data.rows.filter(r => r.status === 'matched').length,
      missingEob: data.rows.filter(r => r.status === 'missingEob').length,
      pendingPayment: data.rows.filter(r => r.status === 'pendingPayment').length,
    };
  }, [data]);

  const filteredRows = useMemo(() => {
    if (!data) return [];
    return data.rows.filter(row => {
      if (activeTab !== 'all' && row.status !== activeTab) return false;

      const relevantDate = row.status === 'pendingPayment' ? row.eobDate : row.depositDate;
      if (filters.dateFrom && relevantDate && relevantDate < filters.dateFrom) return false;
      if (filters.dateTo && relevantDate && relevantDate > filters.dateTo) return false;

      if (filters.payer && row.payerName !== filters.payer) return false;
      if (filters.type && row.type !== filters.type) return false;

      if (filters.search) {
        const q = filters.search.toLowerCase();
        const hit = [row.depositRef, row.eobRef, row.payerName].some(v =>
          v?.toLowerCase().includes(q),
        );
        if (!hit) return false;
      }

      return true;
    });
  }, [data, activeTab, filters]);

  // Extend each row with sort-helper fields and a stable id for DataGrid
  const dgRows = useMemo(
    () =>
      filteredRows.map((row, i) => ({
        ...row,
        id: `${row.depositId ?? row.eobId}-${i}`,
        _dateSort: row.status === 'pendingPayment' ? (row.eobDate ?? '') : (row.depositDate ?? ''),
        _depositRefSort: row.status === 'pendingPayment' ? '' : (row.depositRef ?? ''),
        _eobRefSort: row.eobRef ?? '',
        _typeSort: row.type ?? '',
      })),
    [filteredRows],
  );

  const stats = data?.stats;

  return (
    <div className="p-6 bg-[#f4f5f7] min-h-screen text-[13px] text-slate-800">
      {/* Page header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-900">Payment Reconciliation</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">
            Match bank deposits against Tebra EOB records — deposits are the source of truth
          </p>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing || loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-[13px] font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <span className={syncing ? 'animate-spin inline-block' : ''}> ⟳</span>
          {syncing ? 'Syncing…' : 'Sync'}
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        <div className="bg-white border border-slate-200 rounded-lg px-4 py-3.5">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide mb-1.5">
            Total Deposits
          </div>
          <div className="text-[22px] font-bold text-slate-900 leading-none">
            {stats ? formatCurrency(stats.totalDeposits.amount) : '—'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {stats ? `${stats.totalDeposits.count} deposits` : ''}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg px-4 py-3.5">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide mb-1.5">
            Matched
          </div>
          <div className="text-[22px] font-bold text-green-600 leading-none">
            {stats ? formatCurrency(stats.matched.amount) : '—'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {stats ? `${stats.matched.count} records · deposit + EOB confirmed` : ''}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg px-4 py-3.5">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide mb-1.5">
            Pending Payment
          </div>
          <div className="text-[22px] font-bold text-yellow-600 leading-none">
            {stats ? formatCurrency(stats.pendingPayment.amount) : '—'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {stats ? `${stats.pendingPayment.count} EOBs · deposit not yet posted` : ''}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg px-4 py-3.5">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide mb-1.5">
            Missing EOB
          </div>
          <div className="text-[22px] font-bold text-red-600 leading-none">
            {stats ? formatCurrency(stats.missingEob.amount) : '—'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {stats ? `${stats.missingEob.count} deposits · EOB not yet received` : ''}
          </div>
        </div>
      </div>

      {/* Main card */}
      <div className="bg-white border border-slate-200 rounded-lg">
        {/* Tabs */}
        <div className="flex gap-1 px-4 pt-3 border-b border-slate-200">
          {TABS.map(tab => {
            const count = tabCounts[tab.key === 'all' ? 'all' : tab.key];
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={[
                  'px-5 py-2.5 text-[13px] font-medium rounded-t-md border border-b-0 relative top-px cursor-pointer',
                  isActive
                    ? 'bg-white text-blue-600 border-slate-200 [border-bottom-color:white]'
                    : 'bg-transparent text-slate-500 border-transparent hover:text-slate-700',
                ].join(' ')}
              >
                {tab.label}
                <span
                  className={[
                    'inline-flex items-center justify-center ml-2.5 min-w-[20px] px-1.5 py-px rounded-[10px] text-[10px] font-semibold',
                    isActive ? tab.activeBadge : 'bg-slate-100 text-slate-500',
                  ].join(' ')}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 flex-wrap">
          <span className="text-[12px] font-medium text-slate-400">Filter:</span>
          <div className="flex items-center gap-1.5">
            <input
              type="date"
              value={filters.dateFrom}
              onChange={e => setFilter('dateFrom', e.target.value)}
              className="h-9 border border-slate-300 rounded-md px-3 text-[13px] text-slate-600 focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            />
            <span className="text-[12px] text-slate-400">to</span>
            <input
              type="date"
              value={filters.dateTo}
              onChange={e => setFilter('dateTo', e.target.value)}
              className="h-9 border border-slate-300 rounded-md px-3 text-[13px] text-slate-600 focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <select
            value={filters.payer}
            onChange={e => setFilter('payer', e.target.value)}
            className="h-9 border border-slate-300 rounded-md px-3 text-[13px] text-slate-600 focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">All Payers</option>
            {payers.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <select
            value={filters.type}
            onChange={e => setFilter('type', e.target.value)}
            className="h-9 border border-slate-300 rounded-md px-3 text-[13px] text-slate-600 focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">All Types</option>
            <option value="Check">Check</option>
            <option value="EFT">EFT</option>
            <option value="CC">Credit Card</option>
          </select>
          <div className="relative ml-auto">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[13px] pointer-events-none">
              ⌕
            </span>
            <input
              type="text"
              placeholder="Search reference, payer…"
              value={filters.search}
              onChange={e => setFilter('search', e.target.value)}
              className="h-9 w-52 pl-8 pr-3 border border-slate-300 rounded-md text-[13px] text-slate-600 placeholder:text-slate-400 focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-sm">Loading…</div>
        ) : error ? (
          <div className="py-16 text-center text-red-400 text-sm">{error}</div>
        ) : (
          <DataGrid
            rows={dgRows}
            columns={columns}
            getRowHeight={() => 'auto'}
            pageSizeOptions={[25, 50, 100]}
            initialState={{ pagination: { paginationModel: { pageSize: 50 } } }}
            disableRowSelectionOnClick
            sx={{
              border: 'none',
              fontSize: 13,
              fontFamily: 'inherit',
              '& .MuiDataGrid-columnHeader': {
                backgroundColor: '#f8fafc',
                fontSize: 11,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 600,
              },
              '& .MuiDataGrid-cell': {
                borderColor: '#f1f5f9',
                alignItems: 'center',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: '#f8fafc',
              },
              '& .MuiDataGrid-footerContainer': {
                borderTopColor: '#f1f5f9',
                color: '#94a3b8',
                fontSize: 12,
              },
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ReconciliationDashboard;
