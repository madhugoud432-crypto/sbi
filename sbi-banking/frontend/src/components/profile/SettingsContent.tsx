'use client'

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  Eye, EyeOff, Edit2, CheckCircle2, ChevronRight, ChevronDown, Home,
  User, CreditCard, Shield, Lock, Award, HelpCircle, MessageSquare,
  Search, Bell, Building2, Phone, X, Info, Share2, AlertTriangle,
  FileText, Gauge, DollarSign, Ban, Key, Car, Sparkles, Wallet, Settings as SettingsIcon,
  Smartphone, ArrowLeftRight, Globe, Unlock, RefreshCw
} from 'lucide-react';
import '../../app/settings/profile.css';
import '../../app/dashboard/dashboard.css';
import SbiGlobalBrandHeader from '@/components/banking/SbiGlobalBrandHeader';

export default function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { logout, user } = useAuthStore();

  // Navigation States
  const [activeSidebarMenu, setActiveSidebarMenu] = useState('Manage My Profile');
  const [profileTab, setProfileTab] = useState<'personal' | 'professional'>('personal');
  const [accountsSubTab, setAccountsSubTab] = useState('Account Details');
  const [settingsSubTab, setSettingsSubTab] = useState('Payments');
  const [securitySubTab, setSecuritySubTab] = useState('Manage YONO Mobile');

  useEffect(() => {
    const tab = searchParams.get('tab');
    const subTab = searchParams.get('subTab');
    if (tab === 'Settings') {
      setActiveSidebarMenu('Settings');
      setSettingsSubTab('Payments');
    } else if (tab === 'ManageMyAccounts') {
      setActiveSidebarMenu('Manage My Accounts');
      if (subTab === 'ManageNominee') {
        setAccountsSubTab('Manage Nominee');
      }
    } else if (tab === 'ManageNominee') {
      setActiveSidebarMenu('Manage My Accounts');
      setAccountsSubTab('Manage Nominee');
    } else if (tab === 'UpdateMySecurity') {
      setActiveSidebarMenu('Update My Security');
      if (subTab === 'SecurityQuestions') {
        setSecuritySubTab('Security Questions');
      } else if (subTab === 'eSecureLock') {
        setSecuritySubTab('e-Secure Lock');
      } else if (subTab === 'ManageChannelAccess') {
        setSecuritySubTab('Manage Channel Access');
      } else if (subTab === 'YONONetBanking') {
        setSecuritySubTab('YONO Net Banking');
      } else {
        setSecuritySubTab('Manage YONO Mobile');
      }
    } else if (tab === 'ManageMyProfile' || !tab) {
      setActiveSidebarMenu('Manage My Profile');
    }
  }, [searchParams]);

  // Scroll active tab into view
  useEffect(() => {
    const activeBtn = document.querySelector('.acc-tab-btn.active');
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [accountsSubTab]);

  // View 1: Personal Details Eye Toggles
  const [showCif, setShowCif] = useState(false);
  const [showDob, setShowDob] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  const [showCkyc, setShowCkyc] = useState(false);
  const [showPan, setShowPan] = useState(false);

  // View 1: Personal Details Form
  const [maritalStatus, setMaritalStatus] = useState('Single');
  const [religion, setReligion] = useState('Hindu');
  const [category, setCategory] = useState('General');

  // View 1: Professional Details Form (Screenshot 1)
  const [occupation, setOccupation] = useState('Others');
  const [occupationSubType, setOccupationSubType] = useState('Students');
  const [education, setEducation] = useState('Matriculate');
  const [annualIncome, setAnnualIncome] = useState('2,00,000');
  const [sourceOfIncome, setSourceOfIncome] = useState('Allowance / Savings');

  // View 3: Access Services Search
  const [serviceSearch, setServiceSearch] = useState('');

  const fullName = user?.full_name || 'MADHU';
  const nameParts = fullName.split(' ');
  const initials = nameParts.map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'DV';

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <div className="dashboard-wrapper">

      {/* ================= GLOBAL BRAND HEADER ================= */}
      <SbiGlobalBrandHeader activeNav="Services" />

      {/* ================= MAIN PROFILE CONTENT ================= */}
      <main className="profile-page-wrapper">
        <div className="profile-main-container">

          {/* Dynamic Breadcrumb (Matching Screenshot 4) */}
          <div className="profile-breadcrumb flex items-center gap-2 select-none text-slate-400 mb-6 text-xs font-medium">
            <Link href="/dashboard" className="hover:text-purple-800 flex items-center">
              <Home size={16} className="text-[#681d82]" />
            </Link>
            <span className="text-slate-400 font-bold">&gt;</span>
            <span className="text-slate-500 font-semibold">Profile</span>
          </div>

          <div className="profile-grid-layout">

            {/* Left Sidebar Panel */}
            <div className="profile-left-sidebar">

              {/* User Avatar Card */}
              <div className="profile-user-card">
                <div className="profile-avatar-wrapper">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        toast.success("Profile image updated!");
                      }
                    }}
                    className="hidden"
                    id="avatar-upload-input"
                  />
                  <label htmlFor="avatar-upload-input" className="profile-avatar-circle cursor-pointer relative select-none">
                    {initials}
                    <div className="avatar-pencil-badge">
                      <Edit2 size={12} />
                    </div>
                  </label>
                </div>

                <h2 className="profile-user-name">{fullName}</h2>

                <div className="profile-cif-text">
                  <span>CIF: {showCif ? '9876545720' : 'xxxxxxx5720'}</span>
                  <button
                    type="button"
                    onClick={() => setShowCif(!showCif)}
                    className="eye-mask-icon border-0 bg-none p-0"
                    title={showCif ? "Hide CIF" : "Show CIF"}
                  >
                    {showCif ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>

                <div className="profile-last-login">
                  Last Login 31/07/26 11:08 pm
                </div>
              </div>

              {/* Sidebar Navigation Menu */}
              <div className="profile-menu-box">
                {[
                  { label: 'Manage My Profile', icon: User },
                  { label: 'Manage My Accounts', icon: Building2 },
                  { label: 'Access Services', icon: SettingsIcon },
                  { label: 'Settings', icon: Shield },
                  { label: 'Update My Security', icon: Lock },
                  { label: 'Refer & Earn Rewards', icon: Award },
                  { label: 'Get Support', icon: HelpCircle },
                  { label: 'Share Feedback', icon: MessageSquare },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSidebarMenu === item.label;
                  return (
                    <div
                      key={item.label}
                      onClick={() => setActiveSidebarMenu(item.label)}
                      className={`profile-menu-item ${isActive ? 'active' : ''}`}
                    >
                      <div className="profile-menu-item-left">
                        <div className="profile-menu-icon">
                          <Icon size={18} />
                        </div>
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Right Main Panel */}
            <div className="profile-right-panel">

              {/* ================= VIEW 1: MANAGE MY PROFILE (Screenshot 1 Exact) ================= */}
              {activeSidebarMenu === 'Manage My Profile' && (
                <div>

                  {/* Tabs Header Row */}
                  <div className="profile-tabs-header">
                    <div className="profile-tabs-left">
                      <button
                        type="button"
                        onClick={() => setProfileTab('personal')}
                        className={`profile-tab-btn ${profileTab === 'personal' ? 'active' : ''}`}
                      >
                        Personal Details
                        <span className="info-circle-badge">!</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setProfileTab('professional')}
                        className={`profile-tab-btn ${profileTab === 'professional' ? 'active' : ''}`}
                      >
                        Professional Details
                        <span className="info-circle-badge">!</span>
                      </button>
                    </div>

                    <div className="profile-completion-meter">
                      Profile Completion: 66%
                    </div>
                  </div>

                  {/* Green KYC Banner */}
                  <div className="kyc-updated-banner">
                    <div className="kyc-banner-left">
                      <CheckCircle2 size={20} className="text-green-600" />
                      <span>KYC Updated</span>
                    </div>
                    <a href="https://cdnweb.onlineyono.sbi.bank.in/accounts/re-kyc/kyc-entry" target="_blank" rel="noopener noreferrer" className="kyc-update-now-link">
                      Update Now
                    </a>
                  </div>

                  {/* Personal Details Tab Content */}
                  {profileTab === 'personal' && (
                    <div>
                      {/* Personal Info Gray Box */}
                      <div className="personal-details-gray-box">
                        <div>
                          <span className="detail-field-item">Date of Birth</span>
                          <div className="detail-field-val">
                            <span>{showDob ? '15/08/2000' : 'XX/XX/2000'}</span>
                            <button type="button" onClick={() => setShowDob(!showDob)} className="eye-mask-icon bg-none border-0 p-0">
                              {showDob ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <span className="detail-field-item">Mobile number</span>
                          <div className="detail-field-val">
                            <span>{showMobile ? '9876545933' : 'XXXXXX5933'}</span>
                            <button type="button" onClick={() => setShowMobile(!showMobile)} className="eye-mask-icon bg-none border-0 p-0">
                              {showMobile ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <span className="detail-field-item flex items-center gap-1">
                            CKYC Number <Info size={13} className="text-purple-800" />
                          </span>
                          <div className="detail-field-val">
                            <span>{showCkyc ? '987654322966' : 'XXXXXXXX2966'}</span>
                            <button type="button" onClick={() => setShowCkyc(!showCkyc)} className="eye-mask-icon bg-none border-0 p-0">
                              {showCkyc ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <span className="detail-field-item">PAN</span>
                          <div className="detail-field-val">
                            <span>{showPan ? 'ABCDE6421H' : 'XXXXXX642H'}</span>
                            <button type="button" onClick={() => setShowPan(!showPan)} className="eye-mask-icon bg-none border-0 p-0">
                              {showPan ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>

                        <div className="col-span-1 md:col-span-2">
                          <span className="detail-field-item">Father&apos;s Name</span>
                          <div className="detail-field-val text-slate-800">
                            D SHYAMSUNDER
                          </div>
                        </div>
                      </div>

                      {/* Email & Addresses */}
                      <div className="address-field-block">
                        <span className="address-title">Email ID</span>
                        <div className="address-text lowercase font-normal text-slate-700">
                          {user?.email || 'dumpala.vishnu@example.com'}
                        </div>
                      </div>

                      <div className="address-field-block">
                        <span className="address-title">Communication Address</span>
                        <p className="address-text m-0">
                          H NO 6-20 KUNARAM PEDDAPALLI TELANGANA 505174
                        </p>
                        <Edit2 size={16} className="address-edit-pencil" />
                      </div>

                      <div className="address-field-block">
                        <span className="address-title">Permanent Address</span>
                        <p className="address-text m-0">
                          H NO 6-20 KUNARAM KALVASRIRAMPUR Srirampur KARIMNAGAR TELANGANA 505174
                        </p>
                        <Edit2 size={16} className="address-edit-pencil" />
                      </div>

                      <div className="profile-select-grid mt-6">
                        <div className="profile-select-wrapper">
                          <label htmlFor="marital-status" className="profile-select-label">Marital Status</label>
                          <select id="marital-status" value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)} className="profile-select-input">
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                          </select>
                        </div>

                        <div className="profile-select-wrapper">
                          <label htmlFor="religion" className="profile-select-label">Religion</label>
                          <select id="religion" value={religion} onChange={(e) => setReligion(e.target.value)} className="profile-select-input">
                            <option value="Hindu">Hindu</option>
                            <option value="Muslim">Muslim</option>
                            <option value="Christian">Christian</option>
                            <option value="Sikh">Sikh</option>
                          </select>
                        </div>

                        <div className="profile-select-wrapper">
                          <label htmlFor="category" className="profile-select-label">Category</label>
                          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="profile-select-input">
                            <option value="General">General</option>
                            <option value="OBC">OBC</option>
                            <option value="SC">SC</option>
                            <option value="ST">ST</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Professional Details Tab Content (Screenshot 1 Exact) */}
                  {profileTab === 'professional' && (
                    <div className="pt-4">
                      <div className="profile-select-grid">

                        {/* Occupation */}
                        <div className="profile-select-wrapper">
                          <label htmlFor="occupation" className="profile-select-label">Occupation</label>
                          <select id="occupation" value={occupation} onChange={(e) => setOccupation(e.target.value)} className="profile-select-input">
                            <option value="Others">Others</option>
                            <option value="Salaried">Salaried</option>
                            <option value="Self Employed">Self Employed</option>
                            <option value="Business">Business</option>
                          </select>
                        </div>

                        {/* Occupation Sub-Type */}
                        <div className="profile-select-wrapper">
                          <label htmlFor="occupation-sub-type" className="profile-select-label">Occupation Sub-Type</label>
                          <select id="occupation-sub-type" value={occupationSubType} onChange={(e) => setOccupationSubType(e.target.value)} className="profile-select-input">
                            <option value="Students">Students</option>
                            <option value="Housewife">Housewife</option>
                            <option value="Retired">Retired</option>
                            <option value="Student / Scholar">Student / Scholar</option>
                          </select>
                        </div>

                        {/* Education Qualification */}
                        <div className="profile-select-wrapper">
                          <label htmlFor="education-qualification" className="profile-select-label">Education Qualification</label>
                          <select id="education-qualification" value={education} onChange={(e) => setEducation(e.target.value)} className="profile-select-input">
                            <option value="Matriculate">Matriculate</option>
                            <option value="Under Graduate">Under Graduate</option>
                            <option value="Graduate">Graduate</option>
                            <option value="Post Graduate">Post Graduate</option>
                            <option value="Professional">Professional</option>
                          </select>
                        </div>

                        {/* Annual Income */}
                        <div className="profile-select-wrapper">
                          <label htmlFor="annual-income-input" className="profile-select-label">Annual Income</label>
                          <div className="flex items-center gap-1">
                            <span className="text-slate-400 font-bold text-sm">₹</span>
                            <input
                              id="annual-income-input"
                              type="text"
                              value={annualIncome}
                              onChange={(e) => setAnnualIncome(e.target.value)}
                              className="profile-select-input"
                            />
                          </div>
                        </div>

                        {/* Source of income */}
                        <div className="profile-select-wrapper">
                          <label htmlFor="source-of-income" className="profile-select-label">Source of income</label>
                          <select id="source-of-income" value={sourceOfIncome} onChange={(e) => setSourceOfIncome(e.target.value)} className="profile-select-input">
                            <option value="Allowance / Savings">Allowance / Savings</option>
                            <option value="Salary">Salary</option>
                            <option value="Business Income">Business Income</option>
                            <option value="Investments">Investments</option>
                          </select>
                        </div>

                      </div>

                      <div className="mt-8 flex justify-end">
                        <button
                          type="button"
                          onClick={() => toast.success("Professional Details updated successfully!")}
                          className="bg-purple-900 text-white font-bold px-8 py-2.5 rounded-full hover:bg-purple-950 transition-all text-sm"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* ================= VIEW 2: MANAGE MY ACCOUNTS (Screenshot 2 Exact) ================= */}
              {activeSidebarMenu === 'Manage My Accounts' && (
                <div>

                  {/* Top Apply for Joint Savings Account */}
                  <div className="acc-header-links">
                    <a href="https://onlineapply.sbi.bank.in" target="_blank" rel="noopener noreferrer" className="joint-acc-link">
                      Apply for Joint Savings Account
                    </a>
                  </div>

                  {/* Horizontal Tabs Row */}
                  <div className="acc-tabs-scroll-container">
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById('tabsScrollRow');
                        if (el) el.scrollLeft -= 150;
                      }}
                      className="acc-tabs-arrow-btn"
                    >
                      &#9664;
                    </button>

                    <div className="acc-tabs-row-scrollable select-none" id="tabsScrollRow">
                      {[
                        'Account Details', 'Change Home Branch', 'Convert to Salary Account',
                        'Manage Nominee', 'Manage Transaction Right', 'Auto Sweep Facility'
                      ].map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setAccountsSubTab(tab)}
                          className={`acc-tab-btn ${accountsSubTab === tab ? 'active' : ''}`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById('tabsScrollRow');
                        if (el) el.scrollLeft += 150;
                      }}
                      className="acc-tabs-arrow-btn"
                    >
                      &#9654;
                    </button>
                  </div>
                  {/* Tab Contents */}
                  {accountsSubTab === 'Manage Nominee' && (
                    /* ================= MANAGE NOMINEE TAB VIEW ================= */
                    <div className="space-y-6 animate-in fade-in duration-150">

                      {/* Account Selector Box (Screenshot 2 Exact) */}
                      <div className="bg-white rounded-2xl border border-slate-200/85 p-5 flex items-center justify-between shadow-2xs">
                        <div className="flex items-center gap-3">
                          {/* SBI Circle Logo */}
                          <div className="w-10 h-10 rounded-full bg-[#00a3e0] flex items-center justify-center text-white font-bold text-xs select-none">
                            <svg className="w-6 h-6" viewBox="0 0 100 100" fill="currentColor">
                              <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="18" />
                              <rect x="41" y="10" width="18" height="35" fill="white" />
                            </svg>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-800 tracking-wide font-sans">
                                XXXXXXX7054
                              </span>
                              <button
                                type="button"
                                onClick={() => toast.success("Account Details Visible")}
                                className="text-[#673391] hover:opacity-80 transition-opacity"
                              >
                                <Eye size={15} />
                              </button>
                            </div>
                            <div className="text-xs text-slate-500 font-semibold mt-0.5 font-sans">
                              Savings Account
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Mode of Operation & Type of Nomination Card */}
                      <div className="bg-[#f5f1fa] border border-[#e8dff5] rounded-2xl p-5 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 shadow-3xs">
                        <div>
                          <div className="text-xs font-semibold text-slate-500 mb-1 font-sans">
                            Mode of operation
                          </div>
                          <div className="text-[#673391] font-bold text-sm font-sans">
                            Single
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-500 mb-1 font-sans">
                            Type of nomination
                          </div>
                          <div className="text-[#673391] font-bold text-sm font-sans">
                            Simultaneous
                          </div>
                        </div>
                      </div>

                      {/* Heading: Nominee Details */}
                      <div className="mt-8 mb-4">
                        <h3 className="text-lg md:text-xl font-bold text-[#673391] tracking-tight font-sans">
                          Nominee Details
                        </h3>
                      </div>

                      {/* Nominee Details Card */}
                      <div className="bg-[#f5f1fa] border border-[#e8dff5] rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-3xs">
                        <div className="flex-1">
                          <div className="text-xs font-semibold text-slate-500 mb-1 font-sans">
                            Nominee 1
                          </div>
                          <div className="text-[#673391] font-extrabold text-sm md:text-base font-sans tracking-wide">
                            D BHAGAYA LAKSHMI
                          </div>
                        </div>

                        <div className="md:text-right">
                          <div className="text-xs font-semibold text-slate-500 mb-1 font-sans">
                            Share (%)
                          </div>
                          <div className="text-[#673391] font-extrabold text-sm md:text-base font-sans">
                            0%
                          </div>
                        </div>
                      </div>

                      {/* Edit Nominee Button */}
                      <div className="flex justify-end pt-2">
                        <button
                          type="button"
                          onClick={() => toast.success("Edit Nominee Requested")}
                          className="bg-white border border-[#673391] hover:bg-[#673391] hover:text-white text-[#673391] font-extrabold text-xs md:text-sm py-2.5 px-10 rounded-full transition-all shadow-2xs cursor-pointer font-sans"
                        >
                          Edit Nominee
                        </button>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-slate-200/60 my-8" />

                      {/* Services Cards Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-12">

                        {/* Card 1 */}
                        <div
                          onClick={() => toast.success("Viewing Nominee Update Status...")}
                          className="bg-white border border-slate-200/80 hover:border-purple-300 rounded-2xl p-4 flex items-center justify-between shadow-2xs hover:shadow-md transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#f4edf9] group-hover:bg-[#e8d5f5] flex items-center justify-center text-[#673391] flex-shrink-0 transition-colors">
                              <Building2 size={20} />
                            </div>
                            <div>
                              <h4 className="text-xs md:text-sm font-bold text-slate-800 font-sans leading-snug group-hover:text-[#673391] transition-colors">
                                Nominee Update Status
                              </h4>
                              <p className="text-[10px] md:text-xs text-slate-500 mt-0.5 font-medium leading-relaxed">
                                View status for recently updated accounts
                              </p>
                            </div>
                          </div>
                          <ChevronRight size={18} className="text-slate-400 group-hover:text-[#673391] transition-colors" />
                        </div>

                        {/* Card 2 */}
                        <div
                          onClick={() => toast.success("Managing PPF Nominee...")}
                          className="bg-white border border-slate-200/80 hover:border-purple-300 rounded-2xl p-4 flex items-center justify-between shadow-2xs hover:shadow-md transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#f4edf9] group-hover:bg-[#e8d5f5] flex items-center justify-center text-[#673391] flex-shrink-0 transition-colors">
                              <DollarSign size={20} />
                            </div>
                            <div>
                              <h4 className="text-xs md:text-sm font-bold text-slate-800 font-sans leading-snug group-hover:text-[#673391] transition-colors">
                                PPF
                              </h4>
                              <p className="text-[10px] md:text-xs text-slate-500 mt-0.5 font-medium leading-relaxed">
                                Manage Nominee
                              </p>
                            </div>
                          </div>
                          <ChevronRight size={18} className="text-slate-400 group-hover:text-[#673391] transition-colors" />
                        </div>

                        {/* Card 3 */}
                        <div
                          onClick={() => toast.success("Viewing Nominee Registration Status...")}
                          className="bg-white border border-slate-200/80 hover:border-purple-300 rounded-2xl p-4 flex items-center justify-between shadow-2xs hover:shadow-md transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#f4edf9] group-hover:bg-[#e8d5f5] flex items-center justify-center text-[#673391] flex-shrink-0 transition-colors">
                              <Building2 size={20} />
                            </div>
                            <div>
                              <h4 className="text-xs md:text-sm font-bold text-slate-800 font-sans leading-snug group-hover:text-[#673391] transition-colors">
                                Nominee Registration Status
                              </h4>
                              <p className="text-[10px] md:text-xs text-slate-500 mt-0.5 font-medium leading-relaxed">
                                View for all accounts
                              </p>
                            </div>
                          </div>
                          <ChevronRight size={18} className="text-slate-400 group-hover:text-[#673391] transition-colors" />
                        </div>

                        {/* Card 4 */}
                        <div
                          onClick={() => toast.success("Managing SCSS Nominee...")}
                          className="bg-white border border-slate-200/80 hover:border-purple-300 rounded-2xl p-4 flex items-center justify-between shadow-2xs hover:shadow-md transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#f4edf9] group-hover:bg-[#e8d5f5] flex items-center justify-center text-[#673391] flex-shrink-0 transition-colors">
                              <User size={20} />
                            </div>
                            <div>
                              <h4 className="text-xs md:text-sm font-bold text-slate-800 font-sans leading-snug group-hover:text-[#673391] transition-colors">
                                SCSS
                              </h4>
                              <p className="text-[10px] md:text-xs text-slate-500 mt-0.5 font-medium leading-relaxed">
                                Manage Nominee
                              </p>
                            </div>
                          </div>
                          <ChevronRight size={18} className="text-slate-400 group-hover:text-[#673391] transition-colors" />
                        </div>

                        {/* Card 5 */}
                        <div
                          onClick={() => toast.success("Managing FD/RD Accounts Nominee...")}
                          className="bg-white border border-slate-200/80 hover:border-purple-300 rounded-2xl p-4 flex items-center justify-between shadow-2xs hover:shadow-md transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#f4edf9] group-hover:bg-[#e8d5f5] flex items-center justify-center text-[#673391] flex-shrink-0 transition-colors">
                              <Wallet size={20} />
                            </div>
                            <div>
                              <h4 className="text-xs md:text-sm font-bold text-slate-800 font-sans leading-snug group-hover:text-[#673391] transition-colors">
                                FD/RD Accounts
                              </h4>
                              <p className="text-[10px] md:text-xs text-slate-500 mt-0.5 font-medium leading-relaxed">
                                Manage Nominee
                              </p>
                            </div>
                          </div>
                          <ChevronRight size={18} className="text-slate-400 group-hover:text-[#673391] transition-colors" />
                        </div>

                        {/* Card 6 */}
                        <div
                          onClick={() => toast.success("Managing Locker Nominee...")}
                          className="bg-white border border-slate-200/80 hover:border-purple-300 rounded-2xl p-4 flex items-center justify-between shadow-2xs hover:shadow-md transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#f4edf9] group-hover:bg-[#e8d5f5] flex items-center justify-center text-[#673391] flex-shrink-0 transition-colors">
                              <Lock size={20} />
                            </div>
                            <div>
                              <h4 className="text-xs md:text-sm font-bold text-slate-800 font-sans leading-snug group-hover:text-[#673391] transition-colors">
                                Locker
                              </h4>
                              <p className="text-[10px] md:text-xs text-slate-500 mt-0.5 font-medium leading-relaxed">
                                Manage Nominee
                              </p>
                            </div>
                          </div>
                          <ChevronRight size={18} className="text-slate-400 group-hover:text-[#673391] transition-colors" />
                        </div>

                      </div>
                    </div>
                  )}

                  {accountsSubTab === 'Account Details' && (
                    /* ================= ACCOUNT DETAILS VIEW ================= */
                    <div className="animate-in fade-in duration-150">
                      {/* Account Selector Box */}
                      <div className="acc-select-box-wrapper">
                        <div className="acc-select-left">
                          <div className="acc-sbi-icon-circle">SBI</div>
                          <div>
                            <div className="acc-select-number">XXXXXXX7054</div>
                            <div className="acc-select-ifsc">IFSC -SBIN0020138</div>
                          </div>
                        </div>
                        <ChevronDown size={20} className="text-gray-600" />
                      </div>

                      {/* Account Info Gray Card */}
                      <div className="acc-info-gray-card">
                        <button
                          type="button"
                          onClick={() => toast.success("Account Details Copied / Shared!")}
                          className="share-details-link border-0 bg-none"
                        >
                          <Share2 size={16} />
                          <span>Share Details</span>
                        </button>

                        <div className="acc-details-grid">
                          <div>
                            <div className="acc-detail-label">Account Number</div>
                            <div className="acc-detail-val">37608427054</div>
                          </div>

                          <div>
                            <div className="acc-detail-label">Account Holder&apos;s Name</div>
                            <div className="acc-detail-val">{fullName}</div>
                          </div>

                          <div>
                            <div className="acc-detail-label">Account Type</div>
                            <div className="acc-detail-val">Savings Account</div>
                          </div>

                          <div>
                            <div className="acc-detail-label">Bank Name</div>
                            <div className="acc-detail-val">SBI</div>
                          </div>

                          <div>
                            <div className="acc-detail-label">Bank Branch</div>
                            <div className="acc-detail-val">PEDDAPALLI</div>
                          </div>

                          <div>
                            <div className="acc-detail-label">IFSC</div>
                            <div className="acc-detail-val">SBIN0020138</div>
                          </div>

                          <div>
                            <div className="acc-detail-label">MMID</div>
                            <div className="acc-detail-val">-</div>
                          </div>

                          <div>
                            <div className="acc-detail-label">VPA</div>
                            <div className="acc-detail-val">NA</div>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {accountsSubTab === 'Change Home Branch' && (
                    /* ================= CHANGE HOME BRANCH VIEW ================= */
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 space-y-6 animate-in fade-in duration-150">
                      <h4 className="text-base font-bold text-slate-800">Change Home Branch</h4>
                      <p className="text-xs text-slate-500 max-w-lg leading-relaxed">
                        Easily request to transfer your savings account to another SBI branch. Select the branch using branch code or location details below.
                      </p>
                      <div className="space-y-4 max-w-md">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Select State</label>
                          <select className="w-full border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium text-slate-800 bg-white">
                            <option>Telangana</option>
                            <option>Andhra Pradesh</option>
                            <option>Karnataka</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Enter Branch Code</label>
                          <input type="text" placeholder="e.g. 020138" className="w-full border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium text-slate-800" />
                        </div>
                        <button type="button" onClick={() => toast.success("Branch search initiated")} className="bg-[#673391] hover:bg-[#561578] text-white font-bold text-xs py-2.5 px-8 rounded-full transition-all cursor-pointer">
                          Search Branch
                        </button>
                      </div>
                    </div>
                  )}

                  {accountsSubTab === 'Convert to Salary Account' && (
                    /* ================= CONVERT TO SALARY VIEW ================= */
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 space-y-6 animate-in fade-in duration-150">
                      <h4 className="text-base font-bold text-slate-800">Convert to Salary Account</h4>
                      <p className="text-xs text-slate-500 max-w-lg leading-relaxed">
                        Convert your existing savings account into a salary account to enjoy zero balance facilities, free checkbooks, and specialized corporate benefits.
                      </p>
                      <div className="space-y-4 max-w-md">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Employer Name</label>
                          <input type="text" placeholder="Enter corporate employer name" className="w-full border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium text-slate-800" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Monthly Net Salary</label>
                          <input type="number" placeholder="e.g. 75000" className="w-full border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium text-slate-800" />
                        </div>
                        <button type="button" onClick={() => toast.success("Conversion request submitted!")} className="bg-[#673391] hover:bg-[#561578] text-white font-bold text-xs py-2.5 px-8 rounded-full transition-all cursor-pointer">
                          Submit Request
                        </button>
                      </div>
                    </div>
                  )}

                  {accountsSubTab === 'Manage Transaction Right' && (
                    /* ================= TRANSACTION RIGHT VIEW ================= */
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 space-y-6 animate-in fade-in duration-150">
                      <h4 className="text-base font-bold text-slate-800">Manage Transaction Rights</h4>
                      <p className="text-xs text-slate-500 max-w-lg leading-relaxed">
                        Modify your Net Banking permissions. Higher access rights allow transfers and bill payments, while lower rights provide view-only options.
                      </p>
                      <div className="space-y-4 max-w-md pt-2">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <div>
                            <div className="text-xs font-bold text-slate-800">Full Transaction Rights</div>
                            <div className="text-[10px] text-slate-500">Allows all transfers, deposits, and bill payments</div>
                          </div>
                          <input type="radio" name="tx-right" defaultChecked className="text-[#673391] accent-[#673391]" />
                        </div>
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <div>
                            <div className="text-xs font-bold text-slate-800">Limited Transaction Rights</div>
                            <div className="text-[10px] text-slate-500">Allows bill payments and transfers within own accounts only</div>
                          </div>
                          <input type="radio" name="tx-right" className="text-[#673391] accent-[#673391]" />
                        </div>
                        <div className="flex items-center justify-between pb-3">
                          <div>
                            <div className="text-xs font-bold text-slate-800">View Only Rights</div>
                            <div className="text-[10px] text-slate-500">Inquiry-only access. No transfers allowed.</div>
                          </div>
                          <input type="radio" name="tx-right" className="text-[#673391] accent-[#673391]" />
                        </div>
                        <button type="button" onClick={() => toast.success("Transaction rights updated successfully!")} className="bg-[#673391] hover:bg-[#561578] text-white font-bold text-xs py-2.5 px-8 rounded-full transition-all cursor-pointer">
                          Update Rights
                        </button>
                      </div>
                    </div>
                  )}

                  {accountsSubTab === 'Auto Sweep Facility' && (
                    /* ================= AUTO SWEEP FACILITY VIEW ================= */
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 space-y-6 animate-in fade-in duration-150">
                      <h4 className="text-base font-bold text-slate-800">Auto Sweep Facility (Multi Option Deposit)</h4>
                      <p className="text-xs text-slate-500 max-w-lg leading-relaxed">
                        Link your savings account to a Multi Option Deposit (MOD) to sweep excess funds automatically to high-interest fixed deposits, and withdraw anytime instantly.
                      </p>
                      <div className="space-y-4 max-w-md pt-2">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                          <div>
                            <div className="text-xs font-bold text-slate-800">MOD Sweep Status</div>
                            <div className="text-[10px] text-slate-500">Sweep active for balance above ₹25,000</div>
                          </div>
                          <div className="w-11 h-6 bg-[#673391] rounded-full relative cursor-pointer flex items-center px-1">
                            <div className="w-4 h-4 bg-white rounded-full translate-x-5" />
                          </div>
                        </div>
                        <button type="button" onClick={() => toast.success("Auto Sweep configuration updated!")} className="bg-[#673391] hover:bg-[#561578] text-white font-bold text-xs py-2.5 px-8 rounded-full transition-all cursor-pointer">
                          Configure Sweep Threshold
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* ================= VIEW 3: ACCESS SERVICES (Screenshot 3 Exact) ================= */}
              {activeSidebarMenu === 'Access Services' && (
                <div>

                  {/* Search Input */}
                  <div className="relative">
                    <Search size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search here..."
                      value={serviceSearch}
                      onChange={(e) => setServiceSearch(e.target.value)}
                      className="services-search-input"
                    />
                  </div>

                  {/* Quick Services Section */}
                  <h3 className="services-section-title">Quick Services</h3>
                  <div className="services-cards-grid">
                    <div className="service-card-item" onClick={() => toast.success("Stop Cheque service requested")}>
                      <div className="service-card-left">
                        <div className="service-card-icon-box"><FileText size={18} /></div>
                        <span className="service-card-label">Stop Cheque</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>

                    <div className="service-card-item" onClick={() => toast.success("Block Card requested")}>
                      <div className="service-card-left">
                        <div className="service-card-icon-box"><Ban size={18} /></div>
                        <span className="service-card-label">Block Card</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>

                    <div className="service-card-item" onClick={() => toast.success("Report Unauthorized Transactions")}>
                      <div className="service-card-left">
                        <div className="service-card-icon-box text-amber-600"><AlertTriangle size={18} /></div>
                        <span className="service-card-label">Report Unauthorized<br />Transactions</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>

                    <div className="service-card-item" onClick={() => toast.success("e-Secure Lock activated")}>
                      <div className="service-card-left">
                        <div className="service-card-icon-box"><Lock size={18} /></div>
                        <span className="service-card-label">e-Secure Lock</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  </div>

                  {/* Other Services Section */}
                  <h3 className="services-section-title">Other Services</h3>
                  <div className="services-cards-grid">
                    <div className="service-card-item" onClick={() => toast.success("Account Related Services")}>
                      <div className="service-card-left">
                        <div className="service-card-icon-box"><Building2 size={18} /></div>
                        <span className="service-card-label">Account Related</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>

                    <div className="service-card-item" onClick={() => toast.success("Pension Related Services")}>
                      <div className="service-card-left">
                        <div className="service-card-icon-box"><User size={18} /></div>
                        <span className="service-card-label">Pension Related</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>

                    <div className="service-card-item" onClick={() => toast.success("Tax Related Services")}>
                      <div className="service-card-left">
                        <div className="service-card-icon-box"><DollarSign size={18} /></div>
                        <span className="service-card-label">Tax Related</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>

                    <div className="service-card-item" onClick={() => toast.success("Cheque Services")}>
                      <div className="service-card-left">
                        <div className="service-card-icon-box"><FileText size={18} /></div>
                        <span className="service-card-label">Cheque Services</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>

                    <div className="service-card-item" onClick={() => toast.success("Doorstep Banking Requested")}>
                      <div className="service-card-left">
                        <div className="service-card-icon-box"><Building2 size={18} /></div>
                        <span className="service-card-label">Doorstep Banking</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>

                    <div className="service-card-item" onClick={() => toast.success("FASTag Services")}>
                      <div className="service-card-left">
                        <div className="service-card-icon-box text-orange-600"><Car size={18} /></div>
                        <span className="service-card-label">Apply/Manage<br />FASTag</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  </div>

                </div>
              )}

              {/* ================= VIEW 4: SETTINGS (Screenshot 4 Exact) ================= */}
              {activeSidebarMenu === 'Settings' && (
                <div className="w-full">

                  {/* Settings Tabs Row */}
                  <div className="flex border-b border-slate-200 gap-8 mb-6 select-none w-full">
                    <button
                      type="button"
                      onClick={() => setSettingsSubTab('Payments')}
                      className={`pb-3 text-sm font-bold flex items-center gap-1.5 focus:outline-none transition-all cursor-pointer bg-transparent ${settingsSubTab === 'Payments'
                          ? 'text-[#681d82] border-b-2 border-[#681d82]'
                          : 'text-slate-400 hover:text-slate-600 border-b-2 border-transparent'
                        }`}
                    >
                      <span>Third Party Transaction Limit</span>
                      <Info size={14} className={settingsSubTab === 'Payments' ? 'text-[#681d82]' : 'text-slate-400'} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSettingsSubTab('Personalise Settings')}
                      className={`pb-3 text-sm font-bold flex items-center gap-1.5 focus:outline-none transition-all bg-transparent border-none cursor-pointer ${settingsSubTab === 'Personalise Settings'
                          ? 'text-[#681d82] border-b-2 border-[#681d82]'
                          : 'text-slate-400 hover:text-slate-600 border-b-2 border-transparent'
                        }`}
                    >
                      <span>Other Transaction Limits</span>
                      <Info size={14} className={settingsSubTab === 'Personalise Settings' ? 'text-[#681d82]' : 'text-slate-400'} />
                    </button>
                  </div>

                  {/* Third Party Transaction Limit (Payments) Content */}
                  {settingsSubTab === 'Payments' && (
                    <div>
                      <h3 className="text-[15px] font-bold text-slate-800 mb-5 font-sans">
                        Set transaction limit for all Payees
                      </h3>

                      {/* Limit detail card */}
                      <div className="profile-limit-card">
                        <div className="flex justify-between items-start">
                          <div className="space-y-4">
                            <div className="profile-limit-card-title">
                              Third party transactions* <span className="font-semibold text-slate-700 ml-1">(INR) Max Limit 2500000</span>
                            </div>

                            <div className="space-y-1">
                              <div className="profile-limit-card-label">
                                Current Limit (per day)
                              </div>
                              <div className="profile-limit-card-value">
                                ₹10,00,000.00
                              </div>
                            </div>
                          </div>

                          {/* Edit Pencil Icon Button */}
                          <button
                            type="button"
                            onClick={() => {
                              toast.success("Edit Limit clicked. Enter your profile password to modify.");
                            }}
                            className="p-1.5 text-[#681d82] hover:bg-purple-100 rounded-full transition-colors bg-transparent border-none cursor-pointer"
                          >
                            <Edit2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Other Transaction Limits (Personalise Settings) Content */}
                  {settingsSubTab === 'Personalise Settings' && (
                    <div className="space-y-4 max-w-[800px]">

                      {/* Card 1: Tax Transaction Limit */}
                      <div className="profile-limit-card">
                        <div className="flex justify-between items-start">
                          <div className="space-y-3.5 w-[90%]">
                            <div className="profile-limit-card-title">
                              Tax Transaction Limit <span className="font-semibold text-slate-700 ml-1">Max Limit : 20000000</span>
                            </div>
                            <div className="profile-limit-card-desc">
                              Tax Transaction limit is currently applicable only for OLTAS (Direct Tax) and CBEC (Indirect Tax).
                            </div>
                            <div className="space-y-1">
                              <div className="profile-limit-card-label">
                                Current Limit
                              </div>
                              <div className="profile-limit-card-value">
                                ₹10,00,000.00
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => toast.success("Edit Tax Limit clicked")}
                            className="p-1.5 text-[#681d82] hover:bg-purple-100 rounded-full transition-colors bg-transparent border-none cursor-pointer"
                          >
                            <Edit2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Card 2: State Bank Collect */}
                      <div className="profile-limit-card">
                        <div className="flex justify-between items-start">
                          <div className="space-y-3.5 w-[90%]">
                            <div className="profile-limit-card-title">
                              State Bank Collect <span className="font-semibold text-slate-700 ml-1">Max Limit : 5000000</span>
                            </div>
                            <div className="profile-limit-card-desc">
                              For special category institutions
                            </div>
                            <div className="space-y-1">
                              <div className="profile-limit-card-label">
                                Current Limit
                              </div>
                              <div className="profile-limit-card-value">
                                ₹10,00,000.00
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => toast.success("Edit State Bank Collect Limit clicked")}
                            className="p-1.5 text-[#681d82] hover:bg-purple-100 rounded-full transition-colors bg-transparent border-none cursor-pointer"
                          >
                            <Edit2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Card 3: General Category Merchants */}
                      <div className="profile-limit-card">
                        <div className="flex justify-between items-start">
                          <div className="space-y-3.5 w-[90%]">
                            <div className="profile-limit-card-title">
                              General Category Merchants <span className="font-semibold text-slate-700 ml-1">Max Limit : 2500000</span>
                            </div>
                            <div className="space-y-1">
                              <div className="profile-limit-card-label">
                                Current Limit
                              </div>
                              <div className="profile-limit-card-value">
                                ₹10,00,000.00
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => toast.success("Edit General Category Limit clicked")}
                            className="p-1.5 text-[#681d82] hover:bg-purple-100 rounded-full transition-colors bg-transparent border-none cursor-pointer"
                          >
                            <Edit2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Card 4: Special Category Limit */}
                      <div className="profile-limit-card">
                        <div className="flex justify-between items-start">
                          <div className="space-y-3.5 w-[90%] font-sans">
                            <div className="profile-limit-card-title">
                              Special Category Limit <span className="font-semibold text-slate-700 ml-1">Max Limit : 5000000</span>
                            </div>
                            <div className="space-y-1">
                              <div className="profile-limit-card-label">
                                Current Limit
                              </div>
                              <div className="profile-limit-card-value">
                                ₹5,00,000.00
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => toast.success("Edit Special Category Limit clicked")}
                            className="p-1.5 text-[#681d82] hover:bg-purple-100 rounded-full transition-colors bg-transparent border-none cursor-pointer"
                          >
                            <Edit2 size={16} />
                          </button>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              )}

              {/* Update My Security View (Matching Screenshot 2) */}
              {activeSidebarMenu === 'Update My Security' && (
                <div className="w-full animate-in fade-in duration-150">

                  {/* Security Tabs Header Row */}
                  <div className="profile-tabs-header">
                    <div className="profile-tabs-left overflow-x-auto w-full select-none pb-1">
                      {[
                        'Manage YONO Mobile',
                        'YONO Net Banking',
                        'Manage Channel Access',
                        'e-Secure Lock',
                        'Security Questions'
                      ].map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setSecuritySubTab(tab)}
                          className={`profile-tab-btn whitespace-nowrap ${securitySubTab === tab ? 'active' : ''}`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tab Contents */}
                  {securitySubTab === 'Manage YONO Mobile' && (
                    <div className="space-y-4 max-w-xl">
                      <div
                        onClick={() => toast.success("De-register YONO Mobile Account clicked")}
                        className="flex items-center justify-between p-4 bg-white border border-slate-200/80 hover:border-purple-300 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#f4edf9] group-hover:bg-[#e8d5f5] flex items-center justify-center text-[#673391] flex-shrink-0 transition-colors">
                            <Smartphone size={20} />
                          </div>
                          <span className="text-sm font-bold text-slate-700 group-hover:text-[#673391] transition-colors font-sans">
                            De-register Account
                          </span>
                        </div>
                        <ChevronRight size={18} className="text-slate-400 group-hover:text-[#673391] transition-colors" />
                      </div>

                      <div
                        onClick={() => toast.success("Transaction Authentication clicked")}
                        className="flex items-center justify-between p-4 bg-white border border-slate-200/80 hover:border-purple-300 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#f4edf9] group-hover:bg-[#e8d5f5] flex items-center justify-center text-[#673391] flex-shrink-0 transition-colors">
                            <ArrowLeftRight size={20} />
                          </div>
                          <span className="text-sm font-bold text-slate-700 group-hover:text-[#673391] transition-colors font-sans">
                            Transaction Authentication
                          </span>
                        </div>
                        <ChevronRight size={18} className="text-slate-400 group-hover:text-[#673391] transition-colors" />
                      </div>
                    </div>
                  )}

                  {securitySubTab === 'YONO Net Banking' && (
                    <div className="space-y-4 max-w-xl">
                      <div
                        onClick={() => toast.success("Change Login Password clicked")}
                        className="flex items-center justify-between p-4 bg-white border border-slate-200/80 hover:border-purple-300 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#f4edf9] group-hover:bg-[#e8d5f5] flex items-center justify-center text-[#673391] flex-shrink-0 transition-colors">
                            <Key size={20} />
                          </div>
                          <span className="text-sm font-bold text-slate-700 group-hover:text-[#673391] transition-colors font-sans">
                            Change Login Password
                          </span>
                        </div>
                        <ChevronRight size={18} className="text-slate-400 group-hover:text-[#673391] transition-colors" />
                      </div>

                      <div
                        onClick={() => toast.success("Change Profile Password clicked")}
                        className="flex items-center justify-between p-4 bg-white border border-slate-200/80 hover:border-purple-300 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#f4edf9] group-hover:bg-[#e8d5f5] flex items-center justify-center text-[#673391] flex-shrink-0 transition-colors">
                            <Lock size={20} />
                          </div>
                          <span className="text-sm font-bold text-slate-700 group-hover:text-[#673391] transition-colors font-sans">
                            Change Profile Password
                          </span>
                        </div>
                        <ChevronRight size={18} className="text-slate-400 group-hover:text-[#673391] transition-colors" />
                      </div>

                      <div
                        onClick={() => toast.success("Manage Friendly Name / Alias clicked")}
                        className="flex items-center justify-between p-4 bg-white border border-slate-200/80 hover:border-purple-300 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#f4edf9] group-hover:bg-[#e8d5f5] flex items-center justify-center text-[#673391] flex-shrink-0 transition-colors">
                            <User size={20} />
                          </div>
                          <span className="text-sm font-bold text-slate-700 group-hover:text-[#673391] transition-colors font-sans">
                            Manage Friendly Name / Alias
                          </span>
                        </div>
                        <ChevronRight size={18} className="text-slate-400 group-hover:text-[#673391] transition-colors" />
                      </div>
                    </div>
                  )}

                  {securitySubTab === 'Manage Channel Access' && (
                    <div className="space-y-4 max-w-xl">
                      <div
                        onClick={() => toast.success("Manage Internet Banking access clicked")}
                        className="flex items-center justify-between p-4 bg-white border border-slate-200/80 hover:border-purple-300 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#f4edf9] group-hover:bg-[#e8d5f5] flex items-center justify-center text-[#673391] flex-shrink-0 transition-colors">
                            <Globe size={20} />
                          </div>
                          <span className="text-sm font-bold text-slate-700 group-hover:text-[#673391] transition-colors font-sans">
                            Enable/Disable Internet Banking
                          </span>
                        </div>
                        <ChevronRight size={18} className="text-slate-400 group-hover:text-[#673391] transition-colors" />
                      </div>

                      <div
                        onClick={() => toast.success("Manage Mobile Banking access clicked")}
                        className="flex items-center justify-between p-4 bg-white border border-slate-200/80 hover:border-purple-300 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#f4edf9] group-hover:bg-[#e8d5f5] flex items-center justify-center text-[#673391] flex-shrink-0 transition-colors">
                            <Smartphone size={20} />
                          </div>
                          <span className="text-sm font-bold text-slate-700 group-hover:text-[#673391] transition-colors font-sans">
                            Mobile Banking Access
                          </span>
                        </div>
                        <ChevronRight size={18} className="text-slate-400 group-hover:text-[#673391] transition-colors" />
                      </div>

                      <div
                        onClick={() => toast.success("Manage UPI Services access clicked")}
                        className="flex items-center justify-between p-4 bg-white border border-slate-200/80 hover:border-purple-300 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#f4edf9] group-hover:bg-[#e8d5f5] flex items-center justify-center text-[#673391] flex-shrink-0 transition-colors">
                            <DollarSign size={20} />
                          </div>
                          <span className="text-sm font-bold text-slate-700 group-hover:text-[#673391] transition-colors font-sans">
                            UPI Services Access
                          </span>
                        </div>
                        <ChevronRight size={18} className="text-slate-400 group-hover:text-[#673391] transition-colors" />
                      </div>
                    </div>
                  )}

                  {securitySubTab === 'e-Secure Lock' && (
                    <div className="space-y-4 max-w-xl">
                      <div
                        onClick={() => toast.success("Lock Netbanking Access clicked")}
                        className="flex items-center justify-between p-4 bg-white border border-slate-200/80 hover:border-purple-300 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#f4edf9] group-hover:bg-[#e8d5f5] flex items-center justify-center text-[#673391] flex-shrink-0 transition-colors">
                            <Lock size={20} />
                          </div>
                          <span className="text-sm font-bold text-slate-700 group-hover:text-[#673391] transition-colors font-sans">
                            Lock Netbanking Access
                          </span>
                        </div>
                        <ChevronRight size={18} className="text-slate-400 group-hover:text-[#673391] transition-colors" />
                      </div>

                      <div
                        onClick={() => toast.success("Unlock Netbanking Access clicked")}
                        className="flex items-center justify-between p-4 bg-white border border-slate-200/80 hover:border-purple-300 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#f4edf9] group-hover:bg-[#e8d5f5] flex items-center justify-center text-[#673391] flex-shrink-0 transition-colors">
                            <Unlock size={20} />
                          </div>
                          <span className="text-sm font-bold text-slate-700 group-hover:text-[#673391] transition-colors font-sans">
                            Unlock Netbanking Access
                          </span>
                        </div>
                        <ChevronRight size={18} className="text-slate-400 group-hover:text-[#673391] transition-colors" />
                      </div>
                    </div>
                  )}

                  {securitySubTab === 'Security Questions' && (
                    <div className="space-y-4 max-w-xl">
                      <div
                        onClick={() => toast.success("Set Security Questions clicked")}
                        className="flex items-center justify-between p-4 bg-white border border-slate-200/80 hover:border-purple-300 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#f4edf9] group-hover:bg-[#e8d5f5] flex items-center justify-center text-[#673391] flex-shrink-0 transition-colors">
                            <HelpCircle size={20} />
                          </div>
                          <span className="text-sm font-bold text-slate-700 group-hover:text-[#673391] transition-colors font-sans">
                            Set Security Questions
                          </span>
                        </div>
                        <ChevronRight size={18} className="text-slate-400 group-hover:text-[#673391] transition-colors" />
                      </div>

                      <div
                        onClick={() => toast.success("Reset Security Questions clicked")}
                        className="flex items-center justify-between p-4 bg-white border border-slate-200/80 hover:border-purple-300 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#f4edf9] group-hover:bg-[#e8d5f5] flex items-center justify-center text-[#673391] flex-shrink-0 transition-colors">
                            <RefreshCw size={20} />
                          </div>
                          <span className="text-sm font-bold text-slate-700 group-hover:text-[#673391] transition-colors font-sans">
                            Reset Security Questions
                          </span>
                        </div>
                        <ChevronRight size={18} className="text-slate-400 group-hover:text-[#673391] transition-colors" />
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* Other Sidebar Views (Support, Rewards, Feedback) */}
              {['Refer & Earn Rewards', 'Get Support', 'Share Feedback'].includes(activeSidebarMenu) && (
                <div className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-900 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                    <Sparkles size={28} />
                  </div>
                  <h3 className="font-bold text-lg text-slate-800 mb-2">{activeSidebarMenu}</h3>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
                    This module is active and ready for your banking preferences and security configurations.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveSidebarMenu('Manage My Profile')}
                    className="bg-purple-900 text-white font-bold px-6 py-2 rounded-full text-xs hover:bg-purple-950"
                  >
                    Back to Profile
                  </button>
                </div>
              )}

            </div>

          </div>

        </div>
      </main>

    </div>
  );
}
