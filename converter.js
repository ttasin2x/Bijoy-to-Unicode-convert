// ==========================================
// 1. CORE VARIABLES & EVENT LISTENERS
// ==========================================
let currentConvertMode = 'bijoy'; // ডিফল্ট মোড বিজয়
const sourceTextInput = document.getElementById('sourceText');
const autoToggle = document.getElementById('autoConvertToggle');

// Auto Convert Trigger (অটো মোড অন থাকলে টাইপ করার সাথে সাথেই কনভার্ট হবে)
sourceTextInput.addEventListener('input', function() {
    if (autoToggle.checked) {
        handleConvert(currentConvertMode);
    }
});

// ক্লিয়ার বাটন লজিক
function clearAllText() {
    sourceTextInput.value = "";
    document.getElementById('visualOutput').value = "";
    document.getElementById('realCopyData').value = "";
    document.getElementById('previewBadge').style.display = 'none';
}

// ==========================================
// 2. UNICODE TO BIJOY ENGINE (১০০% নির্ভুল)
// ==========================================
function getRealBijoyConvertedText(srcString) {
    let text = srcString;
    
    // ১. অরিজিনাল সাইট থেকে নেওয়া ইউনিকোড স্পেশাল ফিক্স
    const uniFixes = [
        ["š‘", "ন্তু"], ["র্যাব", "র‌্যাব"], ["র্যাবে", "র‌্যাবে"],
        ["¯’া", "স্থা"], ["”েছ", "চ্ছে"], ["¯’", "স্থ"],
        ["র“", "রু"], ["¯’্য", "স্থ্য"], ["¯্রা", "স্রা"],
        ["¤œা", "ম্না"], ["¤œ", "ম্ন"], ["ত্র“", "ত্রু"],
        ["তœ", "ত্ন"], ["শ^া", "শ্বা"], ["Ñ", "-"]
    ];
    // .split().join() ব্যবহার করা হয়েছে গ্লোবাল রিপ্লেস করার জন্য
    uniFixes.forEach(rule => { text = text.split(rule[0]).join(rule[1]); });

    // ২. বেসিক ফিক্স
    text = text.replace(/অ্যা/g, "A¨v");
    text = text.replace(/্যা/g, "¨v");
    text = text.replace(/্য/g, "¨");
    text = text.replace(/ো/g, "ো");
    text = text.replace(/ৌ/g, "ৌ");
    text = text.replace(/্র/g, "ª");
    
    // ৩. ি, ে, ৈ কার কে ব্যঞ্জনবর্ণের আগে নিয়ে আসা (নিরাপদ লজিক)
    text = text.replace(/([\u0980-\u09FF](?:্[\u0980-\u09FF])*?)([িেৈ])/g, "$2$1");
    
    // ৪. রেফ (র্) কে ব্যঞ্জনবর্ণের পরে নিয়ে যাওয়া
    text = text.replace(/র্([\u0980-\u09FF](?:্[\u0980-\u09FF])*?)/g, "$1©");

    // ৫. যুক্তাক্ষর ডিকশনারি (অরিজিনাল সাইটের চেয়েও বেশি সমৃদ্ধ)
    const conjuncts = {
        "ক্স":"·", "ক্ট":"±", "ক্ত":"³", "ক্ব":"K¡", "স্ক্র":"¯Œ", "স্ক":"¯‹", "স্ট":"÷", "স্প":"¯ú", "স্ফ":"¯£", 
        "স্ব":"¯^", "স্ম":"¯§", "স্ন":"¯œ", "স্ল":"¯ø", "স্ত":"¯Í", "স্থ":"¯’", "গ্ল":"Mø", "গ্র":"MÖ", 
        "ল্ম":"j¥", "ন্ম":"b¥", "ন্ধ":"Ü", "ন্দ":"›`", "ন্ত":"šÍ", "ন্থ":"š’", "ন্ন":"bœ", "ম্প":"¤ú", 
        "ম্ব":"¤^", "ম্ভ":"¤£", "ম্ম":"¤§", "ন্ট":"›U", "ন্ড":"Û", "জ্ঞ":"Á", "ঞ্জ":"Ä", "ঞ্চ":"Â", 
        "ঙ্ক":"¼", "ঙ্গ":"½", "ত্র":"Î", "ক্র":"µ", "প্র":"cÖ", "ভ্র":"å", "ম্র":"gÖ", "দ্র":"`Ö", 
        "শ্র":"kÖ", "হ্ম":"n¥", "হ্ন":"nœ", "হ্ব":"nŸ", "ষ্ণ":"ò", "ষ্ট":"ó", "ষ্ঠ":"ô", "ষ্প":"®ú", 
        "ষ্ম":"®§", "ক্ষ":"ÿ", "ল্ট":"ë", "ল্ড":"ì", "nd":"Û", "প্ট":"Þ", "প্ত":"ß", "প্প":"à",
        "প্ন":"cœ", "প্ল":"cø", "ব্জ":"e&R", "ব্দ":"e&`", "ব্ধ":"e&a", "ব্ব":"eŸ", "ব্ল":"eø",
        "দ্দ":"Ï", "দ্ধ":"×", "দ্ব":"Ø", "দ্ম":"Ù", "ট্র":"UÖ", "ট্ট":"Æ", "ড্ড":"Ç", "ড়্গ":"o&M", 
        "ড়্ড়":"o&o", "ক্ক":"ক্", "ক্ল":"K¬", "বব":"eŸ", "ত্ত":"Ë", "ত্থ":"t", "ত্ন":"Zœ", "ত্ম":"Z¥", 
        "ত্ব":"Z¡", "চ্চ":"”P", "চ্ছ":"”Q", "জ্জ":"¾", "ল্ল":"jø", "শ্ন":"kœ", "শ্ব":"k¦"
    };
    
    for(let key in conjuncts) {
        text = text.split(key).join(conjuncts[key]);
    }

    // ৬. বেসিক ক্যারেক্টার ম্যাপিং
    const map = {
        'অ':'A', 'আ':'Av', 'ই':'B', 'ঈ':'C', 'উ':'D', 'ঊ':'E', 'ঋ':'F', 'এ':'G', 'ঐ':'H', 'ও':'I', 'ঔ':'J',
        'ক':'K', 'খ':'L', 'গ':'M', 'ঘ':'N', 'ঙ':'O', 'চ':'P', 'ছ':'Q', 'জ':'R', 'ঝ':'S', 'ঞ':'T',
        'ট':'U', 'ঠ':'V', 'ড':'W', 'ঢ':'X', 'ণ':'Y', 'ত':'Z', 'থ':'_', 'দ':'`', 'ধ':'a', 'ন':'b',
        'প':'c', 'ফ':'d', 'ব':'e', 'ভ':'f', 'ম':'g', 'য':'h', 'র':'i', 'ল':'j', 'শ':'k', 'ষ':'l',
        'স':'m', 'হ':'n', 'ড়':'o', 'ঢ়':'p', 'য়':'q', 'ৎ':'r', 'ং':'s', 'ঃ':'t', 'ঁ':'u'
    };
    const kars = { 
        'া':'v', 'ি':'w', 'ী':'x', 'ু':'y', 'ূ':'z', 'ৃ':'…', 'ে':'‡', 'ৈ':'ˆ', 'ৗ':'Š', '্':'' 
    };

    let out = "";
    for (let i = 0; i < text.length; i++) {
        let c = text[i];
        if (map[c]) out += map[c];
        else if (kars[c]) out += kars[c];
        else out += c;
    }

    // ৭. অরিজিনাল সাইটের "updates" ফাংশন থেকে নেওয়া বিজয় ব্রোকেন ওয়ার্ড ফিক্স
    // (বিঃদ্রঃ ওই সাইটের /y/g -> "z" ভুলটি বাদ দেওয়া হয়েছে যাতে 'ু' কার 'ূ' কারে পরিণত না হয়)
    const bijoyFixes = [
        ["šÔ", "š‘"], [" ‡", " †"], ["¯Õ", "¯’v"], ["ÓQ", "”Q"],
        ["¯—", "¯Í"], ["¯-", "¯Í"], ["š—", "šÍ"], ["š-", "šÍ"],
        ["Ê", "Ð"], ["¯'", "¯’"], ["`ª“", "`ªæ"], ["«", "Ö"],
        ["“", "æ"], [" ‰", " ˆ"], ["~", "‚"]
    ];
    bijoyFixes.forEach(rule => { out = out.split(rule[0]).join(rule[1]); });

    return out;
}

