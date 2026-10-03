import React, { useState, useEffect } from 'react';
import FinishLab, {LabNav,LabFooter,LabServices} from './components/FinishLab';
import QuoteWizardModal from './components/wizard/QuoteWizardModal';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './components/admin/AdminLogin';
import { BUSINESS_INFO } from './data/businessData';
import { authApi, getStoredToken } from './services/api';
import {ArrowUpRight} from 'lucide-react';
export default function App(){
 const [page,setPage]=useState('home'),[wizard,setWizard]=useState(null),[user,setUser]=useState(null);
 useEffect(()=>{document.documentElement.classList.remove('dark');document.body.classList.remove('dark');const sync=()=>{const h=location.hash;setPage(h==='#/admin'||h==='#admin'?'admin':h==='#/services'||h==='#services-all'?'services':'home');};sync();window.addEventListener('hashchange',sync);window.addEventListener('popstate',sync);if(getStoredToken())authApi.verify().then(r=>{if(r.authenticated)setUser(r.user);}).catch(()=>setUser(null));return()=>{window.removeEventListener('hashchange',sync);window.removeEventListener('popstate',sync);};},[]);
 const navigate=p=>{setPage(p);if(p==='home')history.pushState(null,'',location.pathname+location.search);else location.hash='/'+p;window.scrollTo({top:0,behavior:'instant'});};
 const open=(category=null,service=null)=>setWizard({category,service});
 if(page==='admin')return <div className="lab-admin">{user?<AdminLayout user={user} onLogout={()=>setUser(null)} onBackToSite={()=>navigate('home')}/>:<AdminLogin onLoginSuccess={setUser} onBackToSite={()=>navigate('home')}/>}</div>;
 return <><a href="#main" className="sr-only focus:not-sr-only">Skip to content</a><LabNav currentPage={page} onNavigate={navigate} onOpenWizard={open}/><main id="main">{page==='services'?<LabServices onOpenWizard={open} onBackToHome={()=>navigate('home')}/>:<FinishLab onOpenWizard={open} onViewAllServices={()=>navigate('services')}/>}</main><LabFooter onNavigate={navigate}/>{wizard&&<div className="lab-dialog"><QuoteWizardModal isOpen onClose={()=>setWizard(null)} initialCategory={wizard.category} initialService={wizard.service}/></div>}<div className="mobile-book"><a href={'tel:'+BUSINESS_INFO.phone.replace(/\D/g,'')}>Call Szine</a><button className="lab-button" onClick={()=>open()}>Request a quote <ArrowUpRight size={16}/></button></div></>;
}
