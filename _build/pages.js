// Page templates
const { SITE, ZONES, CITIES, BLOG_POSTS } = require('./data');
const { head, urgency, topNav, form, ticker, footer, mobileCta, script } = require('./components');

// ========== SHARED FAQS ==========
const nationalFaqs = [
  { q: 'Er det gratis at få 3 tilbud via NytTagTilbud.com?', a: 'Ja, 100% gratis og uforpligtende. Du modtager op til 3 tilbud fra lokale taglæggere uden nogen form for binding eller betaling.' },
  { q: 'Hvor hurtigt får jeg svar?', a: 'De fleste boligejere modtager første tilbud inden for 2 timer på hverdage. Alle tre tilbud kommer typisk ind inden for 48 timer.' },
  { q: 'Hvad koster et nyt tag gennemsnitligt i Danmark?', a: 'Et nyt tag i 2026 koster typisk 120.000–280.000 kr. for et parcelhus på 120-140 m². Prisen afhænger af tagtype, materiale, tagareal og husets geometri.' },
  { q: 'Hvem er taglæggerne bag NytTagTilbud.com?', a: 'Vi samarbejder udelukkende med godkendte danske taglæggere, som er CVR-registrerede og har relevante certificeringer. Hver zone har maksimalt 3 taglæggere for at sikre kvalitet.' },
  { q: 'Hvordan håndterer I mine oplysninger?', a: 'Dine oplysninger deles kun med op til 3 udvalgte lokale taglæggere i din zone. Vi sælger aldrig data videre og bruger ikke oplysningerne til markedsføring uden samtykke.' },
  { q: 'Skal jeg bruge det tilbud jeg får?', a: 'Nej. Du er 100% fri til at vælge et af tilbuddene, alle tre, eller ingen af dem. Du kan også bruge tilbuddene som reference, hvis du allerede har egne priser.' },
];

const zoneFaqs = (zone) => [
  { q: `Hvad koster et nyt tag i ${zone.name}?`, a: `Et nyt tag i ${zone.name} koster typisk ${zone.priceRange} kr. afhængigt af tagareal, materiale og husets geometri. Gennemsnittet for et almindeligt parcelhus ligger omkring ${zone.avgJob} kr.` },
  { q: `Hvor mange tilbud får jeg i ${zone.name}?`, a: `Du modtager op til 3 tilbud fra godkendte lokale taglæggere i ${zone.name}-området. Alle tilbud er gratis og uforpligtende.` },
  { q: `Er taglæggerne lokale for ${zone.name}?`, a: `Ja. Vi samarbejder kun med taglæggere, der aktivt arbejder i ${zone.name} og har kendskab til lokale bygningsforhold, materialer og vejrklima.` },
  { q: `Hvor hurtigt kan arbejdet starte i ${zone.name}?`, a: `Det afhænger af årstid og belægning, men typisk 2-6 uger i sommerhalvåret og 1-3 uger i vinterhalvåret. Akutte reparationer kan ofte klares inden for få dage.` },
  { q: `Er det gratis at få tilbud i ${zone.name}?`, a: `Ja, 100% gratis og uforpligtende. Du betaler intet for at modtage de 3 tilbud — kun hvis du vælger at få arbejdet udført.` },
];

const cityFaqs = (city, zone) => [
  { q: `Hvad koster et nyt tag i ${city.name}?`, a: `Priserne i ${city.name} (${city.postcode}) ligger typisk i samme interval som det øvrige ${zone.name}-område: ${zone.priceRange} kr. Det konkrete tilbud afhænger af din boligs størrelse, tagtype og materialevalg.` },
  { q: `Hvor mange taglæggere dækker ${city.name}?`, a: `Vi samarbejder med op til 3 lokale taglæggere i ${zone.name}-zonen, som alle dækker ${city.name} og omegn (postnummer ${city.postcode}).` },
  { q: `Hvor hurtigt kan jeg få svar i ${city.name}?`, a: `De fleste boligejere i ${city.name} modtager det første tilbud inden for 2 timer på hverdage og alle 3 tilbud inden for 48 timer.` },
];

