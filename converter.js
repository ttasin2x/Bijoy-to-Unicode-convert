// ==========================================
// 1. CORE VARIABLES & EVENT LISTENERS
// ==========================================
let currentConvertMode = 'bijoy'; 
const sourceTextInput = document.getElementById('sourceText');
const autoToggle = document.getElementById('autoConvertToggle');

// Auto Convert Trigger
sourceTextInput.addEventListener('input', function() {
    if (autoToggle && autoToggle.checked) {
        handleConvert(currentConvertMode);
    }
});

function clearAllText() {
    sourceTextInput.value = "";
    document.getElementById('visualOutput').value = "";
    document.getElementById('realCopyData').value = "";
    document.getElementById('previewBadge').style.display = 'none';
}

// ==========================================
// 2. UNICODE TO BIJOY ENGINE (BanglaConverter Based)
// ==========================================
function getRealBijoyConvertedText(src) {
    let str = src;
    
    // 1. Pre-Conversion Fixes
    str = str.replace(/অ্যা/g, "A¨v");
    str = str.replace(/্যা/g, "¨v");
    str = str.replace(/্য/g, "¨");
    str = str.replace(/ো/g, "ো");
    str = str.replace(/ৌ/g, "ৌ");
    
    // 2. Re-arrange Vowels (ি, ে, ৈ) and Reph (র্)
    str = str.replace(/(র্)([\u0980-\u09FF](?:্[\u0980-\u09FF])*?)/g, "$2©"); // Move Reph after consonant
    str = str.replace(/([\u0980-\u09FF](?:্[\u0980-\u09FF])*?)([িেৈ])/g, "$2$1"); // Move Vowels before consonant

    // 3. Conjuncts Mapping (BanglaConverter Standard)
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
        "ত্ব":"Z¡", "চ্চ":"”P", "চ্ছ":"”Q", "জ্জ":"¾", "ল্ল":"jø", "শ্ন":"kœ", "শ্ব":"k¦", "শ্র":"kÖ", 
        "উ":"D", "ঊ":"E", "ঋ":"F", "এ":"G", "ঐ":"H", "ও":"I", "ঔ":"J", "অ":"A", "আ":"Av", "ই":"B", "ঈ":"C"
    };

    for(let key in conjuncts) {
        str = str.split(key).join(conjuncts[key]);
    }

    // 4. Basic Characters Mapping
    const charMap = {
        'ক':'K', 'খ':'L', 'গ':'M', 'ঘ':'N', 'ঙ':'O', 'চ':'P', 'ছ':'Q', 'জ':'R', 'ঝ':'S', 'ঞ':'T',
        'ট':'U', 'ঠ':'V', 'ড':'W', 'ঢ':'X', 'ণ':'Y', 'ত':'Z', 'থ':'_', 'দ':'`', 'ধ':'a', 'ন':'b',
        'প':'c', 'ফ':'d', 'ব':'e', 'ভ':'f', 'ম':'g', 'য':'h', 'র':'i', 'ল':'j', 'শ':'k', 'ষ':'l',
        'স':'m', 'হ':'n', 'ড়':'o', 'ঢ়':'p', 'য়':'q', 'ৎ':'r', 'ং':'s', 'ঃ':'t', 'ঁ':'u'
    };
    
    const vowelMap = { 
        'া':'v', 'ি':'w', 'ী':'x', 'ু':'y', 'ূ':'z', 'ৃ':'…', 'ে':'‡', 'ৈ':'ˆ', 'ৗ':'Š', '্':'' 
    };

    let out = "";
    for (let i = 0; i < str.length; i++) {
        let c = str[i];
        if (charMap[c]) out += charMap[c];
        else if (vowelMap[c]) out += vowelMap[c];
        else out += c;
    }

    // 5. Post-Conversion Fixes (To match BanglaConverter exactly)
    const postFixes = [
        ["šÔ", "š‘"], [" ‡", " †"], ["¯Õ", "¯’v"], ["ÓQ", "”Q"],
        ["¯—", "¯Í"], ["¯-", "¯Í"], ["š—", "šÍ"], ["š-", "šÍ"],
        ["Ê", "Ð"], ["¯'", "¯’"], ["`ª“", "`ªæ"], ["«", "Ö"],
        ["“", "æ"], [" ‰", " ˆ"], ["~", "‚"], ["i&", "©"], ["ª", "ª"]
    ];
    postFixes.forEach(rule => { out = out.split(rule[0]).join(rule[1]); });

    return out;
}

