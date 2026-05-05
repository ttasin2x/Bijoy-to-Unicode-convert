// ==========================================
// 1. PWA INSTALL LOGIC
// ==========================================
let deferredPrompt;
const installCard = document.getElementById('installAppCard');
const sideInstall = document.getElementById('side-install-app');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installCard.style.display = 'flex';
    sideInstall.style.display = 'flex';
});

function triggerInstall() {
    if (!deferredPrompt) return;
    installCard.style.display = 'none';
    sideInstall.style.display = 'none';
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        deferredPrompt = null;
    });
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then(reg => {
            console.log('SW Registered!', reg);
        }).catch(err => {
            console.log('SW Fail!', err);
        });
    });
}

// ==========================================
// 2. LANGUAGE TRANSLATION LOGIC
// ==========================================
const dictionary = {
    'EN': {
        title: "Unicode to <span>Bijoy</span> Converter", 
        desc: "Convert your Unicode text to Bijoy format easily and quickly. Completely free and secure.",
        src: "<i class='fas fa-pen' style='color:var(--primary)'></i> Source Text (Input)", 
        auto: "Auto", 
        clear: "<i class='fas fa-trash-alt'></i> Clear",
        out: "<i class='fas fa-file-alt' style='color:var(--primary)'></i> Converted Text (Output)",
        btnBjy: "<i class='fas fa-arrow-down'></i> To Bijoy", 
        btnUni: "<i class='fas fa-arrow-up'></i> To Unicode", 
        btnCpy: "<i class='far fa-copy'></i> Copy Output",
        vis: "Visual Mode", 
        role: "Professional graphic designer, front-end & Android developer based in Barguna, Barishal. Crafting butter smooth UIs.",
        conn: "CONNECT", 
        res: "RESOURCES & FEATURES",
        cTitle: "Buy me a coffee", 
        cDesc: "Support development", 
        hTitle: "How it works", 
        hDesc: "See simple guidelines",
        fTitle: "App Features", 
        fDesc: "See what you get", 
        qTitle: "FAQs", 
        qDesc: "Offline support & more",
        navConv: "Convert", 
        navDev: "Developer", 
        toastCopy: "Successfully Copied!",
        iTitle: "Install App", 
        iDesc: "Add to Homescreen", 
        navInst: "Install App",
        menuThemeLight: "Light Mode",
        menuThemeDark: "Dark Mode"
    },
    'BN': {
        title: "Unicode থেকে <span>Bijoy</span> কনভার্টার", 
        desc: "আমাদের টুল ব্যবহার করে খুব সহজে ও দ্রুত Unicode (ইউনিকোড) টেক্সটকে Bijoy (বিজয়) ফরম্যাটে রূপান্তর করুন। একদম ফ্রি এবং নিরাপদ।",
        src: "<i class='fas fa-pen' style='color:var(--primary)'></i> সোর্স টেক্সট (Input)", 
        auto: "অটো", 
        clear: "<i class='fas fa-trash-alt'></i> মুছুন",
        out: "<i class='fas fa-file-alt' style='color:var(--primary)'></i> রূপান্তরিত টেক্সট (Output)",
        btnBjy: "<i class='fas fa-arrow-down'></i> To Bijoy", 
        btnUni: "<i class='fas fa-arrow-up'></i> To Unicode", 
        btnCpy: "<i class='far fa-copy'></i> Copy Output",
        vis: "Visual Mode", 
        role: "Professional graphic designer, front-end & Android developer based in Barguna, Barishal. Crafting butter smooth UIs.",
        conn: "CONNECT", 
        res: "RESOURCES & FEATURES",
        cTitle: "Buy me a coffee", 
        cDesc: "Support development", 
        hTitle: "অ্যাপ কীভাবে কাজ করে", 
        hDesc: "সহজ গাইডলাইন দেখুন",
        fTitle: "অ্যাপের বৈশিষ্ট্যসমূহ", 
        fDesc: "কী কী সুবিধা পাচ্ছেন দেখুন", 
        qTitle: "FAQs", 
        qDesc: "অফলাইন সাপোর্ট ও অন্যান্য",
        navConv: "কনভার্ট", 
        navDev: "ডেভেলপার", 
        toastCopy: "সফলভাবে কপি হয়েছে!",
        iTitle: "অ্যাপ ইনস্টল করুন", 
        iDesc: "হোমস্ক্রিনে অ্যাড করুন", 
        navInst: "অ্যাপ ইনস্টল করুন",
        menuThemeLight: "লাইট মোড",
        menuThemeDark: "ডার্ক মোড"
    }
};

