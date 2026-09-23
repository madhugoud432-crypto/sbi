'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { 
  ChevronLeft, ChevronRight, HelpCircle, Phone, MessageSquare, Info, 
  ShieldCheck, UserCheck, CreditCard, Video, ArrowRight, CheckCircle, 
  Camera, Smartphone, Lock, Award, FileText, Play, ChevronDown, ChevronUp
} from 'lucide-react';
import SbiGlobalBrandHeader from '@/components/banking/SbiGlobalBrandHeader';
import './open-savings-account.css';

export default function OpenSavingsAccountPage() {
  const router = useRouter();
  
  // Form State
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [hasCkyc, setHasCkyc] = useState<'Yes' | 'No'>('No');
  const [ckycNumber, setCkycNumber] = useState<string>('');
  const [consent, setConsent] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'Features' | 'Tutorials' | 'FAQs'>('Features');
  
  // FAQ Accordion State
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobileNumber(val);
  };

  const handleCkycChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 14);
    setCkycNumber(val);
  };

  const isFormValid = mobileNumber.length === 10 && consent && (hasCkyc === 'No' || ckycNumber.length === 14);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsSubmitting(true);
    toast.success('OTP sent to ' + mobileNumber + '! Redirecting to identity verification...');
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="osa-wrapper">
      
      {/* ================= GLOBAL BRAND HEADER ================= */}
      <SbiGlobalBrandHeader activeNav="Accounts" />

      {/* ================= MAIN CONTENT BODY ================= */}
      <main id="mainContent" className="osa-body">
        
        {/* Back Link & Heading */}
        <Link href="/dashboard" className="osa-back-link">
          <ChevronLeft size={16} /> Back To Home
        </Link>

        <h1 className="osa-page-title">Open Savings Account</h1>

        {/* Upper 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Left Column: 4 Steps (6 Columns) */}
          <div className="lg:col-span-6 pr-lg-4">
            <h2 className="osa-step-heading">Open a savings account in few easy steps!</h2>

            {/* Step 1 */}
            <div className="osa-step-item">
              <div className="osa-step-icon-circle">
                <UserCheck size={24} />
              </div>
              <div>
                <h3 className="osa-step-title">Verify your Identity</h3>
                <p className="osa-step-desc">
                  Use Aadhaar or other OVDs (DL, Passport, Voter ID, MGNREGA, NPR) and PAN / Form 60)
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="osa-step-item">
              <div className="osa-step-icon-circle">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="osa-step-title">Share your details</h3>
                <p className="osa-step-desc">
                  Help us know you better and how to communicate with you
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="osa-step-item">
              <div className="osa-step-icon-circle">
                <CreditCard size={24} />
              </div>
              <div>
                <h3 className="osa-step-title">Choose your account experience</h3>
                <p className="osa-step-desc">
                  Pick your branch location, account type and debit cards
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="osa-step-item">
              <div className="osa-step-icon-circle">
                <Video size={24} />
              </div>
              <div>
                <h3 className="osa-step-title">Complete Your KYC</h3>
                <p className="osa-step-desc">
                  Perform easy KYC through video call or branch visit
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Mobile Number Form Card (6 Columns) */}
          <div className="lg:col-span-6">
            <div className="osa-form-card">
              <h2 className="osa-form-title">Lets start with your mobile number</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Mobile Number Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Mobile Number *</label>
                  <div className="relative">
                    <input 
                      type="tel"
                      required
                      placeholder="Enter 10-digit mobile number"
                      value={mobileNumber}
                      onChange={handleMobileChange}
                      className="osa-input-field font-semibold text-slate-800 tracking-wide"
                    />
                  </div>
                </div>

                {/* CKYC Question & Radios */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-xs font-bold text-slate-700">Do you have a CKYC number?</span>
                    <span title="14-digit Central KYC Number if available">
                      <Info size={14} className="text-[#302985] cursor-pointer" />
                    </span>
                  </div>

                  <div className="osa-radio-group">
                    <label className="osa-radio-label">
                      <input 
                        type="radio" 
                        name="ckycRadio" 
                        checked={hasCkyc === 'Yes'}
                        onChange={() => setHasCkyc('Yes')}
                        className="accent-[#302985] w-4 h-4"
                      />
                      <span>Yes</span>
                    </label>

                    <label className="osa-radio-label">
                      <input 
                        type="radio" 
                        name="ckycRadio" 
                        checked={hasCkyc === 'No'}
                        onChange={() => {
                          setHasCkyc('No');
                          setCkycNumber('');
                        }}
                        className="accent-[#302985] w-4 h-4"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>

                {/* CKYC Number Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">CKYC Number</label>
                  <input 
                    type="text"
                    disabled={hasCkyc === 'No'}
                    placeholder={hasCkyc === 'Yes' ? 'Enter 14-digit CKYC Number' : 'Disabled'}
                    value={ckycNumber}
                    onChange={handleCkycChange}
                    className={`osa-input-field ${hasCkyc === 'No' ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : ''}`}
                  />
                </div>

                {/* Declaration Checkbox */}
                <div className="flex items-start gap-2.5 pt-2">
                  <input 
                    type="checkbox"
                    id="consentCheck"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="accent-[#302985] w-4 h-4 mt-0.5"
                  />
                  <label htmlFor="consentCheck" className="text-xs text-slate-600 leading-snug cursor-pointer select-none">
                    I declare that I am an Indian resident above 18 years and agree to receive communications regarding my account opening.
                  </label>
                </div>

                {/* Let's Begin Button */}
                <button 
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className="osa-btn-purple"
                >
                  {isSubmitting ? 'Processing...' : (
                    <>
                      Let’s Begin <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* Lower Section Tabs (Features, Tutorials, FAQs) */}
        <div className="osa-tab-list">
          {(['Features', 'Tutorials', 'FAQs'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`osa-tab-button ${activeTab === tab ? 'active' : ''}`}
            >
              <span>{tab}</span>
              {activeTab === tab && <div className="osa-tab-line" />}
            </button>
          ))}
        </div>

        {/* TAB 1: FEATURES (Matching 2nd Screenshot) */}
        {activeTab === 'Features' && (
          <div>
            {/* Top 3 Banners */}
            <div className="osa-banner-grid">
              <div className="osa-banner-card osa-banner-1">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <FileText size={20} />
                </div>
                <div className="osa-banner-text">
                  <b>Paperless account</b> opening and no branch visit needed
                </div>
              </div>

              <div className="osa-banner-card osa-banner-2">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Smartphone size={20} />
                </div>
                <div className="osa-banner-text">
                  Experience <b>24*7 Banking</b> access through YONO app, internet banking and mobile banking
                </div>
              </div>

              <div className="osa-banner-card osa-banner-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Phone size={20} />
                </div>
                <div className="osa-banner-text">
                  SMS Alerts, SBI Quick Missed call facility available
                </div>
              </div>
            </div>

            {/* Feature Layout (Left Video Card + Right Mini Grid) */}
            <div className="osa-features-layout">
              
              {/* Left Tall Card: Video KYC */}
              <div className="osa-video-card">
                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4 relative">
                  <Camera size={36} className="text-[#302985]" />
                  <div className="absolute -bottom-1 right-0 bg-[#302985] text-white p-1.5 rounded-full">
                    <Video size={14} />
                  </div>
                </div>

                <h3 className="text-sm font-bold text-[#302985] mb-2">
                  Open your <b>Savings Bank account</b> online via secure video call.
                </h3>
                <p className="text-xs text-slate-500 max-w-xs">
                  Choose a convenient time for your Video KYC or visit any branch to verify the documents
                </p>
              </div>

              {/* Right Mini Grid */}
              <div className="osa-feature-mini-grid">
                
                <div className="osa-feature-mini-card">
                  <div className="osa-feature-mini-icon">
                    <Smartphone size={20} />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 mb-1">Seamless Omnichannel Experience</h4>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Open your account anytime, anywhere, effortlessly through YONO App or web or branch
                  </p>
                </div>

                <div className="osa-feature-mini-card">
                  <div className="osa-feature-mini-icon">
                    <UserCheck size={20} />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 mb-1">Effortless Account Management</h4>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Conveniently access and manage your account through YONO
                  </p>
                </div>

                <div className="osa-feature-mini-card">
                  <div className="osa-feature-mini-icon">
                    <Award size={20} />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 mb-1">Nomination Facility</h4>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Nomination facility is available and highly recommended for security
                  </p>
                </div>

                <div className="osa-feature-mini-card">
                  <div className="osa-feature-mini-icon">
                    <Lock size={20} />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 mb-1">Transparent Service Charges</h4>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Charges for all other services will be in accordance with regular savings account rules
                  </p>
                </div>

                <div className="osa-feature-mini-card col-span-2">
                  <h4 className="text-xs font-bold text-slate-800 mb-2">Transfer Funds</h4>
                  <p className="text-[11px] text-slate-500 mb-3">
                    Transfer Funds on the App and Web using the following payment systems:
                  </p>

                  <div className="flex items-center gap-3">
                    <span className="bg-slate-200 text-slate-800 font-extrabold px-3 py-1 rounded text-xs">NEFT</span>
                    <span className="bg-slate-200 text-slate-800 font-extrabold px-3 py-1 rounded text-xs">IMPS</span>
                    <span className="bg-slate-200 text-slate-800 font-extrabold px-3 py-1 rounded text-xs">UPI</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* TAB 2: TUTORIALS */}
        {activeTab === 'Tutorials' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Video KYC Account Opening Guide', duration: '2 mins' },
              { title: 'How to Keep Physical PAN & Aadhaar Ready', duration: '1 min' },
              { title: 'Choosing Branch & Account Type', duration: '3 mins' },
            ].map((tut, tIdx) => (
              <div key={tIdx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="w-full h-36 bg-purple-900 rounded-lg flex items-center justify-center text-white mb-3 cursor-pointer hover:bg-purple-800">
                    <Play size={32} />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">{tut.title}</h4>
                </div>
                <div className="text-[11px] text-slate-500 mt-2">Duration: {tut.duration}</div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: FAQS */}
        {activeTab === 'FAQs' && (
          <div className="space-y-3 max-w-3xl">
            {[
              {
                q: 'What are the requirements for Video KYC account opening?',
                a: 'You need an active mobile number linked to your Aadhaar, physical PAN Card, a blank sheet of paper with a black/blue pen, and a well-lit quiet room with camera access.'
              },
              {
                q: 'Is branch visit mandatory after Video KYC?',
                a: 'No! Successful Video KYC completes full account activation without visiting any branch. Your Classic Debit Card will be dispatched to your address.'
              },
              {
                q: 'What is the minimum balance required?',
                a: 'SBI Insta Plus Savings Account has ZERO Minimum Average Balance (MAB) requirement.'
              },
              {
                q: 'Who can open an Insta Plus Savings Account?',
                a: 'Any resident Indian individual who is 18 years of age or above and holds a valid Aadhaar and PAN Card.'
              }
            ].map((faq, fIdx) => (
              <div key={fIdx} className="border border-slate-200 rounded-lg overflow-hidden">
                <button 
                  type="button" 
                  onClick={() => setExpandedFaq(expandedFaq === fIdx ? null : fIdx)}
                  className="w-full p-4 text-left text-xs font-bold text-slate-800 bg-slate-50 hover:bg-slate-100 flex justify-between items-center"
                >
                  <span>{faq.q}</span>
                  {expandedFaq === fIdx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {expandedFaq === fIdx && (
                  <div className="p-4 bg-white text-xs text-slate-600 border-t border-slate-200">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </main>

      {/* ================= FOOTER ================= */}
      <footer className="mt-auto py-4 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-600">
        <div className="flex justify-center items-center gap-4">
          <a href="https://sbi.bank.in" target="_blank" rel="noopener noreferrer" className="hover:underline">About SBI</a>
          <span>|</span>
          <a href="https://onlinesbi.sbi.bank.in" target="_blank" rel="noopener noreferrer" className="hover:underline">Terms &amp; Conditions</a>
          <span>|</span>
          <a href="https://sbi.bank.in" target="_blank" rel="noopener noreferrer" className="hover:underline">Privacy Policy</a>
        </div>
      </footer>

    </div>
  );
}
