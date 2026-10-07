(function(){
  'use strict';

  /* ---------- PRELOADER ---------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      // Trigger hero text reveal after preloader
      setTimeout(() => {
        document.querySelectorAll('.hero .text-reveal').forEach(el => {
          el.classList.add('active');
        });
      }, 300);
    }, 800);
  });

  /* ---------- ADVANCED CUSTOM CURSOR ---------- */
  const cursor = document.getElementById('custom-cursor');
  const cursorFollower = document.getElementById('custom-cursor-follower');
  const cursorSteam = document.getElementById('cursor-steam');
  let cursorX = 0, cursorY = 0;
  let followerX = 0, followerY = 0;

  if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      cursor.classList.add('active');
      cursorFollower.classList.add('active');
    });

    // Smooth follower animation
    function animateCursor() {
      followerX += (cursorX - followerX) * 0.1;
      followerY += (cursorY - followerY) * 0.1;
      cursorFollower.style.left = followerX + 'px';
      cursorFollower.style.top = followerY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.addEventListener('mouseleave', () => {
      cursor.classList.remove('active');
      cursorFollower.classList.remove('active');
    });

    // Hover effect on interactive elements
    const interactiveElements = 'a, button, .pour-card, .faq-q, input, select, .social-row a';
    document.querySelectorAll(interactiveElements).forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        cursorFollower.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        cursorFollower.classList.remove('hover');
      });
    });

    // Click effect
    document.addEventListener('mousedown', () => {
      cursor.classList.add('clicking');
    });
    document.addEventListener('mouseup', () => {
      cursor.classList.remove('clicking');
    });

    // Steam trail effect
    let lastSteamTime = 0;
    document.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - lastSteamTime > 150) {
        lastSteamTime = now;
        createSteam(e.clientX, e.clientY);
      }
    });

    function createSteam(x, y) {
      const steam = cursorSteam.cloneNode(true);
      steam.style.left = x + 'px';
      steam.style.top = y + 'px';
      steam.classList.add('active');
      document.body.appendChild(steam);
      setTimeout(() => steam.remove(), 1000);
    }
  }

  /* ---------- ADVANCED SCROLL REVEAL ---------- */
  const revealTypes = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-scale', '.stagger-children'];
  const revealElements = document.querySelectorAll(revealTypes.join(', '));
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ---------- YEAR ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- NAV SOLID ON SCROLL + PROGRESS ---------- */
  const nav = document.getElementById('site-nav');
  const progress = document.getElementById('progress');
  const backtotop = document.getElementById('backtotop');
  function onScroll(){
    nav.classList.toggle('solid', window.scrollY > 80);
    const h = document.documentElement;
    const pct = (h.scrollTop || document.body.scrollTop) / ((h.scrollHeight||document.body.scrollHeight) - h.clientHeight) * 100;
    progress.style.width = pct + '%';
    backtotop.classList.toggle('show', window.scrollY > 800);
  }
  document.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
  backtotop.addEventListener('click', ()=>window.scrollTo({top:0, behavior:'smooth'}));

  /* ---------- MOBILE DRAWER ---------- */
  const drawer = document.getElementById('mobile-drawer');
  document.getElementById('burger-btn').addEventListener('click', ()=>drawer.classList.add('open'));
  document.getElementById('close-drawer').addEventListener('click', ()=>drawer.classList.remove('open'));
  drawer.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>drawer.classList.remove('open')));

  /* ---------- THEME TOGGLE (day / night brew) ---------- */
  const themeBtn = document.getElementById('theme-btn');
  themeBtn.addEventListener('click', ()=>{
    const html = document.documentElement;
    const isNight = html.getAttribute('data-theme') === 'night';
    html.setAttribute('data-theme', isNight ? 'day' : 'night');
    themeBtn.textContent = isNight ? '☾' : '☀';
  });

  /* ---------- ACTIVE NAV LINK ---------- */
  const sections = ['story','menu','bakes','gallery','visit'].map(id=>document.getElementById(id)).filter(Boolean);
  const navLinks = document.querySelectorAll('nav.nav-links a[data-nav]');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        navLinks.forEach(l=>l.classList.toggle('active', l.getAttribute('href') === '#'+entry.target.id));
      }
    });
  }, {rootMargin:'-40% 0px -50% 0px'});
  sections.forEach(s=>io.observe(s));

  /* ---------- OPEN / CLOSED STATUS ---------- */
  const hours = {0:[9*60,22*60+30],1:[8*60,23*60],2:[8*60,23*60],3:[8*60,23*60],4:[8*60,23*60],5:[8*60,23*60+30],6:[8*60,23*60+30]};
  const now = new Date();
  const mins = now.getHours()*60+now.getMinutes();
  const today = hours[now.getDay()];
  const isOpen = today && mins >= today[0] && mins <= today[1];
  const dot = document.getElementById('status-dot');
  const txt = document.getElementById('status-text');
  if(isOpen){
    dot.classList.remove('closed');
    const closeH = Math.floor(today[1]/60), closeM = today[1]%60;
    const h12 = ((closeH+11)%12)+1;
    txt.textContent = 'Open now · closes ' + h12 + (closeM? ':'+String(closeM).padStart(2,'0'):'') + (closeH>=12?' PM':' AM');
  } else {
    dot.classList.add('closed');
    txt.textContent = 'Closed now · opens 8:00 AM';
  }
  const todayRow = document.querySelector('#hours-table tr[data-day="'+now.getDay()+'"]');
  if(todayRow) todayRow.classList.add('today');

  /* ---------- FLIP CARDS WITH 3D TILT ---------- */
  document.querySelectorAll('.pour-card').forEach(card=>{
    const inner = card.querySelector('.pour-inner');

    function flip(){
      card.classList.toggle('flipped');
      // Clear inline transform when flipping to allow CSS transition
      inner.style.transform = '';
    }

    card.addEventListener('click', flip);
    card.addEventListener('touchend', (e) => {
      e.preventDefault();
      flip();
    });
    card.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); flip(); }});

    // 3D tilt effect (desktop only)
    if(window.matchMedia('(pointer: fine)').matches) {
      card.addEventListener('mousemove', (e) => {
        if(card.classList.contains('flipped')) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        if(!card.classList.contains('flipped')) {
          inner.style.transform = '';
        }
      });
    }
  });

  /* ---------- FAQ ACCORDION ---------- */
  document.querySelectorAll('.faq-item').forEach(item=>{
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', ()=>{
      const isOpenNow = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o=>{ o.classList.remove('open'); o.querySelector('.faq-a').style.maxHeight = null; });
      if(!isOpenNow){ item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
    });
  });

  /* ---------- RESERVATION FORM ---------- */
  const form = document.getElementById('reserve-form');
  const msg = document.getElementById('form-msg');
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const name = document.getElementById('r-name').value.trim();
    const phone = document.getElementById('r-phone').value.trim();
    const date = document.getElementById('r-date').value;
    const time = document.getElementById('r-time').value;
    const guests = document.getElementById('r-guests').value;

    if(!name || !phone || !date || !time){
      msg.classList.remove('success');
      msg.style.color = 'var(--burgundy)';
      msg.textContent = 'Please fill in every field.';
      return;
    }

    // Store in database
    const reservation = RoseraDB.addReservation({
      name: name,
      phone: phone,
      date: date,
      time: time,
      guests: guests
    });

    msg.classList.add('success');
    msg.textContent = '✓ Reservation confirmed! Reference #' + reservation.id + '. We\'ll call you at ' + phone + ' to confirm.';
    form.reset();
    document.getElementById('r-time').value = '18:00';

    // Log to console for demo
    console.log('New reservation:', reservation);
    console.log('All reservations:', RoseraDB.getReservations());
  });

  /* ---------- NEWSLETTER ---------- */
  document.getElementById('news-btn').addEventListener('click', ()=>{
    const email = document.getElementById('news-email').value.trim();
    const out = document.getElementById('news-msg');

    if(!email || !email.includes('@') || !email.includes('.')){
      out.classList.remove('success');
      out.style.color = 'var(--burgundy)';
      out.textContent = 'Please enter a valid email address.';
      return;
    }

    // Store in database
    const result = RoseraDB.addSubscription(email);

    if(result.success) {
      out.classList.add('success');
      out.textContent = '✓ Welcome to Roséra! You\'ll receive our seasonal updates.';
      document.getElementById('news-email').value = '';

      // Log to console for demo
      console.log('New subscription:', result.data);
      console.log('All subscriptions:', RoseraDB.getSubscriptions());
    } else {
      out.classList.remove('success');
      out.style.color = 'var(--burgundy)';
      out.textContent = 'This email is already subscribed.';
    }
  });

  /* ---------- MAGNETIC BUTTONS ---------- */
  document.querySelectorAll('.btn-magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* ---------- PARALLAX EFFECT ---------- */
  const parallaxImg = document.querySelector('.parallax-img');
  if(parallaxImg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if(scrolled < window.innerHeight) {
        parallaxImg.style.transform = `translateY(${scrolled * 0.15}px)`;
      }
    }, {passive:true});
  }

  /* ---------- PARTICLE EFFECT ON CLICK ---------- */
  document.addEventListener('click', (e) => {
    createParticles(e.clientX, e.clientY);
  });

  function createParticles(x, y) {
    const particleCount = 8;
    for(let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      const size = Math.random() * 6 + 4;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      particle.style.background = `hsl(${Math.random() * 60 + 30}, 70%, 60%)`;
      particle.style.setProperty('--tx', (Math.random() - 0.5) * 100 + 'px');
      particle.style.setProperty('--ty', (Math.random() - 0.5) * 100 + 'px');
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 1000);
    }
  }

  /* ---------- SMOOTH SCROLL FOR ANCHOR LINKS ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if(target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  /* ---------- LAZY LOADING IMAGES ---------- */
  if('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) {
          const img = entry.target;
          if(img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imgObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
  }

  /* ---------- ADMIN PANEL ---------- */
  const adminPanel = document.getElementById('admin-panel');
  const closeAdmin = document.getElementById('close-admin');
  const adminReservations = document.getElementById('admin-reservations');
  const adminSubscriptions = document.getElementById('admin-subscriptions');
  const clearDb = document.getElementById('clear-db');

  // Toggle admin panel with Ctrl+Shift+D
  document.addEventListener('keydown', (e) => {
    if(e.ctrlKey && e.shiftKey && e.key === 'D') {
      e.preventDefault();
      adminPanel.style.display = adminPanel.style.display === 'none' ? 'block' : 'none';
      if(adminPanel.style.display === 'block') {
        loadAdminData();
      }
    }
  });

  closeAdmin.addEventListener('click', () => {
    adminPanel.style.display = 'none';
  });

  clearDb.addEventListener('click', () => {
    if(confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      RoseraDB.clearAll();
      loadAdminData();
      alert('All data cleared.');
    }
  });

  function loadAdminData() {
    // Load reservations
    const reservations = RoseraDB.getReservations();
    adminReservations.innerHTML = reservations.length === 0
      ? '<p style="color:var(--ink-soft); font-style:italic;">No reservations yet</p>'
      : reservations.map(r => `
        <div style="background:var(--cream); padding:16px; border-radius:var(--radius-sm); border:1px solid var(--line);">
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <strong style="color:var(--burgundy);">${r.name}</strong>
            <span style="font-size:0.8rem; color:var(--ink-soft);">#${r.id}</span>
          </div>
          <div style="font-size:0.9rem; color:var(--ink-soft);">
            <div>📞 ${r.phone}</div>
            <div>📅 ${r.date} at ${r.time}</div>
            <div>👥 ${r.guests} guests</div>
            <div style="margin-top:8px; font-size:0.8rem; color:var(--gold);">Status: ${r.status}</div>
          </div>
          <div style="margin-top:12px; display:flex; gap:8px;">
            <button onclick="updateReservationStatus(${r.id}, 'confirmed')" style="flex:1; padding:6px; background:#8bd17c; color:var(--espresso); border:none; border-radius:4px; cursor:pointer; font-size:0.8rem;">Confirm</button>
            <button onclick="updateReservationStatus(${r.id}, 'cancelled')" style="flex:1; padding:6px; background:#d17c7c; color:white; border:none; border-radius:4px; cursor:pointer; font-size:0.8rem;">Cancel</button>
            <button onclick="deleteReservation(${r.id})" style="padding:6px 12px; background:var(--ink); color:white; border:none; border-radius:4px; cursor:pointer; font-size:0.8rem;">Delete</button>
          </div>
        </div>
      `).join('');

    // Load subscriptions
    const subscriptions = RoseraDB.getSubscriptions();
    adminSubscriptions.innerHTML = subscriptions.length === 0
      ? '<p style="color:var(--ink-soft); font-style:italic;">No subscriptions yet</p>'
      : subscriptions.map(s => `
        <div style="background:var(--cream); padding:16px; border-radius:var(--radius-sm); border:1px solid var(--line);">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <strong style="color:var(--ink);">${s.email}</strong>
              <div style="font-size:0.8rem; color:var(--ink-soft); margin-top:4px;">Subscribed: ${new Date(s.createdAt).toLocaleDateString()}</div>
            </div>
            <button onclick="deleteSubscription(${s.id})" style="padding:6px 12px; background:var(--burgundy); color:var(--gold-soft); border:none; border-radius:4px; cursor:pointer; font-size:0.8rem;">Remove</button>
          </div>
        </div>
      `).join('');
  }

  // Global functions for admin panel
  window.updateReservationStatus = (id, status) => {
    RoseraDB.updateReservationStatus(id, status);
    loadAdminData();
  };

  window.deleteReservation = (id) => {
    if(confirm('Delete this reservation?')) {
      RoseraDB.deleteReservation(id);
      loadAdminData();
    }
  };

  window.deleteSubscription = (id) => {
    if(confirm('Remove this subscription?')) {
      RoseraDB.deleteSubscription(id);
      loadAdminData();
    }
  };
})();