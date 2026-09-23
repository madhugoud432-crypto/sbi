'use client'

import React, { useState, Suspense } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { 
  HelpCircle, ChevronDown, ChevronUp, ChevronRight, Home as HomeIcon, Search, Bell,
  FileText, Download, Wallet, CreditCard, Building2, TrendingUp, ShieldCheck
} from 'lucide-react';
import { MOCK_USER, MOCK_ACCOUNTS } from '@/lib/mockData';
import '../dashboard/dashboard.css';
import SbiGlobalBrandHeader from '@/components/banking/SbiGlobalBrandHeader';
import SbiFixedFooter from '@/components/banking/SbiFixedFooter';

function ViewAllAccountsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { logout, user } = useAuthStore();
  
  // Right details active sub-tab state (Default: 'Account Summary')
  const [detailTab, setDetailTab] = useState<'Account Summary' | 'Transactions' | 'Statements' | 'Spend Analysis'>('Account Summary');
  const [showBalance, setShowBalance] = useState(true);

  // Accordion expanded states for View All mode
  const [expandedTx, setExpandedTx] = useState(false);

  const currentUser = user || MOCK_USER;
  const isViewAll = searchParams?.get('view') === 'all';

  return (
    <div className="dashboard-wrapper min-h-screen flex flex-col bg-[#f3f4f9]">
      
      {/* ================= GLOBAL BRAND HEADER ================= */}
      <SbiGlobalBrandHeader activeNav="Accounts" />

      {isViewAll ? (
        /* ================= VIEW ALL ACCOUNTS MODE ================= */
        <main className="flex-1 max-w-[1240px] w-full mx-auto px-4 py-6 mb-16">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4 font-normal select-none">
            <Link href="/dashboard" className="text-slate-500 hover:text-[#702082] flex items-center transition-colors">
              <HomeIcon size={14} className="stroke-[1.5px]" />
            </Link>
            <span className="text-slate-400 text-[10px] font-bold">&gt;</span>
            <span className="text-slate-600 font-medium">View All Accounts</span>
          </div>

          <h1 className="text-[26px] font-bold text-[#302985] mb-5 tracking-tight font-sans">
            View All Accounts
          </h1>

          {/* Main Content Card Container */}
          <div className="bg-[#f0f2f5] rounded-3xl border border-slate-200/50 p-8 space-y-4 shadow-sm min-h-[380px] flex flex-col justify-between">
            <div className="space-y-4">
              {/* ACCORDION 1: TRANSACTION ACCOUNTS */}
              <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-2sm border-r-[6px] border-r-[#e06287] transition-all">
                <div 
                  onClick={() => setExpandedTx(!expandedTx)}
                  className="p-5 flex justify-between items-center cursor-pointer hover:bg-purple-50/10 transition-colors"
                >
                  <div>
                    <div className="text-sm font-semibold text-slate-800 font-sans">
                      Transaction Accounts (01)
                    </div>
                    <div className="text-[15px] font-bold text-[#702082] mt-1 font-sans">
                      ₹0.09
                    </div>
                  </div>
                  <div className="text-slate-500 pr-1">
                    <ChevronDown size={18} className={`text-[#702082] transition-transform duration-200 ${expandedTx ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {expandedTx && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/40">
                    <div className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4 shadow-2xs">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs text-[#8e8e8e] font-normal">
                          <div className="space-y-4">
                            <div>
                              <div className="mb-0.5">Account Description</div>
                              <div className="text-black font-bold text-[13px] leading-snug">
                                REGULAR SB NCHQ-INDIVIDUALS
                              </div>
                            </div>
                            <div>
                              <div className="mb-0.5">Mode of Operation</div>
                              <div className="text-black font-bold text-[13px]">
                                Single
                              </div>
                            </div>
                            <div>
                              <div className="mb-0.5">Nominee(s)</div>
                              <button
                                type="button"
                                onClick={() => toast.success("Nominee: D SHYAMSUNDER (Father)")}
                                className="text-[#673391] hover:underline font-bold text-[13px] text-left block"
                              >
                                View Details
                              </button>
                            </div>
                          </div>

                          <div className="space-y-4 font-normal">
                            <div>
                              <div className="mb-0.5">Currency</div>
                              <div className="text-black font-bold text-[13px]">
                                Rupees
                              </div>
                            </div>
                            <div>
                              <div className="mb-0.5">Rate of Interest</div>
                              <div className="text-black font-bold text-[13px]">
                                2.50%
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="lg:col-span-5">
                          <div className="bg-[#f3f4f7] rounded-xl p-5 space-y-3.5 text-xs text-[#4b5563] font-medium">
                            <div className="flex justify-between items-center">
                              <span>Available Balance</span>
                              <span className="font-bold text-[13px] text-[#111827]">₹0.09</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Hold/Lien Amount</span>
                              <span className="font-bold text-[13px] text-[#111827]">₹0.00</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Uncleared Balance</span>
                              <span className="font-bold text-[13px] text-[#111827]">₹0.00</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>MOD Balance</span>
                              <span className="font-bold text-[13px] text-[#111827]">₹0.00</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                type="button" 
                onClick={() => toast.success("Downloading Account Summary PDF")}
                className="bg-[#702082] hover:bg-[#5c1a6b] text-white font-bold text-sm px-8 py-2.5 rounded-full shadow-sm transition-all cursor-pointer font-sans"
              >
                Download Summary
              </button>
            </div>
          </div>
        </main>
      ) : (
        /* ================= EXACT MATCH TO OFFICIAL ANGULAR SOURCE & SCREENSHOT 1 ================= */
        <main className="flex-1 max-w-[1360px] w-full mx-auto px-4 py-5 mb-16">
          
          {/* Breadcrumb Navigation Header */}
          <div className="flex items-center justify-between mb-4 select-none">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#673391]">
              <Link href="/dashboard" className="hover:opacity-80 flex items-center">
                <img src="/assets/images/landing-page/breadcrumb-home.svg" alt="Home" className="w-4 h-4 object-contain" />
              </Link>
              <img src="/assets/images/landing-page/Vector.svg" alt="Chevron" className="w-2.5 h-2.5 object-contain" />
              <span className="text-slate-700 font-bold text-[13px]">Relationship Overview</span>
            </div>

            <Link
              href="/accounts?view=all"
              className="flex items-center gap-1.5 border-[1.5px] border-[#673391] text-[#673391] bg-white hover:bg-purple-50 rounded-full px-4 py-1.5 text-xs font-bold transition-all shadow-2xs select-none"
            >
              <span>View All Accounts</span>
              <img src="/assets/images/one-view/one_view_arrow.svg" alt="Arrow" className="w-3 h-3 object-contain" />
            </Link>
          </div>

          {/* Sub-Navigation Category Tabs Bar */}
          <div className="flex justify-between items-end mb-0 border-b border-transparent">
            <div className="flex items-end gap-1">
              {(['Transaction Accounts', 'Deposits', 'Loans', 'Investments', 'Insurance'] as const).map((tabLabel) => {
                const isActive = tabLabel === 'Transaction Accounts';
                const tabHref = tabLabel === 'Transaction Accounts'
                  ? '/accounts'
                  : `/home/landingPage/manageRelationship/${tabLabel.toLowerCase().replace(' ', '-')}`;
                
                return (
                  <Link
                    key={tabLabel}
                    href={tabHref}
                    className={`font-sans text-[15px] px-6 pt-3 pb-2.5 relative transition-all ${
                      isActive 
                        ? 'text-[#673391] font-extrabold bg-white rounded-t-2xl shadow-2xs z-10' 
                        : 'text-slate-500 hover:text-slate-800 font-bold'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <span>{tabLabel}</span>
                      {isActive && (
                        <div className="w-6 h-[3.5px] bg-[#673391] rounded-full mt-1" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Main Content Workspace Container (Solid PURE WHITE Background wrapping both Left Sidebar & Right Details) */}
          <div className="bg-white rounded-b-3xl rounded-tr-3xl border border-slate-200/70 shadow-sm p-6 sm:p-8 -mt-[1px] relative z-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* ================= LEFT SIDEBAR (3 of 12) ================= */}
              <div className="lg:col-span-3 space-y-5">
                
                {/* Search Box */}
                <div className="bg-white border border-slate-200/90 rounded-xl px-3 py-2 flex items-center gap-2 shadow-2xs max-w-[245px] h-[40px]">
                  <img src="/assets/images/landing-page/search.svg" alt="Search" className="w-5 h-5 opacity-70" />
                  <input 
                    type="text" 
                    placeholder="Search here..." 
                    className="w-full text-xs font-semibold text-slate-800 bg-transparent focus:outline-none placeholder:text-slate-400"
                  />
                </div>

                {/* Savings Account Section */}
                <div className="space-y-3">
                  <h4 className="text-sm font-extrabold text-[#673391] tracking-wide">Savings Account</h4>
                  
                  {/* Active Account Pill Card matching Angular source */}
                  <div className="flex items-center gap-2 my-2">
                    <div className="bg-[#673391] rounded-xl px-4 py-2.5 text-white shadow-xs flex-1">
                      <div className="text-[11px] font-semibold text-white/90">A/C Number</div>
                      <div className="text-[14px] font-bold text-white tracking-wide mt-0.5">XXXXXXX7054</div>
                    </div>
                    <div className="bg-slate-100/80 hover:bg-slate-200 p-2 rounded-xl cursor-pointer transition-colors shrink-0">
                      <img 
                        src="/assets/images/landing-page/visibility_on_white.svg" 
                        alt="Eye" 
                        className="w-5 h-5"
                        onClick={() => setShowBalance(!showBalance)}
                      />
                    </div>
                  </div>

                  {/* Soft Light Purple Buttons */}
                  <div 
                    onClick={() => toast.success("Opening New Savings Account Application...")}
                    className="bg-[#f4edf9] hover:bg-[#ebdcf5] rounded-xl p-3.5 flex items-center justify-between cursor-pointer transition-all shadow-2xs group"
                  >
                    <span className="text-xs font-bold text-[#673391]">Apply for a new Savings Account</span>
                    <span className="text-[#673391] font-bold text-sm group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </div>

                  <div 
                    onClick={() => toast.success("Opening Joint Savings Account Application...")}
                    className="bg-[#f4edf9] hover:bg-[#ebdcf5] rounded-xl p-3.5 flex items-center justify-between cursor-pointer transition-all shadow-2xs group"
                  >
                    <span className="text-xs font-bold text-[#673391]">Apply for Joint Savings Account</span>
                    <span className="text-[#673391] font-bold text-sm group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </div>
                </div>

                {/* Current Account Section */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-sm font-extrabold text-[#673391] tracking-wide">Current Account</h4>
                  
                  <div 
                    onClick={() => toast.success("Opening Current Account Application...")}
                    className="bg-[#f4edf9] hover:bg-[#ebdcf5] rounded-xl p-3.5 flex items-center justify-between cursor-pointer transition-all shadow-2xs group"
                  >
                    <span className="text-xs font-bold text-[#673391]">Apply for a new Current Account</span>
                    <span className="text-[#673391] font-bold text-sm group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </div>
                </div>

              </div>

              {/* ================= RIGHT MAIN DETAILS PANEL (9 of 12) ================= */}
              <div className="lg:col-span-9 space-y-6">
                
                {/* Top Purple Banner Header Tag Card & Manage Account Link */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="bg-[#673391] text-white px-5 py-2.5 rounded-t-xl flex items-center gap-6 shadow-xs w-full sm:w-auto min-w-[320px]">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-white">SAVINGS A/C</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold tracking-wide">XXXXXXX7054</span>
                      <img src="/assets/images/landing-page/visibility_on_white.svg" alt="Eye" className="w-4 h-4 cursor-pointer" />
                    </div>
                  </div>

                  <div 
                    onClick={() => toast("Manage Account Options")}
                    className="flex items-center gap-1.5 text-[#673391] hover:underline cursor-pointer font-bold text-xs shrink-0 self-end sm:self-center"
                  >
                    <img src="/assets/images/landing-page/Mate IC_Manage Policies.svg" alt="Manage" className="w-4 h-4 object-contain" />
                    <span>Manage Account</span>
                  </div>
                </div>

                {/* Sub-Tabs Row (Account Summary / Transactions / Statements / Spend Analysis) */}
                <div className="border-b border-slate-200/80 pb-0">
                  <div className="flex items-center gap-8">
                    {(['Account Summary', 'Transactions', 'Statements', 'Spend Analysis'] as const).map((tabName) => {
                      const isActive = detailTab === tabName;
                      return (
                        <button
                          key={tabName}
                          type="button"
                          onClick={() => setDetailTab(tabName)}
                          className={`text-xs transition-all relative pb-3 cursor-pointer ${
                            isActive ? 'text-[#673391] font-extrabold' : 'text-slate-500 font-semibold hover:text-slate-800'
                          }`}
                        >
                          <span>{tabName}</span>
                          {isActive && (
                            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#673391] rounded-full" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* TAB CONTENT: Account Summary (Default Active Tab) */}
                {detailTab === 'Account Summary' && (
                  <div className="space-y-6 pt-2">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      
                      {/* Personal & Account Details (7 of 12) */}
                      <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6 text-xs">
                        <div className="space-y-4">
                          <div>
                            <div className="text-[#8e8e8e] text-xs font-medium mb-1">Account Description</div>
                            <div className="text-black font-bold text-[13px] leading-tight tracking-tight">
                              REGULAR SB NCHQ-INDIVIDUALS
                            </div>
                          </div>

                          <div>
                            <div className="text-[#8e8e8e] text-xs font-medium mb-1">Mode of Operation</div>
                            <div className="text-black font-bold text-[13px]">
                              Single
                            </div>
                          </div>

                          <div>
                            <div className="text-[#8e8e8e] text-xs font-medium mb-1">Nominee(s)</div>
                            <button
                              type="button"
                              onClick={() => toast.success("Nominee: D SHYAMSUNDER (Father)")}
                              className="text-[#673391] hover:underline font-bold text-[13px] text-left block"
                            >
                              View Details
                            </button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <div className="text-[#8e8e8e] text-xs font-medium mb-1">Currency</div>
                            <div className="text-black font-bold text-[13px]">
                              Rupees
                            </div>
                          </div>

                          <div>
                            <div className="text-[#8e8e8e] text-xs font-medium mb-1">Rate of Interest</div>
                            <div className="text-black font-bold text-[13px]">
                              2.50%
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Finance Details Card (5 of 12) - Light Grey Container (#f3f4f7) */}
                      <div className="lg:col-span-5">
                        <div className="bg-[#f3f4f7] rounded-xl p-4 space-y-3 text-xs text-slate-700 font-bold shadow-2xs">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-slate-600 text-xs">Available Balance</span>
                            <span className="font-bold text-sm text-black">₹0.09</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-slate-600 text-xs">Hold/Lien Amount</span>
                            <span className="font-bold text-xs text-black">₹0.00</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-slate-600 text-xs">Uncleared Balance</span>
                            <span className="font-bold text-xs text-black">₹0.00</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-slate-600 text-xs">MOD Balance</span>
                            <span className="font-bold text-xs text-black">₹0.00</span>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Divider & Debit Card Action Box */}
                    <div className="border-t border-slate-200/80 pt-6 mt-6">
                      <div 
                        onClick={() => toast.success("Opening Debit Card Management...")}
                        className="border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between w-full max-w-md bg-white hover:bg-purple-50/20 cursor-pointer transition-all shadow-2xs"
                      >
                        <div className="text-left">
                          <div className="text-xs font-bold text-black">Debit Card</div>
                          <div className="text-[11px] text-slate-500 font-medium mt-0.5">View, Apply & Manage</div>
                        </div>
                        <span className="text-slate-400 font-bold text-lg">&gt;</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: Transactions */}
                {detailTab === 'Transactions' && (
                  <div className="space-y-4 pt-2">
                    <div className="bg-white border border-slate-200/80 rounded-xl px-3.5 py-2.5 flex items-center gap-2 max-w-md shadow-2xs">
                      <Search size={16} className="text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search by name, amount, cheque no., remarks" 
                        className="w-full text-xs font-semibold text-slate-800 bg-transparent focus:outline-none placeholder:text-slate-400"
                      />
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-2xs">
                      <table className="w-full text-left text-xs font-medium text-slate-700">
                        <thead className="bg-purple-50/60 text-[#673391] font-extrabold uppercase text-[11px] tracking-wider border-b border-purple-100">
                          <tr>
                            <th className="py-3 px-4">Date</th>
                            <th className="py-3 px-4">Description</th>
                            <th className="py-3 px-4 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">22/07/2026</td>
                            <td className="py-3.5 px-4 leading-relaxed font-semibold text-slate-800">
                              UPI- TRANSFER TO 4897692162094 UPI/DR/656929883020/Navi Fin/UTIB/navifinser/Paid
                            </td>
                            <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 whitespace-nowrap">₹150.00</td>
                          </tr>
                          <tr className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">22/07/2026</td>
                            <td className="py-3.5 px-4 leading-relaxed font-semibold text-slate-800">
                              UPI- TRANSFER TO 4897692162094 UPI/DR/656911895062/DUMPALA /HDFC/9959662775/Paid
                            </td>
                            <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 whitespace-nowrap">₹500.00</td>
                          </tr>
                          <tr className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">22/07/2026</td>
                            <td className="py-3.5 px-4 leading-relaxed font-semibold text-slate-800">
                              IMPS- TRANSFER FROM 4698313162099 IMPS/620317465123/ICN-XX876-
                            </td>
                            <td className="py-3.5 px-4 text-right font-extrabold text-emerald-600 whitespace-nowrap">+₹2,000.00</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: Statements & Spend Analysis */}
                {(detailTab === 'Statements' || detailTab === 'Spend Analysis') && (
                  <div className="bg-slate-50/60 border border-slate-200/70 rounded-2xl p-8 text-center space-y-3">
                    <h3 className="text-sm font-bold text-slate-800">{detailTab} Report</h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Select date range to view and download custom {detailTab.toLowerCase()} reports for account XXXXXXX7054.
                    </p>
                    <button 
                      type="button" 
                      onClick={() => toast.success(`Generating ${detailTab} report...`)}
                      className="bg-[#673391] text-white px-6 py-2 rounded-full text-xs font-bold hover:bg-[#54247c] transition-all cursor-pointer shadow-2xs"
                    >
                      Generate Report
                    </button>
                  </div>
                )}

              </div>

            </div>
          </div>

        </main>
      )}

      {/* Fixed SBI Global Footer */}
      <SbiFixedFooter />

    </div>
  );
}

export default function AccountsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm font-bold text-purple-900">Loading Accounts...</div>}>
      <ViewAllAccountsContent />
    </Suspense>
  );
}
