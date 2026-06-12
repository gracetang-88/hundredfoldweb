'use client';

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const FED = {
  single:[[11600,.10],[47150,.12],[100525,.22],[191950,.24],[243725,.32],[609350,.35],[1e9,.37]],
  mfj:   [[23200,.10],[94300,.12],[201050,.22],[383900,.24],[487450,.32],[731200,.35],[1e9,.37]],
  mfs:   [[11600,.10],[47150,.12],[100525,.22],[191950,.24],[243725,.32],[365600,.35],[1e9,.37]],
  hoh:   [[16550,.10],[63100,.12],[100500,.22],[191950,.24],[243700,.32],[609350,.35],[1e9,.37]],
};
const STD={single:14600,mfj:29200,mfs:14600,hoh:21900};
const LTCG={single:[[47025,0],[518900,.15],[1e9,.20]],mfj:[[94050,0],[583750,.15],[1e9,.20]],mfs:[[47025,0],[291850,.15],[1e9,.20]],hoh:[[63000,0],[551350,.15],[1e9,.20]]};
const NIIT={single:200000,mfj:250000,mfs:125000,hoh:200000};
const CA={
  single:[[10412,.01],[24684,.02],[38959,.04],[54081,.06],[68350,.08],[349137,.093],[418961,.103],[698274,.113],[1e9,.123]],
  mfj:   [[20824,.01],[49368,.02],[77918,.04],[108162,.06],[136700,.08],[698274,.093],[837922,.103],[1e9,.113],[2e9,.123]],
  mfs:   [[10412,.01],[24684,.02],[38959,.04],[54081,.06],[68350,.08],[349137,.093],[418961,.103],[698274,.113],[1e9,.123]],
  hoh:   [[20839,.01],[49371,.02],[63644,.04],[78765,.06],[93037,.08],[474824,.093],[569790,.103],[949524,.113],[1e9,.123]],
};
function brk(t:number,s:string,tbl:any){let tax=0,prev=0;for(const[lim,r]of(tbl[s]||tbl.single)){if(t<=prev)break;tax+=(Math.min(t,lim)-prev)*r;prev=lim;}return tax;}
const ft=(t:number,s:string)=>brk(Math.max(0,t),s,FED);
const cat=(t:number,s:string)=>brk(Math.max(0,t),s,CA);
const lgr=(inc:number,s:string)=>{for(const[l,r]of(LTCG[s as keyof typeof LTCG]||LTCG.single))if(inc<=l)return r;return .20;};
const mgr=(t:number,s:string)=>{for(const[l,r]of(FED[s as keyof typeof FED]||FED.single))if(t<=l)return r;return .37;};
const fc=(n:number)=>'$'+Math.round(n).toLocaleString();
const f2=(n:number)=>'$'+Number(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,',');
const fd=(n:number)=>(n<0?'-$':'$')+Math.abs(Math.round(n)).toLocaleString();

const s = {
  card:{background:'#fff',borderRadius:12,border:'1px solid #e5e7eb',padding:20},
  res:{background:'#f0f4ff',borderRadius:12,border:'1px solid #c7d2fe',padding:20},
  grid:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16},
  sec:{fontSize:11,fontWeight:700,color:'#6366f1',textTransform:'uppercase' as const,letterSpacing:.5,margin:'13px 0 5px'},
  lbl:{fontSize:12,fontWeight:500,color:'#000',marginBottom:3,display:'block',marginTop:10},
  inp:{width:'100%',padding:'7px 9px',border:'1px solid #d1d5db',borderRadius:7,fontSize:14,outline:'none',boxSizing:'border-box' as const,color:'#000'},
  sel:{width:'100%',padding:'7px 9px',border:'1px solid #d1d5db',borderRadius:7,fontSize:14,background:'#fff',outline:'none',color:'#000'},
  row:{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid #e0e7ff',fontSize:13.5},
  div:{height:1,background:'#e5e7eb',margin:'10px 0'},
  btn:{width:'100%',marginTop:14,padding:10,background:'#6366f1',color:'#fff',border:'none',borderRadius:8,fontSize:14,fontWeight:600,cursor:'pointer'},
};

const Inp=({label,val,set,step=1}:{label:string,val:any,set:any,step?:number})=><><span style={s.lbl}>{label}</span><input type="number" value={val} step={step} onChange={e=>set(e.target.value)} style={s.inp}/></>;
const Sel=({label,val,set,opts}:{label:string,val:string,set:any,opts:any[]})=><><span style={s.lbl}>{label}</span><select value={val} onChange={e=>set(e.target.value)} style={s.sel}>{opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}</select></>;
const Tog=({val,set,opts}:{val:string,set:any,opts:any[]})=><div style={{display:'flex',gap:5,marginTop:4}}>{opts.map(o=><button key={o.v} onClick={()=>set(o.v)} style={{flex:1,padding:'7px 4px',border:`1px solid ${val===o.v?'#6366f1':'#d1d5db'}`,borderRadius:7,background:val===o.v?'#6366f1':'#fff',color:val===o.v?'#fff':'#000',fontSize:12,fontWeight:500,cursor:'pointer'}}>{o.l}</button>)}</div>;
const RR=({label,val,type}:{label:string,val:string,type?:string})=><div style={s.row}><span style={{color:'#000'}}>{label}</span><span style={{fontWeight:500,color:type==='d'?'#dc2626':type==='g'?'#16a34a':type==='h'?'#6366f1':'#000',filter:'blur(4px)'}}>{val}</span></div>;
const RT=({label,val,type}:{label:string,val:string,type?:string})=><div style={{display:'flex',justifyContent:'space-between',padding:'9px 0 5px',borderTop:'2px solid #c7d2fe',marginTop:4,fontSize:14,fontWeight:700}}><span style={{color:'#000'}}>{label}</span><span style={{color:type==='d'?'#dc2626':type==='g'?'#16a34a':'#000',filter:'blur(4px)'}}>{val}</span></div>;
const Warn=({msg,ok}:{msg:string,ok?:boolean})=><div style={{background:ok?'#f0fdf4':'#fef3c7',border:`1px solid ${ok?'#86efac':'#fbbf24'}`,borderRadius:6,padding:'7px 10px',fontSize:12,color:ok?'#166534':'#92400e',marginTop:8}}>{ok?'✓ ':'⚠ '}{msg}</div>;

