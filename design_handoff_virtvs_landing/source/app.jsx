/* VIRTVS — Drop I Landing
   React app: hero, brand meaning, drop preview, symbolism (accordion),
   scarcity, signup form (validated), sticky CTA, tweaks panel. */

const { useState, useEffect, useRef, useCallback } = React;

/* ─────────── Tweakable defaults ─────────── */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#6b1e23",
  "serifChoice": "cinzel",
  "headline": "adastra",
  "grain": true,
  "stickyCta": true
}/*EDITMODE-END*/;

const HEADLINES = {
  dropi:     { a: "Drop I",                b: "" },
  adastra:   { a: "Ad Astra",               b: "Per Aspera." },
  character: { a: "Character",              b: "embodied." },
  timeless:  { a: "Timeless",               b: "meaning." },
  forged:    { a: "Forged.",                b: "Not given." },
  cloth:     { a: "Heavy is",               b: "the cloth." },
  worn:      { a: "Strength,",              b: "worn." },
  labor:     { a: "Built for",              b: "the labor." },
  cipher:    { a: "Wear the",               b: "cipher." },
  original:  { a: "Ancient virtue.",        b: "Modern armor." },
};

const SERIF_MAP = {
  helvetica: '"Helvetica Neue", "HelveticaNeue", Helvetica, "Inter Tight", Arial, sans-serif',
  cinzel: '"Cinzel", "Trajan Pro", "Cormorant Garamond", Georgia, serif',
  cormorant: '"Cormorant Garamond", "EB Garamond", Georgia, serif',
  garamond: '"EB Garamond", "Cormorant Garamond", Georgia, serif',
  playfair: '"Playfair Display", "Cormorant Garamond", Georgia, serif',
};

/* ─────────── Wreath logo (real Virtvs mark, color-masked) ─────────── */
function Wreath({ size = 'sm', style }) {
  return <span className={`wreath wreath-${size}`} style={style} aria-label="Virtvs" role="img" />;
}

/* ─────────── Hercules silhouette placeholder (very abstract) ─────────── */
function HoodieMark() {
  return (
    <svg width="62%" viewBox="0 0 320 400" fill="none" aria-hidden="true" style={{ opacity: 0.85 }}>
      {/* Roman numeral XII band at top center */}
      <text x="160" y="60" textAnchor="middle" fontFamily='"Cormorant Garamond", serif'
            fontSize="22" letterSpacing="6" fill="rgba(232,223,208,0.55)">XII</text>
      {/* Hoodie silhouette — broad shoulder shape */}
      <path
        d="M70 130 Q90 90 130 80 Q140 110 160 110 Q180 110 190 80 Q230 90 250 130 L280 200 L260 215 L255 360 Q230 380 200 384 L200 290 L120 290 L120 384 Q90 380 60 360 L55 215 L40 200 Z"
        fill="rgba(20,17,15,0.95)"
        stroke="rgba(232,223,208,0.18)"
        strokeWidth="0.8"
      />
      {/* Front wordmark band */}
      <rect x="115" y="200" width="90" height="14" fill="rgba(232,223,208,0.06)" />
      <text x="160" y="211" textAnchor="middle" fontFamily='"Cormorant Garamond", serif'
            fontSize="11" letterSpacing="3" fill="rgba(232,223,208,0.85)" fontWeight="500">FORTITVDO</text>
      {/* Hood drawstrings */}
      <line x1="148" y1="115" x2="146" y2="170" stroke="rgba(232,223,208,0.35)" strokeWidth="0.8" />
      <line x1="172" y1="115" x2="174" y2="170" stroke="rgba(232,223,208,0.35)" strokeWidth="0.8" />
    </svg>
  );
}