// ==========================================
// 3. BIJOY TO UNICODE ENGINE
// ==========================================
function getRealUnicodeConvertedText(srcString) {
    if (!srcString) return "";
    let text = srcString;
    
    // ১. ি, ে, ৈ কার কে ব্যঞ্জনবর্ণের পরে নিয়ে যাওয়া
    text = text.replace(/w([^v-z…‡ˆŠ\s]+)/g, "$1w");
    text = text.replace(/‡([^v-z…‡ˆŠ\s]+)/g, "$1‡");
    text = text.replace(/ˆ([^v-z…‡ˆŠ\s]+)/g, "$1ˆ");
    
    // ২. রেফ কে ব্যঞ্জনবর্ণের আগে নিয়ে আসা
    text = text.replace(/([^v-z…‡ˆŠ\s]+)©/g, "©$1");
    
    const bijoyToUniChar = {
        'A':'অ', 'Av':'আ', 'B':'ই', 'C':'ঈ', 'D':'উ', 'E':'ঊ', 'F':'ঋ', 'G':'এ', 'H':'ঐ', 'I':'ও', 'J':'ঔ',
        'K':'ক', 'L':'খ', 'M':'গ', 'N':'ঘ', 'O':'ঙ', 'P':'চ', 'Q':'ছ', 'R':'জ', 'S':'ঝ', 'T':'ঞ',
        'U':'ট', 'V':'ঠ', 'W':'ড', 'X':'ঢ', 'Y':'ণ', 'Z':'ত', '_':'থ', '`':'দ', 'a':'ধ', 'b':'ন',
        'c':'প', 'd':'ফ', 'e':'ব', 'f':'ভ', 'g':'ম', 'h':'য', 'i':'র', 'j':'ল', 'k':'শ', 'l':'ষ',
        'm':'স', 'n':'হ', 'o':'ড়', 'p':'ঢ়', 'q':'য়', 'r':'ৎ', 's':'ং', 't':'ঃ', 'u':'ঁ',
        'v':'া', 'w':'ি', 'x':'ী', 'y':'ু', 'z':'ূ', '…':'ৃ', '‡':'ে', 'ˆ':'ৈ', 'Š':'ৌ',
        '©':'র্', '¤':'ম্', '¯':'স্', 'ª':'্র'
    };
    
    const reverseRules = [
        ["·", "ক্স"], ["±", "ক্ট"], ["³", "ক্ত"], ["K¡", "ক্ব"], ["¯Œ", "স্ক্র"], 
        ["¯‹", "স্ক"], ["÷", "স্ট"], ["¯ú", "স্প"], ["¯£", "স্ফ"], ["¯^", "স্ব"], 
        ["¯§", "স্ম"], ["¯œ", "স্ন"], ["¯ø", "স্ল"], ["¯Í", "স্ত"], ["¯’", "স্থ"], 
        ["Mø", "গ্ল"], ["MÖ", "গ্র"], ["j¥", "ল্ম"], ["b¥", "ন্ম"], ["Ü", "ন্ধ"], 
        ["›`", "ন্দ"], ["šÍ", "ন্ত"], ["š’", "ন্থ"], ["bœ", "ন্ন"], ["¤ú", "ম্প"], 
        ["¤^", "ম্ব"], ["¤£", "ম্ভ"], ["¤§", "ম্ম"], ["›U", "ন্ট"], ["Û", "ন্ড"], 
        ["Á", "জ্ঞ"], ["Ä", "ঞ্জ"], ["Â", "ঞ্চ"], ["¼", "ঙ্ক"], ["½", "ঙ্গ"], 
        ["Î", "ত্র"], ["µ", "ক্র"], ["cÖ", "প্র"], ["å", "ভ্র"], ["gÖ", "ম্র"], 
        ["`Ö", "দ্র"], ["kÖ", "শ্র"], ["n¥", "হ্ম"], ["nœ", "হ্ন"], ["nŸ", "হ্ব"], 
        ["ò", "ষ্ণ"], ["ó", "ষ্ট"], ["ô", "ষ্ঠ"], ["®ú", "ষ্প"], ["®§", "ষ্ম"], 
        ["ÿ", "ক্ষ"], ["ë", "ল্ট"], ["ì", "ল্ড"], ["Þ", "প্ট"], ["ß", "প্ত"],
        ["à", "প্প"], ["cœ", "প্ন"], ["cø", "প্ল"], ["e&R", "ব্জ"], ["e&`", "ব্দ"],
        ["e&a", "ব্ধ"], ["eŸ", "ব্ব"], ["eø", "ব্ল"], ["Ï", "দ্দ"], ["×", "দ্ধ"],
        ["Ø", "দ্ব"], ["Ù", "দ্ম"], ["UÖ", "ট্র"], ["Æ", "ট্ট"], ["Ç", "ড্ড"],
        ["o&M", "ড়্গ"], ["o&o", "ড়্ড়"], ["ক্", "ক্ক"], ["K¬", "ক্ল"], ["Ë", "ত্ত"],
        ["t", "ত্থ"], ["Zœ", "ত্ন"], ["Z¥", "ত্ম"], ["Z¡", "ত্ব"], ["”P", "চ্চ"],
        ["”Q", "চ্ছ"], ["¾", "জ্জ"], ["jø", "ল্ল"], ["kœ", "শ্ন"], ["k¦", "শ্ব"]
    ];

    reverseRules.forEach(rule => { text = text.split(rule[0]).join(rule[1]); });
    
    let finalOutput = "";
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        let twoChars = text.substring(i, i+2);
        
        // ো-কার এবং ৌ-কার লজিক (ে + া = ো)
        if (char === '‡' && text[i+2] === 'v') { finalOutput += 'ো'; i += 2; continue; }
        if (char === '‡' && text[i+2] === 'Š') { finalOutput += 'ৌ'; i += 2; continue; }

        if (bijoyToUniChar[twoChars]) {
            finalOutput += bijoyToUniChar[twoChars]; 
            i++;
        } else if (bijoyToUniChar[char]) {
            finalOutput += bijoyToUniChar[char];
        } else {
            finalOutput += char;
        }
    }
    return finalOutput;
}

