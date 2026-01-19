let db = null;
let map = null;
let countryLayer = null;
let countryCounts = {};
let currentPage = 1;
const RESULTS_PER_PAGE = 10;
let currentResults = [];
let currentCountry = '';
let currentCountryCode = '';
let isSearchMode = false;

const countryCodeMap = {
  'Afghanistan': 'AF', 'Albania': 'AL', 'Algeria': 'DZ', 'Andorra': 'AD', 'Angola': 'AO',
  'Antigua and Barbuda': 'AG', 'Argentina': 'AR', 'Armenia': 'AM', 'Australia': 'AU', 'Austria': 'AT',
  'Azerbaijan': 'AZ', 'Bahamas': 'BS', 'Bahrain': 'BH', 'Bangladesh': 'BD', 'Barbados': 'BB',
  'Belarus': 'BY', 'Belize': 'BZ', 'Benin': 'BJ', 'Bhutan': 'BT', 'Bolivia': 'BO',
  'Bosnia and Herzegovina': 'BA', 'Botswana': 'BW', 'Brazil': 'BR', 'British Virgin Islands': 'VG', 'Brunei': 'BN',
  'Bulgaria': 'BG', 'Burkina Faso': 'BF', 'Burundi': 'BI', 'Cabo Verde': 'CV', 'Cambodia': 'KH',
  'Cameroon': 'CM', 'Cayman Islands': 'KY', 'Central African Republic': 'CF', 'Chad': 'TD', 'Chile': 'CL',
  'China': 'CN', 'Colombia': 'CO', 'Costa Rica': 'CR', 'Croatia': 'HR', 'Cuba': 'CU', 'Czech Republic': 'CZ',
  'Curaçao': 'CW', 'Cyprus': 'CY', 'Democratic Republic of the Congo': 'CD', 'Djibouti': 'DJ', 'Dominica': 'DM',
  'Dominican Republic': 'DO', 'Ecuador': 'EC', 'Egypt': 'EG', 'El Salvador': 'SV', 'Estonia': 'EE',
  'Eswatini': 'SZ', 'Ethiopia': 'ET', 'Fiji': 'FJ', 'Finland': 'FI', 'France': 'FR',
  'Gabon': 'GA', 'Gambia': 'GM', 'Georgia': 'GE', 'Ghana': 'GH', 'Gibraltar': 'GI',
  'Greece': 'GR', 'Greenland': 'GL', 'Grenada': 'GD', 'Guam': 'GU', 'Guatemala': 'GT',
  'Guinea': 'GN', 'Guinea-Bissau': 'GW', 'Guyana': 'GY', 'Haiti': 'HT', 'Honduras': 'HN',
  'Hungary': 'HU', 'Iceland': 'IS', 'India': 'IN', 'Indonesia': 'ID', 'Iran': 'IR',
  'Iraq': 'IQ', 'Ireland': 'IE', 'Israel': 'IL', 'Italy': 'IT', 'Jamaica': 'JM',
  'Jordan': 'JO', 'Kazakhstan': 'KZ', 'Kenya': 'KE', 'Kuwait': 'KW', 'Kyrgyzstan': 'KG',
  'Laos': 'LA', 'Latvia': 'LV', 'Lebanon': 'LB', 'Lesotho': 'LS', 'Liberia': 'LR',
  'Libya': 'LY', 'Liechtenstein': 'LI', 'Lithuania': 'LT', 'Luxembourg': 'LU', 'Madagascar': 'MG',
  'Malawi': 'MW', 'Malaysia': 'MY', 'Maldives': 'MV', 'Mali': 'ML', 'Malta': 'MT',
  'Mauritania': 'MR', 'Mauritius': 'MU', 'Micronesia': 'FM', 'Moldova': 'MD', 'Monaco': 'MC',
  'Mongolia': 'MN', 'Montenegro': 'ME', 'Morocco': 'MA', 'Mozambique': 'MZ', 'Myanmar': 'MM',
  'Namibia': 'NA', 'Nauru': 'NR', 'Nepal': 'NP', 'Netherlands': 'NL', 'New Zealand': 'NZ',
  'Nicaragua': 'NI', 'Niger': 'NE', 'Nigeria': 'NG', 'North Korea': 'KP', 'North Macedonia': 'MK',
  'Oman': 'OM', 'Pakistan': 'PK', 'Panama': 'PA', 'Papua New Guinea': 'PG', 'Paraguay': 'PY',
  'Peru': 'PE', 'Philippines': 'PH', 'Poland': 'PL', 'Portugal': 'PT', 'Qatar': 'QA',
  'Romania': 'RO', 'Russia': 'RU', 'Rwanda': 'RW', 'Saint Kitts and Nevis': 'KN', 'Saint Lucia': 'LC',
  'Saint Vincent and the Grenadines': 'VC', 'Samoa': 'WS', 'San Marino': 'SM', 'Sao Tome and Principe': 'ST',
  'Saudi Arabia': 'SA', 'Senegal': 'SN', 'Serbia': 'RS', 'Seychelles': 'SC', 'Sierra Leone': 'SL',
  'Singapore': 'SG', 'Slovakia': 'SK', 'Slovenia': 'SI', 'Solomon Islands': 'SB', 'Somalia': 'SO',
  'South Africa': 'ZA', 'South Korea': 'KR', 'South Sudan': 'SS', 'Spain': 'ES', 'Sri Lanka': 'LK',
  'Sudan': 'SD', 'Suriname': 'SR', 'Sweden': 'SE', 'Switzerland': 'CH', 'Syria': 'SY',
  'Tajikistan': 'TJ', 'Tanzania': 'TZ', 'Thailand': 'TH', 'Timor-Leste': 'TL', 'Togo': 'TG',
  'Tonga': 'TO', 'Trinidad and Tobago': 'TT', 'Tunisia': 'TN', 'Turkey': 'TR', 'Turkmenistan': 'TM',
  'Tuvalu': 'TV', 'Uganda': 'UG', 'Ukraine': 'UA', 'United Arab Emirates': 'AE', 'United Kingdom': 'GB',
  'United States': 'US', 'Uruguay': 'UY', 'Uzbekistan': 'UZ', 'Vanuatu': 'VU', 'Vatican City': 'VA',
  'Venezuela': 'VE', 'Vietnam': 'VN', 'Yemen': 'YE', 'Zambia': 'ZM', 'Zimbabwe': 'ZW'
};

