// Page templates
const { SITE, ZONES, KOMMUNER, BLOG_POSTS } = require('./data');
const { head, urgency, topNav, form, ticker, footer, mobileCta, script, cookieBanner, exitIntent, guarantee } = require('./components');

// ========== SHARED FAQS ==========
const nationalFaqs = [
  { q: 'Er det gratis at få 3 tilbud via NytTagTilbud.com?', a: 'Ja, 100% gratis og uforpligtende. Du modtager op til 3 tilbud fra lokale taglæggere uden nogen form for binding eller betaling.' },
  { q: 'Hvor hurtigt får jeg svar?', a: 'De fleste boligejere modtager første tilbud inden for 2 timer på hverdage kl. 8–17. Forespørgsler udenfor arbejdstiden besvares næste hverdag. Alle tre tilbud kommer typisk ind inden for 48 timer.' },
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
  { q: `Hvor hurtigt kan jeg få svar i ${city.name}?`, a: `De fleste boligejere i ${city.name} modtager det første tilbud inden for 2 timer på hverdage kl. 8–17. Forespørgsler udenfor arbejdstiden besvares næste hverdag.` },
];

const kommuneFaqs = (kommune, zone) => [
  { q: `Hvad koster et nyt tag i ${kommune.name}?`, a: `Et nyt tag i ${kommune.name} Kommune koster typisk ${zone.priceRange} kr. for et gennemsnitligt parcelhus. Prisen afhænger af tagtype, tagareal og eventuel asbestfjernelse. Gennemsnittet i ${zone.name}-zonen er ca. ${zone.avgJob} kr.` },
  { q: `Hvor lang tid tager det at få nyt tag i ${kommune.name}?`, a: `Du modtager svar inden 2 timer på hverdage kl. 8–17. Forespørgsler udenfor arbejdstiden besvares næste hverdag. Selve tagarbejdet tager typisk 3-7 hverdage afhængigt af projektets størrelse.` },
  { q: `Er det gratis at få tilbud via NytTagTilbud.com i ${kommune.name}?`, a: `Ja, det er 100% gratis og uforpligtende at modtage 3 tilbud fra godkendte taglæggere i ${zone.name}-zonen. Du betaler ingenting og er ikke forpligtet til at vælge nogen af tilbuddene.` },
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
          <div class="zn-cities">${(z.kommuner||z.cities).slice(0, 4).join(' · ')}</div>
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
    <p>Udfyld formularen nu og modtag 3 gratis tilbud fra godkendte lokale taglæggere. Svar inden 2 timer på hverdage kl. 8–17.</p>
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
          <div class="hero-stat"><b>4.0★</b><span>Trustpilot verificeret</span></div>
          <div class="hero-stat"><b>15</b><span>Zoner i hele Danmark</span></div>
          <div class="hero-stat"><b>40.000 kr</b><span>Gns. besparelse</span></div>
          <div class="hero-stat"><b>100%</b><span>Gratis og uforpligtende</span></div>
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
${guarantee()}
${ctaBand()}
${footer()}
${mobileCta()}
${cookieBanner()}
${exitIntent()}
${script()}
</body>
</html>`;
}

// ========== ZONE PAGE ==========
function zonePage(zone) {
  const url = `${SITE.domain}/${zone.slug}`;
  const nearby = ZONES.filter(z => z.slug !== zone.slug).slice(0, 4);
  const zoneKommuner = KOMMUNER.filter(c => c.zone === zone.slug);
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
        ${zoneKommuner.length ? `<h3 style="font-size:22px;margin:30px 0 14px">Kommuner i ${zone.name}</h3>
        <div class="kommune-grid">
          ${zoneKommuner.map(c => `<a href="/${zone.slug}/${c.slug}" class="city-card"><h3>${c.name} Kommune</h3><div class="arrow">Se tilbud →</div></a>`).join('')}
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
${guarantee()}
${ctaBand()}
${footer()}
${mobileCta()}
${cookieBanner()}
${exitIntent()}
${script()}
</body>
</html>`;
}

// ========== KOMMUNE PAGE ==========
function kommunePage(kommune) {
  var zone = ZONES.find(function(z){ return z.slug === kommune.zone; });
  var url = SITE.domain + '/' + zone.slug + '/' + kommune.slug;
  var breadcrumb = [
    { name: 'NytTagTilbud.com', url: SITE.domain },
    { name: zone.name, url: SITE.domain + '/' + zone.slug },
    { name: kommune.name, url: url },
  ];
  var faqs = kommuneFaqs(kommune, zone);
  var otherKommuner = KOMMUNER.filter(function(c){ return c.zone === kommune.zone && c.slug !== kommune.slug; });
  var title = 'Nyt Tag Tilbud ' + kommune.name + ' — 3 Gratis Tilbud';
  var desc = 'Få 3 gratis tilbud på nyt tag i ' + kommune.name + ' Kommune. Godkendte lokale taglæggere i ' + zone.name + '-zonen. Svar inden 2 timer på hverdage kl. 8–17.';

  var schemas = [
    orgSchema,
    serviceSchema(kommune.name, url),
    faqSchema(faqs),
    breadcrumbSchema(breadcrumb),
  ];

  var intro1 = kommune.name + ' Kommune hører til ' + zone.name + '-zonen og har en blandet boligmasse med både parcelhuse, rækkehuse og ældre villaer. Mange tage i kommunen er mellem 30 og 50 år gamle og nærmer sig naturlig udskiftning. Ved at sammenligne 3 tilbud fra godkendte lokale taglæggere kan du sikre dig den bedste pris og kvalitet.';
  var intro2 = 'Priserne for nyt tag i ' + kommune.name + ' ligger typisk i intervallet ' + zone.priceRange + ' kr., afhængigt af tagtype, størrelse og kompleksitet. Den gennemsnitlige pris for et tagprojekt i ' + zone.name + '-området er ca. ' + zone.avgJob + ' kr. Ved at sammenligne tilbud kan du spare op til 40.000 kr.';

  var otherHtml = '';
  if (otherKommuner.length) {
    otherHtml = '<h3 style="font-size:20px;margin:30px 0 14px">Andre kommuner i ' + zone.name + '</h3><div class="kommune-grid">';
    otherKommuner.forEach(function(c) {
      otherHtml += '<a href="/' + zone.slug + '/' + c.slug + '" class="city-card"><h3>' + c.name + '</h3><div class="arrow">Se tilbud →</div></a>';
    });
    otherHtml += '</div>';
  }

  return head({ title: title, desc: desc, canonical: url, schemas: schemas })
+ urgency()
+ topNav()
+ '<div class="crumb"><div class="container"><ol><li><a href="/">NytTagTilbud.com</a></li><li><a href="/' + zone.slug + '">' + zone.name + '</a></li><li>' + kommune.name + '</li></ol></div></div>'
+ '<header class="hero"><div class="container"><div class="hero-grid"><div>'
+ '<div class="hero-badge">' + kommune.name + ' Kommune · Zone ' + zone.num + ' · Opdateret ' + SITE.lastUpdated + '</div>'
+ '<h1>Nyt tag tilbud i ' + kommune.name + ' — <em>3 gratis tilbud</em></h1>'
+ '<span class="date-badge">Opdateret: ' + SITE.lastUpdated + '</span>'
+ '<p class="sub">Få 3 gratis og uforpligtende tilbud fra godkendte lokale taglæggere i ' + kommune.name + ' Kommune. Svar inden 2 timer på hverdage kl. 8–17.</p>'
+ '<div class="hero-stats">'
+ '<div class="hero-stat"><b>' + zone.priceRange.split('–')[0] + ' kr</b><span>Startpris</span></div>'
+ '<div class="hero-stat"><b>' + zone.avgJob + ' kr</b><span>Gns. tagprojekt</span></div>'
+ '<div class="hero-stat"><b>4.0★</b><span>Trustpilot</span></div>'
+ '<div class="hero-stat"><b>100%</b><span>Gratis</span></div>'
+ '</div>'
+ '<div class="hero-trust"><span class="tp-stars">★★★★<span style="color:rgba(255,255,255,.25)">★</span></span> ' + SITE.trustpilotRating + '/5 på Trustpilot</div>'
+ '</div>'
+ form({ zone: zone.slug })
+ '</div></div></header>'
+ ticker()
+ '<section class="local"><div class="container"><div class="local-grid">'
+ '<div class="local-intro"><span class="sec-label">' + kommune.name + ' Kommune</span>'
+ '<h2>Nyt tag i ' + kommune.name + '</h2>'
+ '<p>' + intro1 + '</p><p>' + intro2 + '</p>'
+ otherHtml
+ '</div>'
+ '<aside><div class="local-box">'
+ '<h3>' + kommune.name + ' Kommune</h3>'
+ '<div class="price-row"><span>Gns. tagjob</span><b>' + zone.avgJob + ' kr.</b></div>'
+ '<div class="price-row"><span>Prisinterval</span><b>' + zone.priceRange + ' kr.</b></div>'
+ '<div class="price-row"><span>Zone</span><b><a href="/' + zone.slug + '" style="color:var(--gold)">' + zone.name + '</a></b></div>'
+ '<a href="#tilbud" style="display:block;background:var(--ink);color:#fff;text-align:center;padding:14px;border-radius:10px;font-weight:700;margin-top:22px">Få 3 gratis tilbud →</a>'
+ '<p style="text-align:center;margin-top:12px;font-size:12px;color:var(--muted);font-family:\'Space Mono\',monospace">Svar inden 2 timer på hverdage kl. 8–17</p>'
+ '</div></aside></div></div></section>'
+ faqSection(faqs)
+ guarantee()
+ ctaBand()
+ footer()
+ mobileCta()
+ cookieBanner()
+ exitIntent()
+ script()
+ '</body></html>';
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
  const otherCities = KOMMUNER.filter(c => c.zone === city.zone && c.slug !== city.slug).slice(0, 6);
  const title = `Nyt Tag Tilbud ${city.name} — Gratis Lokale Taglæggere`;
  const desc = `Få 3 gratis tilbud på nyt tag i ${city.name} (${city.postcode}). Godkendte lokale taglæggere. Svar inden 2 timer på hverdage kl. 8–17.`;

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
${cookieBanner()}
${exitIntent()}
${script()}
</body>
</html>`;
}