// Paywall Component
const Paywall = () => (
  <div style={{position:'relative',minHeight:300}}>
    <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 40%, rgba(255,255,255,1) 60%)',zIndex:10,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <div style={{textAlign:'center',maxWidth:400,background:'#fff',padding:32,borderRadius:12,border:'2px solid #6366f1',boxShadow:'0 10px 40px rgba(0,0,0,0.15)'}}>
        <div style={{fontSize:48,marginBottom:16}}>🔒</div>
        <h3 style={{fontSize:20,fontWeight:700,marginBottom:12,color:'#000'}}>Annual Planning Client Access</h3>
        <p style={{fontSize:14,color:'#000',marginBottom:20,lineHeight:1.6}}>
          This advanced calculator with detailed results is available exclusively to our Annual Tax Planning clients.
        </p>
        <a
          href="/contact"
          style={{
            display:'inline-block',
            padding:'12px 28px',
            background:'#6366f1',
            color:'#fff',
            borderRadius:8,
            fontSize:15,
            fontWeight:600,
            textDecoration:'none',
            transition:'background 0.2s'
          }}
        >
          Become a Client
        </a>
      </div>
    </div>
    <div style={{filter:'blur(4px)',pointerEvents:'none',userSelect:'none'}}>
      <RR label="Total Gain" val="$XXX,XXX"/>
      <RR label="Federal Tax" val="$XX,XXX" type="d"/>
      <RR label="State Tax" val="$XX,XXX" type="d"/>
      <div style={s.div}/>
      <RT label="Total Tax Owed" val="$XXX,XXX" type="d"/>
      <RT label="Net Proceeds" val="$XXX,XXX" type="g"/>
    </div>
  </div>
);

// Real Estate Calculator
function RealEstate({isClient}:{isClient:boolean}){
  const[sale,setSale]=useState(1500000);
  const[basis,setBasis]=useState(500000);
  const[depr,setDepr]=useState(80000);
  const[costs,setCosts]=useState(90000);
  const[status,setStatus]=useState('mfj');
  const[rt,setRt]=useState('straight');
  const[firpta,setFirpta]=useState(false);
  const[repl,setRepl]=useState(2000000);
  const[nm,setNm]=useState(800000);
  const[om,setOm]=useState(300000);
  const[csD,setCsD]=useState(200000);
  const[csR,setCsR]=useState(37);
  const adj=+basis + +costs,gain=+sale-adj,unrec=Math.min(+depr,Math.max(0,gain)),ltcg=Math.max(0,gain-unrec);
  let out=null;

  if(!isClient){
    out = <Paywall/>;
  } else if(rt==='straight'){
    const fu=unrec*.25,fl=ltcg*lgr(gain,status),niit=gain>NIIT[status as keyof typeof NIIT]?(gain-NIIT[status as keyof typeof NIIT])*.038:0;
    const ca=cat(gain+100000,status)-cat(100000,status),tot=fu+fl+niit+ca;
    out=<><RR label="Gross Sale Price" val={fc(sale)}/><RR label="Adjusted Basis" val={fc(adj)}/><RR label="Total Gain" val={fc(gain)}/><RR label="§1250 Unrecaptured Depreciation" val={fc(unrec)}/><RR label="Long-Term Capital Gain" val={fc(ltcg)}/><div style={s.div}/><RR label="Federal Unrecaptured (25%)" val={fc(fu)} type="d"/><RR label={`Federal LTCG (${(lgr(gain,status)*100).toFixed(0)}%)`} val={fc(fl)} type="d"/><RR label="NIIT (3.8%)" val={fc(niit)} type={niit>0?'d':''}/><RR label="CA State Tax" val={fc(ca)} type="d"/><RT label="Total Federal + CA Tax" val={fc(tot)} type="d"/><RT label="Net Proceeds After Tax" val={fc(+sale - +costs-tot)} type="g"/>{firpta&&<Warn msg={`FIRPTA: Buyer must withhold 15% = ${fc(+sale*.15)}`}/>}</>;
  } else if(rt==='1031'){
    const mb=Math.max(0,+om - +nm),cb=Math.max(0,(+sale - +costs)- +repl),boot=mb+cb,rec=Math.min(gain,boot),def=gain-rec;
    const fr2=rec>0?rec*.20+Math.min(unrec,rec)*.05:0,cr2=rec>0?cat(rec+100000,status)-cat(100000,status):0,tnow=fr2+cr2;
    out=<><RR label="Total Gain" val={fc(gain)}/><RR label="Mortgage Boot" val={fc(mb)}/><RR label="Cash Boot" val={fc(cb)}/><RR label="Total Boot" val={fc(boot)}/><div style={s.div}/><RR label="Gain Recognized" val={fc(rec)} type={rec>0?'d':'g'}/><RR label="Gain Deferred" val={fc(def)} type="h"/><RT label="Tax Owed Now" val={fc(tnow)} type={tnow>0?'d':'g'}/><RT label="Tax Savings vs. Straight Sale" val={fc(gain*.238-tnow)} type="g"/>{def>0&&<Warn msg={`Deferred gain of ${fc(def)} carries into replacement basis.`}/>}</>;
  } else {
    const r=+csR/100,y1=+csD*r,y1ca=+csD*.093,tot=y1+y1ca,recap=(+csD - +csD/10)*.25;
    out=<><RR label="Year 1 Accelerated Depreciation" val={fc(csD)}/><RR label="vs. Straight-Line" val={fc(+csD/10)}/><div style={s.div}/><RR label="Federal Tax Savings (Yr 1)" val={fc(y1)} type="g"/><RR label="CA Tax Savings (Yr 1)" val={fc(y1ca)} type="g"/><RT label="Total Year 1 Savings" val={fc(tot)} type="g"/><div style={s.div}/><RR label="§1250 Recapture Exposure" val={fc(recap)} type="d"/><Warn msg="Cost seg defers tax; recapture at 25% + CA rate applies at sale."/></>;
  }
  return <div style={s.grid}>
    <div style={s.card}>
      <b style={{fontSize:15,color:'#000'}}>🏠 Property Details</b>
      <Inp label="Sale Price ($)" val={sale} set={setSale}/><Inp label="Cost Basis ($)" val={basis} set={setBasis}/><Inp label="Accumulated Depreciation ($)" val={depr} set={setDepr}/><Inp label="Selling Costs ($)" val={costs} set={setCosts}/>
      <Sel label="Filing Status" val={status} set={setStatus} opts={[{v:'single',l:'Single'},{v:'mfj',l:'Married Filing Jointly'},{v:'hoh',l:'Head of Household'}]}/>
      <span style={s.lbl}>Sale Type</span><Tog val={rt} set={setRt} opts={[{v:'straight',l:'Straight Sale'},{v:'1031',l:'1031 Exchange'},{v:'costseg',l:'Cost Seg'}]}/>
      {rt==='1031'&&<><Inp label="Replacement Value ($)" val={repl} set={setRepl}/><Inp label="New Mortgage ($)" val={nm} set={setNm}/><Inp label="Old Mortgage ($)" val={om} set={setOm}/></>}
      {rt==='costseg'&&<><Inp label="Year 1 Cost Seg Depreciation ($)" val={csD} set={setCsD}/><Inp label="Marginal Federal Rate (%)" val={csR} set={setCsR}/></>}
      <div style={{marginTop:12,display:'flex',alignItems:'center',gap:8}}><input type="checkbox" checked={firpta} onChange={e=>setFirpta(e.target.checked)}/><span style={{fontSize:13,color:'#000'}}>Foreign seller (FIRPTA)</span></div>
    </div>
    <div style={s.res}><b style={{color:'#3730a3'}}>📋 Tax Summary</b><div style={{marginTop:12}}>{out}</div></div>
  </div>;
}

