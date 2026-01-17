# Prompts Used to Build Worldwide Network Explorer

## Project Overview
Built a Worldwide Network Explorer - a vanilla JS serverless SPA PWA that allows users to search IP network allocations from an IP-to-ASN database.

## Prompts (Chronological)

### 1. Initial App Creation
Build a Worldwide Network Explorer app with:
- IP-to-ASN database (sqlite) with ~1M+ records
- Vanilla JS, serverless, SPA, PWA
- Interactive world map (Leaflet.js) with country click-to-search
- Natural language search: "Google in US", "Netflix in JP", "Hetzner in DE"
- ASN search: "AS13335" or "13335"
- Domain search: "google.com"
- Country search: "networks in US" or "in UK"
- Combined search: "Google in US", "Netflix in JP"
- 100+ example queries
- User guide section with cards
- Results display: network (clickable), ASN, Country, Name, Organization, Domain
- Domain links open in new tab
- IP download feature: Click network -> Generate 999 random IPs -> Download as ZIP (ip-addresses.txt)
- Kaspa wallet authentication: Require positive KAS balance via Kasware extension
- Map display on startup with all countries as circle markers
- Click country -> search for that country
- Countries with results turn green, others blue
- Footer with database status and links to https://x.com/liveonkas and https://t.me/kspr_home_bot

### 2. Map Bug Fix
Fix bug: In app.js, the map's mouseout event handler references 'countryCounts' variable which is not in scope. Fix by either making countryCounts global or storing result counts on the circle markers themselves.

### 3. Tooltip Fix
Fix error: "circle.setTooltip is not a function" - CircleMarker uses bindTooltip but doesn't have a setTooltip method. Update to use getTooltip().setContent() instead.

### 4. Footer Status and Links
- "✓ Database loaded - 1,254,989 records ready for search" should always appear at the bottom of the page
- Add footer section with links to https://x.com/liveonkas and https://t.me/kspr_home_bot

### 5. Remove Map Header
Remove the header section that has "Results Map" and "Hide Map" button. Keep the map visible at all times.

### 6. Logo Link
Make the header image open https://x.com/liveonkas in new tab.

### 7. Combined Searches - Single Example per Country
The combined searches section should contain only one example per country and the full name of the country should be visible instead of just country code.

### 8. Remove Loading Message
Remove "Loading database..." from the status div.

### 9. Unique Companies per Country
In the combined searches examples instead of Google, use a unique company that exists in that country as example.

### 10. Organizations Section
In the search results for a specific country, also list all the other possible organizations in that country and provide a link for their searches as well.

### 11. Filter Results and Randomize
- Do not show results for records with no IP's available in this range
- Show unique organization names
- Randomize the order of results

### 12. Add Pagination
Implement pagination for search results (20 results per page).

### 13. KRC20 Token Authentication
- Change wallet authentication to check for positive KRC20 LIVE tokens instead of positive KAS balance
- Do not show the balance amount
- Update wallet modal text accordingly

### 14. Remove "networks in" Prefix
Remove "networks in" prefix from All Countries section examples.

### 15. Organization-Only Search for Combined Queries
When combined searches are used (e.g., "TotalEnergies in France"), the filter should only search the organization field, not name or domain. This ensures results are specifically from that organization, not organizations that happen to mention the keyword.

### 16. Keyword Fix for Combined Searches
Fix issue: "TotalEnergies in France" was matching "Hewlett Packard France S.A.S." because "France" was being added to keywords. Ensure country names are excluded from keywords in combined searches.

### 17. Organizations Section for All Country Searches
When a search by country is made, create another search results section which contains only the names of the unique organizations in that country, with links for their searches. This should apply to all country searches (both pure country searches and combined searches like "TotalEnergies in France").

### 18. Validate Organization Links
Do not show result links for organizations that will have no results records. Only show links for organizations that actually exist in the database with valid IP ranges.

### 19. Change Pagination to 10 Results
Change pagination from 20 to 10 results per page.

### 20. Add Buy Links to Insufficient Balance Error
When "Insufficient balance" message is shown, also link to top places where KAS tokens can be purchased. Links should open in new tab.

### 21. Revert to KAS Balance Authentication
Change authentication logic back to check for positive KAS balance instead of KRC20 LIVE tokens. Update error messages and modal text accordingly.