const countryCoords = {
  'AF': [33.9391, 67.7100], 'AL': [41.1533, 20.1683], 'DZ': [28.0339, 1.6596], 'AD': [42.5462, 1.6016],
  'AO': [-11.2027, 17.8739], 'AG': [17.0608, -61.7964], 'AR': [-38.4161, -63.6167], 'AM': [40.0691, 45.0382],
  'AU': [-25.2744, 133.7751], 'AT': [47.5162, 14.5501], 'AZ': [40.1431, 47.5769], 'BS': [25.0343, -77.3963],
  'BH': [26.0667, 50.5577], 'BD': [23.6850, 90.3563], 'BB': [13.1939, -59.5432], 'BE': [50.8503, 4.3517], 'BY': [53.7098, 27.9534],
  'BZ': [17.1899, -88.4976], 'BJ': [9.3077, 2.3158], 'CA': [56.1304, -106.3468], 'BT': [27.5142, 90.4336], 'BO': [-16.2902, -63.5887],
  'BA': [44.0165, 17.6791], 'BW': [-22.3285, 24.6849], 'BR': [-14.2350, -51.9253], 'VG': [18.4207, -64.6400],
  'BN': [4.5353, 114.7277], 'BG': [42.7339, 25.4858], 'BF': [12.2383, -1.5616], 'BI': [-3.3731, 29.9189],
  'CV': [16.0022, -24.0132], 'KH': [12.5657, 104.9910], 'CM': [7.3697, 12.3547], 'KY': [19.5135, -80.5670],
  'CF': [6.6111, 20.9394], 'TD': [15.4542, 18.7322],   'CL': [-35.6751, -71.5430], 'CN': [35.8617, 104.1954], 'KI': [-3.3704, -168.7340], 'KM': [-11.8750, 43.8722],
  'CO': [4.5709, -74.2973],   'CR': [9.7489, -83.7534], 'HR': [45.1000, 15.2000], 'CU': [21.5218, -77.7812], 'CZ': [49.8175, 15.4730],
  'CW': [12.1696, -68.9900],   'CY': [35.1264, 33.4299], 'CD': [-4.0383, 21.7587], 'DJ': [11.8251, 42.5903], 'DK': [56.2639, 9.5018], 'DE': [51.1657, 10.4515],
  'DM': [15.4150, -61.3710], 'DO': [18.7357, -70.1627], 'EC': [-1.8312, -78.1834], 'EG': [26.8206, 30.8025],
  'SV': [13.7942, -88.9015], 'EE': [58.5953, 25.0136], 'SZ': [-26.5228, 31.4659], 'ER': [15.1794, 39.7823], 'ET': [9.1450, 40.4897],
  'FJ': [-17.7134, 178.0650], 'FI': [61.9241, 25.7482], 'FR': [46.2276, 2.2137], 'GA': [-0.8037, 11.6094],
  'GM': [13.4432, -15.3101], 'GE': [42.3154, 43.3569], 'GH': [7.9465, -1.0232], 'GI': [36.1377, -5.3454],
  'GR': [39.0742, 21.8243], 'GL': [71.7069, -42.6043], 'GD': [12.2628, -61.6041], 'GU': [13.4443, 144.7937], 'GQ': [1.6508, 10.2679],
  'GT': [15.7835, -90.2308], 'GN': [9.9456, -9.6966], 'GW': [11.8037, -15.1804], 'GY': [4.8604, -58.9302],
  'HT': [18.9712, -72.2852], 'HN': [15.1999, -86.2419], 'HU': [47.1625, 19.5033], 'IS': [64.9631, -19.0208],
  'IN': [20.5937, 78.9629], 'ID': [-0.7893, 113.9213], 'IR': [32.4279, 53.6880], 'IQ': [33.2232, 43.6793],
  'IE': [53.1424, -7.6921], 'IL': [31.0461, 34.8516], 'IT': [41.8719, 12.5674], 'JM': [18.1096, -77.2975], 'JP': [36.2048, 138.2529],
  'JO': [30.5852, 36.2384], 'KZ': [48.0196, 66.9237], 'KE': [-0.0236, 37.9062], 'KW': [29.3117, 47.4818],
  'KG': [41.2044, 74.7661], 'LA': [19.8563, 102.4952], 'LV': [56.8796, 24.6032], 'LB': [33.8547, 35.8623],
  'LS': [-29.6099, 28.2336], 'LR': [6.4281, -9.4295], 'LY': [26.3351, 17.2283], 'LI': [47.1660, 9.5554],
  'LT': [55.1694, 23.8813], 'LU': [49.8153, 6.1296], 'MG': [-18.7669, 46.8691], 'MW': [-13.9626, 34.0035],
  'MY': [4.2105, 101.9758], 'MV': [3.2028, 73.2207], 'MX': [23.6345, -102.5528], 'ML': [17.5707, -3.9962], 'MT': [35.9375, 14.3754],
  'MR': [21.0079, -10.9408], 'MU': [-20.3484, 57.5522], 'FM': [7.0897, 150.1838], 'MD': [47.4116, 28.3699],
  'MC': [43.7503, 7.4128], 'MN': [46.8625, 103.8467], 'ME': [42.7087, 19.2404], 'MA': [31.7917, -7.0926],
  'MZ': [-18.6657, 35.5295], 'MM': [21.9162, 95.9560], 'NA': [-22.9576, 18.4904], 'NR': [-0.5228, 166.9315],
  'NP': [28.3949, 84.1240], 'NO': [60.4720, 8.4689], 'NL': [52.1326, 5.2913], 'NZ': [-40.9006, 174.8860], 'NI': [12.1364, -85.2732],
  'NE': [17.6078, 8.0817], 'NG': [9.0820, 8.6753], 'KP': [40.3399, 127.5101], 'MK': [41.6086, 21.7453],
  'OM': [21.4735, 55.9754], 'PK': [30.3753, 69.3451], 'PA': [8.5380, -80.7821], 'PG': [-6.3150, 143.9555],
  'PY': [-23.4425, -58.4438], 'PE': [-9.1900, -75.0152], 'PH': [12.8797, 121.7740], 'PL': [51.9194, 19.1451],
  'PT': [39.3999, -8.2245], 'QA': [25.3548, 51.1839], 'PW': [7.5150, 134.5825], 'RO': [45.9432, 24.9668], 'RU': [61.5240, 105.3188],
  'RW': [-1.9403, 29.8739], 'KN': [17.3578, -62.7430], 'LC': [13.9094, -60.9748], 'VC': [12.9043, -61.2766],
  'WS': [-13.7590, -172.1046], 'SM': [43.9424, 12.4578], 'ST': [0.1864, 6.6131], 'SA': [23.8859, 45.0792],
  'SN': [14.4974, -14.4524], 'RS': [44.0165, 21.0059], 'SC': [-4.6796, 55.4920], 'SL': [8.4606, -11.7799],
  'SG': [1.3521, 103.8198], 'SK': [48.6690, 19.6990], 'SI': [46.1512, 15.2675], 'SB': [-9.6457, 160.1562],
  'SO': [5.1521, 46.1996], 'ZA': [-30.5595, 22.9375], 'KR': [35.9078, 127.7669], 'SS': [6.8770, 31.3070],
  'ES': [40.4637, -3.7492], 'LK': [7.8731, 80.7718], 'SD': [12.8628, 30.2176], 'SR': [3.9193, -56.0278],
  'SE': [60.1282, 18.6435], 'CH': [46.8182, 8.2275], 'SY': [34.8021, 38.9968], 'TJ': [38.8610, 71.2761],
  'TZ': [-6.3690, 34.8888], 'TH': [15.8700, 100.9925], 'TL': [-8.8742, 125.7275], 'TG': [8.6195, 0.8248],
  'TO': [-21.1790, -175.1982], 'TT': [10.6918, -61.2225], 'TN': [33.8869, 9.5375], 'TR': [38.9637, 35.2433],
  'TM': [38.9697, 59.5563], 'TV': [-7.1095, 177.6493], 'UG': [1.3733, 32.2903], 'UA': [48.3794, 31.1656],
  'AE': [23.4241, 53.8478], 'GB': [55.3781, -3.4360], 'US': [37.0902, -95.7129], 'UY': [-32.5228, -55.7658],
  'UZ': [41.3775, 64.5853], 'VU': [-15.3767, 166.9592], 'VA': [41.9029, 12.4534], 'VE': [6.4238, -66.5897],
  'VN': [14.0583, 108.2772], 'YE': [15.5527, 48.5164], 'ZM': [-13.1339, 27.8493], 'ZW': [-19.0154, 29.1548]
};

