// ==========================================
// 1. CORE VARIABLES & EVENT LISTENERS
// ==========================================
let currentConvertMode = 'bijoy'; 
const sourceTextInput = document.getElementById('sourceText');
const autoToggle = document.getElementById('autoConvertToggle');

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
// 2. ORIGINAL BANGLACONVERTER MAPPING
// ==========================================
// এই ম্যাপটি আপনার দেওয়া অরিজিনাল সাইট থেকে ১০০% হুবহু ডিকোড করা হয়েছে।
const b2uMap = [
    ["i¨", "র\u200C্য"], ["ª¨", "্র্য"], ["¤cÖ", "ম্প্র"], ["²", "ক্ষ্ম"], ["°", "ক্ক"], ["±", "ক্ট"], ["³", "ক্ত"], ["K¡", "ক্ব"], ["¯Œ", "স্ক্র"], ["µ", "ক্র"], ["K¬", "ক্ল"], ["¶", "ক্ষ"], ["ÿ", "ক্ষ"], ["·", "ক্স"], ["¸", "গু"], ["»", "গ্ধ"], ["Mœ", "গ্ন"], ["M¥", "গ্ম"], ["M­", "গ্ল"], ["Mø", "গ্ল"], ["¼", "ঙ্ক"], ["•¶", "ঙ্ক্ষ"], ["•L", "ঙ্খ"], ["½", "ঙ্গ"], ["•N", "ঙ্ঘ"], ["•", "ঙ্"], ["”Q¡", "চ্ছ্ব"], ["”Q¦", "চ্ছ্ব"], ["”P", "চ্চ"], ["”Q", "চ্ছ"], ["”T", "চ্ঞ"], ["¾¡", "জ্জ্ব"], ["¾", "জ্জ"], ["À", "জ্ঝ"], ["Á", "জ্ঞ"], ["R¡", "জ্ব"], ["Â", "ঞ্চ"], ["Ã", "ঞ্ছ"], ["Ä", "ঞ্জ"], ["Å", "ঞ্ঝ"], ["Æ", "ট্ট"], ["U¡", "ট্ব"], ["U¥", "ট্ম"], ["Ç", "ড্ড"], ["È", "ণ্ট"], ["É", "ণ্ঠ"], ["Ý", "ন্স"], ["Ê", "ন্ড"], ["š‘", "ন্তু"], ["Y^", "ণ্ব"], ["Ë¡", "ত্ত্ব"], ["Ë", "ত্ত"], ["Ì", "ত্থ"], ["Z¥", "ত্ম"], ["š—¡", "ন্ত্ব"], ["Z¡", "ত্ব"], ["Î", "ত্র"], ["_¡", "থ্ব"], ["›Ø", "ন্দ্ব"], ["˜M", "দ্গ"], ["˜N", "দ্ঘ"], ["Ï", "দ্দ"], ["×", "দ্ধ"], ["˜¡", "দ্ব"], ["Ø", "দ্ব"], ["™¢", "দ্ভ"], ["Ù", "দ্ম"], ["`ª“", "দ্রু"], ["aŸ", "ধ্ব"], ["a¥", "ধ্ম"], ["›U", "ন্ট"], ["Ú", "ন্ঠ"], ["Û", "ন্ড"], ["šÍ", "ন্ত"], ["š—", "ন্ত"], ["š¿", "ন্ত্র"], ["š’", "ন্থ"], ["›`", "ন্দ"], ["Ü", "ন্ধ"], ["bœ", "ন্ন"], ["š^", "ন্ব"], ["b¥", "ন্ম"], ["Þ", "প্ট"], ["ß", "প্ত"], ["cœ", "প্ন"], ["à", "প্প"], ["cø", "প্ল"], ["c­", "প্ল"], ["á", "প্স"], ["d¬", "ফ্ল"], ["â", "ব্জ"], ["ã", "ব্দ"], ["ä", "ব্ধ"], ["eŸ", "ব্ব"], ["e­", "ব্ল"], ["eø", "ব্ল"], ["å“", "ভ্রু"], ["å", "ভ্র"], ["gœ", "ম্ন"], ["¤ú", "ম্প"], ["ç", "ম্ফ"], ["¤^", "ম্ব"], ["¤¢", "ম্ভ"], ["¤£", "ম্ভ্র"], ["¤§", "ম্ম"], ["¤­", "ম্ল"], ["¤ø", "ম্ল"], ["i“", "রু"], ["i¦", "রু"], ["iƒ", "রূ"], ["é", "ল্ক"], ["ê", "ল্গ"], ["ë", "ল্ট"], ["ì", "ল্ড"], ["í", "ল্প"], ["î", "ল্ফ"], ["j¦", "ল্ব"], ["j¥", "ল্ম"], ["j­", "ল্ল"], ["jø", "ল্ল"], ["ï", "শু"], ["ð", "শ্চ"], ["kœ", "শ্ন"], ["k¦", "শ্ব"], ["k¥", "শ্ম"], ["k­", "শ্ল"], ["kø", "শ্ল"], ["®¹", "ষ্ক"], ["®Œ", "ষ্ক্র"], ["ó", "ষ্ট"], ["ô", "ষ্ঠ"], ["ò", "ষ্ণ"], ["®ú", "ষ্প"], ["õ", "স্ফ"], ["®§", "ষ্ম"], ["¯¹", "স্ক"], ["÷", "স্ট"], ["ö", "স্খ"], ["¯—", "স্ত"], ["¯Í", "স্ত"], ["¯‘", "স্তু"], ["¯¿", "স্ত্র"], ["¯’", "স্থ"], ["mœ", "স্ন"], ["¯ú", "স্প"], ["ù", "স্ফ"], ["¯^", "স্ব"], ["¯§", "স্ম"], ["¯­", "স্ল"], ["¯ø", "স্ল"], ["û", "হু"], ["nè", "হ্ণ"], ["nŸ", "হ্ব"], ["ý", "হ্ন"], ["þ", "হ্ম"], ["n¬", "হ্ল"], ["ü", "হৃ"], ["©", "র্"], ["Av", "আ"], ["A", "অ"], ["B", "ই"], ["C", "ঈ"], ["D", "উ"], ["E", "ঊ"], ["F", "ঋ"], ["G", "এ"], ["H", "ঐ"], ["I", "ও"], ["J", "ঔ"], ["K", "ক"], ["L", "খ"], ["M", "গ"], ["N", "ঘ"], ["O", "ঙ"], ["P", "চ"], ["Q", "ছ"], ["R", "জ"], ["S", "ঝ"], ["T", "ঞ"], ["U", "ট"], ["V", "ঠ"], ["W", "ড"], ["X", "ঢ"], ["Y", "ণ"], ["Z", "ত"], ["_", "থ"], ["`", "দ"], ["a", "ধ"], ["b", "ন"], ["c", "প"], ["d", "ফ"], ["e", "ব"], ["f", "ভ"], ["g", "ম"], ["h", "য"], ["i", "র"], ["j", "ল"], ["k", "শ"], ["l", "ষ"], ["m", "স"], ["n", "হ"], ["o", "ড়"], ["p", "ঢ়"], ["q", "য়"], ["r", "ৎ"], ["0", "০"], ["1", "১"], ["2", "২"], ["3", "৩"], ["4", "৪"], ["5", "৫"], ["6", "৬"], ["7", "৭"], ["8", "৮"], ["9", "৯"], ["v", "া"], ["w", "ি"], ["x", "ী"], ["y", "ু"], ["z", "ু"], ["æ", "ু"], ["~", "ূ"], ["‚", "ূ"], ["„", "ৃ"], ["‡", "ে"], ["†", "ে"], ["ˆ", "ৈ"], ["Š", "ৌ"], ["Ð", "-"], ["”", "‘"], ["Õ", "’"], ["|", "।"], ["\\", "॥"], ["Ò", "“"], ["Ó", "”"], ["s", "ং"], ["t", "ঃ"], ["u", "ঁ"], ["ª", "্র"], ["–", "্র"], ["«", "্র"], ["¨", "্য"], ["&", "্"], ["…", "ৃ"]
];

