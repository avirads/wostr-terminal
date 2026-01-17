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

const TURSO_DB_URL = 'https://ip-to-asndb.turso.io';

async function initDatabase() {
  try {
    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@libsql/client@0.6.0/+esm');
    db = createClient({ 
      url: TURSO_DB_URL
    });
    await db.sync();
    document.getElementById('searchBtn').disabled = false;
    showApp();
    setTimeout(initMap, 50);
  } catch (error) {
    console.error('Failed to load database:', error);
    document.getElementById('status').innerHTML = '<p>Failed to load database. Please refresh the page.</p>';
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
    zoom: 2
  });

  const theme = getCurrentTheme();
  const tileLayer = getTileLayerForTheme(theme);
  tileLayer.addTo(map);

  countryLayer = L.layerGroup().addTo(map);

  map.on('zoomend', () => {
    if (map.getZoom() <= 3 && Object.keys(countryCounts).length > 0) {
      displayCountryMarkers();
    }
  });

  loadCountryCounts();
}

async function loadCountryCounts() {
  if (!db) return;

  const result = await db.execute("SELECT country_code, COUNT(*) as count FROM ip_to_asn GROUP BY country_code");

  result.rows.forEach(row => {
    countryCounts[row.country_code] = row.count;
  });

  displayCountryMarkers();
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

async function search(query) {
  if (!db || !query.trim()) return;

  isSearchMode = true;
  currentPage = 1;
  currentResults = [];

  document.getElementById('loading').classList.add('active');
  document.getElementById('results').classList.remove('active');
  document.getElementById('status').innerHTML = '';

  setTimeout(async () => {
    const searchType = detectSearchType(query);
    let results = [];

    switch (searchType) {
      case 'asn':
        results = await searchASN(query);
        break;
      case 'country':
        results = await searchCountry(query);
        break;
      case 'combined':
        results = await searchCombined(query);
        break;
      case 'domain':
        results = await searchDomain(query);
        break;
      case 'network':
        results = await searchNetwork(query);
        break;
      default:
        results = await searchAll(query);
    }

    currentResults = results;
    await displayResults(results);
    updateMapForSearch(results);

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

async function searchAll(keyword) {
  const keywords = keyword.toLowerCase().split(' ').filter(k => k.length > 1);
  const placeholders = keywords.map(() => 'name LIKE ? OR org LIKE ? OR domain LIKE ?').join(' OR ');
  const params = keywords.flatMap(k => [`%${k}%`, `%${k}%`, `%${k}%`]);

  const result = await db.execute({
    sql: `SELECT DISTINCT network, asn, country_code, name, org, domain FROM ip_to_asn WHERE ${placeholders} LIMIT 200`,
    args: params
  });

  const results = result.rows
    .filter(row => row.network && row.network.includes('/'))
    .map(row => ({ network: row.network, asn: row.asn, country_code: row.country_code, name: row.name, org: row.org, domain: row.domain }));

  return shuffleArray(results);
}

async function searchASN(query) {
  const asnNum = query.replace(/as/i, '').trim();
  const result = await db.execute({
    sql: 'SELECT DISTINCT network, asn, country_code, name, org, domain FROM ip_to_asn WHERE asn LIKE ? LIMIT 100',
    args: [`%${asnNum}%`]
  });

  return result.rows
    .filter(row => row.network && row.network.includes('/'))
    .map(row => ({ network: row.network, asn: row.asn, country_code: row.country_code, name: row.name, org: row.org, domain: row.domain }));
}

async function searchCountry(query) {
  let countryCode = query.toUpperCase().trim();

  if (countryCodeMap[query]) {
    countryCode = countryCodeMap[query];
  }

  const result = await db.execute({
    sql: 'SELECT DISTINCT network, asn, country_code, name, org, domain FROM ip_to_asn WHERE country_code = ? LIMIT 200',
    args: [countryCode]
  });

  currentCountry = Object.entries(countryCodeMap).find(([name, code]) => code === countryCode)?.[0] || '';
  currentCountryCode = countryCode;

  const results = result.rows
    .filter(row => row.network && row.network.includes('/'))
    .map(row => ({ network: row.network, asn: row.asn, country_code: row.country_code, name: row.name, org: row.org, domain: row.domain }));

  return shuffleArray(results);
}

async function searchCombined(query) {
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
    const result = await db.execute({
      sql: 'SELECT DISTINCT network, asn, country_code, name, org, domain FROM ip_to_asn WHERE org LIKE ? AND country_code IN (SELECT country_code FROM ip_to_asn WHERE name LIKE ? OR org LIKE ? OR country_code LIKE ?) LIMIT 200',
      args: [`%${org}%`, `%${countryPart}%`, `%${countryPart}%`, `%${countryPart}%`]
    });

    const results = result.rows
      .filter(row => row.network && row.network.includes('/'))
      .map(row => ({ network: row.network, asn: row.asn, country_code: row.country_code, name: row.name, org: row.org, domain: row.domain }));

    return shuffleArray(results);
  }

  const result = await db.execute({
    sql: 'SELECT DISTINCT network, asn, country_code, name, org, domain FROM ip_to_asn WHERE org LIKE ? AND country_code = ? LIMIT 200',
    args: [`%${org}%`, countryCode]
  });

  const results = result.rows
    .filter(row => row.network && row.network.includes('/'))
    .map(row => ({ network: row.network, asn: row.asn, country_code: row.country_code, name: row.name, org: row.org, domain: row.domain }));

  return shuffleArray(results);
}

async function searchDomain(domain) {
  const result = await db.execute({
    sql: 'SELECT DISTINCT network, asn, country_code, name, org, domain FROM ip_to_asn WHERE domain LIKE ? LIMIT 100',
    args: [`%${domain}%`]
  });

  return result.rows
    .filter(row => row.network && row.network.includes('/'))
    .map(row => ({ network: row.network, asn: row.asn, country_code: row.country_code, name: row.name, org: row.org, domain: row.domain }));
}

async function searchNetwork(network) {
  const cleanNetwork = network.trim();
  const result = await db.execute({
    sql: 'SELECT DISTINCT network, asn, country_code, name, org, domain FROM ip_to_asn WHERE network = ? LIMIT 10',
    args: [cleanNetwork]
  });

  return result.rows
    .filter(row => row.network && row.network.includes('/'))
    .map(row => ({ network: row.network, asn: row.asn, country_code: row.country_code, name: row.name, org: row.org, domain: row.domain }));
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function displayResults(results) {
  const resultsList = document.getElementById('resultsList');
  const resultsCount = document.getElementById('resultsCount');

  if (results.length === 0) {
    document.getElementById('status').innerHTML = '<p>No results found. Try a different search term.</p>';
    return;
  }

  resultsCount.textContent = `${results.length.toLocaleString()} results found`;

  const startIndex = (currentPage - 1) * RESULTS_PER_PAGE;
  const endIndex = Math.min(startIndex + RESULTS_PER_PAGE, results.length);
  const pageResults = results.slice(startIndex, endIndex);

  let html = '';

  pageResults.forEach(row => {
    html += `
      <div class="result-card">
        <div class="result-network" onclick="showDownloadModal('${row.network}')">${row.network}</div>
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

  if (currentCountry && (currentCountryCode.length === 2)) {
    const orgs = await getUniqueOrganizations(currentCountryCode);
    if (orgs.length > 0) {
      html += `
        <div class="org-section">
          <div class="org-section-title">Other Organizations in ${currentCountry}</div>
          <div class="org-list">
            ${orgs.map(org => `<span class="org-tag" onclick="copyOrg('${org.replace(/'/g, "\\'")}')" title="Click to copy">${org}</span>`).join('')}
          </div>
        </div>
      `;
    }
  }

  resultsList.innerHTML = html;
  document.getElementById('results').classList.add('active');
}

async function getUniqueOrganizations(countryCode) {
  const result = await db.execute({
    sql: 'SELECT DISTINCT org FROM ip_to_asn WHERE country_code = ? AND org IS NOT NULL AND org != "" ORDER BY org ASC',
    args: [countryCode]
  });

  return result.rows
    .map(row => row.org)
    .filter(org => org && org.trim());
}

function copyOrg(org) {
  navigator.clipboard.writeText(org).then(() => {
    const tags = document.querySelectorAll('.org-tag');
    tags.forEach(tag => {
      if (tag.textContent === org) {
        const originalText = tag.textContent;
        tag.textContent = 'Copied!';
        tag.style.background = '#22c55e';
        setTimeout(() => {
          tag.textContent = originalText;
          tag.style.background = '';
        }, 1500);
      }
    });
  });
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

function updateMapForSearch(results) {
  countryLayer.clearLayers();

  const resultCountries = {};

  results.forEach(row => {
    if (row.country_code) {
      resultCountries[row.country_code] = (resultCountries[row.country_code] || 0) + 1;
    }
  });

  Object.entries(resultCountries).forEach(([code, count]) => {
    if (countryCoords[code]) {
      const theme = getCurrentTheme();
      const colors = getThemeColors(theme);
      const color = count > 0 ? colors.success : colors.default;
      const radius = Math.max(5, Math.min(20, Math.log(count) * 3));

      const circle = L.circleMarker(countryCoords[code], {
        radius: radius,
        fillColor: color,
        color: color,
        weight: 1,
        opacity: 0.8,
        fillOpacity: 0.6
      });

      const countryName = Object.entries(countryCodeMap).find(([name, c]) => c === code)?.[0] || code;

      circle.bindTooltip(
        `<div class="country-tooltip">${countryName} (${code})<br>${count} results</div>`,
        { className: 'country-tooltip' }
      );

      circle.on('click', () => {
        setQuery(countryName);
        search(countryName);
      });

      countryLayer.addLayer(circle);
    }
  });

  if (Object.keys(resultCountries).length > 0) {
    const bounds = Object.entries(resultCountries)
      .filter(([code]) => countryCoords[code])
      .map(([code]) => countryCoords[code]);

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 5 });
    }
  }
}

function showDownloadModal(network) {
  document.getElementById('downloadNetwork').textContent = network;
  document.getElementById('downloadCount').textContent = '999 random IPs will be generated';
  document.getElementById('downloadModal').classList.add('active');
  document.getElementById('downloadProgress').classList.remove('active');
  document.getElementById('confirmDownload').disabled = false;
}

function closeDownloadModal() {
  document.getElementById('downloadModal').classList.remove('active');
}

async function confirmDownload() {
  const network = document.getElementById('downloadNetwork').textContent;
  const progressDiv = document.getElementById('downloadProgress');
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  const confirmBtn = document.getElementById('confirmDownload');

  confirmBtn.disabled = true;
  progressDiv.classList.add('active');
  progressFill.style.width = '0%';
  progressText.textContent = 'Generating IPs...';

  const ips = generateRandomIPs(network, 999);

  progressFill.style.width = '50%';
  progressText.textContent = 'Creating ZIP file...';

  const zip = new JSZip();
  zip.file('ip-addresses.txt', ips.join('\n'));

  progressFill.style.width = '80%';
  progressText.textContent = 'Compressing...';

  const content = await zip.generateAsync({ type: 'blob' });

  progressFill.style.width = '100%';
  progressText.textContent = 'Download starting...';

  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ip-addresses-${network.replace(/\//g, '-')}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  setTimeout(() => {
    closeDownloadModal();
    confirmBtn.disabled = false;
  }, 500);
}

function generateRandomIPs(network, count) {
  const [ip, cidr] = network.split('/');
  const parts = ip.split('.').map(Number);
  const mask = parseInt(cidr);

  const baseIP = (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];
  const numIPs = Math.pow(2, 32 - mask);
  const startIP = baseIP & (~((1 << (32 - mask)) - 1));

  const ips = [];
  for (let i = 0; i < count; i++) {
    const randomOffset = Math.floor(Math.random() * numIPs);
    const ipVal = startIP + randomOffset;

    const a = (ipVal >> 24) & 255;
    const b = (ipVal >> 16) & 255;
    const c = (ipVal >> 8) & 255;
    const d = ipVal & 255;

    ips.push(`${a}.${b}.${c}.${d}`);
  }

  return ips;
}

document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  document.getElementById('searchBtn').addEventListener('click', () => search(document.getElementById('query').value));
  document.getElementById('query').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      search(document.getElementById('query').value);
    }
  });
  document.getElementById('confirmDownload').addEventListener('click', confirmDownload);
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