// RSU/ESPP Calculator
function RSUPanel({isClient}:{isClient:boolean}){
  const[eq,setEq]=useState('rsu');
  const[shares,setShares]=useState(500);const[fmv,setFmv]=useState(180);const[sp,setSp]=useState(200);const[hold,setHold]=useState('short');
  const[esS,setEsS]=useState(100);const[fmvO,setFmvO]=useState(50);const[fmvP,setFmvP]=useState(60);const[disc,setDisc]=useState(15);const[esSp,setEsSp]=useState(70);const[disp,setDisp]=useState('qualifying');const[esH,setEsH]=useState('long');
  const[status,setStatus]=useState('mfj');const[ow2,setOw2]=useState(200000);const[ytd,setYtd]=useState(60000);const[sr,setSr]=useState(22);
  let ordInc=0,capGain=0,cgLbl='',lFMV=0,pp=0,tc=0,proc=0,tg=0;
  if(eq==='rsu'){ordInc=+shares * +fmv;capGain=+shares*(+sp - +fmv);cgLbl=hold==='short'?'Short-term':'Long-term';}
  else{lFMV=Math.min(+fmvO,+fmvP);pp=lFMV*(1-+disc/100);tc=pp * +esS;proc=+esSp * +esS;tg=proc-tc;
    if(disp==='qualifying'){const od=(+fmvO-pp)* +esS;ordInc=Math.max(0,Math.min(od,tg));capGain=tg-ordInc;cgLbl='Long-term (qualifying)';}
    else{ordInc=(+fmvP-pp)* +esS;capGain=proc-(+fmvP * +esS);cgLbl=esH==='long'?'Long-term':'Short-term';}}
  const ti=+ow2+ordInc,suppWH=ordInc*(+sr/100);
  const fo=ft(ti-STD[status as keyof typeof STD],status)-ft(+ow2-STD[status as keyof typeof STD],status);
  const isLong=eq==='rsu'?hold==='long':(disp==='qualifying'||esH==='long');
  const cgt=isLong?Math.max(0,capGain*lgr(ti,status)):(ft(ti+capGain-STD[status as keyof typeof STD],status)-ft(ti-STD[status as keyof typeof STD],status));
  const niit=ti>NIIT[status as keyof typeof NIIT]?capGain*.038:0;
  const cao=cat(ti-5202,status)-cat(+ow2-5202,status);
  const cac=cat(ti+capGain-5202,status)-cat(ti-5202,status);
  const tot=fo+cgt+niit+cao+cac,gap=tot-(+ytd+suppWH);

  let resultDisplay = null;
  if(!isClient){
    resultDisplay = <Paywall/>;
  } else {
    resultDisplay = <>
      {eq==='espp'&&<><div style={s.sec}>ESPP Purchase</div><RR label="Lower FMV" val={`$${lFMV.toFixed(2)}/sh`}/><RR label={`Purchase Price (${(100-+disc).toFixed(0)}% of lower FMV)`} val={`$${pp.toFixed(2)}/sh`}/><RR label="Total Cost" val={f2(tc)}/><RR label="Total Proceeds" val={f2(proc)}/><RR label="Total Gain" val={f2(tg)} type="h"/><div style={s.sec}>{disp==='qualifying'?'Qualifying':'Disqualifying'} Disposition</div></>}
      <RR label="Ordinary Income" val={eq==='espp'?f2(ordInc):fc(ordInc)} type="d"/>
      <RR label={`${cgLbl} Capital ${capGain>=0?'Gain':'Loss'}`} val={eq==='espp'?f2(capGain):fd(capGain)}/>
      <div style={s.div}/>
      <RR label="Federal Tax on Ordinary Income" val={fc(fo)} type="d"/><RR label="Federal CG Tax" val={fc(cgt)} type={cgt>0?'d':''}/><RR label="NIIT (3.8%)" val={fc(niit)} type={niit>0?'d':''}/><RR label="CA Tax (ordinary)" val={fc(cao)} type="d"/><RR label="CA Tax (cap gain)" val={fc(cac)} type={cac>0?'d':''}/>
      <RT label="Total Tax Owed" val={fc(tot)} type="d"/><div style={s.div}/>
      <RR label="Employer Supp. Withholding" val={fc(suppWH)}/><RR label="YTD Withholding" val={fc(ytd)}/>
      <RT label="Withholding Gap / (Surplus)" val={fd(gap)} type={gap>0?'d':'g'}/>
      {gap>0&&<Warn msg={`Need additional ${fc(gap)} to avoid underpayment penalty.`}/>}
      {eq==='espp'&&disp==='disqualifying'&&<Warn msg={`Ordinary income of ${f2(ordInc)} should appear on W-2. Verify with payroll.`}/>}
    </>;
  }

  return <div style={s.grid}>
    <div style={{...s.card,overflowY:'auto',maxHeight:760}}>
      <b style={{fontSize:15,color:'#000'}}>📈 RSU / ESPP Details</b>
      <span style={s.lbl}>Equity Type</span><Tog val={eq} set={setEq} opts={[{v:'rsu',l:'RSU'},{v:'espp',l:'ESPP'}]}/>
      {eq==='rsu'?<><Inp label="Shares Vesting" val={shares} set={setShares}/><Inp label="FMV at Vest ($/sh)" val={fmv} set={setFmv}/><Inp label="Sale Price ($/sh)" val={sp} set={setSp}/><span style={s.lbl}>Holding Period</span><Tog val={hold} set={setHold} opts={[{v:'short',l:'Short-term (<1yr)'},{v:'long',l:'Long-term (≥1yr)'}]}/></>
      :<><div style={s.sec}>ESPP Purchase</div><Inp label="Shares Purchased" val={esS} set={setEsS}/><Inp label="FMV at Offering Date ($/sh)" val={fmvO} set={setFmvO}/><Inp label="FMV at Purchase Date ($/sh)" val={fmvP} set={setFmvP}/><Inp label="Discount (%)" val={disc} set={setDisc}/><Inp label="Sale Price ($/sh)" val={esSp} set={setEsSp}/><div style={s.sec}>Disposition</div><Tog val={disp} set={setDisp} opts={[{v:'qualifying',l:'Qualifying'},{v:'disqualifying',l:'Disqualifying'}]}/><div style={{fontSize:11.5,color:'#000',marginTop:7}}>{disp==='qualifying'?'≥1yr after purchase AND ≥2yrs after offering date.':'Sold before meeting holding period rules.'}</div>{disp==='disqualifying'&&<><div style={s.sec}>CG Holding Period</div><Tog val={esH} set={setEsH} opts={[{v:'long',l:'Long-term (≥1yr)'},{v:'short',l:'Short-term (<1yr)'}]}/></>}</>}
      <div style={s.sec}>Tax Inputs</div>
      <Sel label="Filing Status" val={status} set={setStatus} opts={[{v:'single',l:'Single'},{v:'mfj',l:'Married Filing Jointly'}]}/>
      <Inp label="Other W-2 Income ($)" val={ow2} set={setOw2}/><Inp label="YTD Federal Withholding ($)" val={ytd} set={setYtd}/><Inp label="Employer Supp. Withholding Rate (%)" val={sr} set={setSr}/>
    </div>
    <div style={s.res}><b style={{color:'#3730a3'}}>📋 Tax Summary</b><div style={{marginTop:12}}>{resultDisplay}</div></div>
  </div>;
}