const DB_CACHE_KEY = 'ip-to-asn-20260116-v3';

async function loadCachedDB() {
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open('WostrDB', 1);
      request.onupgradeneeded = (e) => {
        e.target.result.createObjectStore('databases');
      };
      request.onsuccess = (e) => {
        const db = e.target.result;
        const transaction = db.transaction('databases', 'readonly');
        const store = transaction.objectStore('databases');
        const getRequest = store.get(DB_CACHE_KEY);
        getRequest.onsuccess = () => resolve(getRequest.result);
        getRequest.onerror = () => resolve(null);
      };
      request.onerror = () => resolve(null);
    } catch (e) {
      resolve(null);
    }
  });
}

async function cacheDB(buffer) {
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open('WostrDB', 1);
      request.onsuccess = (e) => {
        const db = e.target.result;
        const transaction = db.transaction('databases', 'readwrite');
        const store = transaction.objectStore('databases');
        store.put(buffer, DB_CACHE_KEY);
        transaction.oncomplete = () => resolve();
      };
    } catch (e) {
      resolve();
    }
  });
}

async function initDatabase() {
  showApp();
  const initStatusEl = document.getElementById('initStatus');
  initStatusEl.innerHTML = '<div class="spinner"></div><p id="initStatusText">Initializing SQL Engine...</p>';
  initStatusEl.classList.add('active');
  
  try {
    const SQL = await initSqlJs({
      locateFile: file => file
    });

    document.getElementById('initStatusText').textContent = 'Checking local cache...';
    const cachedBuffer = await loadCachedDB();

    if (cachedBuffer) {
      document.getElementById('initStatusText').textContent = 'Loading from cache...';
      db = new SQL.Database(cachedBuffer);
    } else {
      console.log('No cache found. Starting download...');
      document.getElementById('initStatusText').textContent = 'Downloading database (compressed)...';
      const response = await fetch('ip-to-asn-20260116.7z', {
        cache: 'no-store'
      });
      if (!response.ok) throw new Error('Failed to download archive');
      const blob = await response.blob();
      console.log('Blob received:', blob.size, 'bytes');

      document.getElementById('initStatusText').textContent = 'Analyzing compressed archive...';
      
      if (typeof Archive === 'undefined') {
        throw new Error('Archive library failed to load. Please check your internet connection and refresh the page.');
      }
      
      document.getElementById('initStatusText').textContent = 'Preparing archive engine...';
      
      const workerCode = `
        // Override locateFile to use absolute path
        self.locateFile = function(path) {
          if (path === 'libarchive.wasm') {
            return self.location.origin + self.location.pathname.replace(/\\/[^\\/]*$/, '/') + 'libarchive/libarchive.wasm';
          }
          return path;
        };
      `;
      
      const originalWorkerUrl = 'libarchive/worker-bundle.js';
      const workerBlob = new Blob([workerCode + '\\nimportScripts("' + originalWorkerUrl + '");'], { type: 'application/javascript' });
      const workerBlobUrl = URL.createObjectURL(workerBlob);
      
      Archive.init({
        workerUrl: originalWorkerUrl,
        getWorker: () => new Worker(workerBlobUrl)
      });
      const archive = await Archive.open(blob);
      console.log('Archive opened:', archive);

      document.getElementById('initStatusText').textContent = 'Listing files in archive...';

      let filesList = [];
      try {
        filesList = await archive.getFilesArray();
      } catch (e) {
        console.error('getFilesArray failed:', e);
      }

      if (filesList.length === 0) {
        throw new Error('Archive is empty');
      }

      // Just take the first file found in the archive
      const dbEntry = filesList[0];
      document.getElementById('initStatusText').textContent = 'Extracting database...';
      console.log('Extracting:', dbEntry.path || 'primary file');
      const dbFile = await dbEntry.file.extract();
      const dbBuffer = await dbFile.arrayBuffer();

      const buffer = new Uint8Array(dbBuffer);

      // Check if it's a SQLite database or a CSV
      const magic = String.fromCharCode(...buffer.slice(0, 15));
      console.log('File header detected:', magic);

      if (magic === 'SQLite format 3') {
        document.getElementById('initStatusText').textContent = 'Finalizing...';
        db = new SQL.Database(buffer);
      } else {
        // It's a CSV file
        document.getElementById('initStatusText').textContent = 'Converting CSV to Database...';
        const csvContent = new TextDecoder().decode(buffer);
        const lines = csvContent.split('\n');

        if (lines.length < 2) throw new Error('CSV file is empty or invalid');

        const header = lines[0].toLowerCase().split(',').map(h => h.trim());
        console.log('CSV Header:', header);

        const colMap = {
          network: header.indexOf('network'),
          asn: header.indexOf('asn'),
          country_code: header.indexOf('country_code'),
          name: header.indexOf('name'),
          org: header.indexOf('org'),
          domain: header.indexOf('domain')
        };

        // Fallback for some common alternative names
        if (colMap.country_code === -1) colMap.country_code = header.indexOf('country');

        console.log('Column Map:', colMap);

        db = new SQL.Database();
        db.run("CREATE TABLE ip_to_asn (network TEXT, asn TEXT, country_code TEXT, name TEXT, org TEXT, domain TEXT)");

        db.run("BEGIN TRANSACTION");
        const stmt = db.prepare("INSERT INTO ip_to_asn VALUES (?, ?, ?, ?, ?, ?)");

        const totalLines = lines.length;
        let importedCount = 0;

        for (let i = 1; i < totalLines; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          const parts = [];
          let current = '';
          let inQuotes = false;
          for (let charIndex = 0; charIndex < line.length; charIndex++) {
            const char = line[charIndex];
            if (char === '"') {
              if (inQuotes && line[charIndex + 1] === '"') {
                current += '"';
                charIndex++;
              } else {
                inQuotes = !inQuotes;
              }
            } else if (char === ',' && !inQuotes) {
              parts.push(current);
              current = '';
            } else {
              current += char;
            }
          }
          parts.push(current);

          const cleanParts = parts.map(p => p.trim());

          if (cleanParts.length >= 3) {
            stmt.run([
              (colMap.network !== -1 ? cleanParts[colMap.network] : '') ?? '',
              (colMap.asn !== -1 ? cleanParts[colMap.asn] : '') ?? '',
              (colMap.country_code !== -1 ? cleanParts[colMap.country_code] : '') ?? '',
              (colMap.name !== -1 ? cleanParts[colMap.name] : '') ?? '',
              (colMap.org !== -1 ? cleanParts[colMap.org] : '') ?? '',
              (colMap.domain !== -1 ? cleanParts[colMap.domain] : '') ?? ''
            ]);
            importedCount++;
          }

          if (i % 50000 === 0) {
            const percent = Math.round((i / totalLines) * 100);
            document.getElementById('initStatusText').textContent = `Converting CSV: ${percent}%...`;
          }
        }

        stmt.free();
        db.run("COMMIT");
        console.log(`Imported ${importedCount} rows successfully.`);

        // Add index for performance
        document.getElementById('initStatusText').textContent = 'Optimizing database...';
        db.run("CREATE INDEX idx_country ON ip_to_asn(country_code)");
        console.log('Database conversion complete.');
      }

      // Cache the resulting database buffer for next time
      document.getElementById('initStatusText').textContent = 'Caching database...';
      const finalBuffer = db.export();
      await cacheDB(finalBuffer);
    }

    document.getElementById('searchBtn').disabled = false;
    initStatusEl.innerHTML = '';
    initStatusEl.classList.remove('active');
    setTimeout(initMap, 50);
  } catch (error) {
    console.error('Failed to load database:', error);
    initStatusEl.innerHTML = `<p>Failed to load database: ${error.message}. Please refresh the page.</p>`;
  }
}