// ========== SCHEMAS ==========
const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE.name,
  url: SITE.domain,
  email: SITE.email,
  vatID: `DK${SITE.cvr}`,
  address: { '@type': 'PostalAddress', addressCountry: 'DK' },
  aggregateRating: { '@type': 'AggregateRating', ratingValue: SITE.trustpilotRating, reviewCount: SITE.trustpilotCount, bestRating: '5' },
};

function serviceSchema(zoneName, url) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Nyt Tag Tilbud ${zoneName}`,
    provider: {
      '@type': 'Organization', name: SITE.name, url: SITE.domain,
      vatID: `DK${SITE.cvr}`, email: SITE.email,
    },
    areaServed: { '@type': 'City', name: zoneName },
    description: `Gratis tilbud på nyt tag fra godkendte lokale taglæggere i ${zoneName}`,
    url: url,
    aggregateRating: { '@type': 'AggregateRating', ratingValue: SITE.trustpilotRating, reviewCount: SITE.trustpilotCount, bestRating: '5' },
  };
}

function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
  };
}

function articleSchema(post) {
  return {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: post.title, description: post.desc,
    author: { '@type': 'Organization', name: SITE.name },
    publisher: { '@type': 'Organization', name: SITE.name, url: SITE.domain },
    datePublished: '2026-04-01', dateModified: SITE.buildDate,
    mainEntityOfPage: `${SITE.domain}/blog/${post.slug}`,
  };
}

// ========== SECTIONS ==========
function faqSection(faqs, bg = 'faq') {
  return `<section class="${bg}">
  <div class="container">
    <div class="sec-head">
      <span class="sec-label">FAQ</span>
      <h2>Ofte stillede spørgsmål</h2>
      <p>Alt du har brug for at vide — og lidt til.</p>
    </div>
    <div class="faq-list">
      ${faqs.map(f => `<details class="faq-item"><summary>${f.q}</summary><p>${f.a}</p></details>`).join('')}
    </div>
  </div>
</section>`;
}

function stepsSection() {
  return `<section class="steps">
  <div class="container">
    <div class="sec-head">
      <span class="sec-label">Sådan virker det</span>
      <h2>Fra formular til 3 tilbud på under 2 timer</h2>
      <p>Ingen bindinger. Ingen gebyrer. 100% gratis og uforpligtende — lige meget hvor i Danmark du bor.</p>
    </div>
    <div class="steps-grid">
      <div class="step"><div class="step-num">1</div><h3>Udfyld formularen</h3><p>Fortæl os kort om din bolig, tagprojekt og kontaktoplysninger. Det tager cirka 2 minutter og foregår 100% online.</p></div>
      <div class="step"><div class="step-num">2</div><h3>Modtag 3 tilbud</h3><p>Vi matcher dig med op til 3 godkendte lokale taglæggere i din zone. Første tilbud ankommer typisk inden for 2 timer.</p></div>
      <div class="step"><div class="step-num">3</div><h3>Vælg det rigtige</h3><p>Sammenlign tilbud, materialer og leveringstid. Vælg det tilbud der passer bedst — eller ingen af dem. Ingen bindinger.</p></div>
    </div>
  </div>