let currentLangStr = 'BN';

function setLanguage(lang) {
    currentLangStr = lang;
    document.getElementById('currentLangBtn').innerText = lang;
    document.querySelectorAll(".three-dot-menu").forEach(m => m.classList.remove('show'));
    document.getElementById('langMenu').classList.remove('show');
    
    const t = dictionary[lang];
    
    document.getElementById('t-title').innerHTML = t.title;
    document.getElementById('t-desc').innerText = t.desc;
    document.getElementById('t-src').innerHTML = t.src;
    document.getElementById('t-auto').innerText = t.auto;
    document.getElementById('t-clear').innerHTML = t.clear;
    document.getElementById('t-out').innerHTML = t.out;
    document.getElementById('t-btn-bijoy').innerHTML = t.btnBjy;
    document.getElementById('t-btn-uni').innerHTML = t.btnUni;
    document.getElementById('t-btn-copy').innerHTML = t.btnCpy;
    document.getElementById('t-vis').innerText = t.vis;
    document.getElementById('t-dev-role').innerText = t.role;
    document.getElementById('t-connect').innerText = t.conn;
    document.getElementById('t-resources').innerText = t.res;
    document.getElementById('t-c-title').innerText = t.cTitle;
    document.getElementById('t-c-desc').innerText = t.cDesc;
    document.getElementById('t-h-title').innerText = t.hTitle;
    document.getElementById('t-h-desc').innerText = t.hDesc;
    document.getElementById('t-f-title').innerText = t.fTitle;
    document.getElementById('t-f-desc').innerText = t.fDesc;
    document.getElementById('t-q-title').innerText = t.qTitle;
    document.getElementById('t-q-desc').innerText = t.qDesc;
    document.getElementById('b-nav-conv').innerText = t.navConv;
    document.getElementById('b-nav-dev').innerText = t.navDev;
    document.getElementById('side-nav-conv').innerText = t.navConv;
    document.getElementById('side-nav-dev').innerText = t.navDev;
    document.getElementById('t-i-title').innerText = t.iTitle; 
    document.getElementById('t-i-desc').innerText = t.iDesc;
    document.getElementById('side-nav-inst').innerText = t.navInst;

    const body = document.body;
    const themeText = document.getElementById('menuThemeText');
    if (body.getAttribute('data-theme') === 'dark') {
        themeText.innerText = t.menuThemeLight;
    } else {
        themeText.innerText = t.menuThemeDark;
    }

    setTimeout(() => {
        const activeBtn = document.querySelector('.nav-btn.active');
        if(activeBtn) updateLiquidDrop(activeBtn.id);
    }, 50);
}

// ==========================================
// 3. MENU & THEME LOGIC
// ==========================================
function toggleLangMenu() { 
    document.getElementById('langMenu').classList.toggle('show'); 
    document.getElementById('threeDotMenu').classList.remove('show');
}

function toggleThreeDotMenu() {
    document.getElementById('threeDotMenu').classList.toggle('show');
    document.getElementById('langMenu').classList.remove('show');
}

window.onclick = function(event) {
    if (!event.target.closest('.action-btn')) {
        document.querySelectorAll(".three-dot-menu").forEach(m => m.classList.remove('show'));
    }
    if (!event.target.closest('.lang-btn')) {
        document.querySelectorAll(".lang-dropdown-menu").forEach(m => m.classList.remove('show'));
    }
}