function HatMark() {
  return (
    <svg width="58%" viewBox="0 0 320 320" fill="none" aria-hidden="true" style={{ opacity: 0.88 }}>
      {/* 6-panel cap silhouette */}
      <path
        d="M55 180 Q60 105 160 95 Q260 105 265 180 L265 195 L55 195 Z"
        fill="rgba(15,13,11,0.95)"
        stroke="rgba(232,223,208,0.14)"
        strokeWidth="0.8"
      />
      {/* Brim */}
      <path
        d="M40 195 Q160 235 280 195 L280 208 Q160 245 40 208 Z"
        fill="rgba(20,17,15,0.95)"
        stroke="rgba(232,223,208,0.14)"
        strokeWidth="0.8"
      />
      {/* Corduroy striations */}
      {Array.from({length: 28}).map((_, i) => (
        <line key={i} x1={55 + i*7.6} y1="98" x2={55 + i*7.6} y2="194"
              stroke="rgba(232,223,208,0.04)" strokeWidth="0.6" />
      ))}
      {/* Front center seam */}
      <line x1="160" y1="95" x2="160" y2="195" stroke="rgba(232,223,208,0.08)" strokeWidth="0.6" />
      {/* Embroidery: small Virtvs mark */}
      <text x="160" y="160" textAnchor="middle" fontFamily='"Cormorant Garamond", serif'
            fontSize="13" letterSpacing="3.5" fill="rgba(232,223,208,0.75)" fontWeight="500">VIRTVS</text>
      <line x1="135" y1="167" x2="185" y2="167" stroke="rgba(232,223,208,0.35)" strokeWidth="0.5" />
    </svg>
  );
}

/* ─────────── Nav ─────────── */
function Nav({ onJoin }) {
  return (
    <nav className="nav" data-screen-label="nav">
      <div className="nav-brand">
        <Wreath size="sm" />
        <span>VIRTVS</span>
      </div>
      <div className="nav-meta">
        <a className="nav-link" href="#drop">Drop I</a>
        <a className="nav-link" href="#symbolism">Meaning</a>
        <a className="nav-link" href="#codex">Codex</a>
        <button className="nav-cta" onClick={onJoin}>Join List</button>
      </div>
    </nav>
  );
}