function getCurrentTheme() {
  const themes = ['dark', 'light', 'nord', 'dracula', 'github', 'ocean'];
  for (const theme of themes) {
    if (document.body.classList.contains('theme-' + theme)) {
      return theme;
    }
  }
  return 'dark';
}

function getTileLayerForTheme(theme) {
  const darkThemes = ['dark', 'nord', 'dracula', 'github', 'ocean'];
  const isDark = darkThemes.includes(theme);

  if (isDark) {
    return L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    });
  } else {
    return L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  }
}

function updateMapTheme() {
  if (!map || !countryLayer) return;

  const theme = getCurrentTheme();
  const tileLayer = getTileLayerForTheme(theme);

  map.eachLayer((layer) => {
    if (layer instanceof L.TileLayer) {
      map.removeLayer(layer);
    }
  });

  tileLayer.addTo(map);
}

function initMap() {
  const mapEl = document.getElementById('map');
  if (!mapEl) {
    console.error('Map element not found');
    return;
  }

  if (typeof L === 'undefined') {
    console.error('Leaflet not loaded');
    document.getElementById('status').innerHTML = '<p>Leaflet library not loaded. Please refresh the page.</p>';
    return;
  }

  if (map) {
    map.remove();
  }

  map = L.map('map', {
    center: [20, 0],
    zoom: 2,
    minZoom: 2,
    maxBounds: [[-90, -180], [90, 180]],
    maxBoundsViscosity: 1.0,
    worldCopyJump: false
  });

  const theme = getCurrentTheme();
  const tileLayer = getTileLayerForTheme(theme);
  tileLayer.addTo(map);

  countryLayer = L.layerGroup().addTo(map);

  map.on('zoomend', () => {
    if (Object.keys(countryCounts).length > 0) {
      displayCountryMarkers();
    }
  });

  loadCountryCounts();
}

function loadCountryCounts() {
  if (!db) return;

  const result = db.exec("SELECT country_code, COUNT(*) as count FROM ip_to_asn GROUP BY country_code");

  if (result.length > 0) {
    result[0].values.forEach(row => {
      countryCounts[row[0]] = row[1];
    });

    displayCountryMarkers();
  }
}

function getThemeColors(theme) {
  const colors = {
    dark: { success: '#22c55e', default: '#3b82f6' },
    light: { success: '#16a34a', default: '#2563eb' },
    nord: { success: '#88c0d0', default: '#81a1c1' },
    dracula: { success: '#50fa7b', default: '#bd93f9' },
    github: { success: '#3fb950', default: '#58a6ff' },
    ocean: { success: '#64ffda', default: '#88c0d0' }
  };
  return colors[theme] || colors.dark;
}

function displayCountryMarkers() {
  countryLayer.clearLayers();

  const theme = getCurrentTheme();
  const colors = getThemeColors(theme);
  const usedPositions = [];
  const minDistance = 3;

  Object.entries(countryCounts).forEach(([code, count]) => {
    if (countryCoords[code]) {
      const color = count > 0 ? colors.success : colors.default;
      const radius = Math.max(3, Math.min(8, Math.log(count) * 1.5));

      let lat = countryCoords[code][0];
      let lng = countryCoords[code][1];

      let attempts = 0;
      let offsetLat = 0;
      let offsetLng = 0;

      while (attempts < 10) {
        const newLat = lat + offsetLat;
        const newLng = lng + offsetLng;

        let tooClose = false;
        for (const pos of usedPositions) {
          const dist = Math.sqrt(Math.pow(newLat - pos[0], 2) + Math.pow(newLng - pos[1], 2));
          if (dist < minDistance) {
            tooClose = true;
            break;
          }
        }

        if (!tooClose) {
          usedPositions.push([newLat, newLng]);
          break;
        }

        offsetLat = (Math.random() - 0.5) * 5;
        offsetLng = (Math.random() - 0.5) * 5;
        attempts++;
      }

      const circle = L.circleMarker([lat + offsetLat, lng + offsetLng], {
        radius: radius,
        fillColor: color,
        color: color,
        weight: 1,
        opacity: 0.8,
        fillOpacity: 0.5
      });

      const countryName = Object.entries(countryCodeMap).find(([name, c]) => c === code)?.[0] || code;

      circle.bindTooltip(
        `<div class="country-tooltip">${countryName} (${code})<br>${count.toLocaleString()} results</div>`,
        { className: 'country-tooltip' }
      );

      circle.on('click', () => {
        setQuery(countryName);
        search(countryName);
      });

      countryLayer.addLayer(circle);
    }
  });
}

function setQuery(text) {
  document.getElementById('query').value = text;
}

function setQueryAndSearch(text) {
  document.getElementById('query').value = text;
  search(text);
}

function changeTheme(theme) {
  document.body.className = 'theme-' + theme;
  localStorage.setItem('theme', theme);
  updateMapTheme();
}

function loadTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.body.className = 'theme-' + savedTheme;
  const themeSelect = document.getElementById('themeSelect');
  if (themeSelect) {
    themeSelect.value = savedTheme;
  }
}

function showApp() {
  document.querySelector('.container').classList.add('active');
}

function search(query) {
  if (!db || !query.trim()) return;

  isSearchMode = true;
  currentPage = 1;
  currentResults = [];

  document.getElementById('loading').classList.add('active');
  document.getElementById('results').classList.remove('active');

  setTimeout(() => {
    const searchType = detectSearchType(query);
    let results = [];

    switch (searchType) {
      case 'asn':
        results = searchASN(query);
        break;
      case 'country':
        results = searchCountry(query);
        break;
      case 'combined':
        results = searchCombined(query);
        break;
      case 'domain':
        results = searchDomain(query);
        break;
      case 'network':
        results = searchNetwork(query);
        break;
      default:
        results = searchAll(query);
    }

    currentResults = results;
    displayResults(results);
    updateMapForSearch(results, query);

    document.getElementById('loading').classList.remove('active');
  }, 50);
}

function detectSearchType(query) {
  const lowerQuery = query.toLowerCase().trim();

  if (lowerQuery.startsWith('as') || /^\d+$/.test(lowerQuery.replace('as', ''))) {
    return 'asn';
  }

  const countryMatch = query.match(/\b(in|of|networks? in)\s+([A-Za-z]+)/i);
  if (countryMatch && !/^(asn|as)\d+/i.test(query)) {
    return 'combined';
  }

  const codeMatch = query.match(/\b([A-Z]{2})\b/);
  if (codeMatch && countryCodeMap[Object.values(countryCodeMap).includes(codeMatch[1])]) {
    return 'country';
  }

  if (countryCodeMap[query] || Object.values(countryCodeMap).includes(query.toUpperCase())) {
    return 'country';
  }

  if (query.includes('.') && (query.includes('/') || /\d+\.\d+\.\d+\.\d+/.test(query))) {
    return 'network';
  }

  if (query.includes('.') && !query.includes(' ')) {
    return 'domain';
  }

  const combinedMatch = query.match(/^(.+?)\s+(in|of)\s+(.+)$/i);
  if (combinedMatch) {
    return 'combined';
  }

  return 'all';
}