// ========== OM OS PAGE ==========
function omOsPage() {
  const url = `${SITE.domain}/om-os`;
  const schemas = [orgSchema, breadcrumbSchema([{ name: 'NytTagTilbud.com', url: SITE.domain }, { name: 'Om os', url }])];
  return `${head({ title: 'Om NytTagTilbud.com — Hvem er vi?', desc: 'Lær NytTagTilbud.com at kende. Vi matcher boligejere med godkendte lokale taglæggere i hele Danmark. CVR 44915847.', canonical: url, schemas })}
${urgency()}
${topNav()}
<div class="crumb"><div class="container"><ol><li><a href="/">NytTagTilbud.com</a></li><li>Om os</li></ol></div></div>
<section class="local" style="padding-top:60px">
  <div class="container">
    <div class="local-grid">
      <div class="local-intro">
        <span class="sec-label">Om os</span>
        <h1 style="font-size:36px;margin-bottom:20px">Om NytTagTilbud.com</h1>
        <p>Jeg hedder <strong>Michael Oxholm Johansen</strong> og startede NytTagTilbud.com fordi jeg selv oplevede, hvor svært det er at finde den rigtige taglægger til en fair pris.</p>
        <p>Da mit eget tag skulle udskiftes, brugte jeg ugevis på at ringe rundt til taglæggere, sammenligne tilbud og sikre mig, at jeg ikke blev snydt. Prisforskellen mellem det dyreste og billigste tilbud var over 40.000 kr. — for nøjagtig det samme arbejde.</p>
        <p>Dén oplevelse fik mig til at skabe NytTagTilbud.com: en platform der gør det <strong>nemt, hurtigt og gratis</strong> for danske boligejere at få 3 sammenlignelige tilbud fra godkendte lokale taglæggere. Ingen bindinger, ingen skjulte gebyrer.</p>
        <h2 style="font-size:28px;margin-top:36px">Vores mission</h2>
        <p>Vi vil gøre det enkelt at finde en dygtig taglægger til en fair pris — uanset hvor i Danmark du bor. Vi samarbejder kun med taglæggere, der er CVR-registrerede, har relevant erfaring og kan levere kvalitet.</p>
        <h2 style="font-size:28px;margin-top:36px">Kontakt</h2>
        <p><strong>E-mail:</strong> <a href="mailto:${SITE.email}">${SITE.email}</a><br>
        <strong>CVR:</strong> ${SITE.cvr}<br>
        <strong>Trustpilot:</strong> <a href="${SITE.trustpilotUrl}">${SITE.trustpilotRating}★ — ${SITE.trustpilotCount} anmeldelser</a></p>
      </div>
      <aside>
        <div class="local-box">
          <h3>NytTagTilbud.com</h3>
          <div class="price-row"><span>Ejer</span><b>${SITE.owner}</b></div>
          <div class="price-row"><span>CVR</span><b>${SITE.cvr}</b></div>
          <div class="price-row"><span>E-mail</span><b>${SITE.email}</b></div>
          <div class="price-row"><span>Trustpilot</span><b>${SITE.trustpilotRating}★</b></div>
          <div class="price-row"><span>Zoner</span><b>15 i hele DK</b></div>
          <a href="/#tilbud" style="display:block;background:var(--ink);color:#fff;text-align:center;padding:14px;border-radius:10px;font-weight:700;margin-top:22px">Få 3 gratis tilbud →</a>
        </div>
      </aside>
    </div>
  </div>
</section>
${ctaBand()}
${footer()}
${mobileCta()}
${cookieBanner()}
${exitIntent()}
${script()}
</body>
</html>`;
}

