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
// 2. DICTIONARIES (আপনার দেওয়া 'ay' ভেরিয়েবলের হুবহু ডিকোডেড রূপ)
// ==========================================
const ay_dict = {
    "i¨":"র\u200C্য", "ª¨":"্র্য", "¤cÖ":"ম্প্র", "²":"ক্ষ্ম", "°":"ক্ক", "±":"ক্ট", "³":"ক্ত", "K¡":"ক্ব", 
    "¯Œ":"স্ক্র", "µ":"ক্র", "K¬":"ক্ল", "¶":"ক্ষ", "ÿ":"ক্ষ", "·":"ক্স", "¸":"গু", "»":"গ্ধ", "Mœ":"গ্ন", 
    "M¥":"গ্ম", "M­":"গ্ল", "Mø":"গ্ল", "¼":"ঙ্ক", "•¶":"ঙ্ক্ষ", "•L":"ঙ্খ", "½":"ঙ্গ", "•N":"ঙ্ঘ", "•":"ঙ্", 
    "”Q¡":"চ্ছ্ব", "”Q¦":"চ্ছ্ব", "”P":"চ্চ", "”Q":"চ্ছ", "”T":"চ্ঞ", "¾¡":"জ্জ্ব", "¾":"জ্জ", "À":"জ্ঝ", 
    "Á":"জ্ঞ", "R¡":"জ্ব", "Â":"ঞ্চ", "Ã":"ঞ্ছ", "Ä":"ঞ্জ", "Å":"ঞ্ঝ", "Æ":"ট্ট", "U¡":"ট্ব", "U¥":"ট্ম", 
    "Ç":"ড্ড", "È":"ণ্ট", "É":"ণ্ঠ", "Ý":"ন্স", "Ê":"ন্ড", "š‘":"ন্তু", "Y\\^":"ণ্ব", "Ë¡":"ত্ত্ব", "Ë":"ত্ত", 
    "Ì":"ত্থ", "Z¥":"ত্ম", "š—¡":"ন্ত্ব", "Z¡":"ত্ব", "Î":"ত্র", "_¡":"থ্ব", "›Ø":"ন্দ্ব", "˜M":"দ্গ", "˜N":"দ্ঘ", 
    "Ï":"দ্দ", "×":"দ্ধ", "˜¡":"দ্ব", "Ø":"দ্ব", "™¢":"দ্ভ", "Ù":"দ্ম", "`ª“":"দ্রু", "aŸ":"ধ্ব", "a¥":"ধ্ম", 
    "›U":"ন্ট", "Ú":"ন্ঠ", "Û":"ন্ড", "šÍ":"ন্ত", "š—":"ন্ত", "š¿":"ন্ত্র", "š’":"ন্থ", "›`":"ন্দ", "Ü":"ন্ধ", 
    "bœ":"ন্ন", "š\\^":"ন্ব", "b¥":"ন্ম", "Þ":"প্ট", "ß":"প্ত", "cœ":"প্ন", "à":"প্প", "cø":"প্ল", "c­":"প্ল", 
    "á":"প্স", "d¬":"ফ্ল", "â":"ব্জ", "ã":"ব্দ", "ä":"ব্ধ", "eŸ":"ব্ব", "e­":"ব্ল", "eø":"ব্ল", "å“":"ভ্রু", 
    "å":"ভ্র", "gœ":"ম্ন", "¤ú":"ম্প", "ç":"ম্ফ", "¤\\^":"ম্ব", "¤¢":"ম্ভ", "¤£":"ম্ভ্র", "¤§":"ম্ম", "¤­":"ম্ল", 
    "¤ø":"ম্ল", "i“":"রু", "i¦":"রু", "iƒ":"রূ", "é":"ল্ক", "ê":"ল্গ", "ë":"ল্ট", "ì":"ল্ড", "í":"ল্প", "î":"ল্ফ", 
    "j¦":"ল্ব", "j¥":"ল্ম", "j­":"ল্ল", "jø":"ল্ল", "ï":"শু", "ð":"শ্চ", "kœ":"শ্ন", "k¦":"শ্ব", "k¥":"শ্ম", 
    "k­":"শ্ল", "kø":"শ্ল", "®¹":"ষ্ক", "®Œ":"ষ্ক্র", "ó":"ষ্ট", "ô":"ষ্ঠ", "ò":"ষ্ণ", "®ú":"ষ্প", "õ":"স্ফ", 
    "®§":"ষ্ম", "¯¹":"স্ক", "÷":"স্ট", "ö":"স্খ", "¯—":"স্ত", "¯Í":"স্ত", "¯‘":"স্তু", "¯¿":"স্ত্র", "¯’":"স্থ", 
    "mœ":"স্ন", "¯ú":"স্প", "ù":"স্ফ", "¯\\^":"স্ব", "¯§":"স্ম", "¯­":"স্ল", "¯ø":"স্ল", "û":"হু", "nè":"হ্ণ", 
    "nŸ":"হ্ব", "ý":"হ্ন", "þ":"হ্ম", "n¬":"হ্ল", "ü":"হৃ", "©":"র্", "Av":"আ", "A":"অ", "B":"ই", "C":"ঈ", 
    "D":"উ", "E":"ঊ", "F":"ঋ", "G":"এ", "H":"ঐ", "I":"ও", "J":"ঔ", "K":"ক", "L":"খ", "M":"গ", "N":"ঘ", 
    "O":"ঙ", "P":"চ", "Q":"ছ", "R":"জ", "S":"ঝ", "T":"ঞ", "U":"ট", "V":"ঠ", "W":"ড", "X":"ঢ", "Y":"ণ", 
    "Z":"ত", "_":"থ", "`":"দ", "a":"ধ", "b":"ন", "c":"প", "d":"ফ", "e":"ব", "f":"ভ", "g":"ম", "h":"য", 
    "i":"র", "j":"ল", "k":"শ", "l":"ষ", "m":"স", "n":"হ", "o":"ড়", "p":"ঢ়", "q":"য়", "r":"ৎ", "0":"০", 
    "1":"১", "2":"২", "3":"৩", "4":"৪", "5":"৫", "6":"৬", "7":"৭", "8":"৮", "9":"৯", "v":"া", "w":"ি", 
    "x":"ী", "y":"ু", "z":"ু", "æ":"ু", "~":"ূ", "‚":"ূ", "„":"ৃ", "‡":"ে", "†":"ে", "ˆ":"ৈ", "\\ˆ":"ৈ", 
    "Š":"ৌ", "Ð":"-", "”":"‘", "Õ":"’", "\\|":"।", "\\\\":"॥", "Ò":"“", "Ó":"”", "s":"ং", "t":"ঃ", "u":"ঁ", 
    "ª":"্র", "–":"্র", "«":"্র", "¨":"্য", "\\&":"্", "…":"ৃ"
};

