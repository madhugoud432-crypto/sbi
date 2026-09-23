import React, { useEffect, useState } from 'react';
import { DashboardHeader, SiteFooter } from '../components/Header';
import api from '../utils/api';

const fmt = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ accountId: '', from: '', to: '', type: '' });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 15;

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit });
      if (filters.accountId) params.append('accountId', filters.accountId);
      if (filters.from) params.append('from', filters.from);
      if (filters.to) params.append('to', filters.to);
      if (filters.type) params.append('type', filters.type);
      const [txnRes, accRes] = await Promise.all([
        api.get(`/transactions?${params}`),
        api.get('/accounts')
      ]);
      setTransactions(txnRes.data.data || []);
      setTotal(txnRes.data.total || 0);
      setAccounts(accRes.data.data || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [page]);

  const typeColors = {
    credit: '#1e8449', interest: '#1e8449',
    debit: '#c0392b', transfer: '#2471a3', neft: '#8e44ad', imps: '#e67e22', charges: '#c0392b'
  };

  return (
    <div className="page-wrapper">
      <DashboardHeader />
      <div style={{ background: '#f0f5fb', minHeight: 'calc(100vh - 90px)', padding: '15px 0' }}>
        <div className="container">
          <h2 style={{ fontSize: 15, color: '#1a5276', marginBottom: 12, fontWeight: 'bold' }}>Account Statement</h2>

          {/* Filters */}
          <div className="card" style={{ marginBottom: 15 }}>
            <div className="card-body" style={{ padding: 12 }}>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 'bold', display: 'block', marginBottom: 3 }}>Account</label>
                  <select className="form-control" style={{ width: 160 }} value={filters.accountId}
                    onChange={e => setFilters(f => ({ ...f, accountId: e.target.value }))}>
                    <option value="">All Accounts</option>
                    {accounts.map(a => <option key={a.id} value={a.id}>{a.account_type.toUpperCase()} - {a.account_number.slice(-8)}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 'bold', display: 'block', marginBottom: 3 }}>From Date</label>
                  <input className="form-control" type="date" value={filters.from} style={{ width: 140 }}
                    onChange={e => setFilters(f => ({ ...f, from: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 'bold', display: 'block', marginBottom: 3 }}>To Date</label>
                  <input className="form-control" type="date" value={filters.to} style={{ width: 140 }}
                    onChange={e => setFilters(f => ({ ...f, to: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 'bold', display: 'block', marginBottom: 3 }}>Type</label>
                  <select className="form-control" style={{ width: 120 }} value={filters.type}
                    onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}>
                    <option value="">All Types</option>
                    {['credit', 'debit', 'transfer', 'neft', 'imps', 'interest'].map(t => (
                      <option key={t} value={t}>{t.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => { setPage(1); load(); }}>Search</button>
                <button className="btn btn-secondary btn-sm" onClick={() => { setFilters({ accountId: '', from: '', to: '', type: '' }); setPage(1); load(); }}>Reset</button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Transactions ({total} records)</span>
              <span style={{ fontSize: 11, opacity: 0.8 }}>Page {page} of {Math.ceil(total / limit) || 1}</span>
            </div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 30 }}><div className="spinner" /></div>
            ) : (
              <>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Reference No.</th>
                      <th>Type</th>
                      <th style={{ textAlign: 'right' }}>Amount (₹)</th>
                      <th style={{ textAlign: 'right' }}>Balance (₹)</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length === 0 ? (
                      <tr><td colSpan={7} style={{ textAlign: 'center', padding: 30, color: '#888' }}>No transactions found</td></tr>
                    ) : transactions.map(txn => (
                      <tr key={txn.id}>
                        <td style={{ whiteSpace: 'nowrap' }}>{fmtDate(txn.created_at)}</td>
                        <td>{txn.description || txn.narration}</td>
                        <td style={{ fontFamily: 'monospace', fontSize: 11 }}>{txn.reference_number}</td>
                        <td>
                          <span className="badge" style={{
                            background: (typeColors[txn.transaction_type] || '#555') + '22',
                            color: typeColors[txn.transaction_type] || '#555'
                          }}>{txn.transaction_type.toUpperCase()}</span>
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 'bold', color: typeColors[txn.transaction_type] || '#333' }}>
                          {['credit', 'interest'].includes(txn.transaction_type) ? '+' : '-'}{fmt(txn.amount)}
                        </td>
                        <td style={{ textAlign: 'right' }}>{txn.balance_after ? fmt(txn.balance_after) : '—'}</td>
                        <td><span className={`badge badge-${txn.status === 'completed' ? 'success' : 'warning'}`}>{txn.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {total > limit && (
                  <div style={{ padding: '10px 15px', display: 'flex', gap: 8, justifyContent: 'center' }}>
                    <button className="btn btn-secondary btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹ Prev</button>
                    <span style={{ padding: '4px 12px', fontSize: 12 }}>Page {page} of {Math.ceil(total / limit)}</span>
                    <button className="btn btn-secondary btn-sm" disabled={page >= Math.ceil(total / limit)} onClick={() => setPage(p => p + 1)}>Next ›</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