function searchAll(keyword) {
  const keywords = keyword.toLowerCase().split(' ').filter(k => k.length > 1);
  const placeholders = keywords.map(() => 'name LIKE ? OR org LIKE ? OR domain LIKE ?').join(' OR ');
  const params = keywords.flatMap(k => [`%${k}%`, `%${k}%`, `%${k}%`]);

  let stmt = db.prepare(`SELECT DISTINCT network, asn, country_code, name, org, domain FROM ip_to_asn WHERE ${placeholders} LIMIT 200`);
  stmt.bind(params);

  const results = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    if (row.network && row.network.includes('/')) {
      results.push(row);
    }
  }
  stmt.free();

  return shuffleArray(results);
}

function searchASN(query) {
  const asnNum = query.replace(/as/i, '').trim();
  const stmt = db.prepare('SELECT DISTINCT network, asn, country_code, name, org, domain FROM ip_to_asn WHERE asn LIKE ? LIMIT 100');
  stmt.bind([`%${asnNum}%`]);

  const results = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    if (row.network && row.network.includes('/')) {
      results.push(row);
    }
  }
  stmt.free();

  return results;
}

function searchCountry(query) {
  let countryCode = query.toUpperCase().trim();

  if (countryCodeMap[query]) {
    countryCode = countryCodeMap[query];
  }

  const stmt = db.prepare('SELECT DISTINCT network, asn, country_code, name, org, domain FROM ip_to_asn WHERE country_code = ? LIMIT 200');
  stmt.bind([countryCode]);

  const results = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    if (row.network && row.network.includes('/')) {
      results.push(row);
    }
  }
  stmt.free();

  currentCountry = Object.entries(countryCodeMap).find(([name, code]) => code === countryCode)?.[0] || '';
  currentCountryCode = countryCode;

  return shuffleArray(results);
}

function searchCombined(query) {
  const match = query.match(/^(.+?)\s+(?:in|of)\s+(.+)$/i);

  if (!match) {
    return searchAll(query);
  }

  let org = match[1].trim();
  let countryPart = match[2].trim();
  let countryCode = countryPart.toUpperCase();

  if (countryCodeMap[countryPart]) {
    countryCode = countryCodeMap[countryPart];
  }

  currentCountry = Object.entries(countryCodeMap).find(([name, code]) => code === countryCode)?.[0] || countryPart;
  currentCountryCode = countryCode;

  if (countryCode.length !== 2 || !countryCoords[countryCode]) {
    const stmt = db.prepare('SELECT DISTINCT network, asn, country_code, name, org, domain FROM ip_to_asn WHERE org LIKE ? AND country_code IN (SELECT country_code FROM ip_to_asn WHERE name LIKE ? OR org LIKE ? OR country_code LIKE ?) LIMIT 200');
    stmt.bind([`%${org}%`, `%${countryPart}%`, `%${countryPart}%`, `%${countryPart}%`]);

    const results = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      if (row.network && row.network.includes('/')) {
        results.push(row);
      }
    }
    stmt.free();

    return shuffleArray(results);
  }

  const stmt = db.prepare('SELECT DISTINCT network, asn, country_code, name, org, domain FROM ip_to_asn WHERE org LIKE ? AND country_code = ? LIMIT 200');
  stmt.bind([`%${org}%`, countryCode]);

  const results = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    if (row.network && row.network.includes('/')) {
      results.push(row);
    }
  }
  stmt.free();

  return shuffleArray(results);
}

function searchDomain(domain) {
  const stmt = db.prepare('SELECT DISTINCT network, asn, country_code, name, org, domain FROM ip_to_asn WHERE domain LIKE ? LIMIT 100');
  stmt.bind([`%${domain}%`]);

  const results = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    if (row.network && row.network.includes('/')) {
      results.push(row);
    }
  }
  stmt.free();

  return results;
}