</section>`;
}

function pricingSection() {
  return `<section class="pricing" id="priser">
  <div class="container">
    <div class="sec-head">
      <span class="sec-label">Priser 2026</span>
      <h2>Hvad koster et nyt tag i 2026?</h2>
      <p>Indikative priser per m² inklusive materialer, arbejdsløn, nedrivning, undertag og bortskaffelse. Oplys altid tagareal for at få præcise tilbud.</p>
    </div>
    <div class="price-table-wrap">
      <table class="price-table">
        <thead><tr><th>Tagtype</th><th>Pris per m²</th><th>Typisk total (130 m²)</th><th>Levetid</th></tr></thead>
        <tbody>
          <tr><td><b>Tegltag (traditionelt)</b><br><span style="font-size:12px;color:var(--muted)">Brændte lertegl, klassisk</span></td><td>950–1.400 kr.</td><td>145.000–230.000 kr.</td><td class="lifetime">60-80 år</td></tr>
          <tr><td><b>Betontagsten</b><br><span style="font-size:12px;color:var(--muted)">Monier, Benders</span></td><td>750–1.100 kr.</td><td>115.000–180.000 kr.</td><td class="lifetime">40-60 år</td></tr>
          <tr><td><b>Stålpladetag</b><br><span style="font-size:12px;color:var(--muted)">Klik eller profil</span></td><td>650–1.050 kr.</td><td>100.000–170.000 kr.</td><td class="lifetime">50+ år</td></tr>
          <tr><td><b>Eternit (uden asbest)</b><br><span style="font-size:12px;color:var(--muted)">Moderne skiferplader</span></td><td>700–1.000 kr.</td><td>110.000–165.000 kr.</td><td class="lifetime">30-50 år</td></tr>
          <tr><td><b>Tagpap (fladt tag)</b><br><span style="font-size:12px;color:var(--muted)">SBS, 2-lags</span></td><td>550–850 kr.</td><td>85.000–140.000 kr.</td><td class="lifetime">25-40 år</td></tr>
          <tr><td><b>Naturskifer (premium)</b><br><span style="font-size:12px;color:var(--muted)">Walisisk / spansk</span></td><td>1.800–2.800 kr.</td><td>270.000–430.000 kr.</td><td class="lifetime">100+ år</td></tr>
          <tr><td><b>Asbestnedrivning</b><br><span style="font-size:12px;color:var(--muted)">Bølgeeternit, tillæg</span></td><td>+180–320 kr.</td><td>+25.000–45.000 kr.</td><td class="lifetime">Obligatorisk</td></tr>
        </tbody>
      </table>
    </div>
    <p style="text-align:center;margin-top:24px;color:var(--muted);font-size:13px;font-family:'Space Mono',monospace">Alle priser er indikative — præcise tilbud kræver opmåling af tagareal og inspektion.</p>
  </div>
</section>`;
}

function zoneGridSection(currentSlug = '') {
  return `<section class="zones" id="zoner">
  <div class="container">
    <div class="sec-head">
      <span class="sec-label">15 zoner · Hele Danmark</span>
      <h2>Vælg din zone — <em>få lokale tilbud</em></h2>
      <p>Vi matcher dig med op til 3 taglæggere i din zone. Hver zone har maksimalt 3 godkendte taglæggere for at sikre kvalitet og eksklusivitet.</p>
    </div>
    <div class="zone-grid">
      ${ZONES.map(z => {
        const full = z.spots === 0;
        const spotText = full ? 'Fuldt booket' : `${z.spots} plads${z.spots === 1 ? '' : 'er'} tilbage`;
        const active = z.slug === currentSlug ? ' style="border-color:var(--gold2)"' : '';
        return `<a href="/${z.slug}" class="zone-card"${active}>
          <div class="zn-num">Zone ${z.num}</div>
          <h3>${z.name}</h3>
          <div class="zn-cities">${z.cities.slice(0, 3).join(' · ')}</div>
          <div class="zn-spots ${full ? 'full' : ''}"><span class="dot"></span>${spotText}</div>
        </a>`;
      }).join('')}
    </div>
  </div>
