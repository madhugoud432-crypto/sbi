'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import SbiGlobalBrandHeader from '@/components/banking/SbiGlobalBrandHeader';
import SbiFixedFooter from '@/components/banking/SbiFixedFooter';

export default function InvestmentsRelationshipOverviewPage() {
  const [activeSubTab, setActiveSubTab] = useState<'Mutual Fund' | 'Demat & Securities' | 'PPF' | 'NPS' | 'IPO'>('Mutual Fund');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="dashboard-wrapper min-h-screen flex flex-col bg-[#f3f4f9]">
      
      {/* Global Header */}
      <SbiGlobalBrandHeader activeNav="Accounts" />

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
              const isActive = tabLabel === 'Investments';
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

        {/* Main Content Workspace Container (Solid PURE WHITE Background matching Screenshot media__1785954384416.png) */}
        <div className="bg-white rounded-b-3xl rounded-tr-3xl border border-slate-200/70 shadow-sm p-6 sm:p-8 -mt-[1px] relative z-0 min-h-[480px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ================= LEFT SIDEBAR (3 of 12) ================= */}
            <div className="lg:col-span-3 space-y-3">
              
              {/* Search Box */}
              <div className="bg-white border border-slate-200/90 rounded-xl px-3 py-2 flex items-center gap-2 shadow-2xs max-w-[245px] h-[40px] mb-4">
                <img src="/assets/images/landing-page/search.svg" alt="Search" className="w-5 h-5 opacity-70" />
                <input 
                  type="text" 
                  placeholder="Search here..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-800 bg-transparent focus:outline-none placeholder:text-slate-400"
                />
              </div>

              {/* Sub-Tab Links */}
              {(['Mutual Fund', 'Demat & Securities', 'PPF', 'NPS', 'IPO'] as const).map((subTab) => {
                const isActive = activeSubTab === subTab;
                return (
                  <div
                    key={subTab}
                    onClick={() => setActiveSubTab(subTab)}
                    className={`rounded-xl p-3.5 text-xs font-bold transition-all cursor-pointer shadow-2xs select-none ${
                      isActive 
                        ? 'bg-[#673391] text-white font-extrabold' 
                        : 'bg-[#f4edf9] hover:bg-[#ebdcf5] text-[#673391]'
                    }`}
                  >
                    <span>{subTab}</span>
                  </div>
                );
              })}

            </div>

            {/* ================= RIGHT MAIN CONTENT PANEL (9 of 12) ================= */}
            <div className="lg:col-span-9 flex flex-col items-center justify-center min-h-[380px] pt-4 select-none">
              
              {/* Phone & Hourglass Vector Graphic */}
              <div className="relative w-72 h-48 flex items-center justify-center mb-6">
                {/* Soft background clouds */}
                <div className="absolute inset-0 flex items-center justify-center opacity-70">
                  <svg className="w-64 h-40 text-purple-100/90" viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 100 C30 70 70 70 90 90 C110 60 160 70 180 90 C200 80 220 90 230 100 Z" fill="#F3E8FF"/>
                    <path d="M10 110 C30 90 60 100 80 110 C120 80 170 100 200 110 Z" fill="#E9D5FF" opacity="0.6"/>
                  </svg>
                </div>

                {/* Hourglass */}
                <svg className="absolute right-6 w-36 h-36 text-pink-200/90" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M25 15H75V25C75 40 60 45 53 50C60 55 75 60 75 75V85H25V75C25 60 40 55 47 50C40 45 25 40 25 25V15Z" fill="#FCE7F3" stroke="#FBCFE8" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M30 20H70" stroke="#FBCFE8" strokeWidth="1.5"/>
                  <path d="M30 80H70" stroke="#FBCFE8" strokeWidth="1.5"/>
                  <path d="M33 25H67C65 37 50 42 50 45C50 42 35 37 33 25Z" fill="#F472B6" opacity="0.3"/>
                  <path d="M48 52C48 52 35 60 33 75H67C65 60 52 52 52 52L48 52Z" fill="#F472B6" opacity="0.4"/>
                </svg>

                {/* Mobile Phone Mockup */}
                <div className="relative z-10 w-24 h-44 bg-white rounded-2xl border-[3px] border-[#673391] shadow-md p-2 flex flex-col justify-center items-center">
                  <div className="w-8 h-1 bg-[#673391] rounded-full mb-auto"></div>
                  {/* Progress Blocks inside phone */}
                  <div className="flex gap-1 items-center justify-center my-auto">
                    <span className="w-1.5 h-3 bg-[#e92976] rounded-xs"></span>
                    <span className="w-1.5 h-3 bg-[#e92976] rounded-xs"></span>
                    <span className="w-1.5 h-3 bg-[#e92976] rounded-xs"></span>
                    <span className="w-1.5 h-3 bg-[#e92976] rounded-xs"></span>
                    <span className="w-1.5 h-3 bg-pink-200 rounded-xs"></span>
                  </div>
                  <div className="w-4 h-4 rounded-full border border-[#673391] mt-auto"></div>
                </div>

                {/* Curved Arrow Indicators */}
                <svg className="absolute inset-0 w-full h-full text-purple-300 pointer-events-none" viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M40 70 Q 70 30 110 50" stroke="#C084FC" strokeWidth="1.5" strokeDasharray="3 3" />
                  <path d="M170 50 Q 210 30 240 70" stroke="#C084FC" strokeWidth="1.5" strokeDasharray="3 3" />
                </svg>
              </div>

              {/* Coming Soon Title */}
              <h2 className="text-[22px] font-extrabold text-[#673391] mb-2 tracking-tight">
                Coming Soon
              </h2>

              {/* Description */}
              <p className="text-sm font-bold text-slate-600 text-center max-w-md">
                We are preparing to help you access this Service shortly
              </p>

            </div>

          </div>
        </div>

      </main>

      {/* Fixed Footer */}
      <SbiFixedFooter />

    </div>
  );
}