function searchNetwork(network) {
  const cleanNetwork = network.trim();
  const stmt = db.prepare('SELECT DISTINCT network, asn, country_code, name, org, domain FROM ip_to_asn WHERE network = ? LIMIT 10');
  stmt.bind([cleanNetwork]);

  const results = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    if (row.network && row.network.includes('/')) {
      results.push(row);
    }
  }
  stmt.free();

  return results;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function displayResults(results) {
  const resultsList = document.getElementById('resultsList');
  const resultsCount = document.getElementById('resultsCount');

  if (results.length === 0) {
    document.getElementById('status').innerHTML = '<p>No results found. Try a different search term.</p>';
    return;
  }

  resultsCount.textContent = `${results.length.toLocaleString()} results found`;

  let html = '';

  const startIndex = (currentPage - 1) * RESULTS_PER_PAGE;
  const endIndex = Math.min(startIndex + RESULTS_PER_PAGE, results.length);
  const pageResults = results.slice(startIndex, endIndex);

  pageResults.forEach(row => {
    const escapedNetwork = (row.network || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
    const escapedOrg = (row.org || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
    const escapedName = (row.name || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
    
    html += `
      <div class="result-card">
        <div class="result-network" onclick="showDownloadModal('${escapedNetwork}')">${row.network || 'N/A'}</div>
        <div class="result-details">
          <div class="result-field">
            <span class="field-label">ASN</span>
            <span class="field-value">${row.asn || 'N/A'}</span>
          </div>
          <div class="result-field">
            <span class="field-label">Country</span>
            <span class="field-value">${row.country_code || 'N/A'}</span>
          </div>
          <div class="result-field">
            <span class="field-label">Name</span>
            <span class="field-value">${row.name || 'N/A'}</span>
          </div>
          <div class="result-field">
            <span class="field-label">Organization</span>
            <span class="field-value">${row.org || 'N/A'}</span>
          </div>
          <div class="result-field">
            <span class="field-label">Domain</span>
            <span class="field-value">${row.domain ? `<a href="https://${row.domain}" target="_blank" rel="noopener noreferrer" style="color: #60a5fa;">${row.domain}</a>` : 'N/A'}</span>
          </div>
        </div>
      </div>
    `;
  });

  html += createPagination(results.length);

  if (currentCountry && currentCountryCode.length === 2) {
    const orgs = getUniqueOrganizations(currentCountryCode);
    if (orgs.length > 0) {
      html += `
        <div class="org-section">
          <div class="org-section-title">Other Organizations in ${currentCountry}</div>
          <div class="org-list">
            ${orgs.map(org => {
              const escapedOrg = org.replace(/'/g, "\\'").replace(/"/g, '&quot;');
              return `<span class="org-tag" onclick="copyOrg('${escapedOrg}')">${org}</span>`;
            }).join('')}
          </div>
        </div>
      `;
    }
  }

  resultsList.innerHTML = html;
  document.getElementById('results').classList.add('active');
  
  setTimeout(() => {
    const resultsEl = document.getElementById('results');
    if (resultsEl) {
      resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 100);
}

function getUniqueOrganizations(countryCode) {
  const stmt = db.prepare('SELECT DISTINCT org, asn FROM ip_to_asn WHERE country_code = ? AND org IS NOT NULL AND org != "" ORDER BY org ASC');
  stmt.bind([countryCode]);

  const orgs = [];
  const orgAsns = {};
  while (stmt.step()) {
    const row = stmt.getAsObject();
    if (row.org && row.org.trim()) {
      const orgName = row.org.trim();
      if (!orgs.includes(orgName)) {
        orgs.push(orgName);
        orgAsns[orgName] = row.asn;
      }
    }
  }
  stmt.free();

  window.orgAsnMap = orgAsns;
  return orgs;
}

function copyOrg(org) {
  const asn = window.orgAsnMap?.[org];
  if (asn) {
    const asnQuery = asn.startsWith('AS') ? asn : `AS${asn}`;
    search(asnQuery);
  }
}

function createPagination(totalResults) {
  const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);

  if (totalPages <= 1) {
    return '';
  }

  let html = '<div class="pagination">';
  html += `<button class="page-btn nav-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>`;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
      html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
    } else if (i === currentPage - 3 || i === currentPage + 3) {
      html += '<span style="color: #64748b;">...</span>';
    }
  }

  html += `<button class="page-btn nav-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>`;
  html += '</div>';

  return html;
}

function changePage(page) {
  currentPage = page;
  displayResults(currentResults);

  document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

function updateMapForSearch(results, searchQuery) {
  countryLayer.clearLayers();

  const searchCountryCode = Object.entries(countryCodeMap).find(([name, code]) => 
    name.toLowerCase() === String(searchQuery).toLowerCase().trim() || code.toLowerCase() === String(searchQuery).toLowerCase().trim()
  )?.[1];

  const threshold = 15;
  let bounds = null;

  if (searchCountryCode && countryCoords[searchCountryCode]) {
    bounds = L.latLngBounds([countryCoords[searchCountryCode]]);
  }

  const theme = getCurrentTheme();
  const colors = getThemeColors(theme);

  Object.entries(countryCounts).forEach(([code, count]) => {
    if (countryCoords[code]) {
      const isSearched = code === searchCountryCode;
      const color = count > 0 ? colors.success : colors.default;
      const radius = Math.max(3, Math.min(8, Math.log(count) * 1.5));

      const circle = L.circleMarker(countryCoords[code], {
        radius: isSearched ? radius * 1.5 : radius,
        fillColor: color,
        color: color,
        weight: isSearched ? 3 : 1,
        opacity: 0.8,
        fillOpacity: isSearched ? 0.8 : 0.5
      });

      const countryName = Object.entries(countryCodeMap).find(([name, c]) => c === code)?.[0] || code;

      const tooltipOptions = {
        className: 'country-tooltip',
        permanent: isSearched,
        direction: 'top'
      };

      circle.bindTooltip(
        `<div class="country-tooltip">${countryName} (${code})<br>${count.toLocaleString()} results</div>`,
        tooltipOptions
      );

      if (isSearched) {
        circle.openTooltip();
      }

      circle.on('click', () => {
        setQuery(countryName);
        search(countryName);
      });

      countryLayer.addLayer(circle);
    }
  });

  if (searchCountryCode && countryCoords[searchCountryCode]) {
    const clickedLat = countryCoords[searchCountryCode][0];
    const clickedLng = countryCoords[searchCountryCode][1];

    Object.entries(countryCounts).forEach(([code, count]) => {
      if (code !== searchCountryCode && countryCoords[code]) {
        const otherLat = countryCoords[code][0];
        const otherLng = countryCoords[code][1];

        const latDiff = Math.abs(clickedLat - otherLat);
        const lngDiff = Math.abs(clickedLng - otherLng);

        if (latDiff < threshold && lngDiff < threshold) {
          if (bounds) {
            bounds.extend([otherLat, otherLng]);
          }
        }
      }
    });

    if (bounds && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 7 });
    }
  }
}

function showDownloadModal(network) {
  document.getElementById('downloadNetwork').textContent = network;
  document.getElementById('downloadModal').classList.add('active');
  
  const commandsDiv = document.getElementById('nmapCommands');
  const [ip, cidr] = network.split('/');
  const sanitizedNetwork = network.replace(/\//g, '-').replace(/[^a-zA-Z0-9.\-]/g, '-');
  const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
  const nmapOutput = `${timestamp}_${sanitizedNetwork}_nmap.txt`;
  const masscanOutput = `${timestamp}_${sanitizedNetwork}_masscan.txt`;
  
  const nmapCommands = [
    {
      title: 'Quick scan – most people use this',
      note: 'Standard web server detection',
      cmd: `nmap -p80,443 --open -oN ${nmapOutput} ${network}`
    },
    {
      title: 'Fast scan – skip DNS resolution',
      note: 'Uses alternate web ports',
      cmd: `nmap -n -p80,443,8080,8443,8000,8888 --open -oN ${nmapOutput} ${network}`
    },
    {
      title: 'Most reliable – with sudo',
      note: 'TCP discovery on common ports',
      cmd: `sudo nmap -PS80,443 -p80,443 --open -oN ${nmapOutput} ${network}`
    },
    {
      title: 'Very fast – trusted LAN only',
      note: 'High-speed internal scanning',
      cmd: `nmap -T4 -p80,443 --open --min-rate 400 -oN ${nmapOutput} ${network}`
    },
    {
      title: 'With page titles',
      note: 'Shows HTTP title when found',
      cmd: `nmap -p80,443 --open --script http-title -oN ${nmapOutput} ${network}`
    },
    {
      title: 'Extreme – all ports',
      note: 'Finds web servers on any port',
      cmd: `nmap -p1-65535 --open -sV --version-light --script http-title -oN ${nmapOutput} ${network}`
    }
  ];
  
  const masscanCommands = [
    {
      title: 'Quick & safe internal subnet',
      note: 'Most people start here',
      cmd: `sudo masscan ${network} -p80,443 --rate 10000 -oL ${masscanOutput}`
    },
    {
      title: 'Fast + reliable + alternates',
      note: 'Personal favorite combo',
      cmd: `sudo masscan ${network} -p80,443,8080,8443,8000-9000 --rate 150000 --open-only -oL ${masscanOutput}`
    },
    {
      title: 'Very aggressive scan',
      note: 'Trusted LAN only!',
      cmd: `sudo masscan ${network} -p80,443 --rate 1000000 --wait 0`
    },
    {
      title: 'Get banners + save nicely',
      note: 'Good next step after discovery',
      cmd: `sudo masscan ${network} -p80,443 --banners --rate 200000 -oJ ${masscanOutput.replace('.txt', '.json')}`
    },
    {
      title: 'Resume feature',
      note: 'Useful for very long scans',
      cmd: `sudo masscan ${network} -p80,443 --rate 500000 --resume paused.conf`
    }
  ];
  
  const naabuCommands = [
    {
      title: 'Quick SYN scan',
      note: 'Fast port discovery',
      cmd: `echo ${network} | naabu -p 80,443 -rate 100000 -o ${masscanOutput}`
    },
    {
      title: 'Full port range',
      note: 'All 65535 ports',
      cmd: `naabu -host ${network} -p - -rate 50000 -o ${masscanOutput}`
    },
    {
      title: 'With nmap integration',
      note: 'Auto-run nmap on results',
      cmd: `naabu -l ${network} -p 80,443 -nmap-cli 'nmap -sV -oN ${nmapOutput}'`
    },
    {
      title: 'Top 1000 ports',
      note: 'Most common ports',
      cmd: `naabu -host ${network} -top-ports 1000 -rate 80000 -o ${masscanOutput}`
    },
    {
      title: 'JSON output',
      note: 'For scripting',
      cmd: `naabu -host ${network} -p 80,443 -json -o ${masscanOutput.replace('.txt', '.json')}`
    }
  ];
  
  const rustscanCommands = [
    {
      title: 'Lightning fast scan',
      note: 'Fastest port scanner',
      cmd: `rustscan -a ${network} -p 80,443 --ulimit 8000 -- -sV -oN ${nmapOutput}`
    },
    {
      title: 'Quick web ports only',
      note: 'Only scan HTTP/HTTPS',
      cmd: `rustscan -a ${network} -p 80,443,8080,8443 --ulimit 10000 -g -oN ${nmapOutput}`
    },
    {
      title: 'Full port range',
      note: 'All 65535 ports',
      cmd: `rustscan -a ${network} -p 1-65535 --ulimit 5000 -- -sV -A -oN ${nmapOutput}`
    },
    {
      title: 'Aggressive service detection',
      note: 'Detailed version info',
      cmd: `rustscan -a ${network} --ulimit 8000 -- -sV --script=http-title -A -oN ${nmapOutput}`
    },
    {
      title: 'Fast batch mode',
      note: 'Optimized for speed',
      cmd: `rustscan -a ${network} -b 5000 -t 1000 -- -sV --open -oN ${nmapOutput}`
    }
  ];
  
  const zmapCommands = [
    {
      title: 'Fast single port',
      note: 'Lightning fast first pass',
      cmd: `sudo zmap -p 80 -o ${masscanOutput} -B 1G ${network}`
    },
    {
      title: 'Dual port scan',
      note: 'HTTP + HTTPS',
      cmd: `sudo zmap -p 80,443 -o ${masscanOutput} -B 2G ${network}`
    },
    {
      title: 'High bandwidth',
      note: 'Maximum speed scan',
      cmd: `sudo zmap -p 443 -B 5G --max-targets=1000000 -o ${masscanOutput} ${network}`
    },
    {
      title: 'With output fields',
      note: 'Custom CSV output',
      cmd: `sudo zmap -p 80 -o ${masscanOutput} --output-fields=ip,sport,dport,seqnum,cooldown ${network}`
    },
    {
      title: 'Sharded scan',
      note: 'Distributed scanning',
      cmd: `sudo zmap -p 80 -o ${masscanOutput} --shards=4 --seed=12345 ${network}`
    }
  ];
  
  const gobusterCommands = [
    {
      title: 'Common directories',
      note: 'Quick directory brute force',
      cmd: `gobuster dir -u http://${ip}/ -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-small.txt -t 50 -o ${nmapOutput.replace('_nmap.txt', '_gobuster.txt')}`
    },
    {
      title: 'With extensions',
      note: 'Find .php, .html, .bak files',
      cmd: `gobuster dir -u http://${ip}/ -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-small.txt -x php,html,bak,txt -t 50 -o ${nmapOutput.replace('_nmap.txt', '_gobuster.txt')}`
    },
    {
      title: 'Common web paths',
      note: 'API and admin endpoints',
      cmd: `gobuster dir -u http://${ip}/ -w /usr/share/wordlists/dirb/common.txt -t 30 -o ${nmapOutput.replace('_nmap.txt', '_gobuster.txt')}`
    },
    {
      title: 'Recursive scan',
      note: 'Deep enumeration',
      cmd: `gobuster dir -u http://${ip}/ -w /usr/share/seclists/Discovery/Web-Content/raft-small-words.txt -r -t 20 -o ${nmapOutput.replace('_nmap.txt', '_gobuster.txt')}`
    },
    {
      title: 'Exclude 404s',
      note: 'Only show valid responses',
      cmd: `gobuster dir -u http://${ip}/ -w /usr/share/seclists/Discovery/Web-Content/raft-medium-words.txt -e -s 200,301,302 -o ${nmapOutput.replace('_nmap.txt', '_gobuster.txt')}`
    }
  ];
  
  const httpxCommands = [
    {
      title: 'Probe for live hosts',
      note: 'Find active web servers',
      cmd: `cat ${sanitizedNetwork}.txt | httpx -silent -title -status-code -o ${nmapOutput.replace('_nmap.txt', '_httpx.txt')}`
    },
    {
      title: 'Full fingerprinting',
      note: 'Title + tech + server info',
      cmd: `httpx -l ${sanitizedNetwork}.txt -title -tech-detect -server -status-code -json -o ${nmapOutput.replace('_nmap.txt', '_httpx.json')}`
    },
    {
      title: 'Quick probe',
      note: 'Fast status check',
      cmd: `echo ${network} | httpx -silent -status-code -title -o ${nmapOutput.replace('_nmap.txt', '_httpx.txt')}`
    },
    {
      title: 'With specific ports',
      note: 'Scan uncommon ports',
      cmd: `cat ${sanitizedNetwork}.txt | httpx -ports 80,443,8080,8443,8000,8888 -title -sc -o ${nmapOutput.replace('_nmap.txt', '_httpx.txt')}`
    },
    {
      title: 'Filter by status',
      note: 'Only 200 OK responses',
      cmd: `httpx -l ${sanitizedNetwork}.txt -mc 200 -title -tech-detect -o ${nmapOutput.replace('_nmap.txt', '_httpx.txt')}`
    }
  ];
  
  commandsDiv.innerHTML = `
    <div class="nmap-section">
      <div class="nmap-section-header" onclick="toggleSection('nmap')">
        <span class="nmap-section-title">Nmap Commands</span>
        <span class="nmap-section-toggle" id="nmap-toggle">▶</span>
      </div>
      <div class="nmap-section-content collapsed" id="nmap-content">
        ${nmapCommands.map((c, i) => `
          <div class="nmap-command">
            <div class="nmap-command-header">
              <span class="nmap-command-title">${c.title}</span>
              <button class="nmap-copy-btn" onclick="copyNmapCmd(${i}); event.stopPropagation();">Copy</button>
            </div>
            <div class="nmap-command-note">${c.note}</div>
            <div class="nmap-command-row">${c.cmd}</div>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="nmap-section">
      <div class="nmap-section-header" onclick="toggleSection('masscan')">
        <span class="nmap-section-title">Masscan Commands</span>
        <span class="nmap-section-toggle" id="masscan-toggle">▶</span>
      </div>
      <div class="nmap-section-content collapsed" id="masscan-content">
        ${masscanCommands.map((c, i) => `
          <div class="nmap-command">
            <div class="nmap-command-header">
              <span class="nmap-command-title">${c.title}</span>
              <button class="nmap-copy-btn" onclick="copyMasscanCmd(${i}); event.stopPropagation();">Copy</button>
            </div>
            <div class="nmap-command-note">${c.note}</div>
            <div class="nmap-command-row">${c.cmd}</div>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="nmap-section">
      <div class="nmap-section-header" onclick="toggleSection('naabu')">
        <span class="nmap-section-title">Naabu Commands</span>
        <span class="nmap-section-toggle" id="naabu-toggle">▶</span>
      </div>
      <div class="nmap-section-content collapsed" id="naabu-content">
        ${naabuCommands.map((c, i) => `
          <div class="nmap-command">
            <div class="nmap-command-header">
              <span class="nmap-command-title">${c.title}</span>
              <button class="nmap-copy-btn" onclick="copyNaabuCmd(${i}); event.stopPropagation();">Copy</button>
            </div>
            <div class="nmap-command-note">${c.note}</div>
            <div class="nmap-command-row">${c.cmd}</div>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="nmap-section">
      <div class="nmap-section-header" onclick="toggleSection('rustscan')">
        <span class="nmap-section-title">RustScan Commands</span>
        <span class="nmap-section-toggle" id="rustscan-toggle">▶</span>
      </div>
      <div class="nmap-section-content collapsed" id="rustscan-content">
        ${rustscanCommands.map((c, i) => `
          <div class="nmap-command">
            <div class="nmap-command-header">
              <span class="nmap-command-title">${c.title}</span>
              <button class="nmap-copy-btn" onclick="copyRustscanCmd(${i}); event.stopPropagation();">Copy</button>
            </div>
            <div class="nmap-command-note">${c.note}</div>
            <div class="nmap-command-row">${c.cmd}</div>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="nmap-section">
      <div class="nmap-section-header" onclick="toggleSection('zmap')">
        <span class="nmap-section-title">ZMap Commands</span>
        <span class="nmap-section-toggle" id="zmap-toggle">▶</span>
      </div>
      <div class="nmap-section-content collapsed" id="zmap-content">
        ${zmapCommands.map((c, i) => `
          <div class="nmap-command">
            <div class="nmap-command-header">
              <span class="nmap-command-title">${c.title}</span>
              <button class="nmap-copy-btn" onclick="copyZmapCmd(${i}); event.stopPropagation();">Copy</button>
            </div>
            <div class="nmap-command-note">${c.note}</div>
            <div class="nmap-command-row">${c.cmd}</div>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="nmap-section">
      <div class="nmap-section-header" onclick="toggleSection('gobuster')">
        <span class="nmap-section-title">Gobuster Commands</span>
        <span class="nmap-section-toggle" id="gobuster-toggle">▶</span>
      </div>
      <div class="nmap-section-content collapsed" id="gobuster-content">
        ${gobusterCommands.map((c, i) => `
          <div class="nmap-command">
            <div class="nmap-command-header">
              <span class="nmap-command-title">${c.title}</span>
              <button class="nmap-copy-btn" onclick="copyGobusterCmd(${i}); event.stopPropagation();">Copy</button>
            </div>
            <div class="nmap-command-note">${c.note}</div>
            <div class="nmap-command-row">${c.cmd}</div>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="nmap-section">
      <div class="nmap-section-header" onclick="toggleSection('httpx')">
        <span class="nmap-section-title">Httpx Commands</span>
        <span class="nmap-section-toggle" id="httpx-toggle">▶</span>
      </div>
      <div class="nmap-section-content collapsed" id="httpx-content">
        ${httpxCommands.map((c, i) => `
          <div class="nmap-command">
            <div class="nmap-command-header">
              <span class="nmap-command-title">${c.title}</span>
              <button class="nmap-copy-btn" onclick="copyHttpxCmd(${i}); event.stopPropagation();">Copy</button>
            </div>
            <div class="nmap-command-note">${c.note}</div>
            <div class="nmap-command-row">${c.cmd}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function toggleSection(type) {
  const content = document.getElementById(`${type}-content`);
  const toggle = document.getElementById(`${type}-toggle`);
  content.classList.toggle('collapsed');
  if (content.classList.contains('collapsed')) {
    toggle.textContent = '▶';
  } else {
    toggle.textContent = '▼';
  }
}

function copyNmapCmd(index) {
  const cmd = document.querySelectorAll('.nmap-section')[0].querySelectorAll('.nmap-command-row')[index].textContent;
  navigator.clipboard.writeText(cmd).then(() => {
    const btn = document.querySelectorAll('.nmap-section')[0].querySelectorAll('.nmap-copy-btn')[index];
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = 'Copy';
      btn.classList.remove('copied');
    }, 1500);
  });
}

function copyMasscanCmd(index) {
  const cmd = document.querySelectorAll('.nmap-section')[1].querySelectorAll('.nmap-command-row')[index].textContent;
  navigator.clipboard.writeText(cmd).then(() => {
    const btn = document.querySelectorAll('.nmap-section')[1].querySelectorAll('.nmap-copy-btn')[index];
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = 'Copy';
      btn.classList.remove('copied');
    }, 1500);
  });
}

function copyNaabuCmd(index) {
  const cmd = document.querySelectorAll('.nmap-section')[2].querySelectorAll('.nmap-command-row')[index].textContent;
  navigator.clipboard.writeText(cmd).then(() => {
    const btn = document.querySelectorAll('.nmap-section')[2].querySelectorAll('.nmap-copy-btn')[index];
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = 'Copy';
      btn.classList.remove('copied');
    }, 1500);
  });
}

function copyRustscanCmd(index) {
  const cmd = document.querySelectorAll('.nmap-section')[3].querySelectorAll('.nmap-command-row')[index].textContent;
  navigator.clipboard.writeText(cmd).then(() => {
    const btn = document.querySelectorAll('.nmap-section')[3].querySelectorAll('.nmap-copy-btn')[index];
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = 'Copy';
      btn.classList.remove('copied');
    }, 1500);
  });
}

function copyZmapCmd(index) {
  const cmd = document.querySelectorAll('.nmap-section')[4].querySelectorAll('.nmap-command-row')[index].textContent;
  navigator.clipboard.writeText(cmd).then(() => {
    const btn = document.querySelectorAll('.nmap-section')[4].querySelectorAll('.nmap-copy-btn')[index];
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = 'Copy';
      btn.classList.remove('copied');
    }, 1500);
  });
}