// Estimated Tax Calculator
function EstTax(){
  const[status,setStatus]=useState('mfj');
  const[pyF,setPyF]=useState(85000);const[pyC,setPyC]=useState(32000);const[pyA,setPyA]=useState(420000);
  const[w2,setW2]=useState(300000);const[se,setSe]=useState(0);const[cg,setCg]=useState(50000);const[ren,setRen]=useState(0);const[oth,setOth]=useState(0);
  const[fw,setFw]=useState(55000);const[cw,setCw]=useState(20000);
  const seD=+se*.5*.153,agi=+w2 + +se + +cg + +ren + +oth-seD;
  const fo=ft(Math.max(0,+w2 + +se + +ren + +oth-STD[status as keyof typeof STD]),status);
  const fc2=+cg*lgr(agi,status),niit=agi>NIIT[status as keyof typeof NIIT]?(agi-NIIT[status as keyof typeof NIIT])*.038:0,set2=+se*.153;
  const pf=fo+fc2+niit+set2,pc=cat(Math.max(0,agi-5202),status);
  const fsh=+pyA>150000?+pyF*1.10:+pyF;
  const fn=Math.max(pf*.90,fsh)- +fw,cn=Math.max(pc*.90,+pyC)- +cw;
  const fq=Math.max(0,fn)/4,cq1=Math.max(0,cn)*.30,cq2=Math.max(0,cn)*.40,cq4=Math.max(0,cn)*.30;
  return <div style={s.grid}>
    <div style={s.card}>
      <b style={{fontSize:15,color:'#000'}}>📅 Estimated Tax Inputs</b>
      <Sel label="Filing Status" val={status} set={setStatus} opts={[{v:'single',l:'Single'},{v:'mfj',l:'Married Filing Jointly'},{v:'hoh',l:'Head of Household'}]}/>
      <div style={s.sec}>Prior Year</div>
      <Inp label="Prior Year Federal Tax ($)" val={pyF} set={setPyF}/><Inp label="Prior Year CA Tax ($)" val={pyC} set={setPyC}/><Inp label="Prior Year AGI ($)" val={pyA} set={setPyA}/>
      <div style={s.sec}>Current Year Income</div>
      <Inp label="W-2 Wages ($)" val={w2} set={setW2}/><Inp label="Business / SE Income ($)" val={se} set={setSe}/><Inp label="Capital Gains ($)" val={cg} set={setCg}/><Inp label="Rental / Passive ($)" val={ren} set={setRen}/><Inp label="Other Income ($)" val={oth} set={setOth}/>
      <div style={s.sec}>Withholding</div>
      <Inp label="YTD Federal Withholding ($)" val={fw} set={setFw}/><Inp label="YTD CA Withholding ($)" val={cw} set={setCw}/>
    </div>
    <div style={s.res}><b style={{color:'#3730a3'}}>📋 Estimated Tax Summary</b><div style={{marginTop:12}}>
      <RR label="Projected AGI" val={fc(agi)}/><RR label="Projected Federal Tax" val={fc(pf)} type="d"/><RR label="Projected CA Tax" val={fc(pc)} type="d"/>
      <div style={s.div}/>
      <RR label="110% Rule Applies (AGI > $150k)" val={+pyA>150000?'Yes':'No'}/><RR label="Federal Safe Harbor" val={fc(fsh)}/><RR label="Remaining Federal Needed" val={fc(Math.max(0,fn))} type={fn>0?'d':'g'}/><RR label="Per Federal Quarterly Payment" val={fc(fq)} type="h"/><RR label="Remaining CA Needed" val={fc(Math.max(0,cn))} type={cn>0?'d':'g'}/>
      <div style={s.div}/>
      <table style={{width:'100%',borderCollapse:'collapse',fontSize:13,marginTop:4}}>
        <thead><tr style={{background:'#e0e7ff'}}>{['Quarter','Due','Federal','CA'].map(h=><th key={h} style={{textAlign:'left',padding:'5px 7px',color:'#3730a3',fontWeight:600}}>{h}</th>)}</tr></thead>
        <tbody>{[['Q1','Apr 15',fq,cq1],['Q2','Jun 15',fq,cq2],['Q3','Sep 15',fq,null],['Q4','Jan 15',fq,cq4]].map(([q,d,f,ca])=><tr key={q} style={{borderBottom:'1px solid #e5e7eb'}}><td style={{padding:'5px 7px',color:'#000'}}>{q}</td><td style={{padding:'5px 7px',color:'#000'}}>{d}</td><td style={{padding:'5px 7px',color:'#000',filter:'blur(4px)'}}>{fc(f as number)}</td><td style={{padding:'5px 7px',color:'#000',filter:'blur(4px)'}}>{ca!=null?fc(ca as number):'—'}</td></tr>)}</tbody>
      </table>
    </div></div>
  </div>;
}