</section>`;
}

function proofSection() {
  return `<section class="proof">
  <div class="container">
    <div class="sec-head">
      <span class="sec-label">Verificeret på Trustpilot</span>
      <h2>Hvad siger kunderne?</h2>
      <p>${SITE.trustpilotRating} stjerner baseret på ${SITE.trustpilotCount} uopfordrede anmeldelser. Alle citater herunder er verbatim fra Trustpilot.</p>
    </div>
    <div class="reviews-grid">
      <div class="review">
        <div class="review-stars">★★★★★</div>
        <p class="review-text">"Brugte NytTagTilbud.com da vores tag begyndte at lække. Fik hurtigt kontakt fra tre taglæggere i området og endte med et tilbud der lå 40.000 under hvad jeg selv havde indhentet. Kan klart anbefales."</p>
        <div class="review-meta"><span class="review-name">Michael Oxholm Johansen</span><span class="review-date">2. apr 2026</span></div>
      </div>
      <div class="review">
        <div class="review-stars">★★★★★</div>
        <p class="review-text">"Super nem proces. Udfyldte formularen på under 2 minutter og blev ringet op samme eftermiddag. Professionelt og hurtigt."</p>
        <div class="review-meta"><span class="review-name">Matilde</span><span class="review-date">13. mar 2026</span></div>
      </div>
      <div class="review">
        <div class="review-stars">★★★★<span style="color:var(--border)">★</span></div>
        <p class="review-text">"Var skeptisk i starten, men det er faktisk gratis som de siger. Tre tilbud i hånden uden at løbe rundt og kontakte taglæggere selv. Siger sig selv at det er smart."</p>
        <div class="review-meta"><span class="review-name">Nanna Johansen</span><span class="review-date">2. apr 2026</span></div>
      </div>
    </div>
    <div style="text-align:center">
      <a href="${SITE.trustpilotUrl}" rel="nofollow" class="tp-badge"><b>${SITE.trustpilotRating} ★</b> baseret på ${SITE.trustpilotCount} anmeldelser på Trustpilot</a>
    </div>
  </div>
</section>`;
}

function ctaBand() {
  return `<section class="cta-band">
  <div class="container">
    <h2>Klar til at spare <em>op til 40.000 kr.</em> på dit nye tag?</h2>
    <p>Udfyld formularen nu og modtag 3 gratis tilbud fra godkendte lokale taglæggere inden for 2 timer.</p>
    <a href="#tilbud" class="cta-btn">Start formularen →</a>
  </div>
</section>`;
}

// ========== HOME PAGE ==========
function home() {
  const schemas = [
    orgSchema,
    serviceSchema('Danmark', SITE.domain),
    faqSchema(nationalFaqs),
  ];
  return `${head({
    title: 'NytTagTilbud.com — 3 Gratis Tilbud på Nyt Tag i Hele Danmark',
    desc: 'Få 3 gratis og uforpligtende tilbud på nyt tag fra godkendte lokale taglæggere i hele Danmark. Spar op til 40.000 kr. Svar inden 2 timer.',
    canonical: SITE.domain + '/',
    schemas,
  })}
${urgency()}
${topNav()}
<header class="hero">
  <div class="container">
    <div class="hero-grid">
      <div>
        <div class="hero-badge">📋 Opdateret ${SITE.lastUpdated}</div>
        <h1>Få 3 gratis tilbud på <em>nyt tag</em> fra godkendte fagfolk</h1>
        <p class="sub">NytTagTilbud.com matcher dig med op til 3 godkendte lokale taglæggere — 100% gratis og uforpligtende. Svar inden 2 timer på hverdage.</p>
        <div class="hero-stats">
          <div class="hero-stat"><b>3.200+</b><span>Boligejere hjulpet</span></div>
          <div class="hero-stat"><b>2 timer</b><span>Typisk svartid</span></div>
          <div class="hero-stat"><b>40.000 kr</b><span>Gns. besparelse</span></div>
          <div class="hero-stat"><b>15</b><span>Danske zoner</span></div>
        </div>
        <div class="hero-trust"><span class="tp-stars">★★★★<span style="color:rgba(255,255,255,.25)">★</span></span> ${SITE.trustpilotRating}/5 på Trustpilot · ${SITE.trustpilotCount} uopfordrede anmeldelser</div>
      </div>
      ${form({ zone: 'national' })}
    </div>
  </div>
