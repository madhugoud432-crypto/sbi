'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  Search,
  MoreVertical,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Bell,
  Home,
  Shield,
  FileText,
  PlusCircle,
  LogOut,
  ShoppingBag,
  Gift,
  AlertTriangle,
  FolderX,
  TrendingUp,
  ArrowRight,
  Eye,
  EyeOff,
  Play,
  Volume2,
  X,
  ArrowUpDown,
  Calendar,
  Filter,
  Building2,
  ShieldCheck,
  Star
} from 'lucide-react';
import './SbiLandingPageComponent.css';
import SbiGlobalBrandHeader from './SbiGlobalBrandHeader';
import SbiFixedFooter from './SbiFixedFooter';

interface SbiLandingPageComponentProps {
  initialTab?: 'Transaction' | 'Deposits' | 'Loans' | 'Investments' | 'Insurance';
  initialInvestmentSubTab?: 'Mutual Fund' | 'Demat & Securities' | 'PPF' | 'NPS' | 'IPO';
}

// Shield Illustration Component for Demat Onboarding
function ShieldIllustration({ className = "w-72 h-48" }: { className?: string }) {
  return (
    <div className={`${className} relative flex items-center justify-center select-none`}>
      <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Upward Growth Graph Bar 1 */}
        <rect x="180" y="55" width="22" height="85" rx="3" fill="#f8eef7" />
        {/* Upward Growth Graph Bar 2 */}
        <rect x="208" y="35" width="22" height="105" rx="3" fill="#fcf3fb" />
        
        {/* Upward Pink Trend Arrow */}
        <path d="M140 120 L175 90 L205 60 L235 40" stroke="#eed8ea" strokeWidth="4" strokeLinecap="round" />
        <path d="M225 38 L238 38 L238 51" stroke="#eed8ea" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />

        {/* Padlock on the left */}
        <rect x="25" y="90" width="22" height="18" rx="4" fill="#cbd5e1" />
        <path d="M30 90 V82 C30 76 42 76 42 82 V90" stroke="#cbd5e1" strokeWidth="2.5" fill="none" />
        <circle cx="36" cy="99" r="2" fill="#94a3b8" />

        {/* Document on the left */}
        <rect x="58" y="70" width="40" height="54" rx="3" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
        <line x1="66" y1="82" x2="90" y2="82" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
        <line x1="66" y1="92" x2="86" y2="92" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
        <line x1="66" y1="102" x2="90" y2="102" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
        <line x1="66" y1="112" x2="82" y2="112" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />

        {/* Currency Notes on the right */}
        <rect x="175" y="85" width="50" height="28" rx="3" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1.5" transform="rotate(8 200 99)" />
        <rect x="178" y="88" width="50" height="28" rx="3" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" transform="rotate(15 203 102)" />
        <text x="203" y="104" fontSize="10" fontWeight="bold" fill="#94a3b8" textAnchor="middle" transform="rotate(15 203 102)">₹</text>

        {/* Base Ground Ellipse */}
        <ellipse cx="140" cy="138" rx="100" ry="6" fill="#e2e8f0" opacity="0.6" />

        {/* Shield (Main Guard) */}
        <path d="M95 62 C95 62 140 50 140 50 C140 50 185 62 185 62 C185 92 185 122 140 142 C95 122 95 92 95 62 Z" fill="#ffffff" stroke="#702082" strokeWidth="4" strokeLinejoin="round" />
        
        {/* Inner Shield Accent */}
        <path d="M102 68 C102 68 140 60 140 60 C140 60 178 68 178 68 C178 92 178 116 140 134 C102 116 102 92 102 68 Z" fill="none" stroke="#eed8ea" strokeWidth="1.5" strokeLinejoin="round" />

        {/* Rupee Circle Badge inside Shield */}
        <circle cx="140" cy="95" r="16" fill="#702082" />
        <text x="140" y="100" fontSize="15" fontWeight="extrabold" fill="#ffffff" textAnchor="middle">₹</text>

        {/* Plant sprouting from Shield Top */}
        <path d="M140 50 Q130 32 124 32" stroke="#702082" strokeWidth="2.5" fill="none" />
        <path d="M140 50 Q150 34 156 34" stroke="#702082" strokeWidth="2.5" fill="none" />
        
        {/* Leaves */}
        <path d="M124 32 C118 28 114 34 124 32 Z" fill="#c084fc" stroke="#702082" strokeWidth="1.5" />
        <path d="M156 34 C162 30 166 36 156 34 Z" fill="#c084fc" stroke="#702082" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function SbiLandingPageComponentContent({
  initialTab = 'Deposits',
  initialInvestmentSubTab = 'Mutual Fund'
}: SbiLandingPageComponentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Tab State
  const [activeTab, setActiveTab] = useState<'Transaction' | 'Deposits' | 'Loans' | 'Investments' | 'Insurance'>(initialTab);
  const [investmentSubTab, setInvestmentSubTab] = useState<'Mutual Fund' | 'Demat & Securities' | 'PPF' | 'NPS' | 'IPO'>(initialInvestmentSubTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [othersOpen, setOthersOpen] = useState(true);
  const [liteMode, setLiteMode] = useState(false);
  const [loansSubTab, setLoansSubTab] = useState<'active' | 'closed'>('closed');

  // Transaction sub-tabs & Statements form state (Matching User Reference Images 1, 2, 3, 4)
  const [txSubTab, setTxSubTab] = useState<'Account Summary' | 'Transactions' | 'Statements' | 'Spend Analysis'>('Transactions');
  const [stmtOption, setStmtOption] = useState<'duration' | 'fy'>('duration');
  const [stmtDuration, setStmtDuration] = useState('Duration');
  const [stmtFy, setStmtFy] = useState('Financial Year');
  const [stmtFormat, setStmtFormat] = useState('Format');
  const [includeAllSummary, setIncludeAllSummary] = useState(false);
  const [includeNominee, setIncludeNominee] = useState(false);
  const [showAccountNo, setShowAccountNo] = useState(false);
  const [spendSubTab, setSpendSubTab] = useState<'Tutorials' | 'FAQs'>('Tutorials');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showNoRequestsModal, setShowNoRequestsModal] = useState(false);
  const [showDematDetails, setShowDematDetails] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [detailsSubTab, setDetailsSubTab] = useState<'Features' | 'Eligibility' | 'Documents required' | 'Tutorials'>('Features');
  const [npsCheck, setNpsCheck] = useState(false);
  const [npsTab, setNpsTab] = useState<'Features' | 'Eligibility' | 'Calculator'>('Features');
  const [mfSubTab, setMfSubTab] = useState<'Home' | 'Invest' | 'Portfolio' | 'Ideas' | 'More'>('Home');
  const [mfCarouselIndex, setMfCarouselIndex] = useState(0);
  const [mfFilterTab, setMfFilterTab] = useState<'All funds' | 'Popular' | string>('Popular');
  const [ideasDetail, setIdeasDetail] = useState<string | null>(null);
  const [selectedIdeaFund, setSelectedIdeaFund] = useState<string>('SBI Balanced Advantage Fund');
  const [viewingFundInfo, setViewingFundInfo] = useState<any | null>(null);
  const [mfChartPeriod, setMfChartPeriod] = useState<'1M' | '3M' | '6M' | '1Y' | '5Y' | 'MAX'>('MAX');
  const [riskometerOpen, setRiskometerOpen] = useState(false);
  const [managerOpen, setManagerOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [exitLoadOpen, setExitLoadOpen] = useState(false);
  const [expenseTaxOpen, setExpenseTaxOpen] = useState(false);
  const [holdingsOpen, setHoldingsOpen] = useState(false);
  const [similarFundsOpen, setSimilarFundsOpen] = useState(false);
  const [fundDetailsSubTab, setFundDetailsSubTab] = useState<'Details' | 'Documents'>('Details');
  const [holdingsSubTab, setHoldingsSubTab] = useState<'Stocks' | 'Sector Wise'>('Sector Wise');
  const [similarCarouselIndex, setSimilarCarouselIndex] = useState(0);
  const [moreCarouselIndex, setMoreCarouselIndex] = useState(0);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('showRequestsModal') === 'true') {
        setShowNoRequestsModal(true);
      }
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'Investments' && investmentSubTab === 'Mutual Fund' && mfSubTab === 'Home') {
      const interval = setInterval(() => {
        setMfCarouselIndex((prev) => (prev + 1) % 5);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [activeTab, investmentSubTab, mfSubTab]);


  // Pagination and interactive transaction fake data state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const pageTransactions: Record<number, Array<{
    date: string;
    description: string;
    amount: string;
    isDebit: boolean;
    balance: string;
  }>> = {
    1: [
      { date: '22/07/2026', description: 'UPI- TRANSFER TO 4897692162094 UPI/DR/656929883020/Navi Fin/UTIB/navifinser/Paid', amount: '17049.00', isDebit: true, balance: '0.09' },
      { date: '22/07/2026', description: 'UPI- TRANSFER TO 4897692162094 UPI/DR/656911895062/DUMPALA /HDFC/9959662775/Paid', amount: '15000.00', isDebit: true, balance: '17049.09' },
      { date: '22/07/2026', description: 'IMPS- TRANSFER FROM 4698313162099 IMPS/620317465123/ICN-XX876-KRAZYBEE/Disbursal', amount: '32047.00', isDebit: false, balance: '32049.09' },
      { date: '18/07/2026', description: 'IMPS- TRANSFER FROM 4698328162092 IMPS/619902229627/hsb-XX002-PAYU FIN/PennyDrop', amount: '1.00', isDebit: false, balance: '2.09' },
      { date: '17/07/2026', description: 'UPI- TRANSFER TO 4897694162092 UPI/DR/656419153122/MRS TANV/YESB/q879963732/Paid', amount: '25.00', isDebit: true, balance: '1.09' },
      { date: '06/07/2026', description: 'OTHER- ACHCr HDFC00678000009461 TATASTEELDIV 2026', amount: '4.00', isDebit: false, balance: '26.09' },
      { date: '25/06/2026', description: 'OTHER- CREDIT INTEREST', amount: '1.00', isDebit: false, balance: '22.09' },
      { date: '15/06/2026', description: 'UPI- TRANSFER TO 4897690162095 UPI/DR/616688224870/Vallurip/YESB/paytm.s1sq/UPI', amount: '20.00', isDebit: true, balance: '21.09' },
      { date: '15/06/2026', description: 'UPI- TRANSFER TO 4897690162095 UPI/DR/616663131408/Mr BOYA/FDRL/bharatpe.9/Pay t', amount: '25.00', isDebit: true, balance: '41.09' },
      { date: '15/06/2026', description: 'UPI- TRANSFER TO 4897690162095 UPI/DR/616662782722/SRINIVAS/YESB/q521049726/UPI', amount: '50.00', isDebit: true, balance: '66.09' }
    ],
    2: [
      { date: '14/06/2026', description: 'UPI- TRANSFER TO ZOMATO/DR/616588224870/Zomato/HDFC/zomato.pay/UPI', amount: '320.00', isDebit: true, balance: '116.09' },
      { date: '12/06/2026', description: 'IMPS- TRANSFER FROM 4698313162094 IMPS/620117465999/KRAZYBEE/Disbursal', amount: '10000.00', isDebit: false, balance: '436.09' },
      { date: '10/06/2026', description: 'ATM WDL/SBI KUNARAM BR/KUNARAM/Cash Withdrawal', amount: '2000.00', isDebit: true, balance: '10436.09' },
      { date: '08/06/2026', description: 'UPI- TRANSFER TO 4897692162094 UPI/DR/615911895062/DUMPALA /HDFC/9959662775/Paid', amount: '5000.00', isDebit: true, balance: '12436.09' },
      { date: '05/06/2026', description: 'NEFT/N2060538219/ELECTRICITY BOARD/SBIN/Bill Payment', amount: '1250.00', isDebit: true, balance: '17436.09' },
      { date: '01/06/2026', description: 'OTHER- ACHCr TATASTEEL DIVIDEND/Dividend Payment', amount: '120.00', isDebit: false, balance: '18686.09' },
      { date: '28/05/2026', description: 'UPI- TRANSFER TO 4897690162095 UPI/DR/614688224870/AmazonPay/AMZN/UPI', amount: '899.00', isDebit: true, balance: '18566.09' },
      { date: '24/05/2026', description: 'IMPS- TRANSFER FROM FRIEND/SBIN/Funds Received', amount: '500.00', isDebit: false, balance: '19465.09' },
      { date: '20/05/2026', description: 'UPI- TRANSFER TO SWIGGY/DR/Swiggy Food Delivery/Paid', amount: '450.00', isDebit: true, balance: '18965.09' },
      { date: '18/05/2026', description: 'OTHER- MONTHLY SAVINGS INTEREST/Interest Received', amount: '15.00', isDebit: false, balance: '19415.09' }
    ],
    3: [
      { date: '15/05/2026', description: 'UPI- TRANSFER TO Airtel Prepaid/Airtel Mobile Recharge/Paid', amount: '299.00', isDebit: true, balance: '19400.09' },
      { date: '10/05/2026', description: 'ATM WDL/SBI KALVASRIRAMPUR/PEDDAPALLI/Cash Withdrawal', amount: '1000.00', isDebit: true, balance: '19699.09' },
      { date: '08/05/2026', description: 'IMPS- TRANSFER FROM MOTHER/HDFC/Pocket Money', amount: '2000.00', isDebit: false, balance: '20699.09' },
      { date: '04/05/2026', description: 'UPI- TRANSFER TO Jio Fiber/Broadband Bill/Paid', amount: '1178.00', isDebit: true, balance: '18699.09' },
      { date: '01/05/2026', description: 'OTHER- CASH DEP PEDDAPALLI BR/Cash Deposit', amount: '5000.00', isDebit: false, balance: '19877.09' },
      { date: '28/04/2026', description: 'UPI- TRANSFER TO Netflix/DR/Netflix Subscription/Paid', amount: '649.00', isDebit: true, balance: '14877.09' },
      { date: '25/04/2026', description: 'OTHER- CREDIT INTEREST/Interest Received', amount: '1.00', isDebit: false, balance: '15526.09' },
      { date: '20/04/2026', description: 'UPI- TRANSFER TO Uber India/DR/Cab Ride/Paid', amount: '320.00', isDebit: true, balance: '15525.09' },
      { date: '15/04/2026', description: 'UPI- TRANSFER TO Swiggy/DR/Food Delivery/Paid', amount: '180.00', isDebit: true, balance: '15845.09' },
      { date: '12/04/2026', description: 'NEFT- CHARGES FOR IMPS/Bank Charges', amount: '5.00', isDebit: true, balance: '16025.09' }
    ]
  };

  const getPageData = (page: number) => {
    const baseList = pageTransactions[page] || pageTransactions[1];
    
    // Extend base list up to 55 items dynamically so rowsPerPage dropdown works up to 50
    const fullList = [...baseList];
    while (fullList.length < 55) {
      const idx = fullList.length;
      const day = String((28 - (idx % 20)) || 1).padStart(2, '0');
      const month = String(((7 - (page % 5) + (idx % 3)) % 12) || 12).padStart(2, '0');
      const amountValue = ((idx + 1) * page * 42.5) % 1500 + 4.5;
      const isDebit = idx % 2 === 0;
      
      fullList.push({
        date: `${day}/${month}/2026`,
        description: isDebit 
          ? `UPI- TRANSFER TO ${4897690162000 + idx} UPI/DR/${656911000000 + idx}/Paid`
          : `IMPS- TRANSFER FROM ${4698313162000 + idx} IMPS/${620317000000 + idx}/Disbursal`,
        amount: amountValue.toFixed(2),
        isDebit,
        balance: (100.09 + (idx * 55)).toFixed(2)
      });
    }
    return fullList;
  };

  // Hover Mega Dropdown state
  const [hoveredNavTab, setHoveredNavTab] = useState<string | null>(null);

  // Sync tab with pathname if user navigates via direct URLs
  useEffect(() => {
    if (!pathname) return;
    if (pathname.includes('/loans')) {
      setActiveTab('Loans');
    } else if (pathname.includes('/investments')) {
      setActiveTab('Investments');
      if (pathname.includes('/mutual-fund')) setInvestmentSubTab('Mutual Fund');
    } else if (pathname.includes('/insurance')) {
      setActiveTab('Insurance');
    } else if (pathname.includes('/deposits')) {
      setActiveTab('Deposits');
    } else if (pathname.includes('/transaction')) {
      setActiveTab('Transaction');
    }
  }, [pathname]);

  const handleTabChange = (tab: 'Transaction' | 'Deposits' | 'Loans' | 'Investments' | 'Insurance') => {
    setActiveTab(tab);
    let targetPath = '/home/landingPage/manageRelationship/';
    switch (tab) {
      case 'Deposits':
        targetPath += 'deposits';
        break;
      case 'Loans':
        targetPath += 'loans/loans';
        break;
      case 'Investments':
        targetPath += 'investments/mutual-fund';
        break;
      case 'Insurance':
        targetPath += 'insurance';
        break;
      case 'Transaction':
        targetPath += 'transaction-accounts';
        break;
    }
    router.push(targetPath, { scroll: false });
  };

  return (
    <div className="sbi-portal-wrapper">
      
      {/* ================= GLOBAL BRAND HEADER ================= */}
      <SbiGlobalBrandHeader activeNav={activeTab === 'Loans' || activeTab === 'Transaction' || activeTab === 'Insurance' || activeTab === 'Deposits' ? 'Accounts' : activeTab} />

      {/* 3. BREADCRUMB & MAIN BODY CONTENT */}
      <main className="sbi-main-body">
        
        {/* Breadcrumb */}
        <div className="sbi-breadcrumb select-none font-sans">
          <Link href="/dashboard" className="sbi-bc-home">
            <Home size={15} />
          </Link>
          <span className="sbi-bc-sep">&gt;</span>
          {showDematDetails ? (
            <>
              <span className="sbi-bc-current cursor-pointer hover:underline" onClick={() => setShowDematDetails(false)}>Relationship Overview</span>
              <span className="sbi-bc-sep">&gt;</span>
              <span className="sbi-bc-current">Demat & Securities</span>
            </>
          ) : activeTab === 'Investments' && investmentSubTab === 'Mutual Fund' ? (
            viewingFundInfo !== null ? (
              <>
                <span className="sbi-bc-current cursor-pointer hover:underline" onClick={() => setViewingFundInfo(null)}>Mutual Funds</span>
                <span className="sbi-bc-sep">&gt;</span>
                <span className="sbi-bc-current">Fund Info</span>
              </>
            ) : ideasDetail !== null ? (
              <>
                <span className="sbi-bc-current cursor-pointer hover:underline" onClick={() => { setIdeasDetail(null); setMfSubTab('Home'); }}>Mutual Funds</span>
                <span className="sbi-bc-sep">&gt;</span>
                <span className="sbi-bc-current cursor-pointer hover:underline" onClick={() => { setIdeasDetail(null); setMfSubTab('Ideas'); }}>Ideas</span>
                <span className="sbi-bc-sep">&gt;</span>
                <span className="sbi-bc-current">{ideasDetail}</span>
              </>
            ) : mfSubTab === 'Ideas' ? (
              <>
                <span className="sbi-bc-current cursor-pointer hover:underline" onClick={() => setMfSubTab('Home')}>Mutual Funds</span>
                <span className="sbi-bc-sep">&gt;</span>
                <span className="sbi-bc-current">Ideas</span>
              </>
            ) : (
              <span className="sbi-bc-current">Mutual Funds</span>
            )
          ) : activeTab === 'Investments' ? (
            <span className="sbi-bc-current">
              {investmentSubTab === 'NPS' 
                ? 'NPS Account' 
                : investmentSubTab === 'Demat & Securities' 
                  ? 'Demat & Securities' 
                  : investmentSubTab === 'PPF' 
                    ? 'PPF Account' 
                    : investmentSubTab === 'IPO' 
                      ? 'IPO' 
                      : 'Mutual Funds'}
            </span>
          ) : (
            <span className="sbi-bc-current">
              {searchParams?.get('view') === 'all' && (activeTab === 'Deposits' || activeTab === 'Loans') 
                ? activeTab 
                : 'Relationship Overview'}
            </span>
          )}
        </div>

        {/* Page Header Title Row */}
        {searchParams?.get('view') === 'all' && activeTab === 'Deposits' && (
          <div className="flex justify-between items-center mb-6 mt-3">
            <h1 className="text-[28px] font-bold text-[#302985] font-sans">
              Deposits
            </h1>

            <div className="border border-slate-200 bg-white rounded-xl p-2.5 px-4 flex items-center gap-3 cursor-pointer shadow-2xs hover:bg-slate-50 transition-colors w-full max-w-[280px]">
              <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-[#702082] shrink-0">
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="5" y="11" width="14" height="10" rx="2" />
                  <path d="M12 2a5 5 0 0 0-5 5v4h10V7a5 5 0 0 0-5-5z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-[12px] font-bold text-slate-800 leading-tight">Manage your Deposits (00)</div>
                <div className="text-[11px] text-slate-500 font-semibold mt-0.5">Combined Value: ₹0.00</div>
              </div>
              <ChevronRight size={14} className="text-slate-400" />
            </div>
          </div>
        )}

        {activeTab === 'Investments' && investmentSubTab === 'Mutual Fund' && (
          <div className="flex justify-between items-center mb-4 mt-2">
            <h1 className="text-[28px] font-bold text-[#302985] font-sans">
              Mutual Funds
            </h1>
          </div>
        )}

        {/* 4. SUB-NAVIGATION TABS BAR (Transaction Accounts | Deposits | Loans | Investments | Insurance) */}
        {!showDematDetails && !(searchParams?.get('view') === 'all' && (activeTab === 'Deposits' || activeTab === 'Loans')) && activeTab !== 'Investments' && (
          <div className="sbi-tabs-container">
            <div className="sbi-tabs-row">
              {(['Transaction Accounts', 'Deposits', 'Loans', 'Investments', 'Insurance'] as const).map((tabLabel) => {
                const tabKey = (tabLabel === 'Transaction Accounts' ? 'Transaction' : tabLabel) as typeof activeTab;
                const isActive = activeTab === tabKey;

                return (
                  <button
                    key={tabLabel}
                    type="button"
                    onClick={() => handleTabChange(tabKey)}
                    className={`sbi-tab-btn ${isActive ? 'active' : ''}`}
                  >
                    <span className="sbi-tab-text">{tabLabel}</span>
                    {isActive && <div className="sbi-tab-indicator"></div>}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => router.push('/accounts')}
              className="sbi-view-all-btn"
            >
              <span>View All Accounts</span>
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        {/* 5. ACTIVE TAB MAIN WORKSPACE AREA */}
        <div className="sbi-workspace-area">

          {/* ================= MODAL: NO PENDING REQUESTS (EXACT MATCH TO SCREENSHOT 2) ================= */}
          {showNoRequestsModal && (
            <div 
              className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150"
              onClick={() => setShowNoRequestsModal(false)}
            >
              <div 
                className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-100 animate-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button X */}
                <button
                  type="button"
                  onClick={() => setShowNoRequestsModal(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>

                {/* Modal Title */}
                <h3 className="text-base font-extrabold text-[#673391] mb-6">
                  No pending requests
                </h3>

                {/* Triangle Pole Warning Graphic & Text */}
                <div className="flex flex-col md:flex-row items-center gap-6 py-2">
                  <div className="w-40 h-32 relative flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                      {/* Soft Background Hills */}
                      <path d="M10 120 C40 100 80 110 120 120 Z" fill="#f5edfc" />
                      <path d="M70 120 C100 95 130 110 150 120 Z" fill="#eee3fa" />

                      {/* Ground Base */}
                      <line x1="5" y1="120" x2="155" y2="120" stroke="#d8c5f2" strokeWidth="1.5" strokeDasharray="3 3" />

                      {/* Pole */}
                      <line x1="75" y1="50" x2="75" y2="120" stroke="#702082" strokeWidth="2.5" strokeLinecap="round" />

                      {/* Triangle Sign */}
                      <path 
                        d="M75 15 L100 55 L50 55 Z" 
                        fill="#ffffff" 
                        stroke="#702082" 
                        strokeWidth="3.5" 
                        strokeLinejoin="round" 
                      />
                      {/* Exclamation Point */}
                      <path d="M75 28 L75 41" stroke="#702082" strokeWidth="3" strokeLinecap="round" />
                      <circle cx="75" cy="48" r="1.8" fill="#702082" />

                      {/* Cactus Graphic at Base */}
                      <g transform="translate(58, 95)">
                        <rect x="8" y="6" width="5" height="20" rx="2.5" fill="#a855f7" fillOpacity="0.4" />
                        <path d="M4 12 C4 18 8 18 8 18" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" fill="none" />
                        <path d="M17 14 C17 20 13 20 13 20" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" fill="none" />
                      </g>
                    </svg>
                  </div>

                  <div className="flex-1 text-slate-700 text-xs font-medium leading-relaxed">
                    There are no pending requests that requires your approval (BSTDC038)
                  </div>
                </div>

                {/* Bottom Okay Action Button */}
                <div className="flex justify-end pt-4 mt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowNoRequestsModal(false)}
                    className="px-6 py-1.5 text-xs font-bold text-[#673391] border border-[#673391] rounded-full hover:bg-purple-50 transition-colors"
                  >
                    Okay
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 1: DEPOSITS (MATCHING SCREENSHOT 1) */}
          {/* ========================================================================= */}
          {activeTab === 'Deposits' && (
            searchParams?.get('view') === 'all' ? (
              /* ================= VIEW ALL / FROM OVERVIEW DEPOSITS MODE ================= */
              <div className="space-y-6">
                
                {/* Top Card: Open New Deposit options list & illustration */}
                <div className="bg-[#f0f2f5] rounded-3xl border border-slate-200/50 p-8 shadow-sm flex flex-col lg:flex-row items-stretch gap-8">
                  {/* Left Column (Open New Deposit form) */}
                  <div className="flex-1 space-y-4">
                    <h2 className="text-[18px] font-bold text-[#702082] mb-5 tracking-tight font-sans text-left">
                      Open New Deposit
                    </h2>

                    <div className="space-y-4">
                      {/* Fixed Deposit */}
                      <div 
                        onClick={() => toast.success("Opening Fixed Deposit variant selection...")}
                        className="bg-white hover:bg-purple-50/20 border border-slate-200/80 rounded-xl p-4.5 flex items-center justify-between cursor-pointer transition-all w-full shadow-2xs"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-transparent flex items-center justify-center text-[#702082] rounded-full border border-slate-100 shrink-0">
                            <img src="/assets/images/landing-page/IC_FixedDeposit.svg" alt="Fixed Deposit" className="w-6.5 h-6.5 object-contain" />
                          </div>
                          <div className="text-left">
                            <div className="text-[14.5px] font-bold text-slate-800 font-sans">Fixed Deposit</div>
                            <div className="text-xs text-slate-500 font-semibold mt-0.5 font-sans">Explore a host of FD variants to suit your needs</div>
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-[#702082] shrink-0">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>

                      {/* Recurring Deposit */}
                      <div 
                        onClick={() => toast.success("Opening Recurring Deposit creation...")}
                        className="bg-white hover:bg-purple-50/20 border border-slate-200/80 rounded-xl p-4.5 flex items-center justify-between cursor-pointer transition-all w-full shadow-2xs"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-transparent flex items-center justify-center text-[#702082] rounded-full border border-slate-100 shrink-0">
                            <img src="/assets/images/landing-page/IC_NewRecurringdeposit.svg" alt="Recurring Deposit" className="w-6.5 h-6.5 object-contain" />
                          </div>
                          <div className="text-left">
                            <div className="text-[14.5px] font-bold text-slate-800 font-sans">Recurring Deposit</div>
                            <div className="text-xs text-slate-500 font-semibold mt-0.5 font-sans">One-time deposit creation that ensures you save every month</div>
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-[#702082] shrink-0">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>

                      {/* Annuity Deposit */}
                      <div 
                        onClick={() => toast.success("Opening Annuity Deposit setup...")}
                        className="bg-white hover:bg-purple-50/20 border border-slate-200/80 rounded-xl p-4.5 flex items-center justify-between cursor-pointer transition-all w-full shadow-2xs"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-transparent flex items-center justify-center text-[#702082] rounded-full border border-slate-100 shrink-0">
                            <img src="/assets/images/landing-page/Header_Annuity_deposit.svg" alt="Annuity Deposit" className="w-6.5 h-6.5 object-contain" />
                          </div>
                          <div className="text-left">
                            <div className="text-[14.5px] font-bold text-slate-800 font-sans">Annuity Deposit</div>
                            <div className="text-xs text-slate-500 font-semibold mt-0.5 font-sans">Invest once and get returns every month</div>
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-[#702082] shrink-0">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>

                      {/* Auto Sweep */}
                      <div 
                        onClick={() => toast.success("Opening Auto Sweep setup...")}
                        className="bg-white hover:bg-purple-50/20 border border-slate-200/80 rounded-xl p-4.5 flex items-center justify-between cursor-pointer transition-all w-full shadow-2xs"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-transparent flex items-center justify-center text-[#702082] rounded-full border border-slate-100 shrink-0">
                            <img src="/assets/images/landing-page/header_autosweep.svg" alt="Auto Sweep" className="w-6.5 h-6.5 object-contain" />
                          </div>
                          <div className="text-left">
                            <div className="text-[14.5px] font-bold text-slate-800 font-sans">Auto Sweep</div>
                            <div className="text-xs text-slate-500 font-semibold mt-0.5 font-sans">Let idle funds in your savings account earn more for you</div>
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-[#702082] shrink-0">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column (Illustration & Caption) */}
                  <div className="w-full lg:w-[45%] flex flex-col items-center justify-center select-none shrink-0 self-center">
                    <div className="w-full max-w-[340px]">
                      <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                        <ellipse cx="160" cy="200" rx="120" ry="10" fill="#e2e8f0" opacity="0.6" />
                        <path d="M125,160 L125,80 L95,80 L140,25 L185,80 L155,80 L155,160 Z" fill="#edd6ea" opacity="0.8" />
                        <text x="140" y="85" fontSize="24" fontWeight="bold" fill="#ffffff" textAnchor="middle" opacity="0.9">₹</text>
                        <rect x="55" y="110" width="55" height="60" rx="4" fill="#ffffff" stroke="#525c99" strokeWidth="2.5" />
                        <path d="M55,125 H110" stroke="#525c99" strokeWidth="2.5" />
                        <circle cx="65" cy="118" r="2.5" fill="#b81d6c" /><circle cx="100" cy="118" r="2.5" fill="#b81d6c" />
                        <rect x="65" y="135" width="6" height="6" rx="1" fill="#cbd5e1" />
                        <rect x="77" y="135" width="6" height="6" rx="1" fill="#cbd5e1" />
                        <rect x="89" y="135" width="6" height="6" rx="1" fill="#cbd5e1" />
                        <rect x="65" y="147" width="6" height="6" rx="1" fill="#cbd5e1" />
                        <rect x="77" y="147" width="6" height="6" rx="1" fill="#be185d" />
                        <rect x="89" y="147" width="6" height="6" rx="1" fill="#cbd5e1" />
                        <circle cx="100" cy="165" r="14" fill="#b81d6c" />
                        <text x="100" y="170" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#ffffff" fontFamily="sans-serif">%</text>
                        <rect x="110" y="100" width="90" height="75" rx="8" fill="#525c99" stroke="#312e81" strokeWidth="2" />
                        <path d="M165,100 H200 V130 H165 Z" fill="#434c85" stroke="#312e81" strokeWidth="2" />
                        <circle cx="178" cy="115" r="3.5" fill="#fbbf24" />
                        <path d="M130,100 L155,75 L180,82 L150,107 Z" fill="#d1fae5" stroke="#10b981" strokeWidth="1.5" />
                        <path d="M142,100 L167,75 L192,82 L162,107 Z" fill="#a7f3d0" stroke="#10b981" strokeWidth="1.5" />
                        <path d="M210,185 C210,135 255,135 255,185 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
                        <rect x="222" y="180" width="22" height="15" rx="2" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
                        <circle cx="233" cy="160" r="10" fill="#702082" />
                        <text x="233" y="164" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#ffffff">₹</text>
                      </svg>
                      
                      <div className="text-center font-bold text-slate-700 text-[16px] mt-4 font-sans leading-tight">
                        Invest today for a<br />
                        <span className="text-[#3b2e81] font-extrabold text-[17.5px]">better tomorrow!</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Card: Interest Rates / Calculator / Know More */}
                <div className="bg-white rounded-3xl border border-slate-200/60 p-8 shadow-sm text-left">
                  {/* Tab Selector */}
                  <div className="flex gap-8 border-b border-slate-100 pb-3 mb-6">
                    <button className="text-[13.5px] font-bold text-[#702082] border-b-2 border-b-[#702082] pb-3 -mb-[14px] font-sans">
                      Interest Rates
                    </button>
                    <button className="text-[13.5px] font-semibold text-slate-500 hover:text-slate-800 pb-3 -mb-[14px] font-sans" onClick={() => toast("Payout Calculator feature coming soon")}>
                      Payout Calculator
                    </button>
                    <button className="text-[13.5px] font-semibold text-slate-500 hover:text-slate-800 pb-3 -mb-[14px] font-sans" onClick={() => toast("Information and guidelines loading")}>
                      Know more
                    </button>
                  </div>

                  {/* Grid Column Wrapper */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
                    
                    {/* Column 1: Domestic Term Deposit - General */}
                    <div className="lg:col-span-5 space-y-3">
                      <h3 className="text-[13px] font-bold text-slate-700 font-sans tracking-wide">
                        Domestic Term Deposit - General
                      </h3>
                      <div className="border border-slate-100 rounded-xl overflow-hidden">
                        <div className="grid grid-cols-2 bg-slate-50 border-b border-slate-100 p-2.5 px-4 text-[11px] font-bold text-slate-500 font-sans uppercase">
                          <span>Terms</span>
                          <span className="text-right">Interest Rate</span>
                        </div>
                        {[
                          { term: '7 Days to 45 Days', rate: '3.05%' },
                          { term: '46 Days to 180 Days', rate: '4.90%' },
                          { term: '181 Days to 210 Days', rate: '5.65%' },
                          { term: '211 Days to less than 1 Year', rate: '5.90%' },
                          { term: '1 Year to less than 2 Years', rate: '6.25%' },
                          { term: 'Amrit Vrishiti 444', rate: '6.45%' },
                          { term: '2 Years to less than 3 Years', rate: '6.40%' },
                          { term: '3 Years to less than 5 Years', rate: '6.30%' },
                          { term: '5 Years and upto 10 Years', rate: '6.05%' },
                        ].map((row, idx) => (
                          <div key={idx} className="grid grid-cols-2 p-2.5 px-4 text-xs font-semibold text-slate-700 font-sans border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                            <span>{row.term}</span>
                            <span className="text-right text-slate-900 font-bold">{row.rate}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Column 2: Green Rupee TD - General */}
                    <div className="lg:col-span-4 space-y-3">
                      <h3 className="text-[13px] font-bold text-slate-700 font-sans tracking-wide">
                        Green Rupee TD - General
                      </h3>
                      <div className="border border-slate-100 rounded-xl overflow-hidden">
                        <div className="grid grid-cols-2 bg-slate-50 border-b border-slate-100 p-2.5 px-4 text-[11px] font-bold text-slate-500 font-sans uppercase">
                          <span>Terms</span>
                          <span className="text-right">Interest Rate</span>
                        </div>
                        {[
                          { term: '1111 Days', rate: '6.30%' },
                          { term: '1777 Days', rate: '6.30%' },
                          { term: '2222 Days', rate: '6.05%' },
                        ].map((row, idx) => (
                          <div key={idx} className="grid grid-cols-2 p-2.5 px-4 text-xs font-semibold text-slate-700 font-sans border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                            <span>{row.term}</span>
                            <span className="text-right text-slate-900 font-bold">{row.rate}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Column 3: Non-callable Deposit - General */}
                    <div className="lg:col-span-3 space-y-3">
                      <h3 className="text-[13px] font-bold text-slate-700 font-sans tracking-wide">
                        Non-callable Deposit - General
                      </h3>
                      <div className="border border-slate-100 rounded-xl overflow-hidden">
                        <div className="grid grid-cols-2 bg-slate-50 border-b border-slate-100 p-2.5 px-4 text-[11px] font-bold text-slate-500 font-sans uppercase">
                          <span>Terms</span>
                          <span className="text-right">Interest Rate</span>
                        </div>
                        {[
                          { term: '1 Year', rate: '6.55%' },
                          { term: '2 Years', rate: '6.80%' },
                        ].map((row, idx) => (
                          <div key={idx} className="grid grid-cols-2 p-2.5 px-4 text-xs font-semibold text-slate-700 font-sans border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                            <span>{row.term}</span>
                            <span className="text-right text-slate-900 font-bold">{row.rate}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            ) : (
              /* ================= ORIGINAL TABBED DEPOSITS VIEW ================= */
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-left w-full">
                {/* Left Column (3/12 width) */}
                <div className="md:col-span-3 space-y-4">
                  <div className="sbi-search-card">
                    <Search size={16} className="text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search here..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="sbi-search-input font-sans"
                    />
                    <button type="button" className="text-gray-400 hover:text-gray-600">
                      <MoreVertical size={16} />
                    </button>
                  </div>

                  <div 
                    onClick={() => setShowNoRequestsModal(true)}
                    className="sbi-menu-card flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-xs font-semibold text-gray-700 font-sans">Requests</span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>

                  <div className="sbi-menu-card">
                    <div
                      onClick={() => setOthersOpen(!othersOpen)}
                      className="flex items-center justify-between cursor-pointer pb-1"
                    >
                      <span className="text-xs font-bold text-[#30135d] font-sans">Others (00)</span>
                      {othersOpen ? (
                        <ChevronUp size={16} className="text-[#30135d]" />
                      ) : (
                        <ChevronDown size={16} className="text-gray-400" />
                      )}
                    </div>

                    {othersOpen && (
                      <div className="mt-3">
                        <div
                          onClick={() => toast('Sukanya Samriddhi / Minor PPF Account Info')}
                          className="sbi-sukanya-banner"
                        >
                          <div className="sbi-sukanya-text-col">
                            <div className="sbi-sukanya-sub flex items-center gap-1 font-sans">
                              <span>View your Linked</span>
                              <ChevronRight size={10} />
                            </div>
                            <div className="sbi-sukanya-title font-sans">
                              Sukanya Samriddhi/ Minor PPF Account
                            </div>
                          </div>
                          <div className="sbi-sukanya-graphic">
                            <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                              <path d="M85 30 C85 30 105 35 105 55 C105 75 85 85 85 85 C85 85 65 75 65 55 C65 35 85 30 85 30 Z" fill="#ffffff" fillOpacity="0.25" />
                              <circle cx="45" cy="40" r="10" fill="#fbcfe8" />
                              <path d="M45 52 L35 75 L42 75 L48 62 L55 75 L62 75 L52 52 Z" fill="#ffffff" />
                              <circle cx="25" cy="45" r="7" fill="#f472b6" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column (9/12 width) */}
                <div className="md:col-span-9 space-y-6">
                  <div className="sbi-content-card min-h-[380px] p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-6">
                        <div>
                          <h2 className="text-lg font-bold text-[#30135d] font-sans">Deposits Summary</h2>
                          <p className="text-xs text-gray-500 font-sans">View and manage your Term Deposits, Fixed Deposits, and Special Schemes</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toast.success('Redirecting to Open FD page')}
                          className="sbi-btn-primary flex items-center gap-1.5 font-sans"
                        >
                          <PlusCircle size={15} />
                          <span>Open Fixed Deposit</span>
                        </button>
                      </div>

                      {/* Deposit Cards Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="sbi-deposit-box">
                          <div className="flex justify-between items-start">
                            <span className="sbi-deposit-type font-sans">FIXED DEPOSIT (FD)</span>
                            <span className="sbi-badge-active font-sans">Active</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-2 font-sans">A/C: 39812049182</div>
                          <div className="text-xl font-bold text-gray-900 mt-1 font-sans">₹ 2,50,000.00</div>
                          <div className="flex justify-between items-center mt-3 pt-3 border-t border-purple-100 text-xs font-sans">
                            <span className="text-gray-600">Maturity: 15 Oct 2027 (7.10% p.a.)</span>
                            <button type="button" onClick={() => toast('FD Account Details')} className="text-[#30135d] font-bold hover:underline">
                              Details →
                            </button>
                          </div>
                        </div>

                        <div className="sbi-deposit-box">
                          <div className="flex justify-between items-start">
                            <span className="sbi-deposit-type font-sans">RECURRING DEPOSIT (RD)</span>
                            <span className="sbi-badge-active font-sans">Active</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-2 font-sans">Monthly Installment: ₹5,000</div>
                          <div className="text-xl font-bold text-gray-900 mt-1 font-sans">₹ 60,000.00</div>
                          <div className="flex justify-between items-center mt-3 pt-3 border-t border-purple-100 text-xs font-sans">
                            <span className="text-gray-600">Maturity: 01 Mar 2027 (6.80% p.a.)</span>
                            <button type="button" onClick={() => toast('RD Account Details')} className="text-[#30135d] font-bold hover:underline">
                              Details →
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="sbi-info-bar mt-6 font-sans">
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                        <FileText size={16} className="text-[#30135d]" />
                        <span>Need deposit interest certificate for IT return filing?</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toast.success('Interest Certificate downloaded successfully')}
                        className="sbi-btn-outline font-sans"
                      >
                        Download Certificate
                      </button>
                    </div>
                  </div>

                  <BusinessLoanBanner />
                </div>
              </div>
            )
          )}

          {/* ========================================================================= */}
          {/* TAB 2: LOANS (EXACT MATCH TO SCREENSHOT 2) */}
          {/* ========================================================================= */}
          {activeTab === 'Loans' && (
            searchParams?.get('view') === 'all' ? (
              /* ================= VIEW ALL / FROM OVERVIEW LOANS MODE ================= */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left items-start w-full">
                
                {/* Left Column (Approx 65% width / lg:col-span-8) */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Business Loan Apply Banner */}
                  <div className="bg-[#1e3c72] bg-gradient-to-r from-[#202967] via-[#2d3a8c] to-[#3a4db2] rounded-3xl p-8 text-white relative overflow-hidden shadow-xs">
                    {/* Abstract Wave Shapes in background */}
                    <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-15 pointer-events-none select-none">
                      <svg viewBox="0 0 200 200" fill="none" className="w-full h-full object-cover">
                        <path d="M0,100 C50,150 150,50 200,100 L200,200 L0,200 Z" fill="#ffffff" />
                      </svg>
                    </div>

                    <div className="relative z-10 space-y-5">
                      <h2 className="text-[20px] font-bold tracking-tight font-sans">
                        Apply for a Business Loan
                      </h2>
                      <div>
                        <button 
                          onClick={() => toast.success("Checking Business Loan Eligibility...")}
                          className="bg-white hover:bg-slate-50 text-[#302985] font-bold text-[13px] px-6 py-2.5 rounded-full shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all font-sans"
                        >
                          Click here to check your eligibility
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* View Existing Loans Section */}
                  <div className="bg-white rounded-3xl border border-slate-200/60 p-8 shadow-sm space-y-6">
                    <h3 className="text-[17px] font-bold text-slate-800 tracking-tight font-sans">
                      View Existing Loans
                    </h3>

                    {/* Sub Tab Selector (Active Loan(s) / Closed Loan(s)) */}
                    <div className="flex gap-6 border-b border-slate-100 pb-0">
                      <button 
                        onClick={() => setLoansSubTab('active')}
                        className={`text-[13px] font-bold pb-2.5 transition-all font-sans relative ${
                          loansSubTab === 'active' ? 'text-[#702082]' : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        Active Loan(s)
                        {loansSubTab === 'active' && (
                          <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#702082] rounded-t-sm" />
                        )}
                      </button>
                      <button 
                        onClick={() => setLoansSubTab('closed')}
                        className={`text-[13px] font-bold pb-2.5 transition-all font-sans relative ${
                          loansSubTab === 'closed' ? 'text-[#702082]' : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        Closed Loan(s)
                        {loansSubTab === 'closed' && (
                          <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#702082] rounded-t-sm" />
                        )}
                      </button>
                    </div>

                    {/* Sub Tab Content */}
                    {loansSubTab === 'closed' ? (
                      <div className="py-8 flex flex-col items-center justify-center text-center space-y-5 select-none">
                        {/* High Fidelity Clipboard Shield Graphic */}
                        <div className="w-52 h-52 relative flex items-center justify-center">
                          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                            {/* Shield background shadow/accent */}
                            <path d="M100 20 C140 20 170 30 170 70 C170 120 120 165 100 175 C80 165 30 120 30 70 C30 30 60 20 100 20 Z" fill="#fdf2f8" opacity="0.9" />
                            <path d="M100 25 C135 25 162 34 162 70 C162 115 116 156 100 165 C84 156 38 115 38 70 C38 34 65 25 100 25 Z" stroke="#fbcfe8" strokeWidth="2" strokeDasharray="3 3" />
                            
                            {/* Clipboard Card */}
                            <rect x="65" y="55" width="70" height="90" rx="6" fill="#ffffff" stroke="#a78bfa" strokeWidth="2.5" />
                            {/* Clipboard Header Clip */}
                            <rect x="85" y="46" width="30" height="15" rx="3" fill="#8b5cf6" />
                            
                            {/* Card text lines */}
                            <line x1="77" y1="75" x2="123" y2="75" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                            <line x1="77" y1="90" x2="123" y2="90" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                            <line x1="77" y1="105" x2="110" y2="105" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />

                            {/* Checkmark details inside clipboard */}
                            <path d="M108 128 L114 134 L125 123" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />

                            {/* Floating Rupees Coin */}
                            <circle cx="50" cy="140" r="14" fill="#a5f3fc" stroke="#0891b2" strokeWidth="1.5" />
                            <text x="50" y="145" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#0891b2" fontFamily="sans-serif">₹</text>

                            {/* Floating Percent Coin */}
                            <circle cx="145" cy="135" r="14" fill="#fbcfe8" stroke="#be185d" strokeWidth="1.5" />
                            <text x="145" y="139" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#be185d" fontFamily="sans-serif">%</text>

                            {/* Smile Pill shape at bottom center */}
                            <rect x="85" y="146" width="30" height="8" rx="4" fill="#cbd5e1" />
                          </svg>
                        </div>
                        <p className="text-[14.5px] font-bold text-slate-700 font-sans tracking-wide">
                          No loans have been closed in the last 24 months.
                        </p>
                      </div>
                    ) : (
                      <div className="py-14 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <p className="text-xs font-semibold text-slate-400 font-sans">
                          No active loans found.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column (Approx 35% width / lg:col-span-4) */}
                <div className="lg:col-span-4 w-full">
                  <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm space-y-5">
                    <h3 className="text-[15.5px] font-bold text-slate-800 tracking-tight font-sans text-left">
                      Apply for a new Loan
                    </h3>

                    {/* 2-Column Grid of Options */}
                    <div className="grid grid-cols-2 gap-3.5 w-full">
                      {[
                        { 
                          name: 'Loan Against Mutual Fund',
                          iconImg: '/assets/images/lamfu/Cate_IC_loan_against_mutual_fund.svg'
                        },
                        { 
                          name: 'Personal Loan',
                          iconImg: '/assets/images/landing-page/IC_NewPersonalLoan.svg'
                        },
                        { 
                          name: 'Overdraft against Deposit',
                          iconImg: '/assets/images/landing-page/IC_NewODagainstFD.svg'
                        },
                        { 
                          name: 'Home Loan',
                          iconImg: '/assets/images/landing-page/IC_NewHomeLoan.svg'
                        },
                        { 
                          name: 'Education Loan',
                          iconImg: '/assets/images/landing-page/IC_NewEducationloan.svg'
                        },
                        { 
                          name: 'Gold Loan',
                          iconImg: '/assets/images/landing-page/IC_NewGoldLoan.svg'
                        },
                      ].map((opt, idx) => (
                        <div 
                          key={idx}
                          onClick={() => {
                            if (opt.name === 'Loan Against Mutual Fund') {
                              router.push('/home/landingPage/lending/etb-lamfu/description');
                            } else if (opt.name === 'Personal Loan') {
                              router.push('/home/landingPage/etbPersonalLoan/description');
                            } else if (opt.name === 'Home Loan') {
                              router.push('/home/landingPage/lending/etb-home-loan/home-loan-steps');
                            } else if (opt.name === 'Education Loan') {
                              router.push('/home/landingPage/lending/etb-education-loan');
                            } else if (opt.name === 'Gold Loan') {
                              toast('Coming Soon', {
                                icon: 'ℹ️',
                                position: 'bottom-center',
                                style: {
                                  background: '#333333',
                                  color: '#ffffff',
                                  fontSize: '13px',
                                  fontWeight: 'bold',
                                  borderRadius: '8px',
                                  padding: '10px 18px',
                                },
                              });
                            } else {
                              toast.success(`Starting application for ${opt.name}...`);
                            }
                          }}
                          className="bg-white hover:bg-purple-50/20 border border-slate-200/80 rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:scale-[1.03] active:scale-[0.97] shadow-2xs h-28 w-full"
                        >
                          <div className="w-10 h-10 bg-transparent flex items-center justify-center rounded-full border border-slate-50 shrink-0 mb-2">
                            <img src={opt.iconImg} alt={opt.name} className="w-6.5 h-6.5 object-contain" />
                          </div>
                          <span className="text-[11.5px] font-bold text-slate-700 leading-tight font-sans">
                            {opt.name}
                          </span>
                        </div>
                      ))}

                      {/* Overdraft Against Deposit (Takes 2 Columns Span) */}
                      <div 
                        onClick={() => router.push('/home/landingPage/lending/etb-odad/odad-features')}
                        className="col-span-2 bg-white hover:bg-purple-50/20 border border-slate-200/80 rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] shadow-2xs h-28 w-full"
                      >
                        <div className="w-10 h-10 bg-transparent flex items-center justify-center rounded-full border border-slate-50 shrink-0 mb-2">
                          <svg className="w-6 h-6 text-[#702082]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="11" width="18" height="10" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 2a5 5 0 0 0-5 5v4h10V7a5 5 0 0 0-5-5z" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <span className="text-[11.5px] font-bold text-slate-700 leading-tight font-sans">
                          Overdraft Against Deposit
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              /* ================= ORIGINAL TABBED LOANS VIEW ================= */
              <div className="space-y-6">
                <div className="sbi-content-card min-h-[460px] p-8 flex items-center justify-center relative">
                  
                  {/* 2 Equal Columns Split by Vertical Dotted Border */}
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-6">
                    
                    {/* Left Column: Triangle Warning Pole & Cactus Vector Graphic */}
                    <div className="flex justify-center items-center">
                      <div className="w-64 h-64 relative flex items-center justify-center">
                        <svg viewBox="0 0 24 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                          {/* Soft Purple Mountain Hills in Background */}
                          <path d="M20 200 C60 170 110 185 160 200 Z" fill="#f5edfc" />
                          <path d="M100 200 C150 160 190 180 230 200 Z" fill="#eee3fa" />

                          {/* Base Ground */}
                          <line x1="10" y1="200" x2="230" y2="200" stroke="#d8c5f2" strokeWidth="2" strokeDasharray="4 4" />

                          {/* Pole */}
                          <line x1="110" y1="85" x2="110" y2="200" stroke="#702082" strokeWidth="3" strokeLinecap="round" />

                          {/* Triangle Warning Sign */}
                          <path 
                            d="M110 35 L145 90 L75 90 Z" 
                            fill="#ffffff" 
                            stroke="#702082" 
                            strokeWidth="5" 
                            strokeLinejoin="round" 
                          />
                          {/* Exclamation Mark inside Triangle */}
                          <path d="M110 52 L110 70" stroke="#702082" strokeWidth="4" strokeLinecap="round" />
                          <circle cx="110" cy="79" r="2.5" fill="#702082" />

                          {/* Cactus Plant Graphic at Bottom Left of Pole */}
                          <g transform="translate(85, 160)">
                            <rect x="12" y="10" width="8" height="30" rx="4" fill="#a855f7" fillOpacity="0.4" />
                            <path d="M6 18 C6 26 12 26 12 26" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" fill="none" />
                            <path d="M26 22 C26 30 20 30 20 30" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" fill="none" />
                          </g>
                        </svg>
                      </div>
                    </div>

                    {/* Vertical Dotted Border Divider (Visible on Desktop) */}
                    <div className="hidden md:block absolute left-1/2 top-12 bottom-12 border-r border-dashed border-gray-300 transform -translate-x-1/2 pointer-events-none"></div>

                    {/* Right Column: "No records found" Text */}
                    <div className="flex flex-col items-center justify-center text-center">
                      <p className="text-sm font-semibold text-gray-500 tracking-wide">
                        No records found
                      </p>
                    </div>

                  </div>

                </div>

                {/* Business Loan Banner */}
                <BusinessLoanBanner />
              </div>
            )
          )}

          {/* ========================================================================= */}
          {/* TAB 3: INVESTMENTS (EXACT MATCH TO SCREENSHOT 3) */}
          {/* ========================================================================= */}
          {activeTab === 'Investments' && (
            <div className="space-y-6">
              {showDematDetails ? (
                /* ----------------- DETAILED ONBOARDING PAGE (Screenshot 3 & 4) ----------------- */
                <div className="space-y-6">
                  {/* Page Title */}
                  <h1 className="text-[26px] font-bold text-[#702082] tracking-tight">
                    Demat & Trading Account
                  </h1>

                  {/* Main Container Card */}
                  <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-8 min-h-[480px]">
                    {/* Top Row: Steps on Left, Illustration + Button on Right */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-slate-100 pb-8 mb-6">
                      
                      {/* Left Column: Steps */}
                      <div className="lg:col-span-6 space-y-6">
                        <h2 className="text-xl font-bold text-[#702082] leading-tight mb-8">
                          Open your Demat Account with SBICAP Securities
                        </h2>

                        <div className="space-y-6 pl-1">
                          {/* Step 1 */}
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full border border-purple-100 bg-[#fcfaff] flex items-center justify-center shrink-0 shadow-2xs">
                              <Building2 size={20} className="text-[#702082]" />
                            </div>
                            <span className="text-[14px] font-semibold text-slate-700 ml-4">
                              Select bank account
                            </span>
                          </div>

                          {/* Step 2 */}
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full border border-purple-100 bg-[#fcfaff] flex items-center justify-center shrink-0 shadow-2xs">
                              <FileText size={20} className="text-[#702082]" />
                            </div>
                            <span className="text-[14px] font-semibold text-slate-700 ml-4">
                              Review and verify details
                            </span>
                          </div>

                          {/* Step 3 */}
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full border border-purple-100 bg-[#fcfaff] flex items-center justify-center shrink-0 shadow-2xs">
                              <ShieldCheck size={20} className="text-[#702082]" />
                            </div>
                            <span className="text-[14px] font-semibold text-slate-700 ml-4">
                              Seamless e-sign
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Graphic & Open Button */}
                      <div className="lg:col-span-6 flex flex-col items-center justify-center pt-4 lg:pt-0">
                        {/* Shield Illustration */}
                        <ShieldIllustration className="w-72 h-48 mb-4" />

                        {/* Open Button */}
                        <button
                          type="button"
                          onClick={() => setShowDisclaimer(true)}
                          className="w-full max-w-sm py-3 px-8 text-sm font-bold rounded-full bg-[#702082] text-white hover:bg-[#5c1a6b] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer mt-4"
                        >
                          Open Demat & Trading Account
                        </button>
                      </div>

                    </div>

                    {/* Features, Eligibility, Documents required, Tutorials Subtabs Block (Screenshot 4) */}
                    <div className="mt-8">
                      <div className="flex items-center gap-8 border-b border-slate-100 pb-2 mb-6">
                        {(['Features', 'Eligibility', 'Documents required', 'Tutorials'] as const).map((tab) => {
                          const isActive = detailsSubTab === tab;
                          return (
                            <button
                              key={tab}
                              type="button"
                              onClick={() => setDetailsSubTab(tab)}
                              className={`text-xs font-bold transition-all relative pb-2 ${
                                isActive ? 'text-[#702082]' : 'text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              <span>{tab}</span>
                              {isActive && (
                                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#702082] rounded-full" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Features Tab Content */}
                      {detailsSubTab === 'Features' ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          
                          {/* Feature Card 1 */}
                          <div className="bg-[#fcfaff] border border-[#702082]/10 rounded-xl p-5 shadow-2xs flex flex-col space-y-4 hover:shadow-xs transition-shadow">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#702082] shadow-3xs border border-[#702082]/5">
                              <FileText size={18} />
                            </div>
                            <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                              Zero account opening charges and no paperwork
                            </p>
                          </div>

                          {/* Feature Card 2 */}
                          <div className="bg-[#fcfaff] border border-[#702082]/10 rounded-xl p-5 shadow-2xs flex flex-col space-y-4 hover:shadow-xs transition-shadow">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#702082] shadow-3xs border border-[#702082]/5">
                              <ShieldCheck size={18} />
                            </div>
                            <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                              Zero maintenance charges for the first year
                            </p>
                          </div>

                          {/* Feature Card 3 */}
                          <div className="bg-[#fcfaff] border border-[#702082]/10 rounded-xl p-5 shadow-2xs flex flex-col space-y-4 hover:shadow-xs transition-shadow">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#702082] shadow-3xs border border-[#702082]/5">
                              <TrendingUp size={18} />
                            </div>
                            <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                              Track your investments easily on YONO and get e-statements instantly
                            </p>
                          </div>

                        </div>
                      ) : (
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 text-xs text-slate-500 font-semibold text-center">
                          Details for {detailsSubTab} will be available shortly.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* ----------------- STANDING MENU/GRID LAYOUT (Screenshot 1 & 2) ----------------- */
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Left Sub-Menu Column (3/12 width) */}
                  {activeTab !== 'Investments' && investmentSubTab !== 'Mutual Fund' && (
                    <div className="md:col-span-3 space-y-3">
                      {/* Search Input */}
                      <div className="sbi-search-card">
                        <Search size={16} className="text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search here..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="sbi-search-input"
                        />
                      </div>

                      {/* Vertical Menu Buttons */}
                      {(['Mutual Fund', 'Demat & Securities', 'PPF', 'NPS', 'IPO'] as const).map((subItem) => {
                        const isSelected = investmentSubTab === subItem;
                        return (
                          <button
                            key={subItem}
                            type="button"
                            onClick={() => setInvestmentSubTab(subItem)}
                            className={`sbi-inv-menu-btn select-none ${isSelected ? 'selected' : ''}`}
                          >
                            {subItem}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Right Main Content Column (Full width col-span-12 when in Investments mode) */}
                  <div className={activeTab === 'Investments' || investmentSubTab === 'Mutual Fund' ? 'col-span-12' : 'md:col-span-9'}>
                    <div className="sbi-content-card min-h-[460px] p-0 overflow-hidden relative flex flex-col">
                      
                      {/* Top Purple Tab Badge Header (Hidden in Investments mode) */}
                      {activeTab !== 'Investments' && investmentSubTab !== 'Mutual Fund' && (
                        <div className="sbi-inv-header-tag select-none">
                          {investmentSubTab === 'Demat & Securities' 
                            ? 'Manage Demat & Securities' 
                            : investmentSubTab === 'PPF' 
                              ? 'Public Provident Fund (PPF)' 
                              : investmentSubTab === 'NPS'
                                ? 'National Pension System (NPS)'
                                : investmentSubTab}
                        </div>
                      )}

                      {/* Content Selection check */}
                      {investmentSubTab === 'Demat & Securities' && (
                        /* Demat & Securities Landing View (Screenshot 1 & 2) */
                        <div className="p-8 flex-1 flex flex-col justify-between items-start text-left bg-white w-full h-full">
                          <h2 className="text-[20px] font-bold text-[#702082] tracking-tight mb-2 pl-4">
                            Open Demat & Trading Account
                          </h2>

                          {/* Centered Graphic and Callouts inside Card */}
                          <div className="w-full flex-1 flex flex-col items-center justify-center py-4">
                            <ShieldIllustration className="w-80 h-52 mb-4" />
                            <p className="text-xs text-slate-500 font-semibold mb-6">
                              Start investing today with SBI Securities!
                            </p>

                            <button
                              type="button"
                              onClick={() => setShowDematDetails(true)}
                              className="py-3 px-12 text-sm font-bold rounded-full bg-[#702082] text-white hover:bg-[#5c1a6b] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                            >
                              Get Started
                            </button>
                            <p className="text-xs text-slate-500 mt-4">Open a Demat & Securities account to trade stocks, mutual funds, and more with SBI Securities.</p>
                            <ul className="list-disc list-inside text-xs text-slate-500 mt-2">
                              <li>Seamless account opening</li>
                              <li>Access to research reports</li>
                              <li>Competitive brokerage rates</li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {investmentSubTab === 'PPF' && (
                        /* PPF View (Screenshot 1) */
                        <div className="p-8 flex-1 flex flex-col justify-between items-start text-left bg-white w-full h-full">
                          <h2 className="text-[20px] font-bold text-[#702082] tracking-tight mb-2 pl-4">
                            Open PPF Account
                          </h2>

                          {/* Centered Graphic and Callouts inside Card */}
                          <div className="w-full flex-1 flex flex-col items-center justify-center py-4">
                            {/* PPF SVG Onboarding Illustration */}
                            <div className="w-80 h-52 mb-4 relative flex items-center justify-center select-none">
                              <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                {/* Bank Building in background */}
                                <path d="M50 140 L270 140 M60 140 L60 85 M260 140 L260 85 M80 140 L80 85 M240 140 L240 85 M100 140 L100 85 M220 140 L220 85" stroke="#ebd6ea" strokeWidth="2.5" />
                                <path d="M50 85 L270 85 L160 40 Z" fill="#fcf3fb" stroke="#ebd6ea" strokeWidth="2.5" strokeLinejoin="round" />
                                <circle cx="160" cy="65" r="9" fill="#ffffff" stroke="#ebd6ea" strokeWidth="2" />
                                <rect x="50" y="140" width="220" height="8" fill="#eed8ea" />

                                {/* Base Ground Ellipse */}
                                <ellipse cx="160" cy="155" rx="120" ry="7" fill="#cbd5e1" opacity="0.4" />

                                {/* Piggy Bank on the left */}
                                <ellipse cx="90" cy="120" rx="22" ry="16" fill="#bfdbfe" />
                                <path d="M100 106 C105 106 109 110 109 114" stroke="#1e3a8a" strokeWidth="1.5" />
                                <rect x="74" y="132" width="6" height="8" rx="2" fill="#93c5fd" />
                                <rect x="100" y="132" width="6" height="8" rx="2" fill="#93c5fd" />
                                <circle cx="82" cy="115" r="1.5" fill="#1e3a8a" />
                                <text x="90" y="124" fontSize="10" fontWeight="bold" fill="#1e3a8a" textAnchor="middle">₹</text>

                                {/* Shield on the right */}
                                <path d="M210 105 C210 105 230 100 230 100 C230 100 250 105 250 105 C250 120 250 135 230 145 C210 135 210 120 210 105 Z" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
                                <text x="230" y="126" fontSize="10" fontWeight="bold" fill="#475569" textAnchor="middle">₹</text>

                                {/* Clipboard (Center) */}
                                <rect x="125" y="70" width="70" height="90" rx="6" fill="#ffffff" stroke="#302985" strokeWidth="3" />
                                <rect x="145" y="64" width="30" height="8" rx="3" fill="#302985" />
                                
                                {/* Onboard Profile avatar */}
                                <circle cx="160" cy="98" r="11" fill="#3b82f6" />
                                <circle cx="160" cy="95" r="4.5" fill="#ffffff" />
                                <path d="M152 106 C152 102 155 102 160 102 C165 102 168 102 168 106" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" />

                                {/* Checklist lines inside clipboard */}
                                <line x1="135" y1="118" x2="185" y2="118" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
                                <line x1="135" y1="126" x2="180" y2="126" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
                                <line x1="135" y1="134" x2="170" y2="134" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                                <line x1="135" y1="142" x2="160" y2="142" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />

                                {/* Check Badge */}
                                <circle cx="125" cy="72" r="9" fill="#ec4899" />
                                <path d="M121 72 L124 75 L129 70" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />

                                {/* Percentage Badge */}
                                <circle cx="185" cy="142" r="10" fill="#fce7f3" />
                                <text x="185" y="145" fontSize="10" fontWeight="bold" fill="#be185d" textAnchor="middle">%</text>
                              </svg>
                            </div>
                            <p className="text-xs text-slate-500 font-semibold mb-6">
                              Start saving for your future with SBI PPF!
                            </p>

                            <button
                              type="button"
                              onClick={() => toast.success("Opening PPF Account Form...")}
                              className="py-3 px-12 text-sm font-bold rounded-full bg-[#702082] text-white hover:bg-[#5c1a6b] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                            >
                              Get Started
                            </button>
                            {/* Additional content for longer page */}
                            <div className="mt-6 space-y-4">
                              <p className="text-sm text-slate-600">Public Provident Fund (PPF) offers a safe, government‑backed avenue for long‑term savings with tax benefits.</p>
                              <ul className="list-disc list-inside text-sm text-slate-600">
                                <li>Earn attractive interest rates, compounded annually.</li>
                                <li>Tax‑free interest and principal amount.</li>
                                <li>Lock‑in period of 15 years, with partial withdrawals allowed after 5 years.</li>
                              </ul>
                              <p className="text-sm text-slate-600">Start your PPF journey today and secure your financial future with a disciplined savings plan.</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {investmentSubTab === 'NPS' && (
                        /* NPS View (Exact Match to Image 2) */
                        <div className="p-8 flex-1 flex flex-col justify-between items-stretch text-left bg-white w-full h-full space-y-6 font-sans select-none">
                          
                          {/* Title and Contribution Option Box */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5 mb-1">
                            <h2 className="text-[26px] font-extrabold text-[#5b247c] tracking-tight">
                              NPS Account
                            </h2>
                            <button
                              type="button"
                              onClick={() => toast.success("Opening NPS Contribution Page...")}
                              className="flex items-center justify-between gap-4 border border-[#e2d5f0] bg-[#f5effa] hover:bg-[#ebdcf7] rounded-xl py-3 px-5 transition-all text-left max-w-xl cursor-pointer group shadow-2xs"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-lg bg-[#5b247c]/10 flex items-center justify-center text-[#5b247c] shrink-0">
                                  <svg className="w-4.5 h-4 text-[#5b247c]" viewBox="0 0 24 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="4" width="20" height="12" rx="2" />
                                    <circle cx="12" cy="10" r="2.5" strokeWidth="1.5" />
                                    <text x="12" y="12" fontSize="6.5" fontWeight="900" fill="currentColor" textAnchor="middle" stroke="none">₹</text>
                                  </svg>
                                </div>
                                <span className="text-[13.5px] font-bold text-[#5b247c] leading-tight">
                                  Make one time contribution to self/other NPS Accounts
                                </span>
                              </div>
                              <ChevronRight size={16} className="text-[#5b247c] stroke-[2.5px] shrink-0 ml-1" />
                            </button>
                          </div>

                          {/* 3 NPS Info cards in a row (Full Width 3 equal cols) */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {/* Card 1: Tax Savings */}
                            <div className="bg-gradient-to-r from-[#b5179e] via-[#8e1b8b] to-[#702082] text-white rounded-2xl p-5 flex items-center justify-between shadow-xs">
                              <div className="space-y-1 pr-2">
                                <h4 className="text-[15px] font-extrabold tracking-wide">Tax savings</h4>
                                <p className="text-[11px] text-purple-100/90 font-semibold leading-tight">Minimize taxes with smart investment</p>
                              </div>
                              <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-white font-extrabold text-xl select-none shadow-3xs">
                                %
                              </div>
                            </div>

                            {/* Card 2: Secured Retirements */}
                            <div className="bg-gradient-to-r from-[#5b247c] via-[#481c63] to-[#341147] text-white rounded-2xl p-5 flex items-center justify-between shadow-xs">
                              <div className="space-y-1 pr-2">
                                <h4 className="text-[15px] font-extrabold tracking-wide">Secured retirements</h4>
                                <p className="text-[11px] text-purple-100/90 font-semibold leading-tight">Plan carefully for a stable financial future</p>
                              </div>
                              <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-white shadow-3xs">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                            </div>

                            {/* Card 3: Wealth Creation */}
                            <div className="bg-gradient-to-r from-[#3a4484] via-[#2f376f] to-[#202651] text-white rounded-2xl p-5 flex items-center justify-between shadow-xs">
                              <div className="space-y-1 pr-2">
                                <h4 className="text-[15px] font-extrabold tracking-wide">Wealth creation</h4>
                                <p className="text-[11px] text-indigo-100/90 font-semibold leading-tight">Invest wisely to build long term prosperity</p>
                              </div>
                              <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-white shadow-3xs">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                              </div>
                            </div>
                          </div>

                          {/* Subtabs and features bullet list box */}
                          <div className="space-y-4 pt-2">
                            <div className="flex items-center gap-8 border-b border-slate-200/60 pb-2">
                              {(['Features', 'Eligibility', 'Calculator'] as const).map((tab) => {
                                const isActive = npsTab === tab;
                                return (
                                  <button
                                    key={tab}
                                    type="button"
                                    onClick={() => setNpsTab(tab)}
                                    className={`text-[13px] font-extrabold transition-all relative pb-2 cursor-pointer ${
                                      isActive ? 'text-[#5b247c]' : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                  >
                                    <span>{tab}</span>
                                    {isActive && (
                                      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#5b247c] rounded-full" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Subtabs text box (Full width matching Image 2) */}
                            {npsTab === 'Features' ? (
                              <div className="bg-[#f8f7fc] rounded-2xl p-6 border border-slate-200/60 text-[12.5px] text-[#334155] leading-relaxed space-y-4 relative font-medium shadow-3xs">
                                <div className="font-extrabold text-slate-800 text-[13.5px]">All Citizen Model</div>
                                <ul className="space-y-2 text-[12px] text-slate-700">
                                  <li className="list-disc pl-1 ml-4">
                                    National Pension System (NPS) is a voluntary retirement savings plan where you can define your contributions.
                                  </li>
                                  <li className="list-disc pl-1 ml-4">
                                    Regulated by the Pension Fund Regulatory and Development Authority (PFRDA).
                                  </li>
                                  <li className="list-disc pl-1 ml-4">
                                    Flexibility to select a Pension Fund Manager (PFM) of your choice and change PFM once every financial year.
                                  </li>
                                  <li className="list-disc pl-1 ml-4">
                                    Option to define your asset allocation and change it up to four times in a financial year.
                                  </li>
                                  <li className="list-disc pl-1 ml-4">
                                    Portable across jobs and geographies.
                                  </li>
                                  <li className="list-disc pl-1 ml-4">
                                    It offers two accounts: Tier-I and Tier-II with three investment options (Active, Auto & Balanced Life Cycle Funds). In active choice, the allocation is decided by the subscriber. In auto choice, subscribers are completely assisted in asset allocation decisions. Balanced Life cycle fund allows automatic rebalancing of the asset classes as per age and risk profile of the subscriber.
                                  </li>
                                </ul>
                                <div className="text-right pt-2">
                                  <button type="button" onClick={() => toast.success("Showing more features...")} className="text-[#5b247c] hover:underline font-bold text-[11.5px] inline-flex items-center gap-1 cursor-pointer">
                                    <span>View more</span>
                                    <span>v</span>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-[#f8f7fc] border border-slate-200/60 rounded-2xl p-6 text-xs text-slate-500 font-semibold text-center shadow-3xs">
                                NPS {npsTab} information will be available shortly.
                              </div>
                            )}
                          </div>

                          {/* Pre-existing checkbox declaration and Apply Now footer */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-slate-200/60 pt-5 mt-4">
                            <label className="flex items-center gap-2.5 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={npsCheck}
                                onChange={(e) => setNpsCheck(e.target.checked)}
                                className="rounded border-slate-300 text-[#5b247c] focus:ring-[#5b247c] w-4 h-4 cursor-pointer accent-[#5b247c]"
                              />
                              <span className="text-xs text-slate-700 font-medium">I do not hold any pre-existing account under NPS</span>
                            </label>

                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => toast.success("NPS account verification started")}
                                className="border border-[#5b247c] hover:bg-[#5b247c]/5 text-[#5b247c] px-6 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-3xs"
                              >
                                Add my NPS Account
                              </button>
                              <button
                                type="button"
                                disabled={!npsCheck}
                                onClick={() => toast.success("Opening NPS Onboarding Application Form...")}
                                className={`px-8 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                                  npsCheck 
                                    ? 'bg-[#5b247c] hover:bg-[#481c63] text-white cursor-pointer' 
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                              >
                                <span>Apply Now</span>
                                <ArrowRight size={13} />
                              </button>
                            </div>
                          </div>

                        </div>
                      )}

                      {investmentSubTab === 'IPO' && (
                        <div className="fixed inset-0 z-50 bg-[#f4f3f6] flex flex-col overflow-y-auto">
                          
                          {/* 1. Header Bar */}
                          <header className="bg-white border-b border-slate-200 flex items-stretch h-[75px] w-full shrink-0">
                            {/* SBI Logo */}
                            <div className="flex items-center px-8 bg-white border-r border-slate-100">
                              <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-full bg-[#00b0f0] flex items-center justify-center relative">
                                  <div className="w-3.5 h-3.5 rounded-full bg-white" />
                                  <div className="absolute bottom-0 left-[16.5px] w-1.5 h-3.5 bg-white" />
                                </div>
                                <span className="text-[30px] font-black text-[#1f70b8] tracking-tight font-sans">SBI</span>
                              </div>
                            </div>

                            {/* Purple Info Bar */}
                            <div className="flex-1 bg-[#1e144f] text-white flex items-center justify-between px-6 py-2 select-none">
                              <div>
                                <h1 className="text-[17px] font-bold tracking-wide font-sans">
                                  SBI IPO & Rights Issue Application Portal
                                </h1>
                              </div>
                              <div className="flex items-center gap-6">
                                <div className="text-right font-sans">
                                  <div className="text-[11px] text-[#ffd200] font-semibold">Welcome Mr. DUMPALA VISHNU VARDHAN</div>
                                  <div className="text-[10px] text-white/80 mt-0.5">Last Login: 31 Jul 2026 11:42:17</div>
                                </div>
                                
                                {/* Logout Button */}
                                <button 
                                  type="button" 
                                  onClick={() => {
                                    toast.success('Logged out from IPO Portal');
                                    setInvestmentSubTab('Mutual Fund');
                                  }}
                                  className="bg-[#ffd200] hover:bg-[#ebd01e] text-slate-900 font-bold px-5 h-[75px] flex items-center gap-2 -mr-6 transition-colors font-sans text-xs uppercase cursor-pointer"
                                >
                                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
                                  </svg>
                                  <span>Logout</span>
                                </button>
                              </div>
                            </div>
                          </header>

                          {/* 2. Menu Bar */}
                          <div className="bg-[#fcfbfd] border-b border-slate-200 py-3 px-8 flex items-center gap-6 text-[13.5px] font-semibold text-slate-700 shadow-xs select-none">
                            <button type="button" onClick={() => toast('Loading IPO applications...')} className="text-[#1e144f] hover:underline font-bold cursor-pointer">Apply IPO</button>
                            <span className="text-slate-300">|</span>
                            <button type="button" onClick={() => toast('Opening applications log...')} className="hover:text-[#1e144f] hover:underline cursor-pointer">View/Delete Applications</button>
                            <span className="text-slate-300">|</span>
                            <button type="button" onClick={() => toast('Opening FAQs...')} className="hover:text-[#1e144f] hover:underline cursor-pointer">FAQ's</button>
                            <span className="text-slate-300">|</span>
                            <button type="button" onClick={() => toast('Loading applicant details...')} className="hover:text-[#1e144f] hover:underline cursor-pointer">Manage IPO Applicant</button>
                            <span className="text-slate-300">|</span>
                            <button type="button" onClick={() => toast('Connecting to Support...')} className="hover:text-[#1e144f] hover:underline cursor-pointer">Customer Support</button>
                          </div>

                          {/* 3. Hero Banner Background */}
                          <div className="relative w-full h-[220px] bg-gradient-to-r from-[#442b78] via-[#351e60] to-[#1f0e3d] flex items-center justify-center overflow-hidden">
                            {/* Abstract coin-stack graphics overlay */}
                            <div className="absolute inset-0 pointer-events-none opacity-25 select-none z-0">
                              <svg className="w-full h-full" viewBox="0 0 1000 220" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                                {/* Coin Stacks & Blocks representation */}
                                <ellipse cx="380" cy="180" rx="35" ry="8" fill="#a78bfa" />
                                <ellipse cx="380" cy="172" rx="35" ry="8" fill="#c084fc" />
                                <ellipse cx="380" cy="164" rx="35" ry="8" fill="#d8b4fe" />

                                <ellipse cx="500" cy="190" rx="35" ry="8" fill="#a78bfa" />
                                <ellipse cx="500" cy="182" rx="35" ry="8" fill="#c084fc" />

                                <ellipse cx="620" cy="175" rx="35" ry="8" fill="#a78bfa" />
                                <ellipse cx="620" cy="167" rx="35" ry="8" fill="#c084fc" />
                                <ellipse cx="620" cy="159" rx="35" ry="8" fill="#d8b4fe" />
                                <ellipse cx="620" cy="151" rx="35" ry="8" fill="#f3e8ff" />

                                {/* Cube block outline */}
                                <rect x="345" y="100" width="70" height="40" rx="4" fill="#6d28d9" opacity="0.3" stroke="#d8b4fe" strokeWidth="1" />
                                <rect x="465" y="110" width="70" height="40" rx="4" fill="#6d28d9" opacity="0.3" stroke="#d8b4fe" strokeWidth="1" />
                                <rect x="585" y="95" width="70" height="40" rx="4" fill="#6d28d9" opacity="0.3" stroke="#d8b4fe" strokeWidth="1" />
                                
                                <text x="380" y="130" fontSize="24" fontWeight="black" fill="#ffffff" opacity="0.4" textAnchor="middle">I</text>
                                <text x="500" y="140" fontSize="24" fontWeight="black" fill="#ffffff" opacity="0.4" textAnchor="middle">P</text>
                                <text x="620" y="125" fontSize="24" fontWeight="black" fill="#ffffff" opacity="0.4" textAnchor="middle">O</text>
                              </svg>
                            </div>
                          </div>

                          {/* 4. Three Cards Grid Overlay */}
                          <div className="max-w-[1200px] w-full mx-auto px-6 -mt-[80px] pb-16 relative z-20 flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {/* Card 1: IPO (Equity) */}
                              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-8 text-center flex flex-col justify-between items-center min-h-[300px]">
                                <div className="space-y-4">
                                  {/* Custom growth chart + rupee coin icon */}
                                  <svg className="w-16 h-16 text-[#1e144f] mx-auto mb-2" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    {/* Banknotes outline */}
                                    <rect x="12" y="32" width="22" height="13" rx="1.5" />
                                    <circle cx="23" cy="38.5" r="2.5" />
                                    {/* Growth graph */}
                                    <path d="M44 14 H54 V24 M54 14 L34 34 L22 28 L10 38" strokeWidth="2.2" />
                                    {/* Rupee coin stacks at base */}
                                    <line x1="16" y1="45" x2="16" y2="50" />
                                    <line x1="30" y1="45" x2="30" y2="50" />
                                    <line x1="10" y1="50" x2="32" y2="50" />
                                  </svg>
                                  <h3 className="text-[17px] font-bold text-slate-800 tracking-wide font-sans">
                                    IPO (Equity)
                                  </h3>
                                </div>
                                <div className="w-full border-t border-slate-100 pt-6">
                                  <button 
                                    type="button" 
                                    onClick={() => toast.success("Loading Equity IPO Live Issues...")}
                                    className="text-[#0088cc] hover:text-[#006699] font-bold text-[14px] underline select-none cursor-pointer"
                                  >
                                    6 Live Issues
                                  </button>
                                </div>
                              </div>

                              {/* Card 2: IPO (Debt) */}
                              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-8 text-center flex flex-col justify-between items-center min-h-[300px]">
                                <div className="space-y-4">
                                  {/* Custom document with calculator & coins icon */}
                                  <svg className="w-16 h-16 text-[#1e144f] mx-auto mb-2" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    {/* Document */}
                                    <path d="M14 6 H38 L48 16 V54 H14 Z" />
                                    <line x1="38" y1="6" x2="38" y2="16" />
                                    <line x1="38" y1="16" x2="48" y2="16" />
                                    {/* Calculator outline */}
                                    <rect x="32" y="28" width="10" height="18" rx="1.5" />
                                    <circle cx="35" cy="32" r="1" fill="currentColor" stroke="none" />
                                    <circle cx="39" cy="32" r="1" fill="currentColor" stroke="none" />
                                    <line x1="34" y1="36" x2="40" y2="36" strokeWidth="1.5" />
                                    {/* Stack of coins */}
                                    <ellipse cx="22" cy="36" rx="4" ry="1.5" />
                                    <ellipse cx="22" cy="40" rx="4" ry="1.5" />
                                    <ellipse cx="22" cy="44" rx="4" ry="1.5" />
                                  </svg>
                                  <h3 className="text-[17px] font-bold text-slate-800 tracking-wide font-sans">
                                    IPO (Debt)
                                  </h3>
                                </div>
                                <div className="w-full border-t border-slate-100 pt-6">
                                  <p className="text-slate-500 font-semibold text-[13.5px] leading-tight select-none">
                                    Currently, no issue available for listing
                                  </p>
                                </div>
                              </div>

                              {/* Card 3: Rights Issue */}
                              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-8 text-center flex flex-col justify-between items-center min-h-[300px]">
                                <div className="space-y-4">
                                  {/* Custom document with chevrons and shield icon */}
                                  <svg className="w-16 h-16 text-[#1e144f] mx-auto mb-2" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    {/* Document */}
                                    <path d="M14 6 H38 L48 16 V54 H14 Z" />
                                    {/* Chevrons */}
                                    <path d="M26 22 L30 25 L34 22 M26 28 L30 31 L34 28" strokeWidth="2.2" />
                                    {/* Shield with Rupee */}
                                    <path d="M24 38 C24 38 30 36 30 36 C30 36 36 38 36 38 C36 43 36 47 30 51 C24 47 24 43 24 38 Z" fill="#f5f3ff" />
                                    <text x="30" y="45" fontSize="7" fontWeight="bold" fill="currentColor" textAnchor="middle" stroke="none">₹</text>
                                  </svg>
                                  <h3 className="text-[17px] font-bold text-slate-800 tracking-wide font-sans">
                                    Rights Issue
                                  </h3>
                                </div>
                                <div className="w-full border-t border-slate-100 pt-6">
                                  <button 
                                    type="button" 
                                    onClick={() => toast.success("Loading Rights Issue Live Issues...")}
                                    className="text-[#0088cc] hover:text-[#006699] font-bold text-[14px] underline select-none cursor-pointer"
                                  >
                                    4 Live Issues
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 5. Footer */}
                          <footer className="w-full bg-[#1e144f] text-white/90 text-xs py-3.5 px-8 flex justify-between items-center mt-auto shrink-0 select-none font-sans">
                            <span>© State Bank of India</span>
                            <a href="https://onlinesbi.sbi.bank.in" target="_blank" rel="noopener noreferrer" className="hover:underline">
                              Privacy Policy
                            </a>
                          </footer>

                          {/* Helper float overlay toggle button to quickly jump back to YONO portal */}
                          <button
                            type="button"
                            onClick={() => setInvestmentSubTab('Mutual Fund')}
                            className="fixed bottom-6 right-6 bg-[#702082] hover:bg-[#5c1a6b] text-white font-bold text-xs py-2.5 px-5 rounded-full shadow-lg z-50 flex items-center gap-1.5 transition-all select-none border border-white/20 cursor-pointer"
                          >
                            <span>← Back to YONO</span>
                          </button>
                          
                        </div>
                      )}

                      {investmentSubTab === 'Mutual Fund' && (
                        <div className="p-6 flex-1 flex flex-col bg-[#f1f5f9] text-left font-sans w-full">
                          
                            {/* 1. Mutual Funds Page Tab Navigation */}
                            {ideasDetail === null && viewingFundInfo === null && (
                              <div className="flex border-b border-slate-200 mb-6 bg-white rounded-t-xl overflow-hidden select-none w-full shadow-3xs">
                                {(['Home', 'Invest', 'Portfolio', 'Ideas', 'More'] as const).map((tab) => {
                                  const isActive = mfSubTab === tab;
                                  return (
                                    <button
                                      key={tab}
                                      type="button"
                                      onClick={() => { setMfSubTab(tab); setIdeasDetail(null); setViewingFundInfo(null); }}
                                      className={`font-sans font-bold text-[13px] flex-1 py-3 text-center relative transition-all ${
                                        isActive ? 'text-[#702082] bg-[#f5effa]/40 font-bold' : 'text-slate-500 hover:text-[#702082] hover:bg-slate-50/50'
                                      }`}
                                    >
                                      <span>{tab}</span>
                                      {isActive && (
                                        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#702082] rounded-t" />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                          {viewingFundInfo !== null ? (
                            /* Detailed Fund Info View */
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full text-left font-sans mt-2">
                              {/* Left Column - Fund Basic Info (lg:col-span-5) */}
                              <div className="lg:col-span-5 flex flex-col gap-6 items-stretch justify-start w-full">
                                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs text-left w-full space-y-5 flex flex-col">
                                  {/* Fund Name */}
                                  <div>
                                    <h2 className="font-extrabold text-[19px] text-[#302985] tracking-tight leading-snug">
                                      {viewingFundInfo.name}
                                    </h2>
                                    
                                    {/* Tags Row */}
                                    <div className="flex flex-wrap items-center gap-1.5 text-slate-500 font-semibold text-[11px] mt-2">
                                      <span>{viewingFundInfo.category || 'Hybrid'}</span>
                                      <span className="text-slate-300">|</span>
                                      <span>Long Term</span>
                                      <span className="text-slate-300">|</span>
                                      <span>Long-Term Capital Appreciation</span>
                                    </div>
                                  </div>

                                  {/* Wishlist Button */}
                                  <button 
                                    type="button" 
                                    onClick={() => toast.success(`Added ${viewingFundInfo.name} to wishlist!`)}
                                    className="border border-slate-300 hover:border-slate-400 rounded-full px-5 py-2 text-[12px] font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer self-start flex items-center gap-1.5 shadow-3xs"
                                  >
                                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    <span>Add to wishlist</span>
                                  </button>

                                  {/* Plan Selection dropdown box */}
                                  <div className="space-y-1">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Plan</span>
                                    <div className="border border-slate-200 bg-white rounded-xl p-3 px-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors w-full mt-1.5 shadow-3xs">
                                      <span className="text-[12.5px] font-bold text-slate-700 truncate max-w-[280px]">
                                        {viewingFundInfo.name} - Regular Plan - Growth
                                      </span>
                                      <ChevronDown size={15} className="text-slate-400 ml-2" />
                                    </div>
                                  </div>

                                  {/* Info boxes row (Risk, Min SIP, Min Invest) */}
                                  <div className="grid grid-cols-3 gap-2 w-full pt-1.5">
                                    {/* Risk Involved */}
                                    <div className="bg-[#f8fafc] border border-slate-200/40 rounded-xl p-3.5 flex flex-col justify-between text-left">
                                      <div className="flex items-center gap-1 mb-1.5">
                                        <span className="text-[9px] text-slate-400 font-bold uppercase leading-none">Risk Involved</span>
                                        <svg className="w-3 h-3 text-amber-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                        </svg>
                                      </div>
                                      <span className="text-[13px] font-extrabold text-slate-800 leading-snug">
                                        {viewingFundInfo.risk || 'Very High'}
                                      </span>
                                    </div>

                                    {/* Min. SIP */}
                                    <div className="bg-[#f8fafc] border border-slate-200/40 rounded-xl p-3.5 flex flex-col justify-between text-left">
                                      <span className="text-[9px] text-slate-400 font-bold uppercase leading-none mb-1.5">Min. SIP</span>
                                      <span className="text-[13px] font-extrabold text-slate-800 leading-snug">₹500</span>
                                    </div>

                                    {/* Min. Investment */}
                                    <div className="bg-[#f8fafc] border border-slate-200/40 rounded-xl p-3.5 flex flex-col justify-between text-left">
                                      <span className="text-[9px] text-slate-400 font-bold uppercase leading-none mb-1.5">Min. Investment</span>
                                      <span className="text-[13px] font-extrabold text-slate-800 leading-snug">
                                        {viewingFundInfo.minInvestment || '₹5,000'}
                                      </span>
                                    </div>
                                  </div>

                                  {/* NAV and CAGR Row */}
                                  <div className="bg-[#f8fafc] border border-slate-200/40 rounded-xl p-4.5 grid grid-cols-2 gap-4 w-full text-left">
                                    <div>
                                      <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider block">
                                        NAV (As on 31 Jul 2026)
                                      </span>
                                      <div className="flex items-center gap-2 mt-1.5">
                                        <span className="text-[16.5px] font-black text-slate-800 leading-none">
                                          ₹66.68
                                        </span>
                                        <span className="bg-green-50 text-green-600 px-1.5 py-0.5 rounded text-[10px] font-extrabold flex items-center gap-0.5 leading-none">
                                          <span>↑</span>
                                          <span>0.24%</span>
                                        </span>
                                      </div>
                                    </div>

                                    <div>
                                      <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider block">
                                        CAGR
                                      </span>
                                      <span className="text-[16.5px] font-black text-green-600 mt-1.5 block leading-none">
                                        {viewingFundInfo.cagr || '+12.18%'}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Invest Now Solid Button */}
                                  <button
                                    type="button"
                                    onClick={() => toast.success(`Invested successfully in ${viewingFundInfo.name}!`)}
                                    className="bg-[#702082] hover:bg-[#5c1a6b] text-white font-extrabold text-[14.5px] py-3.5 rounded-2xl w-full text-center shadow-md transition-all cursor-pointer mt-2"
                                  >
                                    Invest Now
                                  </button>
                                </div>
                              </div>

                              {/* Right Column - Chart and Details (lg:col-span-7) */}
                              <div className="lg:col-span-7 flex flex-col gap-6 items-stretch justify-start w-full">
                                {/* Interactive Returns Chart */}
                                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs w-full flex flex-col justify-between min-h-[300px]">
                                  {/* Chart SVG Canvas */}
                                  <div className="w-full flex-1 min-h-[190px] relative flex items-center justify-center">
                                    <svg className="w-full h-full" viewBox="0 0 540 180" fill="none">
                                      <defs>
                                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="0%" stopColor="#702082" stopOpacity="0.15" />
                                          <stop offset="100%" stopColor="#702082" stopOpacity="0" />
                                        </linearGradient>
                                      </defs>
                                      
                                      {/* Grid Lines */}
                                      <line x1="10" y1="30" x2="530" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                                      <line x1="10" y1="80" x2="530" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                                      <line x1="10" y1="130" x2="530" y2="130" stroke="#f1f5f9" strokeWidth="1" />

                                      {/* Chart Path */}
                                      {mfChartPeriod === 'MAX' && (
                                        <>
                                          <path d="M 10 120 C 60 100, 120 70, 180 90 C 240 110, 300 50, 360 60 C 420 70, 480 30, 540 20" stroke="#702082" strokeWidth="3" strokeLinecap="round" />
                                          <path d="M 10 120 C 60 100, 120 70, 180 90 C 240 110, 300 50, 360 60 C 420 70, 480 30, 540 20 L 540 180 L 10 180 Z" fill="url(#chartGrad)" />
                                        </>
                                      )}
                                      {mfChartPeriod !== 'MAX' && (
                                        <>
                                          <path d="M 10 110 C 100 130, 200 80, 300 90 C 400 100, 500 50, 540 40" stroke="#702082" strokeWidth="3" strokeLinecap="round" />
                                          <path d="M 10 110 C 100 130, 200 80, 300 90 C 400 100, 500 50, 540 40 L 540 180 L 10 180 Z" fill="url(#chartGrad)" />
                                        </>
                                      )}
                                    </svg>
                                  </div>

                                  {/* Period Selectors */}
                                  <div className="flex justify-end gap-1.5 select-none pt-4 border-t border-slate-100">
                                    {(['1M', '3M', '6M', '1Y', '5Y', 'MAX'] as const).map((period) => {
                                      const isAct = mfChartPeriod === period;
                                      return (
                                        <button
                                          key={period}
                                          type="button"
                                          onClick={() => setMfChartPeriod(period)}
                                          className={`px-4.5 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                                            isAct 
                                              ? 'bg-[#702082] text-white border border-transparent shadow-3xs' 
                                              : 'text-slate-500 hover:text-slate-800 border border-slate-100 bg-white hover:bg-slate-50'
                                          }`}
                                        >
                                          {period === 'MAX' ? 'Max' : period}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Accordions (Riskometer, Fund Manager, Fund Details) */}
                                <div className="space-y-4 w-full">
                                  
                                  {/* Accordion 1: Riskometer */}
                                  <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
                                    <div 
                                      onClick={() => setRiskometerOpen(!riskometerOpen)}
                                      className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors select-none"
                                    >
                                      <span className="font-extrabold text-[14.5px] text-slate-700">Riskometer</span>
                                      <ChevronDown size={16} className={`text-slate-400 transition-transform ${riskometerOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                    {riskometerOpen && (
                                      <div className="p-6 border-t border-slate-100 bg-slate-50/20 text-[12.5px] text-slate-500 leading-relaxed font-semibold">
                                        <div className="flex flex-col items-center gap-4">
                                          {/* Visual Risk Gauge representation */}
                                          <svg className="w-56 h-28" viewBox="0 0 200 100">
                                            <path d="M 20 90 A 80 80 0 0 1 180 90" fill="none" stroke="#e2e8f0" strokeWidth="18" strokeLinecap="round" />
                                            {/* Colored segments */}
                                            <path d="M 20 90 A 80 80 0 0 1 65 38" fill="none" stroke="#22c55e" strokeWidth="18" /> {/* Low */}
                                            <path d="M 65 38 A 80 80 0 0 1 135 38" fill="none" stroke="#eab308" strokeWidth="18" /> {/* Moderate */}
                                            <path d="M 135 38 A 80 80 0 0 1 180 90" fill="none" stroke="#ef4444" strokeWidth="18" /> {/* High */}
                                            {/* Arrow pointer targeting Very High (near right side) */}
                                            <path d="M 100 90 L 155 45" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
                                            <circle cx="100" cy="90" r="5" fill="#1e293b" />
                                          </svg>
                                          <div className="text-center">
                                            <span className="text-[13px] font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-full uppercase tracking-wider">
                                              Very High Risk
                                            </span>
                                            <p className="mt-2.5 max-w-sm text-slate-400 font-semibold leading-relaxed">
                                              Investors understand that their principal will be at very high risk in this fund allocation.
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Accordion 2: Fund Manager */}
                                  <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
                                    <div 
                                      onClick={() => setManagerOpen(!managerOpen)}
                                      className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors select-none"
                                    >
                                      <span className="font-extrabold text-[14.5px] text-slate-700">Fund Manager</span>
                                      <ChevronDown size={16} className={`text-slate-400 transition-transform ${managerOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                    {managerOpen && (
                                      <div className="p-6 border-t border-slate-100 bg-slate-50/20 text-[12.5px] text-slate-500 font-semibold leading-relaxed">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                          {[
                                            {
                                              name: 'Mr. Dinesh Balachandran',
                                              date: '12 February 2024',
                                              gender: 'male'
                                            },
                                            {
                                              name: 'Ms. Mansi Sajeja',
                                              date: '12 February 2024',
                                              gender: 'female'
                                            },
                                            {
                                              name: 'Ms. Vandna Soni',
                                              date: '12 February 2024',
                                              gender: 'female'
                                            }
                                          ].map((mgr, i) => (
                                            <div 
                                              key={i}
                                              className="bg-[#f5effa]/60 border border-purple-100/50 rounded-xl p-4.5 flex gap-3.5 items-center text-left"
                                            >
                                              {/* Avatar */}
                                              <div className="w-9 h-9 rounded-full bg-[#e8dbf2] text-[#702082] flex items-center justify-center shrink-0 border border-purple-200">
                                                {mgr.gender === 'male' ? (
                                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                  </svg>
                                                ) : (
                                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                  </svg>
                                                )}
                                              </div>

                                              <div className="flex-1 min-w-0">
                                                <h4 className="font-extrabold text-slate-800 text-[13.5px] truncate">
                                                  {mgr.name}
                                                </h4>
                                                <p className="text-slate-400 font-semibold text-[11px] mt-0.5 whitespace-nowrap">
                                                  Managing since {mgr.date}
                                                </p>
                                                
                                                <button
                                                  type="button"
                                                  onClick={() => toast.success(`Showing details of ${mgr.name}...`)}
                                                  className="text-[11.5px] font-extrabold text-[#702082] hover:underline flex items-center gap-0.5 mt-2.5 cursor-pointer"
                                                >
                                                  <span>View Details</span>
                                                  <ChevronRight size={11.5} className="text-[#702082]" />
                                                </button>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Accordion 3: Fund Details */}
                                  <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
                                    <div 
                                      onClick={() => setDetailsOpen(!detailsOpen)}
                                      className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors select-none"
                                    >
                                      <span className="font-extrabold text-[14.5px] text-slate-700">Fund Details</span>
                                      <ChevronDown size={16} className={`text-slate-400 transition-transform ${detailsOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                    {detailsOpen && (
                                      <div className="p-6 border-t border-slate-100 bg-slate-50/20 text-[12.5px] text-slate-500 font-semibold leading-relaxed">
                                        
                                        {/* Sub-tabs Row */}
                                        <div className="flex items-center gap-3 mb-6 select-none">
                                          <button
                                            type="button"
                                            onClick={() => setFundDetailsSubTab('Details')}
                                            className={`px-5 py-1.5 rounded-full text-[11.5px] font-bold transition-all shadow-3xs cursor-pointer ${
                                              fundDetailsSubTab === 'Details'
                                                ? 'bg-[#702082] text-white'
                                                : 'bg-[#f5effa]/85 text-[#702082] hover:bg-[#f5effa]'
                                            }`}
                                          >
                                            Details
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => setFundDetailsSubTab('Documents')}
                                            className={`px-5 py-1.5 rounded-full text-[11.5px] font-bold transition-all shadow-3xs cursor-pointer ${
                                              fundDetailsSubTab === 'Documents'
                                                ? 'bg-[#702082] text-white'
                                                : 'bg-[#f5effa]/85 text-[#702082] hover:bg-[#f5effa]'
                                            }`}
                                          >
                                            Documents
                                          </button>
                                        </div>

                                        {fundDetailsSubTab === 'Details' ? (
                                          <div className="grid grid-cols-2 gap-y-6 gap-x-6 text-left">
                                            <div>
                                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">AUM</span>
                                              <p className="text-slate-700 font-bold text-[13.5px] mt-0.5">₹17,397.93 Cr</p>
                                            </div>
                                            <div>
                                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Fund Category</span>
                                              <p className="text-slate-700 font-bold text-[13.5px] mt-0.5">Open Ended</p>
                                            </div>
                                            <div>
                                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Min SIP Amount</span>
                                              <p className="text-slate-700 font-bold text-[13.5px] mt-0.5">₹500</p>
                                            </div>
                                            <div>
                                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Min Lumpsum Amount</span>
                                              <p className="text-slate-700 font-bold text-[13.5px] mt-0.5">₹5,000</p>
                                            </div>
                                            <div>
                                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Benchmark</span>
                                              <p className="text-slate-700 font-bold text-[13.5px] mt-0.5 leading-snug">
                                                45% CRISIL 10 Year Gilt Index + 40% Nifty 50 + 15% Price of Gold
                                              </p>
                                            </div>
                                            <div>
                                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Fund Age</span>
                                              <p className="text-slate-700 font-bold text-[13.5px] mt-0.5">20 Years</p>
                                            </div>
                                          </div>
                                        ) : (
                                          /* Documents list tab */
                                          <div className="space-y-3.5 text-left">
                                            {[
                                              'Key Information Memorandum (KIM)',
                                              'Scheme Information Document (SID)',
                                              'Factsheet - July 2026',
                                              'Common Application Form'
                                            ].map((doc, idx) => (
                                              <div 
                                                key={idx}
                                                onClick={() => toast.success(`Downloading ${doc}...`)}
                                                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-[#f5effa]/30 hover:border-purple-100 transition-all cursor-pointer shadow-3xs"
                                              >
                                                <div className="flex items-center gap-3">
                                                  <svg className="w-5 h-5 text-red-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                    <polyline points="14 2 14 8 20 8" />
                                                    <line x1="16" y1="13" x2="8" y2="13" />
                                                    <line x1="16" y1="17" x2="8" y2="17" />
                                                    <polyline points="10 9 9 9 8 9" />
                                                  </svg>
                                                  <span className="text-slate-700 font-bold text-[12.5px]">{doc}</span>
                                                </div>
                                                <svg className="w-4.5 h-4.5 text-[#702082]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                  <polyline points="7 10 12 15 17 10" />
                                                  <line x1="12" y1="15" x2="12" y2="3" />
                                                </svg>
                                              </div>
                                            ))}
                                          </div>
                                        )}

                                      </div>
                                    )}
                                  </div>

                                  {/* Accordion 4: Exit Load */}
                                  <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
                                    <div 
                                      onClick={() => setExitLoadOpen(!exitLoadOpen)}
                                      className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors select-none"
                                    >
                                      <span className="font-extrabold text-[14.5px] text-slate-700">Exit Load</span>
                                      <ChevronDown size={16} className={`text-slate-400 transition-transform ${exitLoadOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                    {exitLoadOpen && (
                                      <div className="p-6 border-t border-slate-100 bg-slate-50/20 text-[12px] text-slate-500 font-semibold leading-relaxed text-left space-y-4">
                                        <p className="leading-relaxed">
                                          For units allotted upto 28th Sep 2023 - Nil till 30th Oct 2023
                                        </p>
                                        <p className="leading-relaxed">
                                          For units allotted from 29th Sep 2023 - For exit within 12 months from the date of allotment - For 10% of investments - NIL, For remaining investments - 1%; For exit after 12 months from the date of allotment - NIL
                                        </p>
                                        <p className="leading-relaxed">
                                          From 31st Oct 2023 for all units - For exit within 12 months from the date of allotment - For 10% of investments - NIL, For remaining investments - 1%; For exit after 12 months from the date of allotment - NIL
                                        </p>
                                      </div>
                                    )}
                                  </div>

                                  {/* Accordion 5: Expense Ratio & Tax */}
                                  <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
                                    <div 
                                      onClick={() => setExpenseTaxOpen(!expenseTaxOpen)}
                                      className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors select-none"
                                    >
                                      <span className="font-extrabold text-[14.5px] text-slate-700">Expense Ratio & Tax</span>
                                      <ChevronDown size={16} className={`text-slate-400 transition-transform ${expenseTaxOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                    {expenseTaxOpen && (
                                      <div className="p-6 border-t border-slate-100 bg-slate-50/20 text-[12.5px] text-slate-500 font-semibold leading-relaxed text-left flex flex-col">
                                        <div className="flex items-center gap-3 select-none">
                                          <span className="text-[20px] font-black text-slate-800 tracking-tight leading-none">1.46%</span>
                                          <span className="text-slate-400 text-[11.5px] font-bold">Expense Ratio (as on 31 July, 2026)</span>
                                        </div>
                                        
                                        <div className="bg-[#f5effa]/50 border border-[#702082]/15 text-[#702082] rounded-xl p-3 px-4.5 flex items-center gap-2.5 mt-4 text-[12px] font-bold shadow-3xs">
                                          <svg className="w-4 h-4 text-[#702082] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="12" y1="16" x2="12" y2="12" />
                                            <line x1="12" y1="9" x2="12.01" y2="9" />
                                          </svg>
                                          <span>All expenses are inclusive of GST on management fees</span>
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Accordion 6: Holdings */}
                                  <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
                                    <div 
                                      onClick={() => setHoldingsOpen(!holdingsOpen)}
                                      className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors select-none"
                                    >
                                      <span className="font-extrabold text-[14.5px] text-slate-700">Holdings</span>
                                      <ChevronDown size={16} className={`text-slate-400 transition-transform ${holdingsOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                    {holdingsOpen && (
                                      <div className="p-6 border-t border-slate-100 bg-slate-50/20 text-[12.5px] text-slate-500 font-semibold leading-relaxed text-left flex flex-col items-center">
                                        {/* Sub-tabs Row */}
                                        <div className="flex items-center gap-3 mb-6 select-none self-center">
                                          <button
                                            type="button"
                                            onClick={() => setHoldingsSubTab('Stocks')}
                                            className={`px-6 py-1.5 rounded-full text-[11.5px] font-bold transition-all shadow-3xs cursor-pointer ${
                                              holdingsSubTab === 'Stocks'
                                                ? 'bg-[#702082] text-white'
                                                : 'bg-[#f5effa]/85 text-[#702082] hover:bg-[#f5effa]'
                                            }`}
                                          >
                                            Stocks
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => setHoldingsSubTab('Sector Wise')}
                                            className={`px-6 py-1.5 rounded-full text-[11.5px] font-bold transition-all shadow-3xs cursor-pointer ${
                                              holdingsSubTab === 'Sector Wise'
                                                ? 'bg-[#702082] text-white'
                                                : 'bg-[#f5effa]/85 text-[#702082] hover:bg-[#f5effa]'
                                            }`}
                                          >
                                            Sector Wise
                                          </button>
                                        </div>

                                        {holdingsSubTab === 'Stocks' ? (
                                          <div className="space-y-2.5 w-full">
                                            <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                                              <span className="text-slate-700 font-bold">Government of India Securities</span>
                                              <span className="text-slate-900 font-black">22.4%</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                                              <span className="text-slate-700 font-bold">HDFC Bank Ltd.</span>
                                              <span className="text-slate-900 font-black">8.5%</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                                              <span className="text-slate-700 font-bold">ICICI Bank Ltd.</span>
                                              <span className="text-slate-900 font-black">7.2%</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                                              <span className="text-slate-700 font-bold">Reliance Industries Ltd.</span>
                                              <span className="text-slate-900 font-black">6.8%</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                              <span className="text-slate-700 font-bold">Gold ETF</span>
                                              <span className="text-slate-900 font-black">5.5%</span>
                                            </div>
                                          </div>
                                        ) : (
                                          /* Sector Wise Donut Chart */
                                          <div className="flex flex-col md:flex-row items-center gap-8 justify-center w-full mt-4">
                                            {/* Donut Chart SVG */}
                                            <div className="relative w-48 h-48 shrink-0">
                                              <svg className="w-full h-full" viewBox="0 0 200 200">
                                                {/* Background track circle */}
                                                <circle cx="100" cy="100" r="70" stroke="#cbd5e1" strokeWidth="18" fill="none" opacity="0.15" />
                                                
                                                {/* Blue segment (34.52%) -> stroke-dasharray: 439.8 -> 34.52% = 151.8 */}
                                                <circle cx="100" cy="100" r="70" stroke="#00b0f0" strokeWidth="18" strokeDasharray="151.8 439.8" strokeDashoffset="0" fill="none" transform="rotate(-90 100 100)" />
                                                
                                                {/* Green segment (10.28%) -> 10.28% = 45.2 */}
                                                <circle cx="100" cy="100" r="70" stroke="#22c55e" strokeWidth="18" strokeDasharray="45.2 439.8" strokeDashoffset="-151.8" fill="none" transform="rotate(-90 100 100)" />
                                                
                                                {/* Yellow segment (5.89%) -> 5.89% = 25.9 */}
                                                <circle cx="100" cy="100" r="70" stroke="#eab308" strokeWidth="18" strokeDasharray="25.9 439.8" strokeDashoffset="-197.0" fill="none" transform="rotate(-90 100 100)" />
                                                
                                                {/* Dark Blue segment (5.71%) -> 5.71% = 25.1 */}
                                                <circle cx="100" cy="100" r="70" stroke="#1e3a8a" strokeWidth="18" strokeDasharray="25.1 439.8" strokeDashoffset="-222.9" fill="none" transform="rotate(-90 100 100)" />
                                                
                                                {/* Red segment (5.13%) -> 5.13% = 22.6 */}
                                                <circle cx="100" cy="100" r="70" stroke="#ef4444" strokeWidth="18" strokeDasharray="22.6 439.8" strokeDashoffset="-248.0" fill="none" transform="rotate(-90 100 100)" />
                                                
                                                {/* Orange segment (38.47%) -> 38.47% = 169.2 */}
                                                <circle cx="100" cy="100" r="70" stroke="#f97316" strokeWidth="18" strokeDasharray="169.2 439.8" strokeDashoffset="-270.6" fill="none" transform="rotate(-90 100 100)" />

                                                {/* Pointers & Labels inside SVG */}
                                                {/* Blue segment pointer (right side) */}
                                                <path d="M 148 55 L 175 45 L 188 45" stroke="#00b0f0" strokeWidth="1" fill="none" />
                                                <text x="191" y="48" fontSize="8.5" fontWeight="bold" fill="#64748b" textAnchor="start">34.52%</text>

                                                {/* Green segment pointer (bottom right) */}
                                                <path d="M 148 150 L 165 170 L 180 170" stroke="#22c55e" strokeWidth="1" fill="none" />
                                                <text x="183" y="173" fontSize="8.5" fontWeight="bold" fill="#64748b" textAnchor="start">10.28%</text>

                                                {/* Yellow segment pointer (bottom middle) */}
                                                <path d="M 120 168 L 125 185 L 140 185" stroke="#eab308" strokeWidth="1" fill="none" />
                                                <text x="143" y="188" fontSize="8.5" fontWeight="bold" fill="#64748b" textAnchor="start">5.89%</text>

                                                {/* Dark Blue segment pointer (bottom left) */}
                                                <path d="M 90 168 L 85 185 L 70 185" stroke="#1e3a8a" strokeWidth="1" fill="none" />
                                                <text x="67" y="188" fontSize="8.5" fontWeight="bold" fill="#64748b" textAnchor="end">5.71%</text>

                                                {/* Red segment pointer (left bottom) */}
                                                <path d="M 52 145 L 35 165 L 20 165" stroke="#ef4444" strokeWidth="1" fill="none" />
                                                <text x="17" y="168" fontSize="8.5" fontWeight="bold" fill="#64748b" textAnchor="end">5.13%</text>

                                                {/* Orange segment pointer (left middle/top) */}
                                                <path d="M 45 80 L 15 80" stroke="#f97316" strokeWidth="1" />
                                                <text x="12" y="83" fontSize="8.5" fontWeight="bold" fill="#64748b" textAnchor="end">38.47%</text>
                                              </svg>
                                            </div>

                                            {/* Legend on the Right */}
                                            <div className="flex-1 space-y-2 text-[12px] font-bold text-slate-700 w-full md:w-auto">
                                              {[
                                                { label: 'Fin Services', pct: '34.52%', color: 'bg-[#00b0f0]' },
                                                { label: 'Mutual Funds', pct: '10.28%', color: 'bg-[#22c55e]' },
                                                { label: 'Oil & Gas', pct: '5.89%', color: 'bg-[#eab308]' },
                                                { label: 'Power', pct: '5.71%', color: 'bg-[#1e3a8a]' },
                                                { label: 'Healthcare', pct: '5.13%', color: 'bg-[#ef4444]' },
                                                { label: 'Others', pct: '38.47%', color: 'bg-[#f97316]' }
                                              ].map((item, idx) => (
                                                <div key={idx} className="flex items-center justify-between gap-6 border-b border-slate-50 pb-1 w-full md:min-w-[150px]">
                                                  <div className="flex items-center gap-2">
                                                    <div className={`w-2.5 h-2.5 rounded-full ${item.color} shrink-0`}></div>
                                                    <span>{item.label}</span>
                                                  </div>
                                                  <span className="text-slate-400 font-extrabold">{item.pct}</span>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>

                                  {/* Accordion 7: Similar Funds */}
                                  <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
                                    <div 
                                      onClick={() => setSimilarFundsOpen(!similarFundsOpen)}
                                      className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors select-none"
                                    >
                                      <span className="font-extrabold text-[14.5px] text-slate-700">Similar Funds</span>
                                      <ChevronDown size={16} className={`text-slate-400 transition-transform ${similarFundsOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                    {similarFundsOpen && (
                                      <div className="p-6 border-t border-slate-100 bg-slate-50/20 text-[12.5px] text-slate-500 font-semibold leading-relaxed text-left flex flex-col">
                                        {/* Slider Cards Container */}
                                        <div className="flex gap-4 items-stretch overflow-hidden select-none">
                                          {[
                                            { name: 'SBI Equity Hybrid Fund', category: 'Hybrid', min: '₹1,000', cagr: '14.90%', desc: '100k+ invested in last 3 months' },
                                            { name: 'SBI Multi Asset Allocation Fund', category: 'Hybrid', min: '₹5,000', cagr: '12.18%', desc: '100k+ invested in last 3 months' },
                                            { name: 'SBI Contra Fund', category: 'Equity', min: '₹5,000', cagr: '18.33%', desc: '80k+ invested in last 3 months' },
                                            { name: 'SBI Balanced Advantage Fund', category: 'Hybrid', min: '₹5,000', cagr: '9.98%', desc: '120k+ invested in last 3 months' }
                                          ].slice(similarCarouselIndex, similarCarouselIndex + 2).map((sim, i) => (
                                            <div 
                                              key={i} 
                                              onClick={() => {
                                                // Redirect to the clicked fund info details page
                                                setViewingFundInfo({
                                                  name: sim.name,
                                                  category: sim.category,
                                                  cagr: sim.cagr,
                                                  minSip: '₹500',
                                                  minInvestment: sim.min,
                                                  risk: 'Very High'
                                                });
                                              }}
                                              className="border border-slate-200/90 rounded-2xl p-4.5 bg-white text-left w-[50%] shrink-0 shadow-2xs hover:border-[#702082]/30 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
                                            >
                                              <div>
                                                {/* Header row: title, category and invest now */}
                                                <div className="flex justify-between items-start gap-2">
                                                  <div className="flex gap-2 items-start">
                                                    <div className="w-6.5 h-6.5 rounded-full bg-[#f5effa] text-[#702082] flex items-center justify-center shrink-0 border border-purple-100 mt-0.5">
                                                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                      </svg>
                                                    </div>
                                                    <div>
                                                      <h4 className="font-extrabold text-slate-800 text-[13px] leading-tight line-clamp-1">
                                                        {sim.name.length > 22 ? sim.name.slice(0, 20) + '...' : sim.name}
                                                      </h4>
                                                      <span className="text-[10.5px] text-slate-400 font-bold mt-0.5 block">{sim.category}</span>
                                                    </div>
                                                  </div>
                                                  
                                                  <button 
                                                    type="button"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      toast.success(`Redirecting to invest in ${sim.name}...`);
                                                    }}
                                                    className="text-[#702082] font-black text-[11.5px] hover:underline whitespace-nowrap"
                                                  >
                                                    Invest Now
                                                  </button>
                                                </div>

                                                {/* Inner values sub-box */}
                                                <div className="bg-[#f5effa]/30 border border-slate-100 p-3 rounded-xl flex items-center justify-between mt-3 w-full shadow-3xs">
                                                  <div>
                                                    <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider block">Min. Investment</span>
                                                    <span className="text-[#702082] font-black text-[13px] mt-0.5 block">{sim.min}</span>
                                                  </div>
                                                  <div className="text-right">
                                                    <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider block">Returns *</span>
                                                    <span className="text-green-600 font-black text-[13px] mt-0.5 block">{sim.cagr}</span>
                                                  </div>
                                                </div>
                                              </div>

                                              {/* Trend bottom text */}
                                              <div className="flex items-center gap-1.5 mt-3 text-[10.5px] font-bold text-slate-400 select-none">
                                                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                                </svg>
                                                <span>{sim.desc}</span>
                                              </div>

                                            </div>
                                          ))}
                                        </div>

                                        {/* Slider controls row */}
                                        <div className="flex items-center gap-2 mt-4 select-none justify-start">
                                          <button
                                            type="button"
                                            disabled={similarCarouselIndex === 0}
                                            onClick={() => setSimilarCarouselIndex(similarCarouselIndex - 1)}
                                            className="w-7 h-7 rounded-full border border-slate-200 text-slate-400 hover:text-[#702082] hover:border-purple-200 flex items-center justify-center transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-white shadow-3xs"
                                          >
                                            <ChevronLeft size={14} strokeWidth={2.5} />
                                          </button>
                                          <button
                                            type="button"
                                            disabled={similarCarouselIndex >= 2}
                                            onClick={() => setSimilarCarouselIndex(similarCarouselIndex + 1)}
                                            className="w-7 h-7 rounded-full border border-slate-200 text-slate-400 hover:text-[#702082] hover:border-purple-200 flex items-center justify-center transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-white shadow-3xs"
                                          >
                                            <ChevronRight size={14} strokeWidth={2.5} />
                                          </button>
                                        </div>

                                      </div>
                                    )}
                                  </div>

                                  {/* Disclaimer text */}
                                  <div className="text-[11.5px] text-slate-400 font-semibold select-none pt-2 text-left">
                                    Disclaimer: Data shown is as of 31 Jul 2026
                                  </div>

                                </div>
                              </div>
                            </div>
                          ) : mfSubTab === 'Home' ? (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
                              
                              {/* Left Column: Carousel & SIP Returns Calculator (lg:col-span-4) */}
                              <div className="lg:col-span-4 space-y-6 flex flex-col items-stretch justify-start w-full">
                                
                                {/* Carousel Card */}
                                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between min-h-[340px] w-full self-stretch">
                                  {/* Title */}
                                  <div className="p-4 pb-0 text-[13px] font-bold text-slate-700 font-sans">
                                    Build wealth with ease with SBI Mutual Funds
                                  </div>

                                  {/* Carousel Contents */}
                                  <div className="flex-1 flex flex-col justify-between relative select-none">
                                    
                                    <div className="w-full flex-1 relative min-h-[250px] bg-slate-50 flex items-center justify-center overflow-hidden">
                                      {mfCarouselIndex === 0 && (
                                        <img 
                                          src="https://cdn.onlineyono.sbi.bank.in//documents/d/sbi-yono-2.0/nfo-banner-1" 
                                          alt="Did you start an SIP?" 
                                          className="w-full h-full object-cover"
                                        />
                                      )}
                                      {mfCarouselIndex === 1 && (
                                        <img 
                                          src="https://cdn.onlineyono.sbi.bank.in//documents/d/sbi-yono-2.0/sip-banner" 
                                          alt="Make Salary Day Your SIP Day" 
                                          className="w-full h-full object-cover"
                                        />
                                      )}
                                      {mfCarouselIndex === 2 && (
                                        <img 
                                          src="https://cdn.onlineyono.sbi.bank.in//documents/d/sbi-yono-2.0/make-salary-day-your-sip-day-english" 
                                          alt="Jan Nivesh SIP" 
                                          className="w-full h-full object-cover"
                                        />
                                      )}
                                      {mfCarouselIndex === 3 && (
                                        <img 
                                          src="https://cdn.onlineyono.sbi.bank.in//documents/d/sbi-yono-2.0/tax-saving-made-easy-english" 
                                          alt="Tax Saving Made Easy" 
                                          className="w-full h-full object-cover"
                                        />
                                      )}
                                      {mfCarouselIndex === 4 && (
                                        <img 
                                          src="https://cdn.onlineyono.sbi.bank.in//documents/d/sbi-yono-2.0/create-folio-banner" 
                                          alt="Create Folio Banner" 
                                          className="w-full h-full object-cover"
                                        />
                                      )}
                                    </div>

                                    {/* Indicators (Dots) */}
                                    <div className="py-3 flex justify-center gap-1.5 bg-white border-t border-slate-100 select-none w-full">
                                      {[0, 1, 2, 3, 4].map((idx) => (
                                        <button
                                          key={idx}
                                          type="button"
                                          onClick={() => setMfCarouselIndex(idx)}
                                          className={`w-2 h-2 rounded-full transition-all ${
                                            mfCarouselIndex === idx ? 'bg-[#702082] w-4' : 'bg-slate-300 hover:bg-slate-400'
                                          }`}
                                          aria-label={`Go to slide ${idx + 1}`}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                {/* Jan Nivesh SIP Static Banner */}
                                <div 
                                  onClick={() => toast.success("Navigating to JanNivesh...")}
                                  className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col w-full self-stretch select-none pointer cursor-pointer hover:shadow-md transition-shadow"
                                >
                                  <img 
                                    src="https://cdn.onlineyono.sbi.bank.in//documents/d/sbi-yono-2.0/Jannivesh-Banner_svg" 
                                    alt="Jan Nivesh SIP Banner" 
                                    className="w-full h-auto object-cover"
                                  />
                                </div>

                                {/* Returns on Mutual Fund SIP Card */}
                                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4 text-left flex flex-col items-start justify-start w-full self-stretch">
                                  {/* Badge label */}
                                  <div className="select-none self-start">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#edfbf0] text-[#166534] border border-[#dcfce7] text-xs font-bold font-sans">
                                      <Star size={11} className="fill-[#166534] text-[#166534]" />
                                      Returns on Mutual Fund SIP
                                    </span>
                                  </div>

                                  {/* Calculator text */}
                                  <div className="text-slate-700 text-sm font-semibold leading-relaxed font-sans self-start text-left">
                                    SIP of <span className="font-bold text-[#1e293b]">₹10,000/month</span> for <span className="font-bold text-[#1e293b]">20 years</span> at <span className="font-bold text-[#1e293b]">12% per annum</span>
                                  </div>

                                  {/* Highlighted Flag Badge */}
                                  <div className="flex justify-start items-center w-full self-start select-none">
                                    <div className="flex items-center gap-2">
                                      <span className="text-slate-700 text-[13px] font-bold font-sans">Returns</span>
                                      <div className="relative bg-[#16a34a] text-white text-[13px] font-bold px-4 py-1 rounded-l font-sans">
                                        ₹1 Crore
                                        {/* Triangle Flag tip shape on right side */}
                                        <div className="absolute left-full top-0 w-0 h-0 border-y-[13px] border-y-transparent border-l-[8px] border-l-[#16a34a]"></div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Area chart representation using official SVG */}
                                  <div className="pt-2 w-full self-stretch flex items-center justify-center">
                                    <img 
                                      src="https://cdn.onlineyono.sbi.bank.in/documents/d/sbi-yono-2.0/sipchart_svg" 
                                      alt="SIP Growth Chart" 
                                      className="w-full h-auto object-contain max-h-[105px]"
                                    />
                                  </div>
                                </div>

                                {/* Goals Card */}
                                <div 
                                  className="relative rounded-2xl p-5 text-left flex flex-col justify-between overflow-hidden min-h-[140px] w-full select-none shadow-sm border border-slate-100"
                                  style={{
                                    backgroundImage: `url('https://cdn.onlineyono.sbi.bank.in/documents/d/sbi-yono-2.0/goals_svg')`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                  }}
                                >
                                  <div className="font-extrabold text-[15px] text-slate-800 font-sans leading-snug max-w-[80%]">
                                    Start investing and achieve your goals faster!
                                  </div>
                                  <button 
                                    type="button"
                                    onClick={() => toast.success("Opening SIP Calculator...")}
                                    className="text-[12px] font-black text-[#702082] hover:underline font-sans cursor-pointer mt-4 flex items-center gap-1 self-start"
                                  >
                                    Calculate SIP Today 
                                    <svg className="w-3.5 h-3.5 text-[#702082]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                  </button>
                                </div>

                              </div>

                              {/* Right Column: Trending Funds list (lg:col-span-8) */}
                              <div className="lg:col-span-8 space-y-6 w-full">
                                
                                {/* Section Title */}
                                <div className="flex items-center justify-between select-none">
                                  <h2 className="text-[18px] font-extrabold text-[#302985] font-sans">
                                    Trending Funds
                                  </h2>
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#f5effa] text-[#702082] text-[10px] font-bold font-sans select-none border border-[#eadafb]/30 shadow-3xs">
                                    ★ CAGR since inception
                                  </span>
                                </div>

                                {/* Trending Funds Cards Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full items-stretch">
                                  
                                  {/* Fund 1: SBI Contra Fund */}
                                  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4 text-left flex flex-col justify-between w-full h-full hover:shadow-md transition-shadow">
                                    <div className="space-y-4 w-full">
                                      <div className="flex items-start justify-between w-full">
                                        <div className="flex items-center gap-3">
                                          <div className="w-9 h-9 rounded-full bg-[#f5effa] text-[#702082] flex items-center justify-center shrink-0">
                                            <Star size={16} className="fill-[#702082] text-[#702082]" />
                                          </div>
                                          <div>
                                            <h3 className="font-bold text-[14px] text-slate-800 font-sans">
                                              SBI Contra Fund
                                            </h3>
                                            <span className="text-[10px] text-slate-400 font-medium font-sans uppercase">
                                              Equity
                                            </span>
                                          </div>
                                        </div>
                                        <button 
                                          type="button"
                                          onClick={() => toast.success("Navigating to SBI Contra Fund...")}
                                          className="text-[12px] font-extrabold text-[#702082] hover:underline font-sans cursor-pointer"
                                        >
                                          Invest Now
                                        </button>
                                      </div>

                                      {/* Info box */}
                                      <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-4 grid grid-cols-2 gap-4 w-full">
                                        <div>
                                          <div className="text-[9px] text-slate-400 font-bold uppercase font-sans tracking-wider">
                                            Min. Investment
                                          </div>
                                          <div className="text-[15px] font-extrabold text-slate-800 mt-1 font-sans">
                                            ₹5,000
                                          </div>
                                        </div>
                                        <div>
                                          <div className="text-[9px] text-slate-400 font-bold uppercase font-sans tracking-wider">
                                            Returns <span className="text-[#702082] font-extrabold">★</span>
                                          </div>
                                          <div className="text-[15px] font-extrabold text-green-600 mt-1 font-sans">
                                            18.33%
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 pl-0.5 font-sans select-none mt-2">
                                      <svg className="w-4 h-3.5 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                        <path d="M3 12c3-4 6-4 9 0s6 4 9 0" />
                                      </svg>
                                      <span>100k+ invested in last 3 months</span>
                                    </div>
                                  </div>

                                  {/* Fund 2: SBI Equity Hybrid Fund */}
                                  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4 text-left flex flex-col justify-between w-full h-full hover:shadow-md transition-shadow">
                                    <div className="space-y-4 w-full">
                                      <div className="flex items-start justify-between w-full">
                                        <div className="flex items-center gap-3">
                                          <div className="w-9 h-9 rounded-full bg-[#f5effa] text-[#702082] flex items-center justify-center shrink-0">
                                            <Star size={16} className="fill-[#702082] text-[#702082]" />
                                          </div>
                                          <div>
                                            <h3 className="font-bold text-[14px] text-slate-800 font-sans">
                                              SBI Equity Hybrid Fund
                                            </h3>
                                            <span className="text-[10px] text-slate-400 font-medium font-sans uppercase">
                                              Hybrid
                                            </span>
                                          </div>
                                        </div>
                                        <button 
                                          type="button"
                                          onClick={() => toast.success("Navigating to SBI Equity Hybrid Fund...")}
                                          className="text-[12px] font-extrabold text-[#702082] hover:underline font-sans cursor-pointer"
                                        >
                                          Invest Now
                                        </button>
                                      </div>

                                      {/* Info box */}
                                      <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-4 grid grid-cols-2 gap-4 w-full">
                                        <div>
                                          <div className="text-[9px] text-slate-400 font-bold uppercase font-sans tracking-wider">
                                            Min. Investment
                                          </div>
                                          <div className="text-[15px] font-extrabold text-slate-800 mt-1 font-sans">
                                            ₹1,000
                                          </div>
                                        </div>
                                        <div>
                                          <div className="text-[9px] text-slate-400 font-bold uppercase font-sans tracking-wider">
                                            Returns <span className="text-[#702082] font-extrabold">★</span>
                                          </div>
                                          <div className="text-[15px] font-extrabold text-green-600 mt-1 font-sans">
                                            14.90%
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 pl-0.5 font-sans select-none mt-2">
                                      <svg className="w-4 h-3.5 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                        <path d="M3 12c3-4 6-4 9 0s6 4 9 0" />
                                      </svg>
                                      <span>100k+ invested in last 3 months</span>
                                    </div>
                                  </div>

                                  {/* Fund 3: SBI Gold Fund */}
                                  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4 text-left flex flex-col justify-between w-full h-full hover:shadow-md transition-shadow">
                                    <div className="space-y-4 w-full">
                                      <div className="flex items-start justify-between w-full">
                                        <div className="flex items-center gap-3">
                                          <div className="w-9 h-9 rounded-full bg-[#f5effa] text-[#702082] flex items-center justify-center shrink-0">
                                            <Star size={16} className="fill-[#702082] text-[#702082]" />
                                          </div>
                                          <div>
                                            <h3 className="font-bold text-[14px] text-slate-800 font-sans">
                                              SBI Gold Fund
                                            </h3>
                                            <span className="text-[10px] text-slate-400 font-medium font-sans uppercase">
                                              Other schemes
                                            </span>
                                          </div>
                                        </div>
                                        <button 
                                          type="button"
                                          onClick={() => toast.success("Navigating to SBI Gold Fund...")}
                                          className="text-[12px] font-extrabold text-[#702082] hover:underline font-sans cursor-pointer"
                                        >
                                          Invest Now
                                        </button>
                                      </div>

                                      {/* Info box */}
                                      <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-4 grid grid-cols-2 gap-4 w-full">
                                        <div>
                                          <div className="text-[9px] text-slate-400 font-bold uppercase font-sans tracking-wider">
                                            Min. Investment
                                          </div>
                                          <div className="text-[15px] font-extrabold text-slate-800 mt-1 font-sans">
                                            ₹5,000
                                          </div>
                                        </div>
                                        <div>
                                          <div className="text-[9px] text-slate-400 font-bold uppercase font-sans tracking-wider">
                                            Returns <span className="text-[#702082] font-extrabold">★</span>
                                          </div>
                                          <div className="text-[15px] font-extrabold text-green-600 mt-1 font-sans">
                                            9.97%
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 pl-0.5 font-sans select-none mt-2">
                                      <svg className="w-4 h-3.5 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                        <path d="M3 12c3-4 6-4 9 0s6 4 9 0" />
                                      </svg>
                                      <span>100k+ invested in last 3 months</span>
                                    </div>
                                  </div>

                                  {/* Investment Assistance Card */}
                                  <div className="bg-[#f0f4f8] border border-slate-200/80 rounded-2xl shadow-sm p-5 space-y-3.5 text-left flex flex-col justify-between w-full h-full hover:shadow-md transition-shadow">
                                    <div className="space-y-2.5 w-full">
                                      <div className="flex items-center gap-2.5 w-full">
                                        <div className="w-9 h-9 rounded-xl bg-purple-100/60 text-[#702082] flex items-center justify-center shrink-0">
                                          <svg className="w-5 h-5 stroke-[#702082]" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                            <path d="M9 14h2" />
                                            <path d="M9 11h4" />
                                            <path d="M9 8h6" />
                                          </svg>
                                        </div>
                                        <h3 className="font-extrabold text-[14px] text-slate-800 font-sans">
                                          Investment Assistance
                                        </h3>
                                      </div>
                                      <p className="text-[11.5px] text-slate-500 leading-relaxed font-sans font-medium">
                                        Answer simple questions to evaluate your risk profile and get recommendation to right fund allocation
                                      </p>
                                    </div>

                                    <button 
                                      type="button"
                                      onClick={() => toast.success("Starting Risk Profile Assessment...")}
                                      className="self-start text-[12px] font-extrabold text-[#702082] hover:underline font-sans cursor-pointer mt-2 flex items-center gap-0.5"
                                    >
                                      Start Assessment →
                                    </button>
                                  </div>

                                </div>

                                {/* 3. Learn More Video Section (EXACT MATCH TO REFERENCE IMAGES) */}
                                <div className="border-t border-slate-200/60 pt-6 mt-8 w-full">
                                  <div className="flex items-center justify-between mb-4 select-none w-full">
                                    <h3 className="text-[15.5px] font-bold text-slate-800 font-sans">
                                      Learn more about Mutual Funds
                                    </h3>
                                    <button 
                                      type="button"
                                      onClick={() => toast.success("Navigating to all Mutual Fund videos...")}
                                      className="text-[12px] font-bold text-[#702082] hover:underline font-sans cursor-pointer"
                                    >
                                      View All
                                    </button>
                                  </div>

                                  {/* 4 Video cards */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
                                    
                                    {/* Video Card 1: What is Mutual Fund */}
                                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs hover:shadow-xs transition-shadow flex flex-col text-left group">
                                      {/* Video Thumbnail / Player */}
                                      <div className="h-32 relative flex items-center justify-center select-none overflow-hidden bg-slate-900">
                                        <video 
                                          className="w-full h-full object-cover" 
                                          controls 
                                          preload="metadata" 
                                          poster="https://cdn.onlineyono.sbi.bank.in//documents/d/sbi-yono-2.0/what-is-mutual-fund-1"
                                        >
                                          <source src="https://cdn.onlineyono.sbi.bank.in//documents/d/sbi-yono-2.0/what-is-mutual-fund-2" type="video/mp4" />
                                          Your browser does not support the video tag.
                                        </video>
                                      </div>
                                      {/* Video metadata text */}
                                      <div className="p-3 space-y-1">
                                        <h4 className="font-bold text-[12px] text-slate-800 leading-snug group-hover:text-[#702082] transition-colors font-sans truncate">
                                          What is Mutual Fund
                                        </h4>
                                        <p className="text-[10px] text-slate-500 leading-relaxed font-sans line-clamp-2">
                                          What is Mutual Fund_ Mutual Fund Basics _ Learn About Mutual Funds _ SBI Mutual Fund
                                        </p>
                                      </div>
                                    </div>

                                    {/* Video Card 2: Benefits of Mutual Funds */}
                                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs hover:shadow-xs transition-shadow flex flex-col text-left group">
                                      {/* Video Thumbnail / Player */}
                                      <div className="h-32 relative flex items-center justify-center select-none overflow-hidden bg-slate-900">
                                        <video 
                                          className="w-full h-full object-cover" 
                                          controls 
                                          preload="metadata" 
                                          poster="https://cdn.onlineyono.sbi.bank.in//documents/d/sbi-yono-2.0/what-is-mutual-fund-1"
                                        >
                                          <source src="https://cdn.onlineyono.sbi.bank.in//documents/d/sbi-yono-2.0/benefits-of-mutual-funds" type="video/mp4" />
                                          Your browser does not support the video tag.
                                        </video>
                                      </div>
                                      <div className="p-3 space-y-1">
                                        <h4 className="font-bold text-[12px] text-slate-800 leading-snug group-hover:text-[#702082] transition-colors font-sans truncate">
                                          Benefits of Mutual Funds
                                        </h4>
                                        <p className="text-[10px] text-slate-500 leading-relaxed font-sans line-clamp-2">
                                          Benefits of Mutual Funds_Advantages of Mutual Funds_SBI Mutual Fund
                                        </p>
                                      </div>
                                    </div>

                                    {/* Video Card 3: Type of Mutual Funds */}
                                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs hover:shadow-xs transition-shadow flex flex-col text-left group">
                                      {/* Video Thumbnail / Player */}
                                      <div className="h-32 relative flex items-center justify-center select-none overflow-hidden bg-slate-900">
                                        <video 
                                          className="w-full h-full object-cover" 
                                          controls 
                                          preload="metadata" 
                                          poster="https://cdn.onlineyono.sbi.bank.in//documents/d/sbi-yono-2.0/choosing-the-right-mutual-fund"
                                        >
                                          <source src="https://cdn.onlineyono.sbi.bank.in//documents/d/sbi-yono-2.0/types-of-mutual-funds" type="video/mp4" />
                                          Your browser does not support the video tag.
                                        </video>
                                      </div>
                                      <div className="p-3 space-y-1">
                                        <h4 className="font-bold text-[12px] text-slate-800 leading-snug group-hover:text-[#702082] transition-colors font-sans truncate">
                                          Type of Mutual Funds
                                        </h4>
                                        <p className="text-[10px] text-slate-500 leading-relaxed font-sans line-clamp-2">
                                          Type of Mutual Funds_Choosing the Right Mutual Fund_SBI Mutual Fund
                                        </p>
                                      </div>
                                    </div>

                                    {/* Video Card 4: What is SIP */}
                                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs hover:shadow-xs transition-shadow flex flex-col text-left group">
                                      {/* Video Thumbnail / Player */}
                                      <div className="h-32 relative flex items-center justify-center select-none overflow-hidden bg-slate-900">
                                        <video 
                                          className="w-full h-full object-cover" 
                                          controls 
                                          preload="metadata" 
                                          poster="https://cdn.onlineyono.sbi.bank.in//documents/d/sbi-yono-2.0/what-is-sip-1"
                                        >
                                          <source src="https://cdn.onlineyono.sbi.bank.in//documents/d/sbi-yono-2.0/what-is-sip-2" type="video/mp4" />
                                          Your browser does not support the video tag.
                                        </video>
                                      </div>
                                      <div className="p-3 space-y-1">
                                        <h4 className="font-bold text-[12px] text-slate-800 leading-snug group-hover:text-[#702082] transition-colors font-sans truncate">
                                          What is SIP
                                        </h4>
                                        <p className="text-[10px] text-slate-500 leading-relaxed font-sans line-clamp-2">
                                          What is SIP (Systematic Investment Plan)_Advantages of SIP_SIP Mutual Fund
                                        </p>
                                      </div>
                                    </div>

                                  </div>
                                </div>

                              </div>

                            </div>
                          ) : mfSubTab === 'Invest' ? (
                            /* Invest Sub-tab Content (EXACT MATCH TO SCREENSHOTS) */
                            <div className="space-y-6 w-full text-left font-sans select-none">
                              
                              {/* 1. Header Title & Returns Filter Row */}
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
                                <h2 className="text-[17px] font-bold text-slate-800">
                                  Explore Mutual Funds
                                </h2>
                                
                                {/* Show Returns Filter */}
                                <div className="flex items-center gap-2">
                                  <span className="text-[11.5px] font-semibold text-slate-500">Show Returns:</span>
                                  <div className="flex bg-slate-200/50 p-0.5 rounded-lg border border-slate-200/40">
                                    {(['1M', '3M', '6M', '1Y', '5Y', 'MAX'] as const).map((period) => {
                                      const isMax = period === 'MAX';
                                      return (
                                        <button
                                          key={period}
                                          type="button"
                                          className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                                            isMax 
                                              ? 'bg-[#702082] text-white shadow-3xs' 
                                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/65'
                                          }`}
                                        >
                                          {period}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>

                              {/* 2. Chip Filters & Search Bar Row */}
                              <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 w-full">
                                {/* Left Side Chip/Pill Buttons */}
                                <div className="flex flex-wrap gap-2 items-center">
                                  {[
                                    { label: 'All funds' },
                                    { label: 'Popular' },
                                    { label: '* NFO', isSpecial: true },
                                    { label: 'Equity' },
                                    { label: 'Debts' },
                                    { label: 'Tax Saving' },
                                    { label: 'Solutions Oriented' },
                                    { label: 'Hybrid' }
                                  ].map((chip) => {
                                    const isActive = mfFilterTab === chip.label;
                                    return (
                                      <button
                                        key={chip.label}
                                        type="button"
                                        onClick={() => setMfFilterTab(chip.label)}
                                        className={`px-3 py-1 rounded-full text-[10.5px] font-bold border transition-all ${
                                          isActive 
                                            ? 'bg-[#702082] text-white border-[#702082] shadow-3xs' 
                                            : chip.isSpecial
                                              ? 'bg-[#fff5f6] text-rose-600 border-rose-200/70 hover:bg-rose-100/40'
                                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                      >
                                        {chip.label}
                                      </button>
                                    );
                                  })}
                                </div>

                                {/* Right Side Search & Filters */}
                                <div className="flex items-center gap-3 shrink-0">
                                  {/* Search Box */}
                                  <div className="relative flex items-center bg-white border border-slate-200 rounded-lg px-3 py-1.5 w-full sm:w-[240px] focus-within:border-slate-300 transition-colors">
                                    <Search size={14} className="text-slate-400 mr-2" />
                                    <input
                                      type="text"
                                      placeholder="Search here..."
                                      className="bg-transparent text-[11px] font-semibold text-slate-700 placeholder-slate-400 outline-none w-full"
                                    />
                                  </div>

                                  {/* Funnel/Filter Icon with Badge */}
                                  <button type="button" className="relative p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 shrink-0 transition-colors">
                                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                                    </svg>
                                    {/* Funnel Red Badge */}
                                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#e11d48] text-white text-[8px] font-extrabold flex items-center justify-center border border-white">
                                      0
                                    </span>
                                  </button>

                                  {/* Sorting Arrow Icon */}
                                  <button type="button" className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 shrink-0 transition-colors">
                                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M11 5L6 10M6 10L1 5M6 10V22" />
                                      <path d="M13 19L18 14M18 14L23 19M18 14V2" />
                                    </svg>
                                  </button>
                                </div>
                              </div>

                              {/* 3. Horizontal Mutual Funds Cards list */}
                              <div className="space-y-4 w-full">
                                {(() => {
                                  const allFundsList = [
                                    { name: 'SBI Silver ETF Fund of Fund', category: 'Other Schemes', minInvestment: '₹5,000', cagr: '54.78%' },
                                    { name: 'SBI BSE PSU Bank Index Fund', category: 'Other Schemes', minInvestment: '₹5,000', cagr: '27.41%' },
                                    { name: 'SBI Small Cap Fund', category: 'Equity', minInvestment: '₹5,000', cagr: '18.73%' },
                                    { name: 'SBI Contra Fund', category: 'Equity', minInvestment: '₹5,000', cagr: '18.33%' },
                                    { name: 'SBI US Specific Equity Active FoF', category: 'Other Schemes', minInvestment: '₹5,000', cagr: '18.31%' },
                                    { name: 'SBI Focused Fund', category: 'Equity', minInvestment: '₹5,000', cagr: '18.23%' },
                                    { name: 'SBI Healthcare Opportunities Fund', category: 'Equity', minInvestment: '₹5,000', cagr: '16.64%' },
                                    { name: 'SBI Midcap Fund', category: 'Equity', minInvestment: '₹5,000', cagr: '16.13%' },
                                    { name: 'SBI ELSS Tax Saver Fund (formerly known as SBI Long Term Equity Fund)', category: 'Equity', minInvestment: '₹500', cagr: '15.89%' },
                                    { name: 'SBI Equity Hybrid Fund', category: 'Hybrid', minInvestment: '₹1,000', cagr: '14.90%' },
                                    { name: 'SBI Large & Midcap Fund', category: 'Equity', minInvestment: '₹5,000', cagr: '14.67%' },
                                    { name: 'SBI ESG Exclusionary Strategy Fund', category: 'Equity', minInvestment: '₹1,000', cagr: '13.90%' },
                                    { name: 'SBI MNC Fund (formerly known as SBI Magnum global fund)', category: 'Equity', minInvestment: '₹5,000', cagr: '13.83%' },
                                    { name: 'SBI Nifty Next 50 Index Fund', category: 'Other Schemes', minInvestment: '₹5,000', cagr: '13.80%' },
                                    { name: 'SBI Dividend Yield Fund', category: 'Equity', minInvestment: '₹5,000', cagr: '13.70%' },
                                    { name: 'SBI Retirement Benefit Fund Aggressive Plan', category: 'Solution Oriented Schemes', minInvestment: '₹5,000', cagr: '13.65%' },
                                    { name: 'SBI Retirement Benefit Fund - Aggressive Hybrid Plan', category: 'Solution Oriented Schemes', minInvestment: '₹5,000', cagr: '12.88%' },
                                    { name: 'SBI Gold Fund', category: 'Other Schemes', minInvestment: '₹5,000', cagr: '9.97%' },
                                    { name: 'SBI Automotive Opportunities Fund', category: 'Equity', minInvestment: '₹5,000', cagr: '9.46%' },
                                    { name: 'SBI Infrastructure Fund', category: 'Equity', minInvestment: '₹5,000', cagr: '8.97%' },
                                    { name: 'SBI Retirement Benefit Fund - Conservative Hybrid Plan', category: 'Solution Oriented Schemes', minInvestment: '₹5,000', cagr: '8.83%' },
                                    { name: 'SBI Equity Savings Fund', category: 'Hybrid', minInvestment: '₹1,000', cagr: '8.42%' },
                                    { name: 'SBI Conservative Hybrid Fund', category: 'Hybrid', minInvestment: '₹5,000', cagr: '8.10%' },
                                    { name: 'SBI Gilt Fund (Formerly known as SBI Magnum Gilt Fund)', category: 'Debt', minInvestment: '₹5,000', cagr: '7.83%' },
                                    { name: 'SBI Medium Duration Fund (Formerly known as SBI Magnum Medium Duration Fund)', category: 'Debt', minInvestment: '₹5,000', cagr: '7.76%' },
                                    { name: 'SBI Credit Risk Fund', category: 'Debt', minInvestment: '₹5,000', cagr: '7.55%' },
                                    { name: 'SBI CRISIL IBX SDL Index- Sept 2027 Fund', category: 'Other Schemes', minInvestment: '₹5,000', cagr: '7.37%' },
                                    { name: 'SBI Banking and PSU Fund', category: 'Debt', minInvestment: '₹5,000', cagr: '7.37%' },
                                    { name: 'SBI Retirement Benefit Fund - Conservative Plan', category: 'Solution Oriented Schemes', minInvestment: '₹5,000', cagr: '7.30%' },
                                    { name: 'SBI Low Duration Fund (Formerly known as SBI Magnum Low Duration Fund)', category: 'Debt', minInvestment: '₹5,000', cagr: '7.15%' },
                                    { name: 'SBI Ultra Short Duration Fund (Formerly known as SBI Magnum Ultra Short Duration Fund)', category: 'Debt', minInvestment: '₹5,000', cagr: '7.04%' },
                                    { name: 'SBI CPSE Bond Plus SDL Sep 2026 50-50 Index Fund', category: 'Other Schemes', minInvestment: '₹5,000', cagr: '6.05%' },
                                    { name: 'SBI Income Plus Arbitrage Active FOF', category: 'Other Schemes', minInvestment: '₹5,000', cagr: '5.57%' },
                                    { name: 'SBI Energy Opportunities Fund', category: 'Equity', minInvestment: '₹5,000', cagr: '4.68%' },
                                    { name: 'SBI Quality Fund', category: 'Equity', minInvestment: '₹5,000', cagr: '2.47%' },
                                    { name: 'SBI NIFTY G-SEC JUL 2031 INDEX FUND', category: 'Other Schemes', minInvestment: '₹5,000', cagr: '2.27%' },
                                    { name: 'SBI Nifty Midcap 150 Momentum 50 ETF FOF', category: 'Other Schemes', minInvestment: '₹5,000', cagr: '0.00%', isNfo: true }
                                  ];

                                  const popularFundsList = [
                                    { name: 'SBI Contra Fund', category: 'Equity', minInvestment: '₹5,000', cagr: '18.33%' },
                                    { name: 'SBI Focused Fund', category: 'Equity', minInvestment: '₹5,000', cagr: '18.23%' },
                                    { name: 'SBI ELSS Tax Saver Fund (formerly known as SBI Long Term Equity Fund)', category: 'Equity', minInvestment: '₹500', cagr: '15.89%' },
                                    { name: 'SBI Equity Hybrid Fund', category: 'Hybrid', minInvestment: '₹1,000', cagr: '14.90%' }
                                  ];

                                  if (mfFilterTab === 'Popular') return popularFundsList;
                                  if (mfFilterTab === 'All funds') return allFundsList;
                                  if (mfFilterTab === '* NFO') {
                                    return allFundsList.filter(f => f.isNfo === true);
                                  }
                                  if (mfFilterTab === 'Tax Saving') {
                                    return allFundsList.filter(f => f.name.toLowerCase().includes('tax') || f.name.toLowerCase().includes('elss'));
                                  }
                                  if (mfFilterTab === 'Solutions Oriented') {
                                    return allFundsList.filter(f => f.category.toLowerCase().includes('solution'));
                                  }
                                  if (mfFilterTab === 'Debts') {
                                    return allFundsList.filter(f => f.category.toLowerCase().startsWith('debt'));
                                  }
                                  
                                  const filtered = allFundsList.filter(f => f.category.toLowerCase() === mfFilterTab.toLowerCase());
                                  if (filtered.length > 0) return filtered;
                                  return allFundsList;
                              })().map((fund, idx) => (
                                  <div 
                                    key={idx} 
                                    onClick={() => setViewingFundInfo(fund)}
                                    className="bg-white border border-slate-200/90 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center w-full shadow-2xs hover:shadow-xs hover:border-slate-300/80 transition-all cursor-pointer group"
                                  >
                                    {/* Left Side Info & Heart wishlist: combined md:col-span-4 */}
                                    <div className="flex items-center justify-between md:col-span-4 md:border-r md:border-slate-200/80 md:pr-4 text-left">
                                      <div className="flex items-center gap-3.5">
                                        <div className="w-9 h-9 rounded-full bg-[#f5effa] text-[#702082] flex items-center justify-center shrink-0">
                                          <Star size={16} className="fill-[#702082] text-[#702082]" />
                                        </div>
                                        <div>
                                          <h3 className="font-bold text-[14px] text-slate-800 leading-snug line-clamp-2 max-w-[200px] group-hover:text-[#702082] transition-colors">
                                            {fund.name}
                                          </h3>
                                          <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                                            {fund.category}
                                          </span>
                                        </div>
                                      </div>
                                      <button 
                                        type="button" 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toast.success(`Added ${fund.name} to wishlist!`);
                                        }}
                                        className="p-1 text-slate-400 hover:text-rose-500 shrink-0 self-center"
                                      >
                                        <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                        </svg>
                                      </button>
                                    </div>

                                    {/* Min Investment Info */}
                                    <div className="md:col-span-2 md:border-r md:border-slate-200/80 md:px-2 text-center">
                                      <div className="text-[11px] text-slate-400 font-medium">
                                        Min. Investment
                                      </div>
                                      <div className="text-[15px] font-bold text-[#702082] mt-0.5">
                                        {fund.minInvestment}
                                      </div>
                                    </div>

                                    {/* CAGR returns */}
                                    <div className="md:col-span-2 md:border-r md:border-slate-200/80 md:px-2 text-center">
                                      <div className="text-[11px] text-slate-400 font-medium">
                                        CAGR
                                      </div>
                                      <div className="text-[15px] font-bold text-green-600 mt-0.5">
                                        {fund.cagr}
                                      </div>
                                    </div>

                                    {/* Trending Wave Outline & Invested Text */}
                                    <div className="flex items-center gap-1.5 md:col-span-3 text-left text-slate-500 font-semibold text-[11px] select-none md:pl-4">
                                      <svg className="w-4 h-3.5 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                        <path d="M3 12c3-4 6-4 9 0s6 4 9 0" />
                                      </svg>
                                      <span className="truncate">100K+ invested in last 3 months</span>
                                    </div>

                                    {/* Action button */}
                                    <div className="md:col-span-1 text-right pr-2">
                                      <button 
                                        type="button" 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toast.success(`Starting investment process for ${fund.name}...`);
                                        }}
                                        className="text-[13px] font-extrabold text-[#702082] hover:underline whitespace-nowrap cursor-pointer"
                                      >
                                        Invest Now
                                      </button>
                                    </div>

                                  </div>
                                ))}
                              </div>

                            </div>
                          ) : mfSubTab === 'Ideas' ? (
                            ideasDetail === 'All Weather Investing' ? (
                              /* 1. All Weather Investing Detailed View */
                              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full text-left font-sans mt-2">
                                {/* Left Side Box: Let the experts do the hard work! (md:col-span-4) */}
                                <div className="md:col-span-4 flex flex-col gap-6 items-stretch justify-start w-full">
                                  {/* Info Card */}
                                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs text-left w-full">
                                    <h3 className="font-extrabold text-[16px] text-slate-800 tracking-tight mb-2.5 leading-snug">
                                      Let the experts do the hard work!
                                    </h3>
                                    <div className="bg-[#f1f5f9] border border-slate-200/40 rounded-xl p-4.5">
                                      <p className="text-[12.5px] text-slate-500 font-semibold leading-relaxed">
                                        Invest in funds that offer dynamic portfolio management solutions. They try to maintain the right mix of asset classes based on macro environments and fund house views.
                                      </p>
                                    </div>
                                  </div>

                                  {/* Key Benefits Card */}
                                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs text-left w-full">
                                    <div className="text-[#702082] font-bold text-[12px] uppercase tracking-wider text-center w-full mb-4">
                                      Key Benefits
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-center">
                                      {/* Item 1 */}
                                      <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-[#f5effa] text-[#702082] flex items-center justify-center mb-2 shrink-0">
                                          <svg className="w-5 h-5 text-[#702082]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                            <line x1="16" y1="2" x2="16" y2="6" />
                                            <line x1="8" y1="2" x2="8" y2="6" />
                                            <line x1="3" y1="10" x2="21" y2="10" />
                                            <text x="12" y="18" fontSize="8.5" fontWeight="bold" textAnchor="middle" fill="currentColor" stroke="none">3+</text>
                                          </svg>
                                        </div>
                                        <span className="text-[10px] text-slate-600 font-bold leading-tight">3+ Years of Investing</span>
                                      </div>

                                      {/* Item 2 */}
                                      <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-[#f5effa] text-[#702082] flex items-center justify-center mb-2 shrink-0">
                                          <svg className="w-5 h-5 text-[#702082]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10" />
                                            <text x="12" y="15.5" fontSize="11" fontWeight="black" textAnchor="middle" fill="currentColor" stroke="none">₹</text>
                                          </svg>
                                        </div>
                                        <span className="text-[10px] text-slate-600 font-bold leading-tight">Wealth Creation</span>
                                      </div>

                                      {/* Item 3 */}
                                      <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-[#f5effa] text-[#702082] flex items-center justify-center mb-2 shrink-0">
                                          <svg className="w-5 h-5 text-[#702082]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 3v18h18" strokeWidth="2" />
                                            <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
                                          </svg>
                                        </div>
                                        <span className="text-[10px] text-slate-600 font-bold leading-tight">Dynamic Asset Allocation</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Right Side List: Funds to Invest (md:col-span-8) */}
                                <div className="md:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs w-full text-left space-y-6">
                                  <div>
                                    <h3 className="font-extrabold text-[15.5px] text-slate-800 leading-snug">
                                      Select any one of the funds to invest in this idea
                                    </h3>
                                    <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                                      All returns are shown since inception
                                    </p>
                                  </div>

                                  {/* List of 2 Funds */}
                                  <div className="space-y-6">
                                    {[
                                      {
                                        name: 'SBI Balanced Advantage Fund',
                                        returns: '9.98 %',
                                        category: 'Hybrid',
                                        risk: 'Very High',
                                        desc: 'SBI Balanced Advantage Fund invests in equity & debt securities based on the market condition. Can act as an ideal choice for those looking for an optimal equity-debt allocation at all times.'
                                      },
                                      {
                                        name: 'SBI Multi Asset Allocation Fund',
                                        returns: '12.18 %',
                                        category: 'Hybrid',
                                        risk: 'Very High',
                                        desc: 'SBI Multi Asset Allocation Fund majorly invests in a portfolio of non correlated asset classes to lower the volatility through diversification & also to capture the potential upside in equity, debt & gold.'
                                      }
                                    ].map((fund) => {
                                      const isSelected = selectedIdeaFund === fund.name;
                                      return (
                                        <div 
                                          key={fund.name}
                                          onClick={() => setSelectedIdeaFund(fund.name)}
                                          className={`border rounded-2xl p-5 text-left transition-all cursor-pointer flex gap-4 items-start ${
                                            isSelected 
                                              ? 'border-[#702082] bg-[#fdfafc]/35 shadow-xs' 
                                              : 'border-slate-200 hover:border-slate-300'
                                          }`}
                                        >
                                          {/* Custom Checkbox/Radio button on left */}
                                          <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center mt-1 shrink-0 ${
                                            isSelected ? 'border-[#702082]' : 'border-slate-300'
                                          }`}>
                                            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#702082]"></div>}
                                          </div>

                                          <div className="flex-1 space-y-2">
                                            {/* Fund Name */}
                                            <h4 className="font-extrabold text-[14.5px] text-slate-800 select-none">
                                              {fund.name}
                                            </h4>

                                            {/* Tags Row */}
                                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                              <span className="bg-slate-100/80 px-2 py-0.5 rounded text-[10.5px] text-slate-500 font-bold leading-normal">
                                                Returns: {fund.returns}
                                              </span>
                                              <span className="bg-slate-100/80 px-2 py-0.5 rounded text-[10.5px] text-slate-500 font-bold leading-normal">
                                                {fund.category}
                                              </span>
                                              <span className="bg-rose-50 text-rose-600 px-2 py-0.5 rounded text-[10.5px] font-bold flex items-center gap-1.5 leading-normal">
                                                <svg className="w-3 h-3 text-rose-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                                                </svg>
                                                {fund.risk}
                                              </span>
                                            </div>

                                            {/* Suitability Label */}
                                            <p className="text-[12px] text-slate-800 font-bold mt-2">
                                              Suitable for: <span className="font-semibold text-slate-500">Long-Term (3 years+)</span>
                                            </p>

                                            {/* Description */}
                                            <p className="text-[12px] text-slate-400 font-semibold leading-relaxed mt-2.5">
                                              {fund.desc}
                                            </p>

                                            {/* Action Button link */}
                                            <button 
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setViewingFundInfo(fund);
                                              }}
                                              className="text-[12.5px] font-extrabold text-[#702082] hover:underline flex items-center gap-1.5 mt-4 cursor-pointer"
                                            >
                                              <span>View Fund Details</span>
                                              <ChevronRight size={13} className="text-[#702082]" />
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            ) : ideasDetail === 'Retirement Planning' ? (
                              /* 2. Retirement Planning Detailed View */
                              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full text-left font-sans mt-2">
                                {/* Left Side Box */}
                                <div className="md:col-span-4 flex flex-col gap-6 items-stretch justify-start w-full">
                                  {/* Info Card */}
                                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs text-left w-full">
                                    <h3 className="font-extrabold text-[16px] text-[#702082] tracking-tight mb-2.5 leading-snug">
                                      Retirement Planning
                                    </h3>
                                    <div className="bg-[#f8fafc] border border-slate-200/40 rounded-xl p-4.5">
                                      <h4 className="font-extrabold text-slate-800 text-[13.5px] leading-snug">
                                        A one stop solution to meet your retirement planning needs.
                                      </h4>
                                      <p className="text-[12px] text-slate-500 font-semibold leading-relaxed mt-2">
                                        Choose from 4 different plans based on your life stage and risk preference.
                                      </p>
                                    </div>
                                  </div>

                                  {/* Key Benefits Card */}
                                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs text-left w-full">
                                    <div className="text-[#702082] font-bold text-[12px] uppercase tracking-wider text-center w-full mb-4">
                                      Key Benefits
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-center">
                                      {/* Item 1 */}
                                      <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-[#f5effa] text-[#702082] flex items-center justify-center mb-2 shrink-0">
                                          <svg className="w-5 h-5 text-[#702082]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                            <line x1="16" y1="2" x2="16" y2="6" />
                                            <line x1="8" y1="2" x2="8" y2="6" />
                                            <line x1="3" y1="10" x2="21" y2="10" />
                                            <text x="12" y="18" fontSize="8.5" fontWeight="bold" textAnchor="middle" fill="currentColor" stroke="none">5+</text>
                                          </svg>
                                        </div>
                                        <span className="text-[10px] text-slate-600 font-bold leading-tight">5+ Years of Investing</span>
                                      </div>

                                      {/* Item 2 */}
                                      <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-[#f5effa] text-[#702082] flex items-center justify-center mb-2 shrink-0">
                                          <svg className="w-5 h-5 text-[#702082]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10" />
                                            <text x="12" y="15.5" fontSize="11" fontWeight="black" textAnchor="middle" fill="currentColor" stroke="none">₹</text>
                                          </svg>
                                        </div>
                                        <span className="text-[10px] text-slate-600 font-bold leading-tight">Wealth Creation & Retirement corpus</span>
                                      </div>

                                      {/* Item 3 */}
                                      <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-[#f5effa] text-[#702082] flex items-center justify-center mb-2 shrink-0">
                                          <svg className="w-5 h-5 text-[#702082]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10" />
                                            <circle cx="12" cy="12" r="4" fill="currentColor" />
                                            <line x1="12" y1="2" x2="12" y2="6" />
                                            <line x1="12" y1="18" x2="12" y2="22" />
                                            <line x1="2" y1="12" x2="6" y2="12" />
                                            <line x1="18" y1="12" x2="22" y2="12" />
                                          </svg>
                                        </div>
                                        <span className="text-[10px] text-slate-600 font-bold leading-tight">Disciplined Investment Approach</span>
                                      </div>
                                    </div>

                                    {/* Bottom Lock-in Note */}
                                    <p className="text-[10.5px] text-slate-400 font-semibold leading-relaxed mt-4.5 pt-3 border-t border-slate-100">
                                      Note: Investment amount will be locked in for 5 years or until completion of 65 years of age whichever is earlier. Select a fund of your choice or opt in for Auto-Rebalance and let the experts handle it.
                                    </p>
                                  </div>
                                </div>

                                {/* Right Side List */}
                                <div className="md:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs w-full text-left space-y-6">
                                  <div>
                                    <h3 className="font-extrabold text-[15.5px] text-slate-800 leading-snug">
                                      Select any one of the funds to invest in this idea
                                    </h3>
                                    <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                                      All returns are shown since inception
                                    </p>
                                  </div>

                                  {/* List of 4 Funds */}
                                  <div className="space-y-6">
                                    {[
                                      {
                                        name: 'SBI Retirement Benefit Fund Aggressive Plan',
                                        returns: '13.65 %',
                                        category: 'Solution Oriented Schemes',
                                        risk: 'Very High',
                                        desc: 'A solution-oriented retirement scheme targeting long-term wealth creation. It maintains a predominant equity posture to capitalize on capital growth opportunities over a 5+ year time horizon.'
                                      },
                                      {
                                        name: 'SBI Retirement Benefit Fund - Aggressive Hybrid Plan',
                                        returns: '12.88 %',
                                        category: 'Solution Oriented Schemes',
                                        risk: 'Very High',
                                        desc: 'Maintains an active hybrid allocation, combining equity assets for growth and debt securities for relative stability, suitable for retirement wealth accumulation.'
                                      },
                                      {
                                        name: 'SBI Retirement Benefit Fund - Conservative Hybrid Plan',
                                        returns: '8.83 %',
                                        category: 'Solution Oriented Schemes',
                                        risk: 'High',
                                        desc: 'Focuses on capital preservation with a significant allocation in debt securities and high-grade fixed income instruments, paired with modest equity exposure.'
                                      },
                                      {
                                        name: 'SBI Retirement Benefit Fund - Conservative Plan',
                                        returns: '7.30 %',
                                        category: 'Solution Oriented Schemes',
                                        risk: 'Moderately High',
                                        desc: 'Highly conservative asset mix aimed at safeguarding principal capital while generating regular returns, ideal for investors nearing retirement stage.'
                                      }
                                    ].map((fund) => {
                                      const isSelected = selectedIdeaFund === fund.name;
                                      return (
                                        <div 
                                          key={fund.name}
                                          onClick={() => setSelectedIdeaFund(fund.name)}
                                          className={`border rounded-2xl p-5 text-left transition-all cursor-pointer flex gap-4 items-start ${
                                            isSelected 
                                              ? 'border-[#702082] bg-[#fdfafc]/35 shadow-xs' 
                                              : 'border-slate-200 hover:border-slate-300'
                                          }`}
                                        >
                                          {/* Custom Checkbox/Radio button on left */}
                                          <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center mt-1 shrink-0 ${
                                            isSelected ? 'border-[#702082]' : 'border-slate-300'
                                          }`}>
                                            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#702082]"></div>}
                                          </div>

                                          <div className="flex-1 space-y-2">
                                            {/* Fund Name */}
                                            <h4 className="font-extrabold text-[14.5px] text-slate-800 select-none">
                                              {fund.name}
                                            </h4>

                                            {/* Tags Row */}
                                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                              <span className="bg-slate-100/80 px-2 py-0.5 rounded text-[10.5px] text-slate-500 font-bold leading-normal">
                                                Returns: {fund.returns}
                                              </span>
                                              <span className="bg-slate-100/80 px-2 py-0.5 rounded text-[10.5px] text-slate-500 font-bold leading-normal">
                                                {fund.category}
                                              </span>
                                              <span className="bg-rose-50 text-rose-600 px-2 py-0.5 rounded text-[10.5px] font-bold flex items-center gap-1.5 leading-normal">
                                                <svg className="w-3 h-3 text-rose-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                                                </svg>
                                                {fund.risk}
                                              </span>
                                            </div>

                                            {/* Suitability Label */}
                                            <p className="text-[12px] text-slate-800 font-bold mt-2">
                                              Suitable for: <span className="font-semibold text-slate-500">Retirement & Long-Term (3 years+)</span>
                                            </p>

                                            {/* Action Button link */}
                                            <button 
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setViewingFundInfo({
                                                  name: fund.name,
                                                  category: fund.category,
                                                  cagr: fund.returns,
                                                  minSip: '₹500',
                                                  minInvestment: '₹5,000',
                                                  risk: fund.risk
                                                });
                                              }}
                                              className="text-[12.5px] font-extrabold text-[#702082] hover:underline flex items-center gap-1.5 mt-4 cursor-pointer"
                                            >
                                              <span>View Fund Details</span>
                                              <ChevronRight size={13} className="text-[#702082]" />
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            ) : ideasDetail === 'Smart Save' ? (
                              /* 3. Smart Save Detailed View */
                              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full text-left font-sans mt-2">
                                {/* Left Side Box */}
                                <div className="md:col-span-4 flex flex-col gap-6 items-stretch justify-start w-full">
                                  {/* Info Card */}
                                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs text-left w-full">
                                    <h3 className="font-extrabold text-[16px] text-[#702082] tracking-tight mb-2.5 leading-snug">
                                      Smart Save
                                    </h3>
                                    <div className="bg-[#f8fafc] border border-slate-200/40 rounded-xl p-4.5">
                                      <h4 className="font-extrabold text-slate-800 text-[13.5px] leading-snug">
                                        Want to save more money risk free?
                                      </h4>
                                      <p className="text-[12px] text-slate-500 font-semibold leading-relaxed mt-2">
                                        Potential to earn more than traditional savings instruments such as savings account and Fixed Deposits.
                                      </p>
                                    </div>
                                  </div>

                                  {/* Key Benefits Card */}
                                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs text-left w-full">
                                    <div className="text-[#702082] font-bold text-[12px] uppercase tracking-wider text-center w-full mb-4">
                                      Key Benefits
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-center">
                                      {/* Item 1 */}
                                      <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-[#f5effa] text-[#702082] flex items-center justify-center mb-2 shrink-0">
                                          <svg className="w-5 h-5 text-[#702082]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                            <line x1="16" y1="2" x2="16" y2="6" />
                                            <line x1="8" y1="2" x2="8" y2="6" />
                                            <line x1="3" y1="10" x2="21" y2="10" />
                                            <text x="12" y="18" fontSize="8.5" fontWeight="bold" textAnchor="middle" fill="currentColor" stroke="none">3+</text>
                                          </svg>
                                        </div>
                                        <span className="text-[10px] text-slate-600 font-bold leading-tight">Invest Upto 3 Months</span>
                                      </div>

                                      {/* Item 2 */}
                                      <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-[#f5effa] text-[#702082] flex items-center justify-center mb-2 shrink-0">
                                          <svg className="w-5 h-5 text-[#702082]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="M12 8v4l3 3" />
                                            <text x="12" y="15.5" fontSize="11" fontWeight="black" textAnchor="middle" fill="currentColor" stroke="none">₹</text>
                                          </svg>
                                        </div>
                                        <span className="text-[10px] text-slate-600 font-bold leading-tight">Redeem Funds Instantly*</span>
                                      </div>

                                      {/* Item 3 */}
                                      <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-[#f5effa] text-[#702082] flex items-center justify-center mb-2 shrink-0">
                                          <svg className="w-5 h-5 text-[#702082]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M23 6l-9.5 9.5-5-5L1 18" />
                                            <path d="M17 6h6v6" />
                                          </svg>
                                        </div>
                                        <span className="text-[10px] text-slate-600 font-bold leading-tight">Less Volatility</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Right Side List */}
                                <div className="md:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs w-full text-left space-y-6">
                                  <div>
                                    <h3 className="font-extrabold text-[15.5px] text-slate-800 leading-snug">
                                      Select any one of the funds to invest in this idea
                                    </h3>
                                    <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                                      All returns are shown since inception
                                    </p>
                                  </div>

                                  {/* List of 1 Fund */}
                                  <div className="space-y-6">
                                    {[
                                      {
                                        name: 'SBI Liquid Fund',
                                        returns: '6.88 %',
                                        category: 'Debt',
                                        risk: 'Moderate',
                                        desc: '*SBI Liquid Fund additionally, provides instant redemption upto ₹50,000 or 90% of redeemable balance whichever is lower'
                                      }
                                    ].map((fund) => {
                                      const isSelected = selectedIdeaFund === fund.name;
                                      return (
                                        <div 
                                          key={fund.name}
                                          onClick={() => setSelectedIdeaFund(fund.name)}
                                          className={`border rounded-2xl p-5 text-left transition-all cursor-pointer flex gap-4 items-start ${
                                            isSelected 
                                              ? 'border-[#702082] bg-[#fdfafc]/35 shadow-xs' 
                                              : 'border-slate-200 hover:border-slate-300'
                                          }`}
                                        >
                                          {/* Custom Checkbox/Radio button on left */}
                                          <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center mt-1 shrink-0 ${
                                            isSelected ? 'border-[#702082]' : 'border-slate-300'
                                          }`}>
                                            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#702082]"></div>}
                                          </div>

                                          <div className="flex-1 space-y-2">
                                            {/* Fund Name */}
                                            <h4 className="font-extrabold text-[14.5px] text-slate-800 select-none">
                                              {fund.name}
                                            </h4>

                                            {/* Tags Row */}
                                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                              <span className="bg-slate-100/80 px-2 py-0.5 rounded text-[10.5px] text-slate-500 font-bold leading-normal">
                                                Returns: {fund.returns}
                                              </span>
                                              <span className="bg-slate-100/80 px-2 py-0.5 rounded text-[10.5px] text-slate-500 font-bold leading-normal">
                                                {fund.category}
                                              </span>
                                              <span className="bg-[#fffbeb] text-amber-600 px-2 py-0.5 rounded text-[10.5px] font-bold flex items-center gap-1.5 leading-normal border border-amber-100">
                                                <svg className="w-3 h-3 text-amber-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                                                </svg>
                                                {fund.risk}
                                              </span>
                                            </div>

                                            {/* Description */}
                                            <p className="text-[12px] text-slate-400 font-semibold leading-relaxed mt-2.5">
                                              {fund.desc}
                                            </p>

                                            {/* Action Button link */}
                                            <button 
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setViewingFundInfo({
                                                  name: fund.name,
                                                  category: fund.category,
                                                  cagr: fund.returns,
                                                  minSip: '₹500',
                                                  minInvestment: '₹5,000',
                                                  risk: fund.risk
                                                });
                                              }}
                                              className="text-[12.5px] font-extrabold text-[#702082] hover:underline flex items-center gap-1.5 mt-4 cursor-pointer"
                                            >
                                              <span>View Fund Details</span>
                                              <ChevronRight size={13} className="text-[#702082]" />
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            ) : ideasDetail === "Beginner's Kit" ? (
                              /* 4. Beginner's Kit Detailed View */
                              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full text-left font-sans mt-2">
                                {/* Left Side Box */}
                                <div className="md:col-span-4 flex flex-col gap-6 items-stretch justify-start w-full">
                                  {/* Info Card */}
                                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs text-left w-full">
                                    <h3 className="font-extrabold text-[16px] text-[#702082] tracking-tight mb-2.5 leading-snug">
                                      Beginner's Kit
                                    </h3>
                                    <div className="bg-[#f8fafc] border border-slate-200/40 rounded-xl p-4.5">
                                      <h4 className="font-extrabold text-slate-800 text-[13.5px] leading-snug">
                                        Start your investment journey
                                      </h4>
                                      <p className="text-[12px] text-slate-500 font-semibold leading-relaxed mt-2">
                                        This kit contains funds from 3 categories suitable for majority of first time investors - Balanced Funds, ELSS Funds & Money Market Funds.
                                      </p>
                                    </div>
                                  </div>

                                  {/* Key Benefits Card */}
                                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs text-left w-full">
                                    <div className="text-[#702082] font-bold text-[12px] uppercase tracking-wider text-center w-full mb-4">
                                      Key Benefits
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-center">
                                      {/* Item 1 */}
                                      <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-[#f5effa] text-[#702082] flex items-center justify-center mb-2 shrink-0">
                                          <svg className="w-5 h-5 text-[#702082]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                          </svg>
                                        </div>
                                        <span className="text-[10px] text-slate-600 font-bold leading-tight">Manage Market Volatility</span>
                                      </div>

                                      {/* Item 2 */}
                                      <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-[#f5effa] text-[#702082] flex items-center justify-center mb-2 shrink-0">
                                          <svg className="w-5 h-5 text-[#702082]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10" />
                                            <text x="12" y="15.5" fontSize="11" fontWeight="black" textAnchor="middle" fill="currentColor" stroke="none">₹</text>
                                          </svg>
                                        </div>
                                        <span className="text-[10px] text-slate-600 font-bold leading-tight">Potential Wealth Creation</span>
                                      </div>

                                      {/* Item 3 */}
                                      <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-[#f5effa] text-[#702082] flex items-center justify-center mb-2 shrink-0">
                                          <svg className="w-5 h-5 text-[#702082]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <polyline points="14 2 14 8 20 8" />
                                          </svg>
                                        </div>
                                        <span className="text-[10px] text-slate-600 font-bold leading-tight">Tax Saving through ELSS</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Right Side List */}
                                <div className="md:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs w-full text-left space-y-6">
                                  <div>
                                    <h3 className="font-extrabold text-[15.5px] text-slate-800 leading-snug">
                                      Select any one of the funds to invest in this idea
                                    </h3>
                                    <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                                      All returns are shown since inception
                                    </p>
                                  </div>

                                  {/* List of 3 Funds */}
                                  <div className="space-y-6">
                                    {[
                                      {
                                        name: 'SBI Balanced Advantage Fund',
                                        returns: '9.98 %',
                                        category: 'Hybrid',
                                        risk: 'Very High',
                                        suitable: 'Long-Term (3 years+)',
                                        desc: 'A balanced fund can help to manage market volatility effectively, it is a dynamic asset allocation fund which invests in equity and debt depending on the current market conditions with the aim to balance the risk and the reward.'
                                      },
                                      {
                                        name: 'SBI Long Term Equity Fund (ELSS)',
                                        returns: '15.89 %',
                                        category: 'Equity',
                                        risk: 'Very High',
                                        suitable: 'Tax Planning & Long-Term (3 years+)',
                                        desc: 'An ELSS fund, this fund offers the benefit of tax saving with the potential of wealth creation in a single go.'
                                      },
                                      {
                                        name: 'SBI Savings Fund',
                                        returns: '6.98 %',
                                        category: 'Debt',
                                        risk: 'Low to Moderate',
                                        suitable: 'Short-Term Parking (1-3 Years)',
                                        desc: 'A money market fund, such funds invest in money market instruments which are perceived to be liquid in nature. This gives your money an opportunity to earn reasonable returns while having the convenience to access it whenever required.'
                                      }
                                    ].map((fund) => {
                                      const isSelected = selectedIdeaFund === fund.name;
                                      return (
                                        <div 
                                          key={fund.name}
                                          onClick={() => setSelectedIdeaFund(fund.name)}
                                          className={`border rounded-2xl p-5 text-left transition-all cursor-pointer flex gap-4 items-start ${
                                            isSelected 
                                              ? 'border-[#702082] bg-[#fdfafc]/35 shadow-xs' 
                                              : 'border-slate-200 hover:border-slate-300'
                                          }`}
                                        >
                                          {/* Custom Checkbox/Radio button on left */}
                                          <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center mt-1 shrink-0 ${
                                            isSelected ? 'border-[#702082]' : 'border-slate-300'
                                          }`}>
                                            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#702082]"></div>}
                                          </div>

                                          <div className="flex-1 space-y-2">
                                            {/* Fund Name */}
                                            <h4 className="font-extrabold text-[14.5px] text-slate-800 select-none">
                                              {fund.name}
                                            </h4>

                                            {/* Tags Row */}
                                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                              <span className="bg-slate-100/80 px-2 py-0.5 rounded text-[10.5px] text-slate-500 font-bold leading-normal">
                                                Returns: {fund.returns}
                                              </span>
                                              <span className="bg-slate-100/80 px-2 py-0.5 rounded text-[10.5px] text-slate-500 font-bold leading-normal">
                                                {fund.category}
                                              </span>
                                              <span className={`px-2 py-0.5 rounded text-[10.5px] font-bold flex items-center gap-1.5 leading-normal ${
                                                fund.risk === 'Low to Moderate'
                                                  ? 'bg-green-50 text-green-600'
                                                  : 'bg-rose-50 text-rose-600'
                                              }`}>
                                                <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                                                </svg>
                                                {fund.risk}
                                              </span>
                                            </div>

                                            {/* Suitability Label */}
                                            <p className="text-[12px] text-slate-800 font-bold mt-2">
                                              Suitable for: <span className="font-semibold text-slate-500">{fund.suitable}</span>
                                            </p>

                                            {/* Description */}
                                            <p className="text-[12px] text-slate-400 font-semibold leading-relaxed mt-2.5">
                                              {fund.desc}
                                            </p>

                                            {/* Action Button link */}
                                            <button 
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setViewingFundInfo({
                                                  name: fund.name,
                                                  category: fund.category,
                                                  cagr: fund.returns,
                                                  minSip: '₹500',
                                                  minInvestment: '₹5,000',
                                                  risk: fund.risk
                                                });
                                              }}
                                              className="text-[12.5px] font-extrabold text-[#702082] hover:underline flex items-center gap-1.5 mt-4 cursor-pointer"
                                            >
                                              <span>View Fund Details</span>
                                              <ChevronRight size={13} className="text-[#702082]" />
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              /* Ideas subtab: grid of investment ideas */
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-2">
                                {[
                                  {
                                    title: 'All Weather Investing',
                                    desc: "Markets can fluctuate, your peace of mind shouldn't",
                                    icon: (
                                      <svg className="w-[22px] h-[22px] text-[#702082]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="13" width="4" height="8" rx="1" fill="#f5effa"/>
                                        <rect x="10" y="8" width="4" height="13" rx="1" fill="#f5effa"/>
                                        <rect x="17" y="3" width="4" height="18" rx="1" fill="#f5effa"/>
                                        <path d="M5 11l7-4 7-2" strokeWidth="2"/>
                                      </svg>
                                    )
                                  },
                                  {
                                    title: 'Smart Save',
                                    desc: 'Potential to earn more than traditional savings instrument',
                                    icon: (
                                      <svg className="w-[22px] h-[22px] text-[#702082]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M19 7h-8a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-8a3 3 0 0 0-3-3z" fill="#f5effa"/>
                                        <path d="M16 11h.01M16 14h.01" strokeWidth="2.5" strokeLinecap="round"/>
                                        <path d="M8 11H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h4"/>
                                      </svg>
                                    )
                                  },
                                  {
                                    title: 'Retirement Planning',
                                    desc: 'A one-stop solution to meet your retirement planning needs',
                                    icon: (
                                      <svg className="w-[22px] h-[22px] text-[#702082]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 2v20M12 12a5 5 0 0 1 5-5h2M12 12a5 5 0 0 0-5-5H5" strokeWidth="2"/>
                                        <path d="M12 2A9 9 0 0 1 21 11H3A9 9 0 0 1 12 2Z" fill="#f5effa"/>
                                        <path d="M9 17a3 3 0 0 0 6 0" />
                                      </svg>
                                    )
                                  },
                                  {
                                    title: "Beginner's Kit",
                                    desc: 'Funds hand-picked for the first time investors',
                                    icon: (
                                      <svg className="w-[22px] h-[22px] text-[#702082]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="7" width="18" height="13" rx="2" fill="#f5effa"/>
                                        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                                        <path d="M12 12v3"/>
                                      </svg>
                                    )
                                  },
                                  {
                                    title: "India's Leaders",
                                    desc: "Invest in India's leading companies",
                                    icon: (
                                      <svg className="w-[22px] h-[22px] text-[#702082]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 21h18M5 21V7l5 3v11M14 21V3l5 4v14" fill="#f5effa"/>
                                        <circle cx="16" cy="7" r="1"/>
                                        <circle cx="7" cy="11" r="1"/>
                                      </svg>
                                    )
                                  }
                                ].map((idea, i) => (
                                  <div 
                                    key={i} 
                                    onClick={() => {
                                      if (idea.title === 'All Weather Investing') {
                                        setIdeasDetail('All Weather Investing');
                                        setSelectedIdeaFund('SBI Balanced Advantage Fund');
                                      } else if (idea.title === 'Retirement Planning') {
                                        setIdeasDetail('Retirement Planning');
                                        setSelectedIdeaFund('SBI Retirement Benefit Fund Aggressive Plan');
                                      } else if (idea.title === 'Smart Save') {
                                        setIdeasDetail('Smart Save');
                                        setSelectedIdeaFund('SBI Liquid Fund');
                                      } else if (idea.title === "Beginner's Kit") {
                                        setIdeasDetail("Beginner's Kit");
                                        setSelectedIdeaFund('SBI Balanced Advantage Fund');
                                      } else {
                                        toast.success(`Opening ${idea.title}...`);
                                      }
                                    }}
                                    className="bg-white border border-slate-200/90 rounded-2xl p-5 flex items-center justify-between shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
                                  >
                                    <div className="flex items-center gap-4 text-left">
                                      <div className="w-12 h-12 rounded-full bg-[#f5effa] flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
                                        {idea.icon}
                                      </div>
                                      <div>
                                        <h3 className="font-bold text-[14.5px] text-slate-800 leading-snug">
                                          {idea.title}
                                        </h3>
                                        <p className="text-[12.2px] text-slate-400 font-semibold leading-relaxed mt-0.5 max-w-[240px]">
                                          {idea.desc}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="w-9 h-9 rounded-full border border-slate-200/80 flex items-center justify-center text-[#702082] group-hover:bg-[#f5effa] shrink-0 transition-all">
                                      <svg className="w-4 h-4 text-[#702082] transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                      </svg>
                                    </div>
                                  </div>
                                ))}
                                <div className="hidden md:block"></div>
                              </div>
                            )
                          ) : mfSubTab === 'More' ? (
                            /* More Sub-tab: Customized dashboard matching the mockup */
                            <div className="space-y-6 w-full text-left font-sans mt-2">
                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                                {/* Left Side Box */}
                                <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs flex flex-col justify-between min-h-[220px]">
                                  <div className="space-y-6">
                                    <h3 className="font-extrabold text-[22px] text-[#702082] tracking-tight leading-tight select-none">
                                      You do not have any existing investments with us. Invest now!
                                    </h3>
                                    
                                    <div className="divide-y divide-slate-100">
                                      {/* Wishlist Link */}
                                      <div 
                                        onClick={() => {
                                          setMfSubTab('Invest');
                                          setMfFilterTab('Wishlist');
                                        }}
                                        className="flex items-center justify-between py-4 cursor-pointer group"
                                      >
                                        <span className="text-[13.5px] text-slate-700 font-bold select-none group-hover:text-[#702082] transition-colors">
                                          Wishlist
                                        </span>
                                        <ChevronRight size={16} className="text-slate-400 group-hover:text-[#702082] transition-all group-hover:translate-x-0.5" />
                                      </div>

                                      {/* Learn more Link */}
                                      <div 
                                        onClick={() => {
                                          toast.success("Opening Mutual Funds tutorials...");
                                        }}
                                        className="flex items-center justify-between py-4 cursor-pointer group"
                                      >
                                        <span className="text-[13.5px] text-slate-700 font-bold select-none group-hover:text-[#702082] transition-colors">
                                          Learn more about Mutual Funds
                                        </span>
                                        <ChevronRight size={16} className="text-slate-400 group-hover:text-[#702082] transition-all group-hover:translate-x-0.5" />
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Right Side Banner Carousel */}
                                <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs flex flex-col items-center justify-between min-h-[220px]">
                                  <div className="w-full relative overflow-hidden rounded-xl border border-slate-100 flex-1 min-h-[160px] flex items-stretch">
                                    {moreCarouselIndex === 0 ? (
                                      /* Slide 1: Catch the Wave */
                                      <div className="w-full bg-[#005c53] text-white p-5 relative flex flex-col justify-between text-left select-none">
                                        <div>
                                          <div className="flex justify-between items-start">
                                            <div className="text-[9px] font-black tracking-widest text-[#a3e635] uppercase">
                                              Presenting
                                            </div>
                                            {/* Small Logo outline */}
                                            <div className="text-[9px] font-bold text-slate-100 flex items-center gap-1">
                                              <span className="w-1.5 h-1.5 rounded-full bg-[#a3e635]"></span>
                                              SBI MUTUAL FUND
                                            </div>
                                          </div>
                                          <h4 className="text-[15px] font-black tracking-tight mt-1 max-w-[85%] leading-tight text-white uppercase">
                                            SBI NIFTY MIDCAP 150 MOMENTUM 50 ETF FOF
                                          </h4>
                                          <p className="text-[11px] text-slate-200 mt-1 font-bold">
                                            CATCH THE WAVE AS IT BUILDS
                                          </p>
                                        </div>
                                        <div>
                                          <div className="flex items-center gap-4 mt-3">
                                            <button 
                                              type="button"
                                              onClick={() => toast.success("Redirecting to NFO Investment...")}
                                              className="bg-[#a3e635] text-slate-900 font-extrabold text-[10.5px] px-3.5 py-1.5 rounded hover:bg-[#bef264] transition-all shadow-3xs cursor-pointer"
                                            >
                                              Invest Now!
                                            </button>
                                            <span className="text-[10px] font-bold text-[#a3e635]">
                                              NFO Period: 27th Jul - 5th Aug, 2026
                                            </span>
                                          </div>
                                          <div className="text-[7.5px] text-slate-300 font-semibold leading-tight mt-3">
                                            Registered Name: SBI Mutual Fund. SEBI Registration Number: MF/009/93/3. <br />
                                            Mutual Fund investments are subject to market risks, read all scheme related documents carefully.
                                          </div>
                                        </div>
                                        {/* Background waves vector watermark */}
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
                                          <svg className="w-20 h-20 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                            <path d="M2 12c5-5 5 5 10 0s5-5 10 0" />
                                            <path d="M2 16c5-5 5 5 10 0s5-5 10 0" />
                                          </svg>
                                        </div>
                                      </div>
                                    ) : (
                                      /* Slide 2: JanNivesh SIP */
                                      <div className="w-full bg-slate-50 p-5 flex items-stretch justify-between text-left relative overflow-hidden select-none">
                                        <div className="z-10 max-w-[62%] flex flex-col justify-between h-full">
                                          <div>
                                            <div className="text-[9.5px] font-black text-[#e92976] tracking-wider uppercase">
                                              JanNivesh SIP
                                            </div>
                                            <h4 className="text-[14.5px] font-extrabold text-[#302985] mt-1.5 leading-snug">
                                              Viksit Bharat Hoga Desh,<br />Jab Har Koi Kare Nivesh.
                                            </h4>
                                          </div>
                                          <div>
                                            <button 
                                              type="button"
                                              onClick={() => toast.success("Redirecting to JanNivesh SIP...")}
                                              className="bg-[#0070c0] text-white font-black text-[10.5px] px-3.5 py-1.5 rounded-md hover:bg-[#005bb0] transition-all shadow-3xs cursor-pointer mt-2 w-fit"
                                            >
                                              Invest Now
                                            </button>
                                            <div className="text-[7.5px] text-slate-400 font-semibold leading-tight mt-2.5">
                                              Mutual Fund investments are subject to market risks, read all scheme related documents carefully.
                                            </div>
                                          </div>
                                        </div>
                                        {/* Illustration vectors */}
                                        <div className="absolute right-0 bottom-0 top-0 w-[38%] flex items-end justify-center select-none opacity-90 pr-2 pb-1">
                                          <img 
                                            src="/images/landing/WhatsApp Image 2026-08-01 at 9.07.17 PM.jpeg" 
                                            alt="JanNivesh SIP Illustration" 
                                            className="h-[90%] object-contain" 
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Carousel Dot Indicators */}
                                  <div className="flex items-center gap-1.5 justify-center mt-3 select-none">
                                    {[0, 1].map((idx) => (
                                      <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setMoreCarouselIndex(idx)}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                          moreCarouselIndex === idx ? 'bg-[#702082] px-2.5' : 'bg-slate-200'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Bottom Green Banner */}
                              <div className="bg-[#f4fbf7] border border-emerald-100 rounded-2xl p-5 flex items-center justify-between w-full shadow-2xs hover:border-emerald-200 transition-colors select-none">
                                <div className="text-left space-y-1">
                                  <h4 className="text-[15px] font-bold text-[#166534]">
                                    Start investing and achieve your goals faster!
                                  </h4>
                                  <button 
                                    type="button"
                                    onClick={() => toast.success("Opening SIP Calculator...")}
                                    className="text-[13px] font-extrabold text-[#702082] hover:underline flex items-center gap-1 cursor-pointer"
                                  >
                                    Calculate SIP Today &rarr;
                                  </button>
                                </div>
                                <div className="w-16 h-12 flex items-center justify-center opacity-70">
                                  {/* Goal/Piggy bank mini illustration */}
                                  <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          ) : (
                            /* Other Sub-tabs: Coming Soon screen */
                            <div className="bg-white border border-slate-200/90 rounded-2xl py-20 px-8 flex flex-col items-center justify-center w-full select-none shadow-xs">
                              {/* Central Illustration */}
                              <div className="relative w-72 h-56 flex items-center justify-center mb-6">
                                {/* Hourglass in the background */}
                                <svg className="absolute w-44 h-44 text-pink-100/90" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M25 15H75V25C75 40 60 45 53 50C60 55 75 60 75 75V85H25V75C25 60 40 55 47 50C40 45 25 40 25 25V15Z" fill="#FCE7F3" stroke="#FBCFE8" strokeWidth="1.5" strokeLinejoin="round"/>
                                  <path d="M30 20H70" stroke="#FBCFE8" strokeWidth="1.5"/>
                                  <path d="M30 80H70" stroke="#FBCFE8" strokeWidth="1.5"/>
                                  {/* Sand */}
                                  <path d="M33 25H67C65 37 50 42 50 45C50 42 35 37 33 25Z" fill="#F472B6" opacity="0.25"/>
                                  <path d="M48 52C48 52 35 60 33 75H67C65 60 52 52 52 52L48 52Z" fill="#F472B6" opacity="0.35"/>
                                  <circle cx="50" cy="50" r="1.5" fill="#F472B6" />
                                  <circle cx="50" cy="58" r="1.2" fill="#F472B6" />
                                  <circle cx="50" cy="66" r="1.2" fill="#F472B6" />
                                </svg>

                                {/* Dotted Curved Line Arrows & Clouds */}
                                <svg className="absolute w-full h-full" viewBox="0 0 300 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  {/* Left loop arrow */}
                                  <path d="M 75,150 C 50,120 50,85 85,75" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 4"/>
                                  <path d="M 85,75 L 77,75 M 85,75 L 83,83" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round"/>
                                  <path d="M 75,150 L 72,143 M 75,150 L 82,148" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round"/>
                                  
                                  {/* Right loop arrow */}
                                  <path d="M 225,150 C 250,120 250,85 215,75" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 4"/>
                                  <path d="M 215,75 L 223,75 M 215,75 L 217,83" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round"/>
                                  <path d="M 225,150 L 228,143 M 225,150 L 218,148" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round"/>

                                  {/* Left Clouds */}
                                  <path d="M 40,165 A 12,12 0 0,1 60,155 A 16,16 0 0,1 85,160 A 8,8 0 0,1 95,165 M 30,175 A 10,10 0 0,1 40,165 H 105 A 10,10 0 0,1 105,175 Z" fill="#F1F5F9" opacity="0.9"/>
                                  {/* Right Clouds */}
                                  <path d="M 195,165 A 12,12 0 0,1 215,155 A 16,16 0 0,1 240,160 A 8,8 0 0,1 250,165 M 185,175 A 10,10 0 0,1 195,165 H 260 A 10,10 0 0,1 260,175 Z" fill="#F1F5F9" opacity="0.9"/>
                                </svg>

                                {/* Smartphone on top */}
                                <div className="relative w-[78px] h-[138px] bg-white border-[3px] border-[#302985] rounded-[16px] shadow-[0_8px_20px_-6px_rgba(48,41,133,0.2)] flex flex-col items-center justify-between py-3.5 px-2 z-10">
                                  {/* Speaker / Notch */}
                                  <div className="w-8 h-1.5 bg-[#302985] rounded-full shrink-0"></div>
                                  
                                  {/* Progress bar and dots */}
                                  <div className="w-full flex flex-col items-center gap-2 mt-4">
                                    {/* Simulated horizontal loading segments */}
                                    <div className="w-full bg-slate-100 h-2.5 rounded-full p-0.5 flex items-center">
                                      <div className="bg-[#e92976] h-1.5 rounded-full flex gap-0.5 justify-start px-0.5 items-center w-[75%]">
                                        <span className="w-0.5 h-0.5 bg-white rounded-full"></span>
                                        <span className="w-0.5 h-0.5 bg-white rounded-full"></span>
                                        <span className="w-0.5 h-0.5 bg-white rounded-full"></span>
                                      </div>
                                    </div>
                                    
                                    {/* Progress Dots */}
                                    <div className="flex items-center gap-1">
                                      <span className="w-1 h-1 rounded-full bg-[#e92976]"></span>
                                      <span className="w-1 h-1 rounded-full bg-[#e92976]"></span>
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#e92976] animate-pulse"></span>
                                      <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                      <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                    </div>
                                  </div>

                                  {/* Bottom Home Indicator */}
                                  <div className="w-6 h-1 bg-slate-200 rounded-full shrink-0"></div>
                                </div>
                              </div>

                              {/* Text Info */}
                              <h2 className="text-[25px] font-bold text-[#302985] mb-2 select-none tracking-tight">
                                Coming Soon
                              </h2>
                              <p className="text-[13px] text-slate-500 font-medium text-center max-w-[320px] select-none leading-relaxed">
                                We are preparing to help you access this Service shortly
                              </p>
                            </div>
                          )}

                        </div>
                      )}

                    </div>
                  </div>

                </div>
              )}

              {/* Business Loan Banner */}
              {investmentSubTab !== 'Mutual Fund' && <BusinessLoanBanner />}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: INSURANCE (EXACT MATCH TO SCREENSHOT 4) */}
          {/* ========================================================================= */}
          {activeTab === 'Insurance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Left Sidebar Column (3/12 width) */}
                <div className="md:col-span-3 space-y-4">
                  
                  {/* Search Input */}
                  <div className="sbi-search-card">
                    <Search size={16} className="text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search here..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="sbi-search-input"
                    />
                  </div>

                  {/* Action Pill Buttons */}
                  <button
                    type="button"
                    onClick={() => toast('Link Policy option selected')}
                    className="sbi-action-pill-btn flex items-center justify-between"
                  >
                    <span>Link Policy</span>
                    <ChevronRight size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => toast('Buy New Policy option selected')}
                    className="sbi-action-pill-btn flex items-center justify-between"
                  >
                    <span>Buy New Policy</span>
                    <ChevronRight size={14} />
                  </button>

                </div>

                {/* Right Main Content Column (9/12 width) */}
                <div className="md:col-span-9">
                  <div className="sbi-content-card min-h-[440px] p-8 flex flex-col items-center justify-center text-center">
                    
                    {/* Folder with Cross Icon Vector Illustration */}
                    <div className="w-52 h-44 relative mb-6 flex items-center justify-center">
                      <svg viewBox="0 0 180 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        
                        {/* Soft Pink Background Circle */}
                        <circle cx="90" cy="80" r="55" fill="#fce7f3" />

                        {/* Lilac/Purple Folder */}
                        <path d="M50 60 C50 56 53 52 57 52 L80 52 L90 62 L123 62 C127 62 130 65 130 69 L130 110 C130 114 127 118 123 118 L57 118 C53 118 50 114 50 110 Z" fill="#c084fc" opacity="0.85" />
                        
                        {/* Folder Front Flap */}
                        <path d="M45 70 C45 66 48 62 52 62 L128 62 C132 62 135 66 135 70 L135 110 C135 114 132 118 128 118 L52 118 C52 118 45 114 45 110 Z" fill="#a855f7" />

                        {/* Pink Circle with White X Icon */}
                        <circle cx="90" cy="90" r="14" fill="#ec4899" />
                        <path d="M84 84 L96 96 M96 84 L84 96" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />

                        {/* Leaf Foliage behind folder */}
                        <path d="M135 95 Q145 90 148 80 Q142 90 135 95" fill="#a855f7" />
                        <path d="M137 100 Q148 100 150 92 Q143 98 137 100" fill="#ec4899" />
                      </svg>
                    </div>

                    <h3 className="text-lg font-bold text-[#30135d] mb-2">
                      No policies found.
                    </h3>

                    <p className="text-xs text-gray-500 max-w-md mb-6 leading-relaxed">
                      You can link your existing SBI Life policies or explore new policies to meet all your insurance needs.
                    </p>

                  </div>
                </div>

              </div>

              {/* Business Loan Banner */}
              <BusinessLoanBanner />
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: TRANSACTION ACCOUNTS (EXACT MATCH TO REFERENCE IMAGES 1, 2, 3, 4) */}
          {/* ========================================================================= */}
          {activeTab === 'Transaction' && (
            <div className="flex flex-col space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Left Sidebar Column (3/12 width) */}
              <div className="md:col-span-3 space-y-4">
                
                {/* Search Box */}
                <div className="sbi-search-card">
                  <Search size={16} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search here..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="sbi-search-input"
                  />
                </div>

                {txSubTab === 'Spend Analysis' ? (
                  // Special Sidebar Content for Spend Analysis (Matching Screenshot Exactly)
                  <div className="space-y-4 pt-1">
                    <div className="flex justify-end items-center gap-2.5 text-xs font-semibold text-slate-700 pr-2">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-[#702082] focus:ring-[#702082] w-4 h-4 cursor-pointer accent-[#702082]"
                      />
                      <span>Select All</span>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => toast('Add a New Account')}
                        className="text-[#702082] hover:opacity-85 font-bold text-[15px] text-left block transition-opacity"
                      >
                        Add a New Account +
                      </button>
                    </div>

                    <div className="border-b border-slate-200/60 my-4" />

                    <div>
                      <button
                        type="button"
                        onClick={() => toast('Add a New Credit Card')}
                        className="text-[#702082] hover:opacity-85 font-bold text-[15px] text-left block transition-opacity"
                      >
                        Add a New Credit Card +
                      </button>
                    </div>
                  </div>
                ) : (
                  // Standard Sidebar Content for Account Summary, Transactions, and Statements
                  <>
                    {/* Savings Account Card */}
                   <div className="mb-6">
  <div className="bg-[#702082] rounded-2xl px-6 py-5 text-white shadow-sm">
    <p className="text-[11px] font-bold uppercase tracking-wide opacity-80">
      A/C Number
    </p>

    <div className="mt-2 flex items-center gap-2">
      <span className="font-mono text-sm font-semibold tracking-[0.15em] leading-none">
        {showAccountNo ? "10849207054" : "XXXXXXX7054"}
      </span>

      <button
        type="button"
        onClick={() => setShowAccountNo(!showAccountNo)}
        className="flex items-center justify-center hover:opacity-80 transition"
        title={showAccountNo ? "Hide Account Number" : "Show Account Number"}
      >
        {showAccountNo ? (
          <EyeOff size={17} strokeWidth={2} />
        ) : (
          <Eye size={17} strokeWidth={2} />
        )}
      </button>
    </div>
  </div>
</div>
                    {/* Action Buttons */}
                    <button
                      type="button"
                      onClick={() => router.push('/accounts/open-savings-account')}
                      className="w-full text-left bg-[#f3eef9] text-[#702082] text-[13px] font-bold py-7 px-6 rounded-2xl flex items-center justify-between hover:bg-[#e9ddf2] transition-colors border border-transparent"
                    >
                      <span>Apply for a new Savings Account</span>
                      <ArrowRight size={16} className="text-[#702082]" />
                    </button>

                    <button
                      type="button"
                      onClick={() => toast('Opening Joint Savings Account Application')}
                      className="w-full text-left bg-[#f3eef9] text-[#702082] text-[13px] font-bold py-7 px-6 rounded-2xl flex items-center justify-between hover:bg-[#e9ddf2] transition-colors border border-transparent"
                    >
                      <span>Apply for Joint Savings Account</span>
                      <ArrowRight size={16} className="text-[#702082]" />
                    </button>

                    {/* Current Account Section */}
                    <div>
                      <div className="text-sm font-bold text-[#702082] mb-3 mt-6">Current Account</div>
                      <button
                        type="button"
                        onClick={() => toast('Opening Current Account Application')}
                        className="w-full text-left bg-[#f3eef9] text-[#702082] text-[13px] font-bold py-7 px-6 rounded-2xl flex items-center justify-between hover:bg-[#e9ddf2] transition-colors border border-transparent"
                      >
                        <span>Apply for a new Current Account</span>
                        <ArrowRight size={16} className="text-[#702082]" />
                      </button>
                    </div>

                    {/* Additional Links */}
                    <div className="pt-2 space-y-2 text-xs font-bold text-[#673391]">
                      <button type="button" onClick={() => toast('Add a New Account')} className="block hover:underline">
                        Add a New Account +
                      </button>
                      <button type="button" onClick={() => toast('Add a New Credit Card')} className="block hover:underline">
                        Add a New Credit Card +
                      </button>
                    </div>
                  </>
                )}

              </div>

              {/* Right Main Workspace Column (9/12 width) */}
              <div className="md:col-span-9 space-y-4">
                
                {/* Account Top Purple Strip Header */}
                <div className="flex items-center justify-between border-b border-purple-100 pb-0.5">
                  <div className="bg-[#702082] text-white py-2 px-5 rounded-t-xl rounded-b-sm flex items-center gap-4 text-xs font-bold tracking-wide shadow-sm">
                    <span>SAVINGS A/C</span>
                    <span className="font-mono opacity-90">
                      {showAccountNo ? '10849207054' : 'XXXXXXX7054'}
                    </span>
                    <button 
                      type="button" 
                      onClick={() => setShowAccountNo(!showAccountNo)} 
                      className="hover:opacity-85 transition-opacity"
                    >
                      {showAccountNo ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => toast('Manage Account Settings')} 
                    className="text-xs font-bold text-[#702082] hover:underline flex items-center gap-1"
                  >
                    <FileText size={14} className="text-[#702082]" />
                    <span>Manage Account</span>
                  </button>
                </div>

                {/* Sub-Tabs Bar (Account Summary | Transactions | Statements | Spend Analysis) */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 min-h-[460px]">
                  
                  <div className="flex items-center gap-6 border-b border-slate-200 mb-6">
                    {(['Account Summary', 'Transactions', 'Statements', 'Spend Analysis'] as const).map((subTab) => {
                      const isSubActive = txSubTab === subTab;
                      return (
                        <button
                          key={subTab}
                          type="button"
                          onClick={() => setTxSubTab(subTab)}
                          className={`text-sm font-semibold transition-all relative pb-3 -mb-[1px] ${
                            isSubActive ? 'text-[#702082] font-bold' : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          <span>{subTab}</span>
                          {isSubActive && (
                            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#702082] rounded-t" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* SUB-VIEW 1: TRANSACTIONS (EXACT MATCH TO IMAGES 2 & 3) */}
                  {txSubTab === 'Transactions' && (
                    <div className="space-y-4">
                      {/* Search & Filter Control Bar */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
                        <div className="relative flex-1 w-full max-w-md">
                          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Search by name, amount, cheque no.,remarks"
                            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#702082]"
                          />
                        </div>
                        <div className="flex items-center gap-4 text-xs font-semibold">
                          <button type="button" onClick={() => toast('Sort option')} className="flex items-center gap-1.5 text-[#702082] hover:opacity-80 transition-opacity">
                            <ArrowUpDown size={13} />
                            <span>Sort</span>
                          </button>
                          <button type="button" onClick={() => toast('Select Duration option')} className="flex items-center gap-1.5 text-[#702082] hover:opacity-80 transition-opacity">
                            <Calendar size={13} />
                            <span>Select Duration</span>
                          </button>
                          <button type="button" onClick={() => toast('Filters option')} className="flex items-center gap-1.5 text-[#702082] hover:opacity-80 transition-opacity">
                            <Filter size={13} />
                            <span>Filters</span>
                          </button>
                        </div>
                      </div>

                      {/* Transactions Table (Matching Screenshot Exact Rows dynamically) */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-[#f4edf9] text-[#702082] font-bold border-b border-[#e9ddf2]">
                              <th className="py-2.5 px-4">Date</th>
                              <th className="py-2.5 px-4">Description</th>
                              <th className="py-2.5 px-4 text-right">Amount (Rs.)</th>
                              <th className="py-2.5 px-4 text-right">Balance (Rs.)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                            {getPageData(currentPage).slice(0, rowsPerPage).map((tx, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/40 transition-colors">
                                <td className="py-3 px-4 font-semibold text-slate-800">{tx.date}</td>
                                <td className="py-3 px-4 max-w-md leading-relaxed text-slate-600">
                                  {tx.description}
                                </td>
                                <td className={`py-3 px-4 text-right font-bold ${tx.isDebit ? 'text-red-600' : 'text-emerald-600'}`}>
                                  {tx.isDebit ? '↗' : '↙'} ₹ {Number(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="py-3 px-4 text-right font-bold text-slate-800">
                                  ₹{Number(tx.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination Bar (Matching Screenshot 2 Exactly and fully responsive) */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 mt-4 border-t border-slate-100 text-xs text-slate-500 font-semibold">
                        <div className="hidden sm:block w-32"></div>
                        
                        <div className="flex items-center gap-4">
                          <button 
                            type="button" 
                            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`transition-colors ${currentPage === 1 ? 'text-slate-400 cursor-not-allowed' : 'text-[#702082] hover:underline'}`}
                          >
                            Previous
                          </button>
                          
                          {[1, 2, 3].map((page) => (
                            <button 
                              key={page}
                              type="button" 
                              onClick={() => setCurrentPage(page)}
                              className={`w-6 h-6 rounded flex items-center justify-center font-bold transition-all ${
                                currentPage === page 
                                  ? 'bg-[#702082] text-white' 
                                  : 'text-slate-600 hover:text-[#702082] hover:bg-purple-50'
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                          
                          <span className="w-6 h-6 flex items-center justify-center">...</span>
                          
                          <button 
                            type="button" 
                            onClick={() => setCurrentPage(15)}
                            className={`w-6 h-6 rounded flex items-center justify-center font-bold transition-all ${
                              currentPage === 15 
                                ? 'bg-[#702082] text-white' 
                                : 'text-slate-600 hover:text-[#702082] hover:bg-purple-50'
                            }`}
                          >
                            15
                          </button>
                          
                          <button 
                            type="button" 
                            onClick={() => currentPage < 15 && setCurrentPage(currentPage + 1)}
                            disabled={currentPage === 15}
                            className={`text-[#702082] hover:underline flex items-center gap-0.5 ${currentPage === 15 ? 'text-slate-400 cursor-not-allowed' : ''}`}
                          >
                            <span>Next</span>
                            <span>›</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2 text-slate-600 font-semibold">
                          <span>Rows per page</span>
                          <div className="relative">
                            <select 
                              value={rowsPerPage}
                              onChange={(e) => setRowsPerPage(Number(e.target.value))}
                              className="appearance-none border border-slate-200 rounded px-2.5 py-0.5 pr-6 bg-white focus:outline-none focus:border-[#702082] text-xs font-semibold cursor-pointer"
                            >
                              <option value={10}>10</option>
                              <option value={20}>20</option>
                              <option value={50}>50</option>
                            </select>
                            <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-VIEW 2: STATEMENTS (EXACT MATCH TO IMAGES 1 & 2) */}
                  {txSubTab === 'Statements' && (
                    <div className="space-y-6 max-w-4xl">
                      <h3 className="text-base font-extrabold text-[#702082] tracking-wide">Request Statement</h3>
                      
                      {/* Radio Select Row (Aligned using the exact same grid column layout as the dropdowns below) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                        <label className={`flex items-center gap-2.5 cursor-pointer select-none transition-colors ${stmtOption === 'duration' ? 'text-slate-800 font-medium' : 'text-slate-400 font-normal'}`}>
                          <input
                            type="radio"
                            name="stmtOption"
                            checked={stmtOption === 'duration'}
                            onChange={() => setStmtOption('duration')}
                            className="accent-[#702082] w-4 h-4 cursor-pointer"
                          />
                          <span>Select Duration</span>
                        </label>
                        <label className={`flex items-center gap-2.5 cursor-pointer select-none transition-colors ${stmtOption === 'fy' ? 'text-slate-800 font-medium' : 'text-slate-400 font-normal'}`}>
                          <input
                            type="radio"
                            name="stmtOption"
                            checked={stmtOption === 'fy'}
                            onChange={() => setStmtOption('fy')}
                            className="accent-[#702082] w-4 h-4 cursor-pointer"
                          />
                          <span>Select Financial Year</span>
                        </label>
                      </div>
 
                      {/* Dropdown Selectors Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-2">
                        {/* Duration Field */}
                        <div>
                          <div className="relative">
                            <select 
                              value={stmtDuration}
                              onChange={(e) => setStmtDuration(e.target.value)}
                              disabled={stmtOption !== 'duration'}
                              className={`w-full py-2 bg-transparent border-b focus:outline-none pr-8 text-sm font-normal cursor-pointer appearance-none transition-colors opacity-100 disabled:opacity-100 ${
                                stmtOption === 'duration' 
                                  ? 'text-slate-600 border-slate-300 focus:border-[#702082]' 
                                  : 'text-slate-300 border-slate-100'
                              }`}
                            >
                              <option value="Duration">Duration</option>
                              <option value="1 Month">1 Month</option>
                              <option value="3 Months">3 Months</option>
                              <option value="6 Months">6 Months</option>
                              <option value="1 Year">1 Year</option>
                            </select>
                            <ChevronDown 
                              size={16} 
                              className={`absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
                                stmtOption === 'duration' ? 'text-[#702082]' : 'text-slate-300'
                              }`} 
                            />
                          </div>
                        </div>
 
                        {/* Financial Year Field */}
                        <div>
                          <div className="relative">
                            <select 
                              value={stmtFy}
                              onChange={(e) => setStmtFy(e.target.value)}
                              disabled={stmtOption !== 'fy'}
                              className={`w-full py-2 bg-transparent border-b focus:outline-none pr-8 text-sm font-normal cursor-pointer appearance-none transition-colors opacity-100 disabled:opacity-100 ${
                                stmtOption === 'fy' 
                                  ? 'text-slate-600 border-slate-300 focus:border-[#702082]' 
                                  : 'text-slate-300 border-slate-100'
                              }`}
                            >
                              <option value="Financial Year">Financial Year</option>
                              <option value="2025-2026">2025 - 2026</option>
                              <option value="2024-2025">2024 - 2025</option>
                              <option value="2023-2024">2023 - 2024</option>
                            </select>
                            <ChevronDown 
                              size={16} 
                              className={`absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
                                stmtOption === 'fy' ? 'text-[#702082]' : 'text-slate-300'
                              }`} 
                            />
                          </div>
                        </div>

                        {/* Format Selector */}
                        <div>
                          <div className="relative">
                            <select 
                              value={stmtFormat}
                              onChange={(e) => setStmtFormat(e.target.value)}
                              className="w-full py-2 bg-transparent border-b border-slate-300 focus:outline-none focus:border-[#702082] pr-8 text-sm font-normal text-slate-600 cursor-pointer appearance-none transition-colors"
                            >
                              <option value="Format">Format</option>
                              <option value="PDF">PDF</option>
                              <option value="Excel">Excel</option>
                              <option value="Text">Text</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-0 top-1/2 -translate-y-1/2 text-[#702082] pointer-events-none" />
                          </div>
                        </div>

                        {/* Spacer empty cell */}
                        <div className="hidden md:block"></div>
                      </div>
 
                      {/* Checkboxes */}
                      <div className="space-y-4 pt-2 text-[13px] font-normal text-slate-500">
                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={includeAllSummary}
                            onChange={(e) => setIncludeAllSummary(e.target.checked)}
                            className="rounded border-slate-300 text-[#702082] focus:ring-[#702082] w-4 h-4 cursor-pointer accent-[#702082]"
                          />
                          <div className="flex items-center gap-1">
                            <span>Include all account summary</span>
                            <span className="text-[#702082] font-normal text-sm cursor-help hover:opacity-80">ⓘ</span>
                          </div>
                        </label>
 
                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={includeNominee}
                            onChange={(e) => setIncludeNominee(e.target.checked)}
                            className="rounded border-slate-300 text-[#702082] focus:ring-[#702082] w-4 h-4 cursor-pointer accent-[#702082]"
                          />
                          <span>Include nominee details</span>
                        </label>
                      </div>

                      {/* Password Logic Info Callout Box */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                          <span>Password Logic</span>
                          <span className="text-[#702082] text-[13px] font-bold cursor-help hover:opacity-80">ⓘ</span>
                        </div>
                        <div className="bg-[#f5effa] border border-[#e2d4eb] rounded-lg p-3 text-xs flex items-center gap-2">
                          <span className="text-[#702082] text-sm font-bold">ⓘ</span>
                          <span className="font-semibold text-[#702082]">Maximum 5 downloads per account in day. 2000 transactions per download.</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-VIEW 3: SPEND ANALYSIS (EXACT MATCH TO IMAGE 3 & 4) */}
                  {txSubTab === 'Spend Analysis' && (
                    <div className="space-y-6">
                      <h2 className="text-3xl font-bold text-[#702082] tracking-tight">
                        Welcome to your Spend Analysis!
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                        
                        {/* Left Card Callout (Fitted with h-full flex layout to stretch alongside the right column) */}
                        <div className="relative overflow-hidden bg-[#f6ecf5] rounded-2xl p-6 py-8 shadow-sm border border-[#702082]/5 h-full flex flex-col justify-center">
                          
                          {/* Beautiful Abstract Pink Waves Background matching screenshot exactly */}
                          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
                            <svg className="absolute right-0 bottom-0 w-[120%] h-full" viewBox="0 0 360 160" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                              {/* Darker Wave */}
                              <path d="M60 160 C150 115 250 55 360 75 L360 160 Z" fill="#edd6ea" />
                              {/* Lighter Wave */}
                              <path d="M0 160 C100 135 200 95 360 105 L360 160 Z" fill="#f5e1f3" opacity="0.95" />
                              {/* Bottom Left Wave */}
                              <path d="M0 130 C40 130 70 145 90 160 L0 160 Z" fill="#eed8ea" opacity="0.75" />
                            </svg>
                          </div>

                          <div className="relative z-10 space-y-4">
                            <h3 className="text-[15px] font-bold text-slate-800 tracking-wide">Take control of your Spendings!</h3>
                            <ul className="space-y-2.5 text-[13px] font-semibold text-slate-700">
                              <li className="flex items-center gap-2">
                                <span className="text-slate-800 text-lg leading-none">•</span>
                                <span>Smarter Insights. Better Decisions</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="text-slate-800 text-lg leading-none">•</span>
                                <span>View Spend Summary</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="text-slate-800 text-lg leading-none">•</span>
                                <span>Interactive Graphs</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="text-slate-800 text-lg leading-none">•</span>
                                <span>Manage Budget</span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        {/* Right Column: Graphic at the top and Button at the bottom (Stretched to match Left Card height exactly) */}
                        <div className="flex flex-col justify-between h-full py-1">
                          
                          {/* Graphic Container (Aligned to the top) */}
                          <div className="w-full flex justify-center md:justify-end md:pr-4">
                            <div className="w-72 h-44 relative flex items-center justify-center">
                              <svg viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                {/* Background Soft Purple Circle */}
                                <circle cx="120" cy="90" r="70" fill="#f3e8ff" opacity="0.6" />
                                
                                {/* Notepad / Clipboard */}
                                <rect x="70" y="30" width="70" height="110" rx="8" fill="#ffffff" stroke="#673391" strokeWidth="3" />
                                <rect x="80" y="24" width="50" height="12" rx="4" fill="#673391" />
                                
                                {/* Rupee Circle Badge */}
                                <circle cx="125" cy="45" r="10" fill="#d92588" />
                                <text x="125" y="49" fontSize="11" fontWeight="bold" fill="#ffffff" textAnchor="middle">₹</text>

                                {/* Checklist items inside notepad */}
                                <rect x="80" y="65" width="12" height="12" rx="3" fill="#fbcfe8" />
                                <line x1="98" y1="71" x2="128" y2="71" stroke="#673391" strokeWidth="2.5" strokeLinecap="round" />

                                <rect x="80" y="85" width="12" height="12" rx="3" fill="#fbcfe8" />
                                <line x1="98" y1="91" x2="128" y2="91" stroke="#673391" strokeWidth="2.5" strokeLinecap="round" />

                                <rect x="80" y="105" width="12" height="12" rx="3" fill="#fbcfe8" />
                                <line x1="98" y1="111" x2="128" y2="111" stroke="#673391" strokeWidth="2.5" strokeLinecap="round" />

                                {/* Wallet & Calculator Graphics */}
                                <rect x="135" y="90" width="45" height="55" rx="6" fill="#302985" />
                                <circle cx="145" cy="115" r="4" fill="#ffffff" />
                                <path d="M150 70 L180 70 L170 90 Z" fill="#d92588" opacity="0.4" />
                              </svg>
                            </div>
                          </div>
                          
                          {/* Let's Get Started Button (Aligned to the bottom and matches width of graphic above) */}
                          <div className="w-full flex justify-center md:justify-end md:pr-4">
                            <button
                              type="button"
                              onClick={() => toast.success('Spend Analysis setup started!')}
                              className="py-3 px-10 text-sm font-bold rounded-full bg-[#702082] text-white hover:bg-[#5c1a6b] transition-all flex items-center justify-center gap-2 shadow-sm w-60 sm:w-64 cursor-pointer"
                            >
                              <span>Let's Get Started</span>
                              <ArrowRight size={16} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Tutorials & FAQs Sub-Tabs (Matching User Image 2) */}
                      <div className="pt-6">
                        <div className="flex items-center gap-6 mb-4">
                          <button
                            type="button"
                            onClick={() => setSpendSubTab('Tutorials')}
                            className={`text-xs font-bold transition-all relative pb-2 ${
                              spendSubTab === 'Tutorials' ? 'text-[#702082]' : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            <span>Tutorials</span>
                            {spendSubTab === 'Tutorials' && (
                              <div className="absolute bottom-0 left-0 right-0 h-[3.5px] bg-[#702082] rounded-full" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => setSpendSubTab('FAQs')}
                            className={`text-xs font-bold transition-all relative pb-2 ${
                              spendSubTab === 'FAQs' ? 'text-[#702082]' : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            <span>FAQs</span>
                            {spendSubTab === 'FAQs' && (
                              <div className="absolute bottom-0 left-0 right-0 h-[3.5px] bg-[#702082] rounded-full" />
                            )}
                          </button>
                        </div>

                        {spendSubTab === 'Tutorials' ? (
                          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                            {/* Learn More about Spend Analysis Card Box */}
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-sm font-bold text-slate-800">Learn More about Spend Analysis</h3>
                              <button
                                type="button"
                                onClick={() => toast.success('Opening all Spend Analysis tutorials')}
                                className="text-xs font-bold text-[#702082] hover:underline"
                              >
                                View All
                              </button>
                            </div>

                            {/* 4 Video Cards Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                              
                              {/* Card 1 */}
                              <div className="flex flex-col space-y-2 group cursor-pointer" onClick={() => toast.success('Playing: Get to Know Your Spending Patterns')}>
                                <div className="bg-gradient-to-br from-[#2a0845] to-[#642b73] h-32 rounded-xl relative p-3 flex flex-col justify-between overflow-hidden shadow-xs group-hover:shadow-md transition-shadow">
                                  <div className="flex justify-end">
                                    <span className="text-white/70 hover:text-white text-xs">⋮</span>
                                  </div>
                                  <div className="flex items-center justify-center">
                                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                      <Play size={18} className="fill-white ml-0.5" />
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between text-white/80 text-[10px]">
                                    <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                                      <div className="w-1/3 h-full bg-[#d92588]"></div>
                                    </div>
                                    <Volume2 size={12} className="ml-2" />
                                  </div>
                                </div>
                                <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#673391] transition-colors leading-tight">
                                  Get to Know Your Spending Patterns
                                </h4>
                                <p className="text-[11px] text-slate-500 leading-normal line-clamp-3">
                                  See how Spend Analysis breaks down your daily expenses in a clear, simple way for better financial insights.
                                </p>
                              </div>

                              {/* Card 2 */}
                              <div className="flex flex-col space-y-2 group cursor-pointer" onClick={() => toast.success('Playing: Easy Way to Manage Your Budget')}>
                                <div className="bg-gradient-to-br from-[#2a0845] to-[#642b73] h-32 rounded-xl relative p-3 flex flex-col justify-between overflow-hidden shadow-xs group-hover:shadow-md transition-shadow">
                                  <div className="flex justify-end">
                                    <span className="text-white/70 hover:text-white text-xs">⋮</span>
                                  </div>
                                  <div className="flex items-center justify-center">
                                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                      <Play size={18} className="fill-white ml-0.5" />
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between text-white/80 text-[10px]">
                                    <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                                      <div className="w-1/2 h-full bg-[#d92588]"></div>
                                    </div>
                                    <Volume2 size={12} className="ml-2" />
                                  </div>
                                </div>
                                <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#673391] transition-colors leading-tight">
                                  Easy Way to Manage Your Budget
                                </h4>
                                <p className="text-[11px] text-slate-500 leading-normal line-clamp-3">
                                  A quick guide to setting up, tracking, and staying on top of your monthly budget.
                                </p>
                              </div>

                              {/* Card 3 */}
                              <div className="flex flex-col space-y-2 group cursor-pointer" onClick={() => toast.success('Playing: All Your Spending, in One Visual View')}>
                                <div className="bg-gradient-to-br from-[#2a0845] to-[#642b73] h-32 rounded-xl relative p-3 flex flex-col justify-between overflow-hidden shadow-xs group-hover:shadow-md transition-shadow">
                                  <div className="flex justify-end">
                                    <span className="text-white/70 hover:text-white text-xs">⋮</span>
                                  </div>
                                  <div className="flex items-center justify-center">
                                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                      <Play size={18} className="fill-white ml-0.5" />
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between text-white/80 text-[10px]">
                                    <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                                      <div className="w-2/3 h-full bg-[#d92588]"></div>
                                    </div>
                                    <Volume2 size={12} className="ml-2" />
                                  </div>
                                </div>
                                <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#673391] transition-colors leading-tight">
                                  All Your Spending, in One Visual View
                                </h4>
                                <p className="text-[11px] text-slate-500 leading-normal line-clamp-3">
                                  Explore the features and visuals that give you a clear, meaningful view of your money.
                                </p>
                              </div>

                              {/* Card 4 */}
                              <div className="flex flex-col space-y-2 group cursor-pointer" onClick={() => toast.success('Playing: Turn Your Card Statements into Quick Insights')}>
                                <div className="bg-gradient-to-br from-[#2a0845] to-[#642b73] h-32 rounded-xl relative p-3 flex flex-col justify-between overflow-hidden shadow-xs group-hover:shadow-md transition-shadow">
                                  <div className="flex justify-end">
                                    <span className="text-white/70 hover:text-white text-xs">⋮</span>
                                  </div>
                                  <div className="flex items-center justify-center">
                                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                      <Play size={18} className="fill-white ml-0.5" />
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between text-white/80 text-[10px]">
                                    <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                                      <div className="w-1/4 h-full bg-[#d92588]"></div>
                                    </div>
                                    <Volume2 size={12} className="ml-2" />
                                  </div>
                                </div>
                                <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#673391] transition-colors leading-tight">
                                  Turn Your Card Statements into Quick Insights
                                </h4>
                                <p className="text-[11px] text-slate-500 leading-normal line-clamp-3">
                                  Gain a complete, integrated view of your spending by uploading your credit card statements.
                                </p>
                              </div>

                            </div>
                          </div>
                        ) : (
                          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-xs">
                            <div className="divide-y divide-slate-100">
                              {[
                                {
                                  q: "1. What is 'Spend Analysis'?",
                                  a: "Spend Analysis is a personal finance tool that automatically categorizes your transaction records (such as shopping, travel, groceries, utilities, etc.) to give you a clear graphical overview of where your money is spent."
                                },
                                {
                                  q: "2. How do I use spend analytics?",
                                  a: "Simply click on the subtabs under 'Transaction Accounts' to explore interactive charts, track category-wise spend summaries, compare monthly averages, and set budget limits."
                                },
                                {
                                  q: "3. How do I create a budget?",
                                  a: "You can allocate specific monthly budget targets for various categories under Spend Settings. We will notify you dynamically when you approach or exceed these limits."
                                },
                                {
                                  q: "4. How do I see an analysis of my spend across all bank accounts (across all banks - SBI and non SBI)?",
                                  a: "By using the secure Account Aggregator facility, you can consent to link statements from your accounts at other participating banks. The engine will aggregate and display a unified spend analysis across all banks."
                                },
                                {
                                  q: "5. What happens if I overshoot my budget?",
                                  a: "When your spending in any category hits 80% or 100% of your set limit, you will receive real-time alerts so you can take control of further outlays."
                                },
                                {
                                  q: "6. Can I view analytics on my credit card spends?",
                                  a: "Yes, you can view card analytics by linking your SBI Credit Cards or manually importing monthly card statement files."
                                },
                                {
                                  q: "7. How are the insights generated, and can I rely on them for financial planning?",
                                  a: "Insights are computed by an automated classification engine based on merchant category codes and transaction descriptors. While highly reliable for visual budgeting, they should be cross-referenced with bank statements for legal or tax planning."
                                }
                              ].map((faq, index) => {
                                const isExpanded = expandedFaq === index;
                                return (
                                  <div key={index} className="transition-all">
                                    <div
                                      onClick={() => setExpandedFaq(isExpanded ? null : index)}
                                      className="w-full flex items-center justify-between py-4 text-left cursor-pointer select-none group"
                                    >
                                      <span className={`text-[13px] font-medium transition-colors ${isExpanded ? 'text-[#702082] font-semibold' : 'text-slate-700 group-hover:text-[#702082]'}`}>
                                        {faq.q}
                                      </span>
                                      <ChevronDown
                                        size={16}
                                        className={`text-slate-400 group-hover:text-[#702082] transition-all duration-200 shrink-0 ml-4 ${isExpanded ? 'rotate-180 text-[#702082]' : ''}`}
                                      />
                                    </div>
                                    
                                    {isExpanded && (
                                      <div className="pb-4 pt-1 pl-4 pr-4 text-xs text-slate-500 font-normal leading-relaxed bg-[#fcfaff]/80 rounded-lg mb-2">
                                        {faq.a}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* SUB-VIEW 4: ACCOUNT SUMMARY */}
                  {txSubTab === 'Account Summary' && (
                    <div className="space-y-6 pt-2">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Left side details (7 columns) */}
                        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs text-[#8e8e8e] font-normal">
                          
                          <div className="space-y-4">
                            <div>
                              <div className="mb-0.5">Account Description</div>
                              <div className="text-[#1a1a1a] font-bold text-[13px] leading-snug">
                                REGULAR SB NCHQ-INDIVIDUALS
                              </div>
                            </div>
                            
                            <div>
                              <div className="mb-0.5">Mode of Operation</div>
                              <div className="text-[#1a1a1a] font-bold text-[13px]">
                                Single
                              </div>
                            </div>
                            
                            <div>
                              <div className="mb-0.5">Nominee(s)</div>
                              <button
                                type="button"
                                onClick={() => toast.success("Nominee: D SHYAMSUNDER (Father)")}
                                className="text-[#702082] hover:underline font-bold text-[13px] text-left block"
                              >
                                View Details
                              </button>
                            </div>
                          </div>

                          <div className="space-y-4 font-normal">
                            <div>
                              <div className="mb-0.5">Currency</div>
                              <div className="text-[#1a1a1a] font-bold text-[13px]">
                                Rupees
                              </div>
                            </div>
                            
                            <div>
                              <div className="mb-0.5">Rate of Interest</div>
                              <div className="text-[#1a1a1a] font-bold text-[13px]">
                                2.50%
                              </div>
                            </div>
                          </div>

                        </div>

                        {/* Right side balance card box (5 columns) */}
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

                      {/* Divider and Debit Card Button */}
                      <div className="border-t border-slate-200/60 pt-6 mt-4">
                        <button
                          type="button"
                          onClick={() => toast.success("Opening Debit Card Management...")}
                          className="bg-white border border-slate-200/80 hover:border-purple-200 hover:bg-purple-50/10 rounded-xl p-4 flex items-center justify-between w-full max-w-sm shadow-sm transition-all"
                        >
                          <div className="text-left font-medium">
                            <div className="text-[#1a1a1a] font-bold text-sm">Debit Card</div>
                            <div className="text-slate-500 text-xs mt-0.5">View, Apply & Manage</div>
                          </div>
                          <ChevronRight size={16} className="text-slate-400" />
                        </button>
                      </div>
                    </div>
                  )}

                </div>

              </div>
            </div>

            {/* If subtab is Statements, render the full-width Action Bar below the columns! */}
              {txSubTab === 'Statements' && (
                <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] border-t border-slate-300 bg-gradient-to-b from-[#ffffff] to-[#eaeaea] py-5 shadow-inner mt-6 overflow-hidden">
                  <div className="max-w-[1360px] mx-auto flex items-center justify-end gap-8 px-8">
                    <button
                      type="button"
                      onClick={() => toast.success('Statement uploaded to DigiLocker successfully!')}
                      className="text-[#4b5563] hover:text-slate-800 text-sm font-bold transition-colors py-2"
                    >
                      Upload to Digilocker
                    </button>
                    <button
                      type="button"
                      onClick={() => toast.success('Statement sent to registered email!')}
                      className="py-2.5 px-10 text-sm font-bold rounded-full border border-slate-400 bg-white/70 text-[#4b5563] hover:bg-slate-50 hover:border-slate-500 transition-all w-36 sm:w-40 shadow-sm text-center cursor-pointer"
                    >
                      Email
                    </button>
                    <button
                      type="button"
                      onClick={() => toast.success('Statement downloaded successfully!')}
                      className="py-2.5 px-10 text-sm font-bold rounded-full border border-slate-400 bg-white/70 text-[#4b5563] hover:bg-slate-50 hover:border-slate-500 transition-all w-36 sm:w-40 shadow-sm text-center cursor-pointer"
                    >
                      Download
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: LOANS (EXACT MATCH TO SCREENSHOT 1) */}
          {/* ========================================================================= */}
        

          {/* ========================================================================= */}
          {/* TAB 5: INSURANCE (EXACT MATCH TO USER REFERENCE SCREENSHOT) */}
          {/* ========================================================================= */}
         
        </div>

      </main>

      {/* Dark Grey Footer Bar */}
      <footer className="bg-[#333333] text-white py-3 w-full mt-auto border-t border-neutral-800">
        <div className="max-w-[1400px] mx-auto flex justify-center items-center gap-4 text-xs font-medium">
          <a href="https://sbi.bank.in" target="_blank" rel="noopener noreferrer" className="text-white underline hover:opacity-85">
            About SBI
          </a>
          <span className="opacity-60">|</span>
          <a href="https://onlinesbi.sbi.bank.in" target="_blank" rel="noopener noreferrer" className="text-white underline hover:opacity-85">
            Terms &amp; Conditions
          </a>
          <span className="opacity-60">|</span>
          <a href="https://sbi.bank.in" target="_blank" rel="noopener noreferrer" className="text-white underline hover:opacity-85">
            Privacy Policy
          </a>
        </div>
      </footer>

      {/* Disclaimer Modal (Exact Match to Screenshot 5) */}
      {showDisclaimer && (
        <div 
          className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
          onClick={() => setShowDisclaimer(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative border border-slate-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#702082]">Disclaimer</h3>
              <button 
                type="button" 
                onClick={() => setShowDisclaimer(false)}
                className="text-slate-400 hover:text-[#702082] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="text-[11px] text-slate-600 leading-relaxed font-normal mt-4 space-y-4 max-h-[350px] overflow-y-auto pr-1">
              <div>
                <span className="font-bold block text-slate-700 mb-0.5">Registered & Corporate Office:</span>
                <p>
                  SBICAP Securities Limited, Marathon Futurex, Unit No. 1201, B-Wing, 12th Floor, N M Joshi Marg, Mafatlal Mill Compound, Lower Parel East, Mumbai 400013.
                </p>
                <p className="mt-1">
                  Corporate Identification Number (CIN): U65999MH2005PLC155485 | <a href="https://www.sbisecurities.in" target="_blank" rel="noopener noreferrer" className="text-[#702082] hover:underline font-semibold">www.sbisecurities.in</a>
                </p>
                <p className="mt-1">
                  NSE, BSE, MCX-SX & MCX | SEBI Registration No.: Stock Broker: INZ000200032 | DP Registration No.: IN-DP-314-2017
                </p>
                <p className="mt-1">
                  Research Analyst: INH000000602 | IRDA: CA0103 | AMFI ARN No. 0011
                </p>
              </div>

              <p>
                Investment in securities market are subject to market risks, read all the related documents carefully before investing. Mutual Fund investments are subject to market risks, read all scheme related documents carefully. The information is only for consumption by the client and such material should not be redistributed. We are a distributor of Mutual Funds, NCDs, Bonds, IPOs and Corporate FDs. Equity SIP is not an approved product of the Exchange and any dispute related to this will not be dealt at Exchange platform.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-4 border-t border-slate-100 mt-5">
              <button
                type="button"
                onClick={() => {
                  setShowDisclaimer(false);
                  toast.success("Redirecting to SBICAP Securities portal...");
                }}
                className="bg-[#702082] hover:bg-[#5c1a6b] text-white px-8 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* No Pending Requests Warning Modal (Exact Match to User Screenshot 4) */}
      {showNoRequestsModal && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
          onClick={() => setShowNoRequestsModal(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button Top Right */}
            <button 
              type="button" 
              onClick={() => setShowNoRequestsModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Modal Title */}
            <h3 className="text-lg font-bold text-[#673391] mb-6">No pending requests</h3>

            {/* Modal Body with Purple Warning Triangle & Text */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center mb-8">
              <div className="md:col-span-5 flex justify-center">
                <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 h-28">
                  {/* Triangle Warning */}
                  <path d="M70 20 L115 90 L25 90 Z" fill="none" stroke="#9d227b" strokeWidth="4" strokeLinejoin="round" />
                  <path d="M70 42 L70 65" stroke="#9d227b" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="70" cy="76" r="2.5" fill="#9d227b" />

                  {/* Ground/Desert details */}
                  <path d="M10 105 Q50 95 90 105 T160 105" stroke="#e2d8ee" strokeWidth="2" strokeDasharray="3 3" fill="none" />
                  <g transform="translate(15, 80)">
                    <path d="M5 25 L5 10 M5 15 L0 12 M5 18 L10 15" stroke="#c0a5d4" strokeWidth="2" strokeLinecap="round" />
                  </g>
                </svg>
              </div>

              <div className="md:col-span-7">
                <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                  There are no pending requests that requires your approval (BSTDC038)
                </p>
              </div>
            </div>

            {/* Modal Footer: Okay Button */}
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowNoRequestsModal(false);
                  router.push('/home/landingPage/manageRelationship/deposits');
                }}
                className="border border-[#673391] text-[#673391] hover:bg-[#673391] hover:text-white px-8 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FIXED SBI GLOBAL FOOTER (16px Roboto, Fixed at Bottom at All Times) */}
      <SbiFixedFooter />

    </div>
  );
}

export default function SbiLandingPageComponent(props: SbiLandingPageComponentProps) {
  return (
    <Suspense fallback={null}>
      <SbiLandingPageComponentContent {...props} />
    </Suspense>
  );
}

{/* Business Loan Banner Component (Exact Match to Screenshot 5) */}
function BusinessLoanBanner() {
  const router = useRouter();

  return (
    <div className="sbi-business-banner">
      <div className="sbi-bb-content">
        <h3 className="sbi-bb-title">Apply for a Business Loan</h3>
        <button
          type="button"
          onClick={() => {
            toast.success('Checking Business Loan Eligibility...');
            router.push('/home/landingPage/manageRelationship/loans/loans');
          }}
          className="sbi-bb-btn"
        >
          Click here to check your eligibility
        </button>
      </div>

      {/* Decorative Translucent Overlapping Circles Graphic */}
      <div className="sbi-bb-circles">
        <div className="sbi-circle-1"></div>
        <div className="sbi-circle-2"></div>
      </div>
    </div>
  );
}