// Mega Backdoor Roth Calculator
const LIM={2024:{c415:69000,el:23000,cu:7500},2025:{c415:70000,el:23500,cu:7500}};
function MegaBackdoor(){
  const[yr,setYr]=useState('2024');const[age,setAge]=useState(40);
  const[pt,setPt]=useState(0);const[r4,setR4]=useState(0);const[match,setMatch]=useState(0);
  const[contrib,setContrib]=useState(0);const[earn,setEarn]=useState(0);
  const[fr,setFr]=useState(22);const[cr,setCr]=useState(5);const[yrs,setYrs]=useState(20);const[rr,setRr]=useState(7);
  const lim=LIM[yr as keyof typeof LIM],cu=+age>=50?lim.cu:0,emax=lim.el+cu,tlim=lim.c415+cu;
  const avail=Math.max(0,tlim - +pt - +r4 - +match),ok=+contrib<=avail;
  const tot=+contrib + +earn,tax=+earn,fRate=+fr/100,cRate=+cr/100,comb=fRate+cRate;
  const fedT=tax*fRate,caT=tax*cRate,totT=fedT+caT,savs=(tot*comb)-totT;
  const g=+rr/100,fvR=tot*Math.pow(1+g,+yrs),fvT=tot*Math.pow(1+g,+yrs)*(1-comb);
  const chartData=Array.from({length:Math.min(+yrs,30)+1},(_,i)=>({yr:i===0?'Now':`Yr ${i}`,Roth:Math.round(tot*Math.pow(1+g,i)),Traditional:Math.round(tot*Math.pow(1+g,i)*(1-comb))}));
  return <div style={s.grid}>
    <div style={{...s.card,overflowY:'auto',maxHeight:760}}>
      <b style={{fontSize:15,color:'#000'}}>🔄 Mega Backdoor Roth</b>
      <div style={s.sec}>Section 1 — 401(k) Limits</div>
      <Tog val={yr} set={setYr} opts={[{v:'2024',l:'2024'},{v:'2025',l:'2025'}]}/>
      <Inp label="Age (end of tax year)" val={age} set={setAge}/>
      <div style={{fontSize:12,color:'#000',marginTop:7}}>IRS 415(c): <b>{fc(tlim)}</b> | Elective max: <b>{fc(emax)}</b>{+age>=50?` | Catch-up: ${fc(cu)}`:''}</div>
      <div style={s.sec}>Section 2 — 401(k) Contributions</div>
      <Inp label="Employee Pre-Tax ($)" val={pt} set={setPt}/><Inp label="Employee Roth 401(k) ($)" val={r4} set={setR4}/><Inp label="Employer Match ($)" val={match} set={setMatch}/>
      <div style={s.sec}>Section 3 — After-Tax</div>
      <Inp label="After-Tax Contribution ($)" val={contrib} set={setContrib}/><Inp label="Earnings Before Conversion ($)" val={earn} set={setEarn}/>
      <div style={s.sec}>Section 4 — Tax Rates</div>
      <Inp label="Federal Marginal Rate (%)" val={fr} set={setFr} step={0.5}/><Inp label="State Rate (%)" val={cr} set={setCr} step={0.1}/>
      <div style={s.sec}>Growth Projection</div>
      <Inp label="Years Until Retirement" val={yrs} set={setYrs}/><Inp label="Expected Annual Return (%)" val={rr} set={setRr} step={0.5}/>
    </div>
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      <div style={s.res}><b style={{color:'#3730a3'}}>📋 Conversion Summary</b><div style={{marginTop:12}}>
        <RR label="Available After-Tax Space" val={fc(avail)} type="h"/><RR label="Within 415(c) Limit" val={ok?'✓ Yes':'✗ No — reduce contribution'} type={ok?'g':'d'}/>
        <div style={s.div}/>
        <RR label="After-Tax Basis (non-taxable)" val={fc(contrib)} type="g"/><RR label="Earnings (taxable only)" val={fc(earn)} type={+earn>0?'d':''}/><RR label="Total Converted to Roth" val={fc(tot)}/>
        <div style={s.div}/>
        <RR label={`Federal Tax on Earnings (${fr}%)`} val={fc(fedT)} type={+earn>0?'d':''}/><RR label={`State Tax on Earnings (${cr}%)`} val={fc(caT)} type={+earn>0?'d':''}/>
        <RT label="Total Tax on Conversion" val={fc(totT)} type={totT>0?'d':'g'}/>
        <RR label="Net Amount in Roth (full)" val={fc(tot)} type="g"/><RR label="Tax Savings vs. Pre-Tax" val={fc(savs)} type="g"/>
        {!ok&&<Warn msg={`Exceeds available space of ${fc(avail)}.`}/>}
        {+earn>1000&&<Warn msg="Convert soon — earnings grow your taxable portion."/>}
      </div></div>
      <div style={s.card}>
        <b style={{color:'#000'}}>📈 Roth vs. Traditional Growth</b>
        <div style={{height:150,marginTop:8}}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="yr" tick={{fontSize:11}} interval={Math.floor(Math.min(+yrs,30)/5)}/>
              <YAxis tick={{fontSize:11}} tickFormatter={(v:number)=>'$'+(v/1000).toFixed(0)+'k'}/>
              <Tooltip formatter={(v:number)=>fc(v)}/>
              <Line type="monotone" dataKey="Roth" stroke="#6366f1" dot={false} strokeWidth={2}/>
              <Line type="monotone" dataKey="Traditional" stroke="#9ca3af" dot={false} strokeDasharray="4 3"/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{display:'flex',gap:16,marginTop:6,fontSize:12,color:'#000'}}>
          <span><span style={{display:'inline-block',width:12,height:3,background:'#6366f1',verticalAlign:'middle',marginRight:4}}/>Roth (tax-free)</span>
          <span><span style={{display:'inline-block',width:12,height:3,background:'#9ca3af',verticalAlign:'middle',marginRight:4}}/>Traditional (after-tax)</span>
        </div>
      </div>
      <div style={s.card}>
        <b style={{color:'#000'}}>⚖️ Mega Backdoor vs. Pre-Tax</b>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:12.5,marginTop:10}}>
          <thead><tr style={{background:'#e0e7ff'}}>{['','Mega Backdoor','Pre-Tax'].map(h=><th key={h} style={{textAlign:'left',padding:'5px 7px',color:'#3730a3',fontWeight:600}}>{h}</th>)}</tr></thead>
          <tbody>{[['Pro-Rata Rule','NO ✓','YES'],['What\'s Taxed?','Earnings only','Entire amount'],['Annual Capacity',fc(tlim),'Unlimited'],['Tax This Conversion',fc(totT),fc(tot*comb)],[`Future Value (${yrs}yr)`,fc(fvR),fc(fvT)],['Roth Advantage',fd(fvR-fvT),'']].map(([l,a,b])=><tr key={l} style={{borderBottom:'1px solid #e5e7eb'}}><td style={{padding:'5px 7px',color:'#000'}}>{l}</td><td style={{padding:'5px 7px',color:'#6366f1',fontWeight:500}}>{a}</td><td style={{padding:'5px 7px',color:'#000'}}>{b}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  </div>;
}

// Roth Conversion Calculator
function RothConv(){
  const[pb,setPb]=useState(0);const[nc,setNc]=useState(7000);
  const[ti,setTi]=useState(1600000);const[si,setSi]=useState(0);const[smi,setSmi]=useState(0);
  const[cv,setCv]=useState(7000);const[status,setStatus]=useState('mfj');const[oi,setOi]=useState(0);const[sr,setSr]=useState(5);
  const[gro,setGro]=useState(7);const[tw,setTw]=useState(10);const[sw,setSw]=useState(5);const[yrs,setYrs]=useState(30);
  const tb=+pb + +nc,tIRA=+ti + +si + +smi;
  const ntr=tIRA>0?tb/tIRA:0,ntp=+cv*ntr,txp=+cv-ntp,rb=tb-ntp;
  const txBase=Math.max(0,+oi-STD[status as keyof typeof STD]);
  const twout=ft(txBase,status),twith=ft(txBase+txp,status);
  const ifc=twith-twout,sta=txp*(+sr/100),tot=ifc+sta,eff=+cv>0?tot/+cv:0;
  const marg=mgr(txBase+txp,status),bef=mgr(txBase,status),bumps=marg>bef;
  const room=(()=>{let prev=0;for(const[l]of(FED[status as keyof typeof FED]||FED.single)){if(txBase<l)return l-txBase;prev=l;}return 0;})();
  const g=+gro/100,twr=(+tw + +sw)/100,yrsN=Math.min(+yrs,50);
  const milestones=[5,10,15,20,25,30].filter(m=>m<=yrsN);
  const chartData=Array.from({length:yrsN+1},(_,i)=>({yr:i===0?'Now':`Yr ${i}`,Roth:Math.round(+cv*Math.pow(1+g,i)),Traditional:Math.round(+cv*Math.pow(1+g,i)*(1-twr))}));
  return <div style={s.grid}>
    <div style={{...s.card,overflowY:'auto',maxHeight:820}}>
      <b style={{fontSize:15,color:'#000'}}>↔️ Roth IRA Conversion</b>
      <div style={s.sec}>Section 1 — Prior-Year Basis (Form 8606)</div>
      <Inp label="Prior-Year Nondeductible Basis ($)" val={pb} set={setPb}/><Inp label="Current-Year Nondeductible Contributions ($)" val={nc} set={setNc}/>
      <div style={s.sec}>Section 2 — IRA Balances (Form 5498)</div>
      <Inp label="Traditional IRA 12/31 ($)" val={ti} set={setTi}/><Inp label="SEP IRA 12/31 ($)" val={si} set={setSi}/><Inp label="SIMPLE IRA 12/31 ($)" val={smi} set={setSmi}/>
      <div style={s.sec}>Section 3 — Conversion</div>
      <Inp label="Amount to Convert ($)" val={cv} set={setCv}/>
      <div style={s.sec}>Section 5 — Tax Inputs</div>
      <Sel label="Filing Status" val={status} set={setStatus} opts={[{v:'single',l:'Single'},{v:'mfj',l:'Married Filing Jointly'},{v:'mfs',l:'Married Filing Separately'},{v:'hoh',l:'Head of Household'}]}/>
      <Inp label="Other Taxable Income ($)" val={oi} set={setOi}/><Inp label="State Income Tax Rate (%)" val={sr} set={setSr} step={0.1}/>
      <div style={s.sec}>Growth Projection</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
        <Inp label="Annual Growth (%)" val={gro} set={setGro} step={0.5}/><Inp label="Tax at Withdrawal (%)" val={tw} set={setTw} step={0.5}/>
        <Inp label="State Tax at Withdrawal (%)" val={sw} set={setSw} step={0.5}/><Inp label="Years to Project" val={yrs} set={setYrs}/>
      </div>
    </div>
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      <div style={s.res}><b style={{color:'#3730a3'}}>📋 Pro-Rata & Tax Summary</b><div style={{marginTop:12}}>
        <RR label="Total Basis" val={f2(tb)} type="h"/><RR label="Total IRA Balance" val={f2(tIRA)}/><RR label="Non-Taxable Ratio" val={(ntr*100).toFixed(2)+'%'}/><RR label="Non-Taxable Portion" val={f2(ntp)} type="g"/><RR label="Taxable Portion" val={f2(txp)} type={txp>0?'d':''}/><RR label="Remaining Basis (carry forward)" val={f2(rb)}/>
        <div style={s.div}/>
        <RR label="Federal Tax WITHOUT Conversion" val={f2(twout)}/><RR label="Federal Tax WITH Conversion" val={f2(twith)} type="d"/><RR label="Incremental Federal Tax" val={f2(ifc)} type="d"/><RR label="Marginal Rate on Conversion" val={(marg*100).toFixed(1)+'%'}/><RR label={`State Tax (${sr}%)`} val={f2(sta)} type="d"/>
        <RT label="Total Tax on Conversion" val={f2(tot)} type="d"/><RT label="Effective Rate" val={(eff*100).toFixed(1)+'%'}/>
        {ntr<0.01&&tIRA>0&&<Warn msg={`Pro-rata ratio only ${(ntr*100).toFixed(2)}% — nearly all taxable. Consider rolling trad IRA into 401(k) first.`}/>}
      </div></div>
      <div style={s.card}>
        <b style={{color:'#000'}}>📊 Bracket Awareness</b><div style={{marginTop:8}}>
          <RR label="Current Bracket" val={(bef*100).toFixed(1)+'%'}/><RR label="Bracket After Conversion" val={(marg*100).toFixed(1)+'%'} type={bumps?'d':''}/><RR label="Room in Current Bracket" val={fc(room)} type="h"/><RR label="Pushes Into Higher Bracket?" val={bumps?'Yes':'No'} type={bumps?'d':'g'}/>
          {bumps&&<Warn msg={`Split conversions across years to stay in ${(bef*100).toFixed(0)}% bracket.`}/>}
          {!bumps&&room>+cv&&<Warn ok msg={`${fc(room - +cv)} of additional capacity in ${(bef*100).toFixed(0)}% bracket.`}/>}
        </div>
      </div>
      <div style={s.card}>
        <b style={{color:'#000'}}>📈 Compounding Growth</b>
        <div style={{height:150,marginTop:8}}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="yr" tick={{fontSize:11}} interval={Math.floor(yrsN/5)}/>
              <YAxis tick={{fontSize:11}} tickFormatter={(v:number)=>'$'+(v/1000).toFixed(0)+'k'}/>
              <Tooltip formatter={(v:number)=>f2(v)}/>
              <Line type="monotone" dataKey="Roth" stroke="#6366f1" dot={false} strokeWidth={2}/>
              <Line type="monotone" dataKey="Traditional" stroke="#9ca3af" dot={false} strokeDasharray="4 3"/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:12.5,marginTop:8}}>
          <thead><tr style={{background:'#e0e7ff'}}>{['Year','Traditional','Roth','Advantage'].map(h=><th key={h} style={{textAlign:'left',padding:'5px 7px',color:'#3730a3',fontWeight:600}}>{h}</th>)}</tr></thead>
          <tbody>{milestones.map(m=>{const tr=+cv*Math.pow(1+g,m)*(1-twr),ro=+cv*Math.pow(1+g,m),adv=ro-tr;return <tr key={m} style={{borderBottom:'1px solid #e5e7eb'}}><td style={{padding:'5px 7px',color:'#000'}}>{m} yrs</td><td style={{padding:'5px 7px',color:'#000',filter:'blur(4px)'}}>{f2(tr)}</td><td style={{padding:'5px 7px',color:'#16a34a',fontWeight:600,filter:'blur(4px)'}}>{f2(ro)}</td><td style={{padding:'5px 7px',color:adv>=0?'#16a34a':'#dc2626',fontWeight:600,filter:'blur(4px)'}}>{adv>=0?'+':''}{f2(adv)}</td></tr>;})}</tbody>
        </table>
      </div>
    </div>
  </div>;
}