</header>
${ticker()}
${stepsSection()}
${pricingSection()}
${zoneGridSection()}
${proofSection()}
${faqSection(nationalFaqs)}
${ctaBand()}
${footer()}
${mobileCta()}
${script()}
</body>
</html>`;
}

// ========== ZONE PAGE ==========
function zonePage(zone) {
  const url = `${SITE.domain}/${zone.slug}`;
  const nearby = ZONES.filter(z => z.slug !== zone.slug).slice(0, 4);
  const zoneCities = CITIES.filter(c => c.zone === zone.slug);
  const breadcrumb = [
    { name: 'NytTagTilbud.com', url: SITE.domain },
    { name: zone.name, url },
  ];
  const faqs = zoneFaqs(zone);
  const schemas = [
    orgSchema,
    serviceSchema(zone.name, url),
    faqSchema(faqs),
    breadcrumbSchema(breadcrumb),
  ];

  return `${head({ title: zone.title, desc: zone.desc, canonical: url, schemas })}
${urgency()}
${topNav()}
<div class="crumb"><div class="container"><ol><li><a href="/">NytTagTilbud.com</a></li><li>${zone.name}</li></ol></div></div>
<header class="hero">
  <div class="container">
    <div class="hero-grid">
      <div>
        <div class="hero-badge">Zone ${zone.num} · Opdateret ${SITE.lastUpdated}</div>
        <h1>${zone.h1}</h1>
        <p class="sub">${zone.heroSub}</p>
        <div class="hero-stats">
          <div class="hero-stat"><b>${zone.priceRange.split('–')[0]} kr</b><span>Startpris i ${zone.name}</span></div>
          <div class="hero-stat"><b>${zone.avgJob} kr</b><span>Gns. tag i ${zone.name}</span></div>
          <div class="hero-stat"><b>2 timer</b><span>Svartid</span></div>
          <div class="hero-stat"><b>${zone.spots || 'Få'}</b><span>Pladser tilbage</span></div>
        </div>
        <div class="hero-trust"><span class="tp-stars">★★★★<span style="color:rgba(255,255,255,.25)">★</span></span> ${SITE.trustpilotRating}/5 på Trustpilot · ${SITE.trustpilotCount} uopfordrede anmeldelser</div>
      </div>
      ${form({ zone: zone.slug })}
    </div>
  </div>
</header>
${ticker()}
<section class="local">
  <div class="container">
    <div class="local-grid">
      <div class="local-intro">
        <span class="sec-label">${zone.name}</span>
        <h2>Nyt tag i ${zone.name}</h2>
        <p>${zone.intro}</p>
        <p>${zone.intro2}</p>
        ${zoneCities.length ? `<h3 style="font-size:22px;margin:30px 0 14px">Byer vi dækker i ${zone.name}</h3>
        <div class="city-grid">
          ${zoneCities.map(c => `<a href="/${zone.slug}/${c.slug}" class="city-card"><h3>${c.name}</h3><div class="pc">Postnummer ${c.postcode}</div><div class="arrow">Se tilbud →</div></a>`).join('')}
        </div>` : ''}
      </div>
      <aside>
        <div class="local-box">
          <h3>Priser i ${zone.name}</h3>
          <div class="price-row"><span>Tegltag</span><b>${zone.priceRange.split('–')[0]}–${zone.priceRange.split('–')[1]} kr.</b></div>
          <div class="price-row"><span>Betontagsten</span><b>${Math.round(parseInt(zone.priceRange.split('–')[0].replace('.',''))*0.85/1000)}k–${Math.round(parseInt(zone.priceRange.split('–')[1].replace('.',''))*0.85/1000)}k kr.</b></div>
          <div class="price-row"><span>Stålpladetag</span><b>${Math.round(parseInt(zone.priceRange.split('–')[0].replace('.',''))*0.75/1000)}k–${Math.round(parseInt(zone.priceRange.split('–')[1].replace('.',''))*0.75/1000)}k kr.</b></div>
          <div class="price-row"><span>Eternit (uden asbest)</span><b>${Math.round(parseInt(zone.priceRange.split('–')[0].replace('.',''))*0.80/1000)}k–${Math.round(parseInt(zone.priceRange.split('–')[1].replace('.',''))*0.80/1000)}k kr.</b></div>
          <div class="price-row"><span>Asbest nedrivning</span><b>+25.000–45.000 kr.</b></div>
          <h3 style="font-size:14px;margin-top:22px;font-family:'Outfit',sans-serif;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--muted)">Postnumre vi dækker</h3>
          <div class="postcode-list">
            ${zone.postcodes.map(p => `<span class="postcode">${p}</span>`).join('')}
          </div>
          <a href="#tilbud" style="display:block;background:var(--ink);color:#fff;text-align:center;padding:14px;border-radius:10px;font-weight:700;margin-top:22px">Få 3 gratis tilbud →</a>
        </div>
      </aside>
    </div>
  </div>