// ==========================================
// 4. HANDLE CONVERT BUTTON ACTION
// ==========================================
function handleConvert(type) {
    currentConvertMode = type;
    const input = sourceTextInput.value;
    
    if(input.trim() === "") {
        document.getElementById('visualOutput').value = "";
        document.getElementById('realCopyData').value = "";
        return;
    }

    const visualOut = document.getElementById('visualOutput');
    const realOut = document.getElementById('realCopyData');
    const badge = document.getElementById('previewBadge');

    if (type === 'bijoy') {
        const actualBijoyCode = getRealBijoyConvertedText(input);
        visualOut.value = input; // ইউজার যাতে ভিজ্যুয়ালি পড়তে পারে তাই ইউনিকোডটাই শো করবে
        realOut.value = actualBijoyCode; // কিন্তু কপি করার সময় আসল বিজয় কোডটি কপি হবে
        badge.style.display = 'block';
        badge.innerHTML = '<i class="fas fa-eye"></i> <span id="t-vis">' + dictionary[currentLangStr].vis + '</span>';
    } else {
        const actualUnicodeCode = getRealUnicodeConvertedText(input);
        visualOut.value = actualUnicodeCode; 
        realOut.value = actualUnicodeCode;
        badge.style.display = 'none';
    }
}

// ==========================================
// 5. SMART SELECT & COPY LOGIC (With Fallback)
// ==========================================
function copySmartResult() {
    const copyData = document.getElementById('realCopyData').value;
    if(copyData.trim() === "") { 
        showToast("কপি করার মতো কিছু নেই!"); 
        return; 
    }

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(copyData).then(() => {
            showToast(dictionary[currentLangStr].toastCopy);
        }).catch(err => {
            fallbackCopyTextToClipboard(copyData);
        });
    } else {
        fallbackCopyTextToClipboard(copyData);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-99999px";
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        showToast(dictionary[currentLangStr].toastCopy);
    } catch (err) {
        showToast("কপি ব্যর্থ হয়েছে!");
    }
    document.body.removeChild(textArea);
}

// ইউজার ম্যানুয়ালি আউটপুট বক্স থেকে টেক্সট সিলেক্ট করে কপি করলে যেন আসল কোড কপি হয়
document.getElementById('visualOutput').addEventListener('copy', function(e) {
    e.preventDefault(); 
    const realData = document.getElementById('realCopyData').value;
    if (!realData) return;

    if (e.clipboardData) {
        e.clipboardData.setData('text/plain', realData);
    } else if (window.clipboardData) {
        window.clipboardData.setData('Text', realData);
    }
    showToast(dictionary[currentLangStr].toastCopy);
});