// Main App
const TABS=[{id:'re',l:'🏠 Real Estate'},{id:'rsu',l:'📈 RSU/ESPP'},{id:'est',l:'📅 Est. Tax'},{id:'roth',l:'🔄 Mega Backdoor'},{id:'conv',l:'↔️ Roth Conversion'}];

interface TaxCalculatorProps {
  isClient: boolean;
}

export default function TaxCalculator({ isClient }: TaxCalculatorProps) {
  const[tab,setTab]=useState('re');

  if (!isClient) {
    return (
      <div style={{fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',fontSize:15,background:'#f8f9fa',minHeight:'400px',padding:'40px 16px',textAlign:'center'}}>
        <div style={{maxWidth:'600px',margin:'0 auto',background:'#fff',borderRadius:12,padding:'40px 20px',border:'1px solid #e5e7eb'}}>
          <div style={{fontSize:48,marginBottom:20}}>🔒</div>
          <h2 style={{fontSize:24,fontWeight:700,marginBottom:12,color:'#000'}}>Premium Client Access Required</h2>
          <p style={{fontSize:15,color:'#000',marginBottom:24,lineHeight:1.6}}>
            This advanced tax planning calculator is exclusively available to our Annual Tax Planning clients.
            To access these powerful tools and receive personalized tax strategies, please contact us to become a client.
          </p>
          <a
            href="/contact"
            style={{
              display:'inline-block',
              padding:'12px 32px',
              background:'#6366f1',
              color:'#fff',
              borderRadius:8,
              fontSize:15,
              fontWeight:600,
              textDecoration:'none',
              transition:'background 0.2s'
            }}
          >
            Contact Us to Get Access
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',fontSize:15,background:'transparent',minHeight:'100vh',padding:'20px 16px'}}>
      <h1 style={{fontSize:20,fontWeight:700,marginBottom:3,color:'#000'}}>🧮 Tax Analysis Calculator</h1>
      <p style={{fontSize:13,color:'#000',marginBottom:18}}>Real Estate · RSU/ESPP · Estimated Tax · Mega Backdoor Roth · Roth Conversion</p>
      <div style={{display:'flex',gap:3,marginBottom:20,background:'#e9ecef',borderRadius:10,padding:4}}>
        {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:'9px 4px',border:'none',borderRadius:7,cursor:'pointer',fontSize:12,fontWeight:500,background:tab===t.id?'#fff':'transparent',color:tab===t.id?'#000':'#000',boxShadow:tab===t.id?'0 1px 3px rgba(0,0,0,.1)':'none'}}>{t.l}</button>)}
      </div>
      {tab==='re'&&<RealEstate isClient={isClient}/>}{tab==='rsu'&&<RSUPanel isClient={isClient}/>}{tab==='est'&&<EstTax/>}{tab==='roth'&&<MegaBackdoor/>}{tab==='conv'&&<RothConv/>}
    </div>
  );
}
