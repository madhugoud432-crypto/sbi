'use client'
import { useState, useEffect, useMemo, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { accountsApi, transactionsApi, statementsApi } from '@/lib/api'
import { formatIndianCurrency, formatDate } from '@/lib/utils'
import {
  Download,
  FileText,
  Sparkles,
  RefreshCw,
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  X,
  Upload,
  FileSpreadsheet,
  AlertCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function StatementsPage() {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedAccount, setSelectedAccount] = useState('')
  const [period, setPeriod] = useState('3m')
  const [format, setFormat] = useState('pdf')
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'credit' | 'debit'>('all')

  // Generator Modal State
  const [showGenModal, setShowGenModal] = useState(false)
  const [genCount, setGenCount] = useState(35)
  const [genDays, setGenDays] = useState(90)
  const [genClear, setGenClear] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  // Upload Statement Modal State
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadClear, setUploadClear] = useState(false)
  const [uploadStartBal, setUploadStartBal] = useState('')

  const { data: accounts, isLoading: accountsLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountsApi.list().then((r) => r.data),
  })

  useEffect(() => {
    if (accounts && accounts.length && !selectedAccount) {
      setSelectedAccount(accounts[0].id)
    }
  }, [accounts, selectedAccount])

  const getDateRange = () => {
    const to = new Date()
    const from = new Date()
    if (period === '1m') from.setMonth(from.getMonth() - 1)
    else if (period === '3m') from.setMonth(from.getMonth() - 3)
    else if (period === '6m') from.setMonth(from.getMonth() - 6)
    else if (period === '1y') from.setFullYear(from.getFullYear() - 1)
    return { from: from.toISOString(), to: to.toISOString() }
  }

  const { data: txnData, isLoading, refetch } = useQuery({
    queryKey: ['statement', selectedAccount, period],
    queryFn: () => {
      const { from, to } = getDateRange()
      return transactionsApi
        .list(selectedAccount, { from_date: from, to_date: to, page_size: 200 })
        .then((r) => r.data)
    },
    enabled: !!selectedAccount,
  })

  // Summary Metrics Query
  const { data: summaryData } = useQuery({
    queryKey: ['statement-summary', selectedAccount, period],
    queryFn: () => {
      const { from, to } = getDateRange()
      return statementsApi
        .summary(selectedAccount, period, from, to)
        .then((r) => r.data)
        .catch(() => null)
    },
    enabled: !!selectedAccount,
  })

  // Random Statement Generator Mutation
  const generateMutation = useMutation({
    mutationFn: (variables: { count: number; days: number; clear_existing: boolean }) =>
      statementsApi.generateRandom({
        account_id: selectedAccount,
        count: variables.count,
        days: variables.days,
        clear_existing: variables.clear_existing,
      }),
    onSuccess: (res) => {
      toast.success(res.data?.message || 'Random statement generated successfully!')
      setShowGenModal(false)
      queryClient.invalidateQueries({ queryKey: ['statement'] })
      queryClient.invalidateQueries({ queryKey: ['statement-summary'] })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || 'Failed to generate random statements.')
    },
  })

  // Upload Statement Mutation
  const uploadMutation = useMutation({
    mutationFn: (formData: FormData) => statementsApi.upload(formData),
    onSuccess: (res) => {
      const data = res.data
      toast.success(
        `Imported ${data.transactions_imported} transactions! Tallied Closing Balance: ${formatIndianCurrency(
          data.closing_balance
        )}`
      )
      setShowUploadModal(false)
      setUploadFile(null)
      setUploadStartBal('')
      queryClient.invalidateQueries({ queryKey: ['statement'] })
      queryClient.invalidateQueries({ queryKey: ['statement-summary'] })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || 'Failed to upload statement file.')
    },
  })

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadFile) {
      toast.error('Please select a CSV or Excel statement file.')
      return
    }
    if (!selectedAccount) {
      toast.error('Please select a target account.')
      return
    }

    const formData = new FormData()
    formData.append('file', uploadFile)
    formData.append('account_id', selectedAccount)
    formData.append('clear_existing', String(uploadClear))
    if (uploadStartBal) {
      formData.append('start_balance', uploadStartBal)
    }

    uploadMutation.mutate(formData)
  }

  const selectedAcc = accounts?.find((a: any) => a.id === selectedAccount)

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    if (!txnData?.items) return []
    return txnData.items.filter((txn: any) => {
      if (typeFilter !== 'all' && txn.type !== typeFilter) return false
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const descMatch = (txn.description || '').toLowerCase().includes(query)
        const refMatch = (txn.transaction_ref || '').toLowerCase().includes(query)
        const partyMatch = (txn.counterparty_name || '').toLowerCase().includes(query)
        const catMatch = (txn.category || '').toLowerCase().includes(query)
        if (!descMatch && !refMatch && !partyMatch && !catMatch) return false
      }
      return true
    })
  }, [txnData, searchQuery, typeFilter])

  // Download Handler (PDF / CSV)
  const handleDownload = async () => {
    if (!selectedAccount) return
    setIsDownloading(true)
    const toastId = toast.loading(`Preparing SBI Statement (${format.toUpperCase()})...`)
    try {
      const { from, to } = getDateRange()
      const res = await statementsApi.download(selectedAccount, format, period, from, to)

      const mimeType = format === 'pdf' ? 'application/pdf' : 'text/csv'
      const fileExt = format === 'pdf' ? 'pdf' : 'csv'
      const blob = new Blob([res.data], { type: mimeType })
      const downloadUrl = window.URL.createObjectURL(blob)

      const accNumber = selectedAcc?.account_number || 'account'
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
      const fileName = `SBI_Statement_${accNumber}_${dateStr}.${fileExt}`

      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(downloadUrl)

      toast.success(`Statement downloaded: ${fileName}`, { id: toastId })
    } catch (err) {
      // Offline fallback: generate CSV client side if backend binary not reachable
      if (format === 'csv' && filteredTransactions.length > 0) {
        let csvContent = 'data:text/csv;charset=utf-8,'
        csvContent += 'Date,Ref,Description,Category,Counterparty,Debit,Credit,Balance\n'
        filteredTransactions.forEach((t: any) => {
          csvContent += `"${t.value_date}","${t.transaction_ref}","${t.description}","${
            t.category
          }","${t.counterparty_name || ''}","${t.type === 'debit' ? t.amount : ''}","${
            t.type === 'credit' ? t.amount : ''
          }","${t.balance_after}"\n`
        })
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement('a')
        link.setAttribute('href', encodedUri)
        link.setAttribute('download', `SBI_Statement_${selectedAcc?.account_number}.csv`)
        document.body.appendChild(link)
        link.click()
        link.remove()
        toast.success('Statement exported as CSV', { id: toastId })
      } else {
        toast.error('Failed to generate statement file. Please try again.', { id: toastId })
      }
    } finally {
      setIsDownloading(false)
    }
  }

  // Calculated totals
  const totalCredits =
    txnData?.items
      ?.filter((t: any) => t.type === 'credit')
      .reduce((s: number, t: any) => s + parseFloat(t.amount || 0), 0) || 0
  const totalDebits =
    txnData?.items
      ?.filter((t: any) => t.type === 'debit')
      .reduce((s: number, t: any) => s + parseFloat(t.amount || 0), 0) || 0
  const creditCount = txnData?.items?.filter((t: any) => t.type === 'credit').length || 0
  const debitCount = txnData?.items?.filter((t: any) => t.type === 'debit').length || 0

  const openingBalance =
    summaryData?.opening_balance !== undefined
      ? Number(summaryData.opening_balance)
      : selectedAcc
      ? Number(selectedAcc.balance) - (totalCredits - totalDebits)
      : 0

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Page Header with Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-gray-900">Account Statements</h1>
            <span className="bg-blue-100 text-sbi-blue text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Official Records
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            View, filter, import real statements (CSV/Excel), generate and export official statements.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Upload Statement Button */}
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm transition hover:border-blue-400"
            title="Upload CSV or Excel statement file"
          >
            <Upload size={14} className="text-sbi-blue" />
            <span>Upload Statement</span>
          </button>

          {/* Generate Random Statements Button */}
          <button
            onClick={() => setShowGenModal(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm transition-all duration-200 hover:shadow transform active:scale-95"
            title="Generate realistic random transactions for this account"
          >
            <Sparkles size={14} className="animate-pulse text-amber-300" />
            <span>Generate Random Statements</span>
          </button>

          <button
            onClick={() => refetch()}
            className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium px-3 py-2 rounded-lg transition"
            title="Refresh transactions"
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Control Panel: Account, Period, Format & Download */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
            <Layers size={13} className="text-sbi-blue" />
            Select Account
          </label>
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="w-full text-xs bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 font-medium text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            {accounts?.map((a: any) => (
              <option key={a.id} value={a.id}>
                {a.account_number} — {a.account_type.replace('_', ' ').toUpperCase()} (₹
                {parseFloat(a.balance).toLocaleString('en-IN')})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
            <Calendar size={13} className="text-sbi-blue" />
            Statement Period
          </label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full text-xs bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 font-medium text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="1m">Last 1 Month (30 Days)</option>
            <option value="3m">Last 3 Months (90 Days)</option>
            <option value="6m">Last 6 Months (180 Days)</option>
            <option value="1y">Last 1 Year (365 Days)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
            <FileText size={13} className="text-sbi-blue" />
            Export Format
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full text-xs bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 font-medium text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="pdf">Official PDF Statement</option>
            <option value="csv">CSV Spreadsheet (Excel)</option>
          </select>
        </div>

        <div>
          <button
            onClick={handleDownload}
            disabled={isDownloading || !selectedAccount}
            className="w-full flex items-center justify-center gap-2 bg-[#1A365D] hover:bg-[#152C4D] text-white text-xs font-semibold h-[38px] px-4 rounded-lg shadow-sm transition-all disabled:opacity-50"
          >
            <Download size={14} className={isDownloading ? 'animate-bounce' : ''} />
            <span>{isDownloading ? 'Generating...' : `Download ${format.toUpperCase()}`}</span>
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      {selectedAcc && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Opening Balance
            </p>
            <p className="text-sm font-bold text-gray-700 font-mono">
              {formatIndianCurrency(openingBalance)}
            </p>
            <span className="text-[10px] text-gray-400">Period Start</span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] font-semibold text-green-700 uppercase tracking-wider">
                Total Inflows
              </p>
              <span className="bg-green-100 text-green-800 text-[9px] font-bold px-1.5 py-0.2 rounded">
                +{creditCount}
              </span>
            </div>
            <p className="text-sm font-bold text-green-700 font-mono">
              {formatIndianCurrency(totalCredits)}
            </p>
            <span className="text-[10px] text-gray-400">Salary, UPI, Credits</span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] font-semibold text-red-700 uppercase tracking-wider">
                Total Outflows
              </p>
              <span className="bg-red-100 text-red-800 text-[9px] font-bold px-1.5 py-0.2 rounded">
                -{debitCount}
              </span>
            </div>
            <p className="text-sm font-bold text-red-700 font-mono">
              {formatIndianCurrency(totalDebits)}
            </p>
            <span className="text-[10px] text-gray-400">Bills, Transfers, UPI</span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Net Cash Flow
            </p>
            <p
              className={`text-sm font-bold font-mono ${
                totalCredits - totalDebits >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {totalCredits - totalDebits >= 0 ? '+' : ''}
              {formatIndianCurrency(totalCredits - totalDebits)}
            </p>
            <span className="text-[10px] text-gray-400">Period Net</span>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/60 p-3.5 rounded-xl border border-blue-200 shadow-sm col-span-2 md:col-span-1">
            <p className="text-[10px] font-semibold text-sbi-blue uppercase tracking-wider mb-1">
              Closing Balance
            </p>
            <p className="text-base font-bold text-sbi-blue font-mono">
              {formatIndianCurrency(selectedAcc.balance)}
            </p>
            <span className="text-[10px] text-blue-600/80">Current Book Balance</span>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search description, merchant, ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:bg-white transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span className="text-xs text-gray-500 font-medium mr-1 flex items-center gap-1">
            <Filter size={12} /> Filter:
          </span>
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
              typeFilter === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All ({txnData?.items?.length || 0})
          </button>
          <button
            onClick={() => setTypeFilter('credit')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-semibold transition ${
              typeFilter === 'credit'
                ? 'bg-green-600 text-white shadow-sm'
                : 'bg-green-50 text-green-700 hover:bg-green-100'
            }`}
          >
            <ArrowDownLeft size={12} /> Credits ({creditCount})
          </button>
          <button
            onClick={() => setTypeFilter('debit')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-semibold transition ${
              typeFilter === 'debit'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            <ArrowUpRight size={12} /> Debits ({debitCount})
          </button>
        </div>
      </div>

      {/* Statement Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-[#1A365D] text-white px-4 py-2.5 flex justify-between items-center">
          <span className="text-xs font-semibold flex items-center gap-2">
            <FileText size={14} /> Itemized Statement Ledger
          </span>
          <span className="text-xs opacity-80 font-mono">
            Showing {filteredTransactions.length} of {txnData?.total || 0} entries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Transaction Ref</th>
                <th className="py-2.5 px-3">Description & Merchant</th>
                <th className="py-2.5 px-3">Channel / Cat</th>
                <th className="py-2.5 px-3 text-right">Debit (₹)</th>
                <th className="py-2.5 px-3 text-right">Credit (₹)</th>
                <th className="py-2.5 px-3 text-right">Balance (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw size={20} className="animate-spin text-sbi-blue" />
                      <span>Loading statement records...</span>
                    </div>
                  </td>
                </tr>
              )}

              {!isLoading && filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500">
                    <div className="max-w-sm mx-auto flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-sbi-blue">
                        <Sparkles size={24} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">
                          No transactions found in this period
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          You can upload your real bank statement (CSV/Excel) or generate sample statements right now.
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowUploadModal(true)}
                          className="flex items-center gap-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm transition"
                        >
                          <Upload size={13} className="text-sbi-blue" />
                          Upload CSV/Excel
                        </button>
                        <button
                          onClick={() => setShowGenModal(true)}
                          className="flex items-center gap-1.5 bg-sbi-blue hover:bg-blue-800 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow transition"
                        >
                          <Sparkles size={13} className="text-amber-300" />
                          Generate Statements
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}

              {filteredTransactions.map((txn: any, idx: number) => {
                const isDebit = txn.type === 'debit'
                const isCredit = txn.type === 'credit'
                return (
                  <tr
                    key={txn.id || idx}
                    className="hover:bg-blue-50/40 transition-colors duration-150"
                  >
                    <td className="py-2.5 px-3 whitespace-nowrap text-gray-700 font-medium text-[11px]">
                      {formatDate(txn.value_date, 'short')}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[10px] text-gray-500 whitespace-nowrap">
                      {txn.transaction_ref}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-gray-900 text-[11px]">
                        {txn.description}
                      </div>
                      {txn.counterparty_name && (
                        <div className="text-[10px] text-gray-500">
                          {txn.counterparty_name}
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="inline-block bg-gray-100 text-gray-700 text-[9px] font-semibold px-2 py-0.5 rounded uppercase">
                        {txn.category || txn.channel || 'OTHER'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-red-600 text-[11px]">
                      {isDebit ? formatIndianCurrency(txn.amount) : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-green-600 text-[11px]">
                      {isCredit ? formatIndianCurrency(txn.amount) : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-medium text-gray-900 text-[11px]">
                      {formatIndianCurrency(txn.balance_after)}
                    </td>
                  </tr>
                )
              })}
            </tbody>

            {filteredTransactions.length > 0 && (
              <tfoot className="bg-gray-100 border-t-2 border-gray-300 font-bold">
                <tr>
                  <td colSpan={4} className="py-2.5 px-3 text-gray-700 text-xs">
                    Period Summary Totals ({filteredTransactions.length} entries)
                  </td>
                  <td className="py-2.5 px-3 text-right text-red-700 font-mono text-xs">
                    {formatIndianCurrency(totalDebits)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-green-700 font-mono text-xs">
                    {formatIndianCurrency(totalCredits)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-sbi-blue font-mono text-xs">
                    {selectedAcc ? formatIndianCurrency(selectedAcc.balance) : '—'}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* ── Modal: Upload Bank Statement (CSV / Excel) ────────────── */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full overflow-hidden animate-scale-up">
            <div className="bg-[#1A365D] text-white p-5 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                  <FileSpreadsheet size={18} className="text-blue-300" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Upload Bank Statement</h3>
                  <p className="text-[11px] text-blue-100">
                    Import real CSV or Excel (.xlsx / .xls) statements
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-white/80 hover:text-white rounded-lg p-1 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-5 space-y-4">
              {/* File Dropzone / Selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Select Statement File (CSV / Excel)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-xl p-4 text-center cursor-pointer bg-gray-50 hover:bg-blue-50/40 transition flex flex-col items-center justify-center gap-2"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv, .xlsx, .xls"
                    onChange={(e) => {
                      if (e.target.files?.[0]) setUploadFile(e.target.files[0])
                    }}
                    className="hidden"
                  />
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-sbi-blue flex items-center justify-center">
                    <Upload size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">
                      {uploadFile ? uploadFile.name : 'Click to browse or drag file here'}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      Supports SBI, HDFC, ICICI, Axis and standard CSV / Excel statements
                    </p>
                  </div>
                </div>
              </div>

              {/* Target Account */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Target Account
                </label>
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="w-full text-xs bg-gray-50 border border-gray-300 rounded-lg p-2.5 font-medium outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {accounts?.map((a: any) => (
                    <option key={a.id} value={a.id}>
                      {a.account_number} ({a.account_type.toUpperCase()}) — Balance: ₹
                      {parseFloat(a.balance).toLocaleString('en-IN')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Optional Starting Balance Override */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 flex justify-between">
                  <span>Starting Balance (Optional Override)</span>
                  <span className="text-[10px] text-gray-400">Leave blank to auto-detect</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 150000.00"
                  value={uploadStartBal}
                  onChange={(e) => setUploadStartBal(e.target.value)}
                  className="w-full text-xs bg-gray-50 border border-gray-300 rounded-lg p-2.5 font-mono outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Replace / Overwrite Checkbox */}
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={uploadClear}
                    onChange={(e) => setUploadClear(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Replace existing transactions with uploaded statement</span>
                </label>
              </div>

              {/* Tally Assurance Note */}
              <div className="text-[11px] text-gray-600 bg-blue-50/70 p-2.5 rounded-lg border border-blue-100 flex items-start gap-2">
                <CheckCircle2 size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                <p>
                  <strong>Automated Balance Tallying:</strong> All credits and debits will be
                  reconciled in chronological order, and the account balance will automatically tally
                  with the statement closing balance.
                </p>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold py-2.5 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadMutation.isPending || !uploadFile}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#1A365D] hover:bg-[#152C4D] text-white text-xs font-semibold py-2.5 rounded-lg shadow-md transition disabled:opacity-50"
                >
                  {uploadMutation.isPending ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      <span>Parsing & Tallying...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={13} />
                      <span>Import & Tally</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Generate Random Statements ─────────────────────── */}
      {showGenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full overflow-hidden animate-scale-up">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-5 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                  <Sparkles size={18} className="text-amber-300" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Generate Random Statements</h3>
                  <p className="text-[11px] text-blue-100">
                    Simulate realistic Indian banking transactions
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGenModal(false)}
                className="text-white/80 hover:text-white rounded-lg p-1 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Account Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Target Account
                </label>
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="w-full text-xs bg-gray-50 border border-gray-300 rounded-lg p-2.5 font-medium outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {accounts?.map((a: any) => (
                    <option key={a.id} value={a.id}>
                      {a.account_number} ({a.account_type.toUpperCase()}) — Balance: ₹
                      {parseFloat(a.balance).toLocaleString('en-IN')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Number of Transactions */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex justify-between">
                  <span>Number of Transactions</span>
                  <span className="text-sbi-blue font-bold font-mono">{genCount} statements</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[15, 30, 50, 100].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGenCount(num)}
                      className={`py-1.5 rounded-lg text-xs font-semibold border transition ${
                        genCount === num
                          ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Horizon (Days) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex justify-between">
                  <span>Time Span (Past Days)</span>
                  <span className="text-sbi-blue font-bold font-mono">Past {genDays} days</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: '30 Days', val: 30 },
                    { label: '90 Days', val: 90 },
                    { label: '180 Days', val: 180 },
                    { label: '1 Year', val: 365 },
                  ].map((d) => (
                    <button
                      key={d.val}
                      type="button"
                      onClick={() => setGenDays(d.val)}
                      className={`py-1.5 rounded-lg text-xs font-semibold border transition ${
                        genDays === d.val
                          ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Overwrite or Append */}
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={genClear}
                    onChange={(e) => setGenClear(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Clear existing transactions and replace with new dataset</span>
                </label>
              </div>

              {/* Features Included Note */}
              <div className="text-[11px] text-gray-500 bg-blue-50/60 p-2.5 rounded-lg border border-blue-100 space-y-1">
                <p className="font-semibold text-blue-900 flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-blue-600" />
                  What will be generated:
                </p>
                <p>
                  • Authentic UPI transactions (Swiggy, Zomato, Blinkit, Amazon Pay, Uber, CRED)
                </p>
                <p>• Monthly salary credits, NEFT/IMPS transfers, bill payments, and interest</p>
                <p>• 100% mathematically balanced ledger maintaining strict book balance</p>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGenModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold py-2.5 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={generateMutation.isPending}
                  onClick={() =>
                    generateMutation.mutate({
                      count: genCount,
                      days: genDays,
                      clear_existing: genClear,
                    })
                  }
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white text-xs font-semibold py-2.5 rounded-lg shadow-md transition disabled:opacity-50"
                >
                  {generateMutation.isPending ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={13} className="text-amber-300" />
                      <span>Generate Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
