(function(){
  // Dismissible order banner (remembers dismissal)
  var b=document.getElementById('order-banner');
  try{ if(b && localStorage.getItem('orderBannerDismissed')!=='1'){ b.hidden=false; } }catch(e){ if(b) b.hidden=false; }
  if(b){ b.querySelector('.banner-x').addEventListener('click',function(){ b.hidden=true; try{localStorage.setItem('orderBannerDismissed','1')}catch(e){} }); }

  // Open-now badge from window.HOURS, evaluated in Chicago time; handles closing after midnight
  var badge=document.querySelector('[data-open-badge]');
  if(badge && window.HOURS){
    var days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',weekday:'long',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date());
    var p={};parts.forEach(function(x){p[x.type]=x.value});
    var di=days.indexOf(p.weekday), now=(parseInt(p.hour,10)%24)*60+parseInt(p.minute,10);
    function rule(d){for(var i=0;i<HOURS.length;i++){if(HOURS[i].days.indexOf(days[d])>-1)return HOURS[i]}return null}
    function m(t){var a=t.split(':');return a[0]*60+ +a[1]}
    function fmt(t){var h=+t.split(':')[0],mm=t.split(':')[1];var ap=h<12?'AM':'PM';var h12=h%12||12;return h12+(mm==='00'?'':':'+mm)+' '+ap}
    var open=false,closes=null,r=rule(di),y=rule((di+6)%7);
    if(y){var yo=m(y.opens),yc=m(y.closes); if(yc<=yo && now<yc){open=true;closes=y.closes}}
    if(!open&&r){var o=m(r.opens),c=m(r.closes); if(c<=o){ if(now>=o){open=true;closes=r.closes} } else if(now>=o&&now<c){open=true;closes=r.closes}}
    badge.textContent=open?('Open now · closes '+fmt(closes)):'Closed now';
    if(!open) badge.classList.add('closed');
  }

  // Click-to-load maps
  document.querySelectorAll('[data-load-map]').forEach(function(btn){
    btn.addEventListener('click',function(){var box=btn.closest('.map');var f=document.createElement('iframe');f.src=box.getAttribute('data-map');f.title="Map of Ricobene's";f.loading='lazy';box.innerHTML='';box.appendChild(f)});
  });

  // Mailto forms: build a readable email body
  document.querySelectorAll('form.mform').forEach(function(f){
    f.addEventListener('submit',function(ev){
      if(!f.reportValidity())return; ev.preventDefault();
      var lines=[];f.querySelectorAll('input,textarea').forEach(function(i){lines.push(i.name+': '+i.value)});
      location.href='mailto:'+f.dataset.mailto+'?subject='+encodeURIComponent(f.dataset.subject)+'&body='+encodeURIComponent(lines.join('\n'));
    });
  });
})();