</section>
${pricingSection()}
${zoneGridSection(zone.slug)}
<div class="nearby"><div class="container">
  <h3>Nabozoner</h3>
  <div class="nearby-list">
    ${nearby.map(z => `<a href="/${z.slug}">Nyt tag ${z.name} →</a>`).join('')}
  </div>
</div></div>
${proofSection()}
${faqSection(faqs)}
${ctaBand()}
${footer()}
${mobileCta()}
${script()}
</body>
</html>`;
}

// ========== CITY PAGE ==========
function cityPage(city) {
  const zone = ZONES.find(z => z.slug === city.zone);
  const url = `${SITE.domain}/${zone.slug}/${city.slug}`;
  const breadcrumb = [
    { name: 'NytTagTilbud.com', url: SITE.domain },
    { name: zone.name, url: `${SITE.domain}/${zone.slug}` },
    { name: city.name, url },
  ];
  const faqs = cityFaqs(city, zone);
  const otherCities = CITIES.filter(c => c.zone === city.zone && c.slug !== city.slug);
  const title = `Nyt Tag Tilbud ${city.name} — Gratis Lokale Taglæggere`;
  const desc = `Få 3 gratis tilbud på nyt tag i ${city.name} (${city.postcode}). Godkendte lokale taglæggere. Spar op til 35.000 kr. Svar inden 2 timer.`;

  const schemas = [
    orgSchema,
    serviceSchema(city.name, url),
    faqSchema(faqs),
    breadcrumbSchema(breadcrumb),
  ];

  return `${head({ title, desc, canonical: url, schemas })}
${urgency()}
${topNav()}
<div class="crumb"><div class="container"><ol><li><a href="/">NytTagTilbud.com</a></li><li><a href="/${zone.slug}">${zone.name}</a></li><li>${city.name}</li></ol></div></div>
<header class="hero">
  <div class="container">
    <div class="hero-grid">
      <div>
        <div class="hero-badge">${city.name} · ${city.postcode} · Opdateret ${SITE.lastUpdated}</div>
        <h1>Nyt tag tilbud ${city.name} — <em>3 gratis tilbud</em></h1>
        <p class="sub">Få 3 gratis og uforpligtende tilbud fra godkendte lokale taglæggere i ${city.name} (postnummer ${city.postcode}).</p>
        <div class="hero-stats">
          <div class="hero-stat"><b>${city.postcode}</b><span>${city.name}</span></div>
          <div class="hero-stat"><b>${zone.avgJob} kr</b><span>Gennemsnitligt tag</span></div>
          <div class="hero-stat"><b>2 timer</b><span>Svartid</span></div>
          <div class="hero-stat"><b>3</b><span>Lokale taglæggere</span></div>
        </div>
        <div class="hero-trust"><span class="tp-stars">★★★★<span style="color:rgba(255,255,255,.25)">★</span></span> ${SITE.trustpilotRating}/5 på Trustpilot</div>
      </div>
      ${form({ zone: zone.slug })}
    </div>
  </div>