// ========== PRIVATLIVSPOLITIK ==========
function privatlivspolitikPage() {
  const url = `${SITE.domain}/privatlivspolitik`;
  const schemas = [orgSchema, breadcrumbSchema([{ name: 'NytTagTilbud.com', url: SITE.domain }, { name: 'Privatlivspolitik', url }])];
  return `${head({ title: 'Privatlivspolitik — NytTagTilbud.com', desc: 'Læs NytTagTilbud.com privatlivspolitik. Vi beskytter dine persondata i henhold til GDPR og dansk lovgivning.', canonical: url, schemas })}
${urgency()}
${topNav()}
<div class="crumb"><div class="container"><ol><li><a href="/">NytTagTilbud.com</a></li><li>Privatlivspolitik</li></ol></div></div>
<section class="article" style="padding-top:50px">
  <div class="container">
    <h1 style="font-size:36px;margin-bottom:24px">Privatlivspolitik</h1>
    <p><strong>Senest opdateret:</strong> ${SITE.lastUpdated}</p>

    <h2>1. Dataansvarlig</h2>
    <p>Den dataansvarlige for behandling af personoplysninger på NytTagTilbud.com er:</p>
    <p><strong>${SITE.owner}</strong><br>CVR: ${SITE.cvr}<br>E-mail: <a href="mailto:${SITE.email}">${SITE.email}</a></p>

    <h2>2. Hvilke oplysninger indsamler vi?</h2>
    <p>Når du udfylder vores formular, indsamler vi følgende oplysninger:</p>
    <ul>
      <li>Navn (fornavn og efternavn)</li>
      <li>E-mailadresse</li>
      <li>Telefonnummer</li>
      <li>Adresse, postnummer og by</li>
      <li>Boligtype og tagprojekttype</li>
      <li>Ønsket tidshorisont for arbejdet</li>
    </ul>

    <h2>3. Formål med behandlingen</h2>
    <p>Vi indsamler dine oplysninger med det formål at:</p>
    <ul>
      <li>Matche dig med op til 3 godkendte lokale taglæggere i din zone</li>
      <li>Videregive dine kontaktoplysninger til de matchede taglæggere, så de kan kontakte dig med tilbud</li>
      <li>Forbedre vores service og brugeroplevelse</li>
    </ul>

    <h2>4. Retsgrundlag</h2>
    <p>Behandlingen af dine personoplysninger sker på baggrund af:</p>
    <ul>
      <li><strong>Samtykke</strong> (GDPR artikel 6, stk. 1, litra a) — du giver aktivt samtykke ved at indsende formularen</li>
      <li><strong>Berettiget interesse</strong> (GDPR artikel 6, stk. 1, litra f) — til at analysere og forbedre vores service</li>
    </ul>

    <h2>5. Deling af data</h2>
    <p>Dine personoplysninger deles <strong>udelukkende</strong> med op til 3 godkendte taglæggere i din zone. Vi sælger <strong>aldrig</strong> dine data til tredjeparter eller bruger dem til markedsføring uden dit samtykke.</p>

    <h2>6. Opbevaring</h2>
    <p>Dine personoplysninger opbevares i maksimalt 12 måneder efter indsendelse, hvorefter de slettes automatisk. Du kan til enhver tid bede om sletning af dine data ved at kontakte os.</p>

    <h2>7. Dine rettigheder</h2>
    <p>Du har ifølge GDPR ret til:</p>
    <ul>
      <li><strong>Indsigt:</strong> Du kan bede om at se hvilke oplysninger vi har om dig</li>
      <li><strong>Berigtigelse:</strong> Du kan bede os rette forkerte oplysninger</li>
      <li><strong>Sletning:</strong> Du kan bede os slette dine oplysninger</li>
      <li><strong>Begrænsning:</strong> Du kan bede os begrænse behandlingen af dine oplysninger</li>
      <li><strong>Dataportabilitet:</strong> Du kan bede om at få dine data udleveret i et struktureret format</li>
      <li><strong>Indsigelse:</strong> Du kan gøre indsigelse mod behandlingen</li>
    </ul>
    <p>Kontakt os på <a href="mailto:${SITE.email}">${SITE.email}</a> for at udøve dine rettigheder.</p>

    <h2>8. Cookies</h2>
    <p>Vi bruger cookies til at analysere trafik på vores hjemmeside via Google Analytics (implementeret gennem Google Tag Manager). Analytiske cookies aktiveres <strong>kun</strong> efter dit samtykke via cookie-banneret.</p>
    <p><strong>Nødvendige cookies:</strong> Bruges til at huske dit samtykkevalg. Disse kræver ikke samtykke.</p>
    <p><strong>Analytiske cookies:</strong> Google Analytics cookies bruges til at forstå, hvordan besøgende bruger sitet. Disse aktiveres kun hvis du accepterer i cookie-banneret.</p>

    <h2>9. Klageadgang</h2>
    <p>Du har ret til at indgive klage til Datatilsynet:</p>
    <p><strong>Datatilsynet</strong><br>Carl Jacobsens Vej 35<br>2500 Valby<br>Telefon: 33 19 32 00<br>E-mail: dt@datatilsynet.dk<br>Web: <a href="https://www.datatilsynet.dk" rel="nofollow">www.datatilsynet.dk</a></p>

    <h2>10. Kontakt</h2>
    <p>Har du spørgsmål til vores behandling af personoplysninger, er du velkommen til at kontakte os på <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>
  </div>
</section>
${footer()}
${mobileCta()}
${cookieBanner()}
${exitIntent()}
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
${cookieBanner()}
${exitIntent()}
${script()}
</body>
</html>`;
}

module.exports = {
  home, zonePage, kommunePage, cityPage, blogIndex, omOsPage, privatlivspolitikPage,
  orgSchema, serviceSchema, faqSchema, breadcrumbSchema, articleSchema,
  nationalFaqs, zoneFaqs, cityFaqs, kommuneFaqs,
  faqSection, pricingSection, zoneGridSection, proofSection, stepsSection, ctaBand,
};