// ==========================================
// 3. BIJOY TO UNICODE ENGINE (BanglaConverter Based)
// ==========================================
function getRealUnicodeConvertedText(src) {
    if (!src) return ""; 
    let str = src;

    // 1. Pre-Conversion Fixes
    const preFixes = [
        ["š‘", "ন্তু"], ["র্যাব", "র‌্যাব"], ["র্যাবে", "র‌্যাবে"],
        ["¯’া", "স্থা"], ["”েছ", "চ্ছে"], ["¯’", "স্থ"],
        ["র“", "রু"], ["¯’্য", "স্থ্য"], ["¯্রা", "স্রা"],
        ["¤œা", "ম্না"], ["¤œ", "ম্ন"], ["ত্র“", "ত্রু"],
        ["তœ", "ত্ন"], ["শ^া", "শ্বা"], ["Ñ", "-"]
    ];
    preFixes.forEach(rule => { str = str.split(rule[0]).join(rule[1]); });

    // 2. Re-arrange Vowels (ি, ে, ৈ) and Reph (©)
    str = str.replace(/w([^v-z…‡ˆŠ\s]+)/g, "$1w"); 
    str = str.replace(/‡([^v-z…‡ˆŠ\s]+)/g, "$1‡"); 
    str = str.replace(/ˆ([^v-z…‡ˆŠ\s]+)/g, "$1ˆ");
    str = str.replace(/([^v-z…‡ˆŠ\s]+)©/g, "©$1"); 

    // 3. Reverse Conjuncts Mapping
    const revConjuncts = {
        "·":"ক্স", "±":"ক্ট", "³":"ক্ত", "K¡":"ক্ব", "¯Œ":"স্ক্র", "¯‹":"স্ক", "÷":"স্ট", "¯ú":"স্প", 
        "¯£":"স্ফ", "¯^":"স্ব", "¯§":"স্ম", "¯œ":"স্ন", "¯ø":"স্ল", "¯Í":"স্ত", "¯’":"স্থ", "Mø":"গ্ল", 
        "MÖ":"গ্র", "j¥":"ল্ম", "b¥":"ন্ম", "Ü":"ন্ধ", "›`":"ন্দ", "šÍ":"ন্ত", "š’":"ন্থ", "bœ":"ন্ন", 
        "¤ú":"ম্প", "¤^":"ম্ব", "¤£":"ম্ভ", "¤§":"ম্ম", "›U":"ন্ট", "Û":"ন্ড", "Á":"জ্ঞ", "Ä":"ঞ্জ", 
        "Â":"ঞ্চ", "¼":"ঙ্ক", "½":"ঙ্গ", "Î":"ত্র", "µ":"ক্র", "cÖ":"প্র", "å":"ভ্র", "gÖ":"ম্র", 
        "`Ö":"দ্র", "kÖ":"শ্র", "n¥":"হ্ম", "nœ":"হ্ন", "nŸ":"হ্ব", "ò":"ষ্ণ", "ó":"ষ্ট", "ô":"ষ্ঠ", 
        "®ú":"ষ্প", "®§":"ষ্ম", "ÿ":"ক্ষ", "ë":"ল্ট", "ì":"ল্ড", "Þ":"প্ট", "ß":"প্ত", "à":"প্প", 
        "cœ":"প্ন", "cø":"প্ল", "e&R":"ব্জ", "e&`":"ব্দ", "e&a":"ব্ধ", "eŸ":"ব্ব", "eø":"ব্ল", 
        "Ï":"দ্দ", "×":"দ্ধ", "Ø":"দ্ব", "Ù":"দ্ম", "UÖ":"ট্র", "Æ":"ট্ট", "Ç":"ড্ড", "o&M":"ড়্গ", 
        "o&o":"ড়্ড়", "ক্":"ক্ক", "K¬":"ক্ল", "Ë":"ত্ত", "t":"ত্থ", "Zœ":"ত্ন", "Z¥":"ত্ম", "Z¡":"ত্ব", 
        "”P":"চ্চ", "”Q":"চ্ছ", "¾":"জ্জ", "jø":"ল্ল", "kœ":"শ্ন", "k¦":"শ্ব", "ª":"্র"
    };

    for(let key in revConjuncts) {
        str = str.split(key).join(revConjuncts[key]);
    }

    // 4. Reverse Basic Characters
    const revCharMap = {
        'A':'অ', 'Av':'আ', 'B':'ই', 'C':'ঈ', 'D':'উ', 'E':'ঊ', 'F':'ঋ', 'G':'এ', 'H':'ঐ', 'I':'ও', 'J':'ঔ',
        'K':'ক', 'L':'খ', 'M':'গ', 'N':'ঘ', 'O':'ঙ', 'P':'চ', 'Q':'ছ', 'R':'জ', 'S':'ঝ', 'T':'ঞ',
        'U':'ট', 'V':'ঠ', 'W':'ড', 'X':'ঢ', 'Y':'ণ', 'Z':'ত', '_':'থ', '`':'দ', 'a':'ধ', 'b':'ন',
        'c':'প', 'd':'ফ', 'e':'ব', 'f':'ভ', 'g':'ম', 'h':'য', 'i':'র', 'j':'ল', 'k':'শ', 'l':'ষ',
        'm':'স', 'n':'হ', 'o':'ড়', 'p':'ঢ়', 'q':'য়', 'r':'ৎ', 's':'ং', 't':'ঃ', 'u':'ঁ',
        'v':'া', 'w':'ি', 'x':'ী', 'y':'ু', 'z':'ূ', '…':'ৃ', '‡':'ে', 'ˆ':'ৈ', 'Š':'ৌ', '©':'র্'
    };

    let out = "";
    for (let i = 0; i < str.length; i++) {
        let char = str[i];
        let twoChars = str.substring(i, i+2);
        
        // 5. Combine O-kar and Ou-kar (ে + া = ো, ে + ৗ = ৌ)
        if (char === '‡' && str[i+1] === 'v') { out += 'ো'; i++; continue; }
        if (char === '‡' && str[i+1] === 'Š') { out += 'ৌ'; i++; continue; }

        if (revCharMap[twoChars]) {
            out += revCharMap[twoChars]; 
            i++;
        } else if (revCharMap[char]) {
            out += revCharMap[char];
        } else {
            out += char;
        }
    }
    return out;
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
        visualOut.value = input; // Display original Unicode for readability
        realOut.value = actualBijoyCode; // Save real Bijoy code for copying
        badge.style.display = 'block';
        if(typeof dictionary !== 'undefined') {
            badge.innerHTML = '<i class="fas fa-eye"></i> <span id="t-vis">' + dictionary[currentLangStr].vis + '</span>';
        }
    } else {
        const actualUnicodeCode = getRealUnicodeConvertedText(input);
        visualOut.value = actualUnicodeCode; 
        realOut.value = actualUnicodeCode;
        badge.style.display = 'none';
    }
}