// শব্দ যাতে আংশিক ম্যাচ হয়ে ভেঙে না যায়, তাই বড় শব্দগুলো আগে সর্ট করে নিচ্ছি
const sortedBijoyKeys = Object.keys(ay_dict).sort((a, b) => b.length - a.length);

const u2bMap = {};
for (let key in ay_dict) {
    u2bMap[ay_dict[key]] = key;
}
const sortedUnicodeKeys = Object.keys(u2bMap).sort((a, b) => b.length - a.length);

// ==========================================
// 3. UNICODE TO BIJOY ENGINE
// ==========================================
function getRealBijoyConvertedText(src) {
    if (!src) return "";
    let line = src;

    // ১. আপনার দেওয়া স্ক্রিপ্ট অনুযায়ী বেসিক ফিক্স
    line = line.replace(/অ্যা/g, "A¨v");
    line = line.replace(/্যা/g, "¨v");
    line = line.replace(/্য/g, "¨");
    line = line.replace(/ো/g, "ো");
    line = line.replace(/ৌ/g, "ৌ");

    // ২. কার ও রেফ মুভমেন্ট (আপনার 'au' ফাংশনের নিরাপদ রিপ্লেসমেন্ট)
    // রেফ ব্যঞ্জনবর্ণের পরে যাবে
    line = line.replace(/(র্)([\u0980-\u09FF](?:্[\u0980-\u09FF])*?)/g, "$2©"); 
    // ি, ে, ৈ কার ব্যঞ্জনবর্ণের আগে আসবে
    line = line.replace(/([\u0980-\u09FF](?:্[\u0980-\u09FF])*?)([িেৈ])/g, "$2$1");

    // ৩. মেইন ডিকশনারি রিপ্লেসমেন্ট
    for (let i = 0; i < sortedUnicodeKeys.length; i++) {
        let key = sortedUnicodeKeys[i];
        let val = u2bMap[key];
        let regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        line = line.replace(regex, val);
    }

    // ৪. আপনার 'updates' ফাংশন থেকে নেওয়া ফিক্স
    line = line.replace(/ /g, " ");
    line = line.replace(/šÔ/g, "š‘");
    line = line.replace(/ ‡/g, " †");
    line = line.replace(/¯Õ/g, "¯’v");
    line = line.replace(/ÓQ/g, "”Q");
    line = line.replace(/¯—/g, "¯Í");
    line = line.replace(/¯-/g, "¯Í");
    line = line.replace(/š—/g, "šÍ");
    line = line.replace(/š-/g, "šÍ");
    line = line.replace(/Ê/g, "Ð");
    line = line.replace(/¯'/g, "¯’");
    line = line.replace(/`ª“/g, "`ªæ");
    line = line.replace(/y/g, "z");
    line = line.replace(/«/g, "Ö");
    line = line.replace(/“/g, "æ");
    line = line.replace(/ ‰/g, " ˆ");
    line = line.replace(/~/g, "‚");

    return line;
}

// ==========================================
// 4. BIJOY TO UNICODE ENGINE
// ==========================================
function getRealUnicodeConvertedText(src) {
    if (!src) return ""; 
    let line = src;

    // ১. আপনার 'update' ফাংশন ও অন্যান্য সাইট থেকে নেওয়া প্রি-ফিক্স
    line = line.replace(/š‘/g, "ন্তু");
    line = line.replace(/র্যাব/g, "র‌্যাব");
    line = line.replace(/র্যাবে/g, "র‌্যাবে");
    line = line.replace(/¯’া/g, "স্থা");
    line = line.replace(/”েছ/g, "চ্ছে");
    line = line.replace(/¯’/g, "স্থ");
    line = line.replace(/র“/g, "রু");
    line = line.replace(/¯’্য/g, "স্থ্য");
    line = line.replace(/¯্রা/g, "স্রা");
    line = line.replace(/¤œা/g, "ম্না");
    line = line.replace(/¤œ/g, "ম্ন");
    line = line.replace(/ত্র“/g, "ত্রু");
    line = line.replace(/তœ/g, "ত্ন");
    line = line.replace(/শ\^া/g, "শ্বা");
    line = line.replace(/h়/g, "q");
    line = line.replace(/h‡়/g, "‡q");
    line = line.replace(/hw়/g, "wq");
    line = line.replace(/Ñ/g, "-");

    // ২. কার ও রেফ মুভমেন্ট
    // ি, ে, ৈ কার ব্যঞ্জনবর্ণের পরে যাবে
    line = line.replace(/w([^v-z…‡ˆŠ\s]+)/g, "$1w");
    line = line.replace(/†([^v-z…‡ˆŠ\s]+)/g, "$1†");
    line = line.replace(/‡([^v-z…‡ˆŠ\s]+)/g, "$1‡");
    line = line.replace(/ˆ([^v-z…‡ˆŠ\s]+)/g, "$1ˆ");
    // রেফ (©) ব্যঞ্জনবর্ণের আগে আসবে
    line = line.replace(/([^v-z…‡ˆŠ\s]+)©/g, "©$1");

    // ৩. মেইন ডিকশনারি রিপ্লেসমেন্ট
    for (let i = 0; i < sortedBijoyKeys.length; i++) {
        let key = sortedBijoyKeys[i];
        let val = ay_dict[key];
        let regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        line = line.replace(regex, val);
    }

    // ৪. ো-কার এবং ৌ-কার জোড়া লাগানো (ে + া = ো, ে + ৗ = ৌ)
    let finalOutput = "";
    for (let i = 0; i < line.length; i++) {
        let char = line[i];
        if (char === 'ে' && line[i+1] === 'া') { 
            finalOutput += 'ো'; i++; 
        } else if (char === 'ে' && line[i+1] === 'ৗ') { 
            finalOutput += 'ৌ'; i++; 
        } else {
            finalOutput += char;
        }
    }

    return finalOutput;
}

// ==========================================
// 5. HANDLE UI & CONVERT
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
        visualOut.value = input; // ইউজার যাতে পড়তে পারে তাই ইউনিকোড শো করবে
        realOut.value = actualBijoyCode; // কিন্তু কপি করার সময় আসল বিজয় কোড কপি হবে
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

// ভিজ্যুয়াল বক্স থেকে কপি করলেও আসল কোড কপি হবে
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