</header>
${ticker()}
<section class="local">
  <div class="container">
    <div class="local-grid">
      <div class="local-intro">
        <span class="sec-label">${city.name} · ${city.postcode}</span>
        <h2>Nyt tag i ${city.name}</h2>
        <p>${city.intro}</p>
        <p>${city.intro2}</p>
        ${otherCities.length ? `<h3 style="font-size:20px;margin:30px 0 14px">Andre byer i ${zone.name}</h3>
        <div class="city-grid">
          ${otherCities.map(c => `<a href="/${zone.slug}/${c.slug}" class="city-card"><h3>${c.name}</h3><div class="pc">Postnummer ${c.postcode}</div><div class="arrow">Se tilbud →</div></a>`).join('')}
        </div>` : ''}
      </div>
      <aside>
        <div class="local-box">
          <h3>${city.name} · ${city.postcode}</h3>
          <div class="price-row"><span>Gns. tagjob</span><b>${zone.avgJob} kr.</b></div>
          <div class="price-row"><span>Prisinterval</span><b>${zone.priceRange} kr.</b></div>
          <div class="price-row"><span>Postnummer</span><b>${city.postcode}</b></div>
          <div class="price-row"><span>Zone</span><b><a href="/${zone.slug}" style="color:var(--gold)">${zone.name}</a></b></div>
          <a href="#tilbud" style="display:block;background:var(--ink);color:#fff;text-align:center;padding:14px;border-radius:10px;font-weight:700;margin-top:22px">Få 3 gratis tilbud →</a>
          <p style="text-align:center;margin-top:12px;font-size:12px;color:var(--muted);font-family:'Space Mono',monospace">← Tilbage til <a href="/${zone.slug}" style="color:var(--gold)">${zone.name} oversigt</a></p>
        </div>
      </aside>
    </div>
  </div>
</section>
${pricingSection()}
${faqSection(faqs)}
${ctaBand()}
${footer()}
${mobileCta()}
${script()}
</body>
</html>`;
}

// ========== BLOG INDEX ==========
function blogIndex() {
  const url = `${SITE.domain}/blog`;
  const schemas = [orgSchema, breadcrumbSchema([{ name: 'NytTagTilbud.com', url: SITE.domain }, { name: 'Blog', url }])];

  return `${head({
    title: 'Blog — Guides, Priser og Tips til Nyt Tag 2026',
    desc: 'Læs de nyeste guides om priser på nyt tag, asbest regler, tegl vs. beton, tilskud og hvornår dit tag skal skiftes. Opdateret 2026.',
    canonical: url, schemas,
  })}
${urgency()}
${topNav()}
<div class="crumb"><div class="container"><ol><li><a href="/">NytTagTilbud.com</a></li><li>Blog</li></ol></div></div>
<header class="blog-hero">
  <div class="container">
    <div class="badge">Blog · Opdateret ${SITE.lastUpdated}</div>
    <h1>Guides og prisviden om <em style="color:var(--gold2);font-style:normal">nyt tag</em></h1>
    <p class="lead">Alt du behøver at vide om priser, materialer, regler og besparelsesmuligheder. Skrevet af eksperter — opdateret løbende.</p>
  </div>
</header>
<section class="article">
  <div class="container">
    <div class="blog-grid">
      ${BLOG_POSTS.map(p => `<a href="/blog/${p.slug}" class="blog-card">
        <div class="cat">${p.keyword}</div>
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        <div class="read">${p.readTime} →</div>
      </a>`).join('')}
    </div>
  </div>
</section>
${ctaBand()}
${footer()}
${mobileCta()}
${script()}
</body>
</html>`;
}

module.exports = {
  home, zonePage, cityPage, blogIndex,
  orgSchema, serviceSchema, faqSchema, breadcrumbSchema, articleSchema,
  nationalFaqs, zoneFaqs, cityFaqs,
  faqSection, pricingSection, zoneGridSection, proofSection, stepsSection, ctaBand,
};