// ==========================================
// 5. SMART SELECT & COPY LOGIC
// ==========================================
function copySmartResult() {
    const copyData = document.getElementById('realCopyData').value;
    if(copyData.trim() === "") { 
        if(typeof showToast !== 'undefined') showToast("কপি করার মতো কিছু নেই!"); 
        return; 
    }

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(copyData).then(() => {
            if(typeof showToast !== 'undefined') showToast(dictionary[currentLangStr].toastCopy);
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
        if(typeof showToast !== 'undefined') showToast(dictionary[currentLangStr].toastCopy);
    } catch (err) {
        if(typeof showToast !== 'undefined') showToast("কপি ব্যর্থ হয়েছে!");
    }
    document.body.removeChild(textArea);
}

// Ensure copying from Visual Box copies the Real Bijoy Data
const visualOutElem = document.getElementById('visualOutput');
if(visualOutElem) {
    visualOutElem.addEventListener('copy', function(e) {
        e.preventDefault(); 
        const realData = document.getElementById('realCopyData').value;
        if (!realData) return;

        if (e.clipboardData) {
            e.clipboardData.setData('text/plain', realData);
        } else if (window.clipboardData) {
            window.clipboardData.setData('Text', realData);
        }
        if(typeof showToast !== 'undefined') showToast(dictionary[currentLangStr].toastCopy);
    });
}
