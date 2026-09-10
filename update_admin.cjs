const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const districts = [
  "AGRA", "ALIGARH", "AMBEDKAR NAGAR", "AMETHI", "AMROHA", "AURAIYA", "AYODHYA", "AZAMGARH", "BAGHPAT", "BAHRAICH", "BALLIA", "BALRAMPUR", "BANDA", "BARABANKI", "BAREILLY", "BASTI", "BHADOHI", "BIJNOR", "BUDAUN", "BULANDSHAHR", "CHANDAULI", "CHITRAKOOT", "DEORIA", "ETAH", "ETAWAH", "FARRUKHABAD", "FATEHPUR", "FIROZABAD", "GAUTAM BUDDHA NAGAR", "GHAZIABAD", "GHAZIPUR", "GONDA", "GORAKHPUR", "HAMIRPUR", "HAPUR", "HARDOI", "HATHRAS", "JALAUN", "JAUNPUR", "JHANSI", "KANNAUJ", "KANPUR DEHAT", "KANPUR NAGAR", "KASGANJ", "KAUSHAMBI", "KHERI", "KUSHINAGAR", "LALITPUR", "LUCKNOW", "MAHARAJGANJ", "MAHOBA", "MAINPURI", "MATHURA", "MAU", "MEERUT", "MIRZAPUR", "MORADABAD", "MUZAFFARNAGAR", "PILIBHIT", "PRATAPGARH", "PRAYAGRAJ", "RAEBARELI", "RAMPUR", "SAHARANPUR", "SAMBHAL", "SANT KABIR NAGAR", "SHAHJAHANPUR", "SHAMLI", "SHRAVASTI", "SIDDHARTHNAGAR", "SITAPUR", "SONBHADRA", "SULTANPUR", "UNNAO", "VARANASI"
];

let optionsHtml = `                  <optgroup label="Main Categories">
                    <option value="INDIA">India</option>
                    <option value="UTTAR PRADESH">Uttar Pradesh</option>
                    <option value="POLITICS">Politics</option>
                    <option value="CRIME">Crime</option>
                    <option value="WEATHER">Weather (मौसम)</option>
                    <option value="BUSINESS">Business</option>
                    <option value="SPORTS">Sports</option>
                    <option value="ENTERTAINMENT">Entertainment</option>
                  </optgroup>
                  <optgroup label="UP Districts">
`;

districts.forEach(d => {
    // Title case for display
    const display = d.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
    optionsHtml += `                    <option value="${d}">${display}</option>\n`;
});
optionsHtml += `                  </optgroup>`;

code = code.replace(/<option value="UTTAR PRADESH">Uttar Pradesh<\/option>[\s\S]*?<option value="ENTERTAINMENT">Entertainment<\/option>/g, optionsHtml);

fs.writeFileSync('src/pages/Admin.tsx', code);