/* ─────────── Hero ─────────── */
function Hero({ onJoin, headlineKey }) {
  const h = HEADLINES[headlineKey] || HEADLINES.adastra;
  return (
    <section className="hero" id="top" data-screen-label="01 Hero">
      <div className="hero-frame">
        <div className="placeholder" />
        <div className="stone" />
        <div className="vignette" />
      </div>

      <div className="hero-inner">
        <div className="hero-text">
          <h1 className="display hero-headline">
            {h.a}{h.b ? <><br/><em>{h.b}</em></> : null}
          </h1>

          <p className="hero-tagline">Timeless meaning. Modern form.</p>

          <p className="lede">
            Virtvs is a limited streetwear brand built on Roman virtue, myth, and modern
            discipline. Drop I begins with the Hercules <em>FORTITVDO</em> hoodie and the
            Virtvs black corduroy hat — <b style={{color:'var(--bone)', fontWeight:500}}>75 units, early access first.</b>
          </p>

          <div className="scarcity-badges">
            <span className="chip lead"><span className="pip" />75 Units Only</span>
            <span className="chip">Early Access First</span>
            <span className="chip">No Restocks Planned</span>
          </div>

          <div className="hero-bottom">
            <div className="hero-cta-stack">
              <button className="btn btn-lg" onClick={onJoin}>
                Join the Drop List
                <span className="btn-arrow" />
              </button>
              <div className="micro">Free · No spam · Only when the drop moves</div>
            </div>
          </div>
        </div>

        <aside className="hero-product" aria-label="Drop I product preview">
          <div className="hero-product-frame">
            <div className="product-glow" />
            <image-slot
              shape="rect"
              id="hero-hoodie"
              src="assets/fortitvdo-hoodie.png"
              fit="contain"
              placeholder="FORTITVDO hoodie — hero render"
              style={{position:'absolute', inset:0, width:'100%', height:'100%'}}
            ></image-slot>
            <div className="hero-product-overlay">
              <div className="top">
                <div>
                  <div className="item-id">001 · Drop I</div>
                  <div className="item-name">Hercules <em style={{fontStyle:'italic'}}>FORTITVDO</em> Hoodie</div>
                </div>
              </div>
              <div className="bot">
                <div className="item-id">Heavyweight · Charcoal</div>
                <div className="item-meta">
                  <div>75 units</div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

/* ─────────── The Codex ─ 4 cardinal virtues ─────────── */
const CODEX = [
  {
    n: "I",
    name: "FORTITVDO",
    en: "Courage · Resilience · Strength under pressure",
    myth: "Hercules. Strength forged in trial.",
    state: "active",
    statusLabel: "Drop I · MMXXVI",
  },
  {
    n: "II",
    name: "DISCIPLINA",
    en: "Discipline · Self-mastery · Precision",
    myth: "Marcus Aurelius. Mind held to its task.",
    state: "locked",
    statusLabel: "Drop II · Forthcoming",
  },
  {
    n: "III",
    name: "AUCTORITAS",
    en: "Earned influence · Credibility · Quiet authority",
    myth: "Cicero. Influence earned by the word.",
    state: "locked",
    statusLabel: "Drop III · Forthcoming",
  },
  {
    n: "IV",
    name: "GRAVITAS",
    en: "Presence · Seriousness · Inner weight",
    myth: "Augustus. Power held without spectacle.",
    state: "locked",
    statusLabel: "Drop IV · Forthcoming",
  },
];

function Codex() {
  return (
    <section id="codex" className="codex" data-screen-label="06 Codex">
      <div className="codex-head">
        <div>
          <div className="eyebrow"><span className="dot" />06 — What follows</div>
          <h2 className="display" style={{marginTop: 18, marginBottom: 0}}>
            Four virtues.<br/><em>One code.</em>
          </h2>
        </div>
        <p className="lede" style={{margin: 0}}>
          Drop I is the first of four. Each release is built around a single Virtvs pillar — gravitas, disciplina, and auctoritas follow Drop I, one at a time, in order.
        </p>
      </div>

      <div className="codex-grid">
        {CODEX.map((c) => (
          <article key={c.n} className={`codex-cell ${c.state}`}>
            <div className="roman">{c.n}</div>
            <div className="virtue">{c.name}</div>
            <div className="trans">{c.en}</div>
            <div className="myth">{c.myth}</div>
            <div className="status">
              <span className="pip" />
              {c.statusLabel}
            </div>
          </article>
        ))}
      </div>

      <div className="codex-foot">
        <span>Codex · 4 virtues · 4 drops</span>
        <span>One released. Three forthcoming.</span>
      </div>
    </section>
  );
}

/* ─────────── Drop I products ─────────── */
function Drop({ onJoin }) {
  return (
    <section id="drop" data-screen-label="02 Drop I">
      <div className="sec">
        <div className="drop-head">
          <div>
            <div className="eyebrow"><span className="dot" />02 — Drop I</div>
            <h2 className="display" style={{marginTop:18, marginBottom:0}}>
              Drop I:<br/><em>FORTITVDO</em>
            </h2>
          </div>
          <button className="btn btn-ghost" onClick={onJoin}>
            Get Early Access <span className="btn-arrow" />
          </button>
        </div>

        <div className="drop-grid">
          {/* HOODIE */}
          <article className="product">
            <div className="product-frame">
              <image-slot
                shape="rect"
                id="product-hoodie"
                src="assets/fortitvdo-hoodie.png"
                fit="contain"
                placeholder="FORTITVDO hoodie — front or back graphic"
                style={{position:'absolute', inset:0, width:'100%', height:'100%'}}
              ></image-slot>
              <div className="roman-mark">XII</div>
            </div>
            <div className="product-meta">
              <div>
                <div className="product-tag">001 · Heavyweight Hoodie</div>
                <h3 className="product-name">Hercules FORTITVDO Hoodie</h3>
                <div className="product-price">$189</div>
                <p className="product-desc">
                  Heavyweight charcoal fleece. Back Nemean Lion embroidery. XII sleeve mark.
                </p>
                <div className="product-chips">
                  <span className="chip">75 Units</span>
                  <span className="chip">Heavyweight Fleece</span>
                  <span className="chip">No Restocks</span>
                </div>
              </div>
              <div className="product-status">
                <span className="ring" /> Coming
              </div>
            </div>
          </article>

          {/* HAT */}
          <article className="product">
            <div className="product-frame is-cap">
              <image-slot
                shape="rect"
                id="product-hat"
                src="assets/virtvs-cap.png"
                fit="cover"
                placeholder="Virtvs corduroy cap — straight-on or angled"
                style={{position:'absolute', inset:0, width:'100%', height:'100%'}}
              ></image-slot>
            </div>
            <div className="product-meta">
              <div>
                <div className="product-tag">002 · Cap</div>
                <h3 className="product-name">Virtvs Black Corduroy Hat</h3>
                <div className="product-price">$79</div>
                <p className="product-desc">
                  Structured black corduroy. Wreath V embroidery. Bronze clasp.
                </p>
                <div className="product-chips">
                  <span className="chip">Corduroy</span>
                  <span className="chip">Embroidered Wreath</span>
                  <span className="chip">Drop I Core</span>
                </div>
              </div>
              <div className="product-status">
                <span className="ring" /> Coming
              </div>
            </div>
          </article>
        </div>

        <div className="drop-details">
          <div className="drop-details-head">
            <div className="eyebrow"><span className="dot" />Construction</div>
            <h3 className="display drop-details-title">The details.</h3>
            <p className="drop-details-lede">
              Tonal embroidery on heavyweight charcoal fleece. Each mark is stitched, not printed —
              built to hold under wear.
            </p>
          </div>

          <figure className="drop-details-frame">
            <img
              src="assets/fortitvdo-details.png"
              alt="FORTITVDO hoodie construction details — Nemean Lion back graphic, sleeve XII numeral, FORTITVDO wordmark embroidery"
            />
          </figure>

          <ol className="drop-details-captions">
            <li>
              <span className="num">I</span>
              <span className="cap">
                <b>Nemean Lion</b>
                <em>Back hem · tonal embroidery</em>
              </span>
            </li>
            <li>
              <span className="num">II</span>
              <span className="cap">
                <b>Numeral XII</b>
                <em>Left sleeve · twelve labors</em>
              </span>
            </li>
            <li>
              <span className="num">III</span>
              <span className="cap">
                <b>FORTITVDO Wordmark</b>
                <em>Front chest · serif embroidery</em>
              </span>
            </li>
          </ol>
        </div>

        <div className="drop-details">
          <div className="drop-details-head">
            <div className="eyebrow"><span className="dot" />Cap construction</div>
            <h3 className="display drop-details-title">In the cap.</h3>
            <p className="drop-details-lede">
              Black corduroy. Embroidered wreath V. Antique brass adjuster, and
              <i> Ad Astra Per Aspera</i> printed inside the crown — a mark only the wearer sees.
            </p>
          </div>

          <figure className="drop-details-frame">
            <img
              src="assets/virtvs-cap-details.png"
              alt="Virtvs corduroy cap construction details — wreath V front embroidery, interior Ad Astra Per Aspera taping, antique brass rear adjuster"
            />
          </figure>

          <ol className="drop-details-captions">
            <li>
              <span className="num">I</span>
              <span className="cap">
                <b>Wreath V Mark</b>
                <em>Front panel · embroidered</em>
              </span>
            </li>
            <li>
              <span className="num">II</span>
              <span className="cap">
                <b>Ad Astra Per Aspera</b>
                <em>Interior crown tape · gold print</em>
              </span>
            </li>
            <li>
              <span className="num">III</span>
              <span className="cap">
                <b>Antique Brass Adjuster</b>
                <em>Rear strap · matte hardware</em>
              </span>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ─────────── Symbolism w/ accordion ─────────── */
function Symbolism() {
  const [open, setOpen] = useState(0);
  const items = [
    {
      q: "I. Why Hercules.",
      a: "Hercules is the archetype of strength earned through trial. Twelve labors. No shortcuts. Drop I is named for him because real fortitude isn’t born — it is built under load. The hoodie is the first artifact of that idea."
    },
    {
      q: "II. Why Roman lettering.",
      a: "Classical Roman inscriptions use V where modern English uses U. We keep VIRTVS and FORTITVDO in their original form as a quiet signal — the brand belongs to the lineage, not the costume."
    },
    {
      q: "III. The Nemean Lion.",
      a: "The first labor. Arrows could not pierce its hide. Hercules wore its skin afterward as armor. The back graphic on the FORTITVDO hoodie is a refined, modern read on that idea — strength absorbed, not displayed."
    },
    {
      q: "IV. What comes next.",
      a: "Each future drop is built around a single Virtvs pillar — Disciplina, Auctoritas, Gravitas. Drop I begins with Fortitvdo because everything else requires it first."
    }
  ];
  return (
    <section id="symbolism" data-screen-label="03 Symbolism">
      <div className="sec">
        <div className="sym">
          <div className="copy">
            <div className="eyebrow"><span className="dot" />03 — Symbolism</div>
            <h2 className="display" style={{marginTop: 18}}>
              The first virtue:<br/><em>Fortitude.</em>
            </h2>
            <p className="lede" style={{marginTop: 24}}>
              FORTITVDO is strength under pressure. The kind that is not loud, not
              easy, and not given. Inspired by Hercules and the Nemean Lion, Drop I
              is built around the idea that real strength is proven through difficulty.
            </p>
          </div>

          <div className="sym-stack">
            <div className="eyebrow" style={{marginBottom: 6}}>Meaning behind the drop</div>
            {items.map((it, i) => (
              <div className={`acc ${open === i ? 'open' : ''}`} key={i}>
                <button className="acc-row" onClick={() => setOpen(open === i ? -1 : i)}>
                  <span>{it.q}</span>
                  <span className="acc-i">{String(i+1).padStart(2,'0')}</span>
                </button>
                <div className="acc-body"><p>{it.a}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────── Scarcity ─────────── */
function Scarcity() {
  return (
    <section className="scarcity" data-screen-label="04 Scarcity">
      <div className="scarcity-inner">
        <div>
          <div className="eyebrow"><span className="dot" />04 — Release</div>
          <h2 className="display" style={{marginTop: 18}}>
            Limited<br/>first release.
          </h2>
          <p className="lede" style={{marginTop: 24}}>
            Drop I will be released in limited quantities to the early access list first.
            Sign up to receive product previews, launch timing, and first access before
            the public drop.
          </p>
        </div>

        <div className="scarcity-stats">
          <div>
            <div className="stat-num">75</div>
            <div className="stat-lbl">Hoodies / Drop I</div>
          </div>
          <div>
            <div className="stat-num">I</div>
            <div className="stat-lbl">Single production run</div>
          </div>
          <div>
            <div className="stat-num">0</div>
            <div className="stat-lbl">Restocks Planned</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────── Signup ─────────── */
function Signup({ formRef }) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [prefs, setPrefs] = useState(["both"]); // single-select default
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [position, setPosition] = useState(null);

  const togglePref = (p) => setPrefs([p]);

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Enter a valid email.";
    }
    if (phone && phone.replace(/\D/g,'').length < 7) {
      next.phone = "Enter a valid number, or leave empty.";
    }
    setErrors(next);
    if (Object.keys(next).length === 0) {
      // fake position 100–999
      setPosition(100 + Math.floor(Math.random() * 900));
      setSubmitted(true);
    }
  };

  return (
    <section id="signup" ref={formRef} data-screen-label="05 Signup">
      <div className="signup">
        <div>
          <div className="eyebrow"><span className="dot" />05 — Enter the list</div>
          <h2 className="display" style={{marginTop: 18}}>
            Enter <em>the list.</em>
          </h2>
          <p className="lede" style={{marginTop: 24}}>
            Early access. Product previews. Launch timing. You will hear from us
            before the public drop — and only when there is something worth saying.
          </p>

          <p className="signup-pricing">
            Drop I includes the <b>$189</b> Hercules FORTITVDO hoodie and the
            <b> $79</b> Virtvs black corduroy hat. Early access receives first availability.
          </p>

          <div className="code-block" style={{marginTop: 32}}>
            {`// Drop I dispatch\n`}
            <b>schedule</b>{`     →  early access window opens MMXXVI\n`}
            <b>volume</b>{`       →  single run · 75 hoodies\n`}
            <b>restock</b>{`      →  none\n`}
            <b>frequency</b>{`    →  only when the drop moves`}
          </div>
        </div>

        {!submitted ? (
          <form className="form" onSubmit={submit} noValidate>
            <div className={`field ${errors.email ? 'invalid' : ''}`}>
              <label className="field-label" htmlFor="email">
                <span>Email address</span>
                <span className="opt">required</span>
              </label>
              <input
                id="email" type="email" placeholder="you@domain.com"
                value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email"
              />
              {errors.email && <div className="err">{errors.email}</div>}
            </div>

            <div className={`field ${errors.phone ? 'invalid' : ''}`}>
              <label className="field-label" htmlFor="phone">
                <span>SMS for launch drop</span>
                <span className="opt">optional</span>
              </label>
              <input
                id="phone" type="tel" placeholder="+1 (___) ___ ____"
                value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel"
              />
              {errors.phone && <div className="err">{errors.phone}</div>}
            </div>

            <div className="field">
              <div className="field-label">
                <span>Preference</span>
                <span className="opt">optional</span>
              </div>
              <div className="prefs">
                {[
                  { id: 'hoodie', label: 'Hoodie', num: '001' },
                  { id: 'hat', label: 'Hat', num: '002' },
                  { id: 'both', label: 'Both', num: '001 + 002' },
                ].map((p) => (
                  <button
                    key={p.id} type="button"
                    className={`pref ${prefs.includes(p.id) ? 'on' : ''}`}
                    onClick={() => togglePref(p.id)}
                  >
                    <span className="pref-num">{p.num}</span>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="consent">
              By joining, you agree to receive Drop I updates from Virtvs. Unsubscribe anytime. <a href="#">Privacy</a>
            </div>

            <button type="submit" className="btn btn-accent submit">
              Join Early Access <span className="btn-arrow" />
            </button>
          </form>
        ) : (
          <div className="success">
            <div className="position">
              <Wreath size="sm" style={{width:18, height:18}} />
              You're on the list · Position №{position}
            </div>
            <h3>Watch for Drop I updates.</h3>
            <p className="lede" style={{margin:0}}>
              Confirmation sent to <b style={{color:'var(--bone)'}}>{email}</b>. We'll write with product previews, launch timing, and your early access window before the public drop.
            </p>
            <div style={{display:'flex', gap: 12, flexWrap: 'wrap', marginTop: 8}}>
              <button className="btn btn-ghost" onClick={() => { setSubmitted(false); setEmail(""); setPhone(""); }}>
                Add another email <span className="btn-arrow" />
              </button>
            </div>
            <div className="micro" style={{marginTop: 6}}>
              Share VIRTVS · <a href="#" style={{textDecoration:'underline', textUnderlineOffset:3}}>@virtvs</a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─────────── Footer ─────────── */
function Footer() {
  return (
    <footer className="foot" data-screen-label="footer">
      <div className="foot-brand" style={{display:'flex', alignItems:'center', gap: 12}}>
        <Wreath size="sm" /> VIRTVS
      </div>
      <div className="micro">© MMXXVI · Ad astra per aspera</div>
      <div className="micro">VIRTVS · FORTITVDO · DISCIPLINA · AVCTORITAS · GRAVITAS</div>
    </footer>
  );
}

/* ─────────── Sticky CTA ─────────── */
function StickyCTA({ onJoin, visible }) {
  return (
    <div className={`stickycta ${visible ? 'show' : ''}`}>
      <span>Drop I · 75 Units · Early Access First</span>
      <button onClick={onJoin}>Join List</button>
    </div>
  );
}

/* ─────────── Root ─────────── */
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const formRef = useRef(null);
  const [stickyVisible, setStickyVisible] = useState(false);

  // Apply tweaks to CSS vars
  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty('--accent-on', t.accent);
    r.style.setProperty('--serif', SERIF_MAP[t.serifChoice] || SERIF_MAP.cinzel);
    r.setAttribute('data-serif', t.serifChoice);
    document.body.style.setProperty('--grain-opacity', t.grain ? '0.05' : '0');
  }, [t.accent, t.serifChoice, t.grain]);

  // Toggle grain visibility via class
  useEffect(() => {
    document.body.classList.toggle('no-grain', !t.grain);
  }, [t.grain]);

  // Show sticky CTA after scrolling past hero
  useEffect(() => {
    if (!t.stickyCta) { setStickyVisible(false); return; }
    const onScroll = () => {
      const y = window.scrollY;
      const formTop = formRef.current?.getBoundingClientRect().top ?? 9999;
      const vh = window.innerHeight;
      // Show after hero, hide when near signup form
      setStickyVisible(y > vh * 0.8 && formTop > vh * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [t.stickyCta]);

  const joinList = useCallback(() => {
    formRef.current?.scrollTo?.({ top: 0 });
    const el = document.getElementById('signup');
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 40;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);

  return (
    <>
      <Nav onJoin={joinList} />
      <Hero onJoin={joinList} headlineKey={t.headline} />
      <Drop onJoin={joinList} />
      <Symbolism />
      <Scarcity />
      <Signup formRef={formRef} />
      <Codex />
      <Footer />
      <StickyCTA onJoin={joinList} visible={stickyVisible} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Accent" />
        <TweakColor
          label="Accent color"
          value={t.accent}
          options={['#6b1e23', '#8a7449', '#3a4f3a', '#7a7a7a']}
          onChange={(v) => setTweak('accent', v)}
        />
        <TweakSection label="Hero headline" />
        <TweakSelect
          label="Headline"
          value={t.headline}
          options={[
            { value: 'dropi',     label: 'Drop I' },
            { value: 'adastra',   label: 'Ad Astra Per Aspera.' },
            { value: 'character', label: 'Character embodied.' },
            { value: 'timeless',  label: 'Timeless meaning.' },
            { value: 'forged',    label: 'Forged. Not given.' },
            { value: 'cloth',     label: 'Heavy is the cloth.' },
            { value: 'worn',      label: 'Strength, worn.' },
            { value: 'labor',     label: 'Built for the labor.' },
            { value: 'cipher',    label: 'Wear the cipher.' },
            { value: 'original',  label: 'Ancient virtue. Modern armor.' },
          ]}
          onChange={(v) => setTweak('headline', v)}
        />
        <TweakSection label="Typography" />
        <TweakRadio
          label="Display serif"
          value={t.serifChoice}
          options={['helvetica', 'cinzel', 'cormorant', 'garamond', 'playfair']}
          onChange={(v) => setTweak('serifChoice', v)}
        />
        <TweakSection label="Atmosphere" />
        <TweakToggle
          label="Film grain"
          value={t.grain}
          onChange={(v) => setTweak('grain', v)}
        />
        <TweakToggle
          label="Sticky CTA"
          value={t.stickyCta}
          onChange={(v) => setTweak('stickyCta', v)}
        />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