function copyGobusterCmd(index) {
  const cmd = document.querySelectorAll('.nmap-section')[5].querySelectorAll('.nmap-command-row')[index].textContent;
  navigator.clipboard.writeText(cmd).then(() => {
    const btn = document.querySelectorAll('.nmap-section')[5].querySelectorAll('.nmap-copy-btn')[index];
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = 'Copy';
      btn.classList.remove('copied');
    }, 1500);
  });
}

function copyHttpxCmd(index) {
  const cmd = document.querySelectorAll('.nmap-section')[6].querySelectorAll('.nmap-command-row')[index].textContent;
  navigator.clipboard.writeText(cmd).then(() => {
    const btn = document.querySelectorAll('.nmap-section')[6].querySelectorAll('.nmap-copy-btn')[index];
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = 'Copy';
      btn.classList.remove('copied');
    }, 1500);
  });
}

function closeDownloadModal() {
  document.getElementById('downloadModal').classList.remove('active');
}

document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  document.getElementById('searchBtn').addEventListener('click', () => search(document.getElementById('query').value));
  document.getElementById('query').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      search(document.getElementById('query').value);
    }
  });
  document.getElementById('cancelDownload').addEventListener('click', closeDownloadModal);

  window.addEventListener('online', () => {
    document.getElementById('offlineBadge').classList.remove('active');
  });

  window.addEventListener('offline', () => {
    document.getElementById('offlineBadge').classList.add('active');
  });

  if (navigator.serviceWorker) {
    navigator.serviceWorker.register('sw.js').catch(err => {
      console.log('Service worker registration failed:', err);
    });
  }

  initDatabase();
});