// ইউনিকোড টু বিজয় তৈরি করার জন্য ম্যাপটিকে উল্টো (Reverse) করা হলো
const u2bMap = [];
b2uMap.forEach(r => u2bMap.push([r[1], r[0]]));
u2bMap.sort((a, b) => b[0].length - a[0].length);


// ==========================================
// 3. BIJOY TO UNICODE ENGINE
// ==========================================
function getRealUnicodeConvertedText(src) {
    if (!src) return ""; 
    let text = src;

    // অরিজিনাল ম্যাপ রিপ্লেস
    b2uMap.forEach(r => { text = text.split(r[0]).join(r[1]); });

    // ১. ি, ে, ৈ কার কে ব্যঞ্জনবর্ণের পরে নিয়ে যাওয়া (নিখুঁত লজিক)
    text = text.replace(/([িেৈ])([\u0995-\u09B9\u09CE-\u09DF](?:্[\u0995-\u09B9\u09CE-\u09DF])*)/g, "$2$1");

    // ২. ো-কার এবং ৌ-কার জোড়া লাগানো (ে + া = ো, ে + ৗ = ৌ)
    text = text.replace(/ে([াৗ])/g, (m, p1) => p1 === 'া' ? 'ো' : 'ৌ');
    text = text.replace(/ে([\u0995-\u09B9\u09CE-\u09DF](?:্[\u0995-\u09B9\u09CE-\u09DF])*)া/g, "$1ো");
    text = text.replace(/ে([\u0995-\u09B9\u09CE-\u09DF](?:্[\u0995-\u09B9\u09CE-\u09DF])*)ৗ/g, "$1ৌ");

    return text;
}


// ==========================================
// 4. UNICODE TO BIJOY ENGINE
// ==========================================
function getRealBijoyConvertedText(src) {
    if (!src) return ""; 
    let text = src;

    // ১. ো-কার এবং ৌ-কার কে ভেঙে ফেলা (ো = ে + া)
    text = text.replace(/ো/g, "ো");
    text = text.replace(/ৌ/g, "ৌ");

    // ২. ি, ে, ৈ কার কে ব্যঞ্জনবর্ণের আগে নিয়ে আসা
    text = text.replace(/([\u0995-\u09B9\u09CE-\u09DF](?:্[\u0995-\u09B9\u09CE-\u09DF])*?)([িেৈ])/g, "$2$1");

    // ৩. উল্টো ম্যাপ (Reverse Dictionary) রিপ্লেস
    u2bMap.forEach(r => { text = text.split(r[0]).join(r[1]); });

    return text;
}


// ==========================================
// 5. HANDLE CONVERT BUTTON ACTION
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
// 6. SMART SELECT & COPY LOGIC (With Fallback)
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

// ইউজার ম্যানুয়ালি আউটপুট বক্স থেকে টেক্সট সিলেক্ট করে কপি করলে যেন আসল কোড কপি হয়
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