function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('menuThemeIcon');
    const themeText = document.getElementById('menuThemeText');
    const headerThemeIcon = document.querySelector('#themeIcon i');
    
    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        themeIcon.className = 'far fa-moon';
        headerThemeIcon.className = 'far fa-moon';
        themeText.innerText = dictionary[currentLangStr].menuThemeDark;
    } else {
        body.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
        headerThemeIcon.className = 'fas fa-sun';
        themeText.innerText = dictionary[currentLangStr].menuThemeLight;
    }
    document.getElementById('threeDotMenu').classList.remove('show');
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('show');
}

// ==========================================
// 4. CUSTOM TOAST NOTIFICATION
// ==========================================
function showToast(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMsg').innerText = msg;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 2500);
}

// ==========================================
// 5. KEYBOARD FIX (Hide Nav on Mobile Typing)
// ==========================================
const floatingNav = document.getElementById('floatingNav');
const textInputs = document.querySelectorAll('textarea'); 

textInputs.forEach(input => {
    input.addEventListener('focus', () => {
        floatingNav.style.opacity = '0';
        floatingNav.style.pointerEvents = 'none';
        floatingNav.style.transform = 'translate(-50%, 50px)'; 
    });

    input.addEventListener('blur', () => {
        setTimeout(() => {
            floatingNav.style.opacity = '1';
            floatingNav.style.pointerEvents = 'auto';
            floatingNav.style.transform = 'translate(-50%, 0)';
        }, 100);
    });
});

// ==========================================
// 6. LIQUID BOTTOM NAV LOGIC
// ==========================================
function updateLiquidDrop(targetBtnId) {
    const btn = document.getElementById(targetBtnId);
    const drop = document.getElementById('liquidDrop');
    const navInner = document.getElementById('navInner');
    
    if(!btn || !drop || !navInner) return;

    const btnRect = btn.getBoundingClientRect();
    const navRect = navInner.getBoundingClientRect();
    const relativeLeft = btnRect.left - navRect.left;
    
    drop.style.left = relativeLeft + 'px';
    drop.style.width = btnRect.width + 'px';
}

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => { updateLiquidDrop('btn-convert'); }, 100);
});

window.addEventListener('resize', () => {
    const activeBtn = document.querySelector('.nav-btn.active');
    if(activeBtn) updateLiquidDrop(activeBtn.id);
});

function switchView(viewName) {
    document.getElementById('btn-convert').classList.remove('active');
    document.getElementById('btn-dev').classList.remove('active');
    
    const targetBtnId = 'btn-' + viewName;
    document.getElementById(targetBtnId).classList.add('active');

    updateLiquidDrop(targetBtnId);

    const views = document.querySelectorAll('.view-section');
    views.forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(viewName + '-view').classList.add('active');
    window.scrollTo(0, 0);
}

// ==========================================
// 7. BUTTON RIPPLE EFFECTS
// ==========================================
const rippleElements = document.querySelectorAll('.add-ripple');
rippleElements.forEach(el => {
    el.addEventListener('mousedown', function(e) {
        let rect = this.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        
        let ripple = document.createElement('span');
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('btn-ripple');
        this.appendChild(ripple);
        setTimeout(() => { ripple.remove() }, 600);
    });
});

// ==========================================
// 8. MODAL LOGIC
// ==========================================
function openModal(modalId) { document.getElementById(modalId).classList.add('show'); }
function closeModal(modalId) { document.getElementById(modalId).classList.remove('show'); }
function closeModalOutside(event, modalId) { if (event.target.id === modalId) closeModal(modalId); }

function copyBkashNumber() {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText("01533327033").then(() => {
            showToast("বিকাশ নম্বর কপি হয়েছে!");
        });
    } else {
        const temp = document.createElement("input");
        temp.value = "01533327033";
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        document.body.removeChild(temp);
        showToast("বিকাশ নম্বর কপি হয়েছে!");
    }
}
