import Link from "next/link";

export default function HomePage() {
  return (
    <main className="shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Local barter marketplace</p>
          <h1>Trade momentum, not money.</h1>
          <p className="lede">
            hobby2hobby helps people swap hobbies, practical skills, and local help
            through listings, chat, agreements, and trust signals that stay on-platform.
          </p>
          <div className="actions">
            <Link href="/explore" className="button button-primary">
              Explore listings
            </Link>
            <Link href="/workspace" className="button button-secondary">
              Open workspace
            </Link>
          </div>
        </div>
        <div className="hero-card">
          <div className="hero-panel">
            <p className="panel-label">MVP flow</p>
            <ol className="feature-list numbered-list">
              <li>Create a profile with location and availability.</li>
              <li>Post offers and needs for one pilot geography.</li>
              <li>Open a thread from a listing and propose a swap.</li>
              <li>Complete the barter and leave trust signals behind.</li>
            </ol>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <article className="card stat-card">
          <p className="panel-label">Built for</p>
          <h2>Local density</h2>
          <p>One region, tighter trust loops, faster proof of marketplace liquidity.</p>
        </article>
        <article className="card stat-card">
          <p className="panel-label">Core differentiator</p>
          <h2>Trust by default</h2>
          <p>Profiles, reviews, vouches, reporting, and blocked-user controls are part of the product, not an afterthought.</p>
        </article>
        <article className="card stat-card">
          <p className="panel-label">Current stack</p>
          <h2>Real gateway + services</h2>
          <p>The web app already targets the Docker-backed API gateway instead of placeholder mocks.</p>
        </article>
      </section>

      <section className="grid">
        <article className="card">
          <h2>Discovery that feels human</h2>
          <p>Search by region, category, and service mode while keeping the exchange framed around intent instead of price tags.</p>
        </article>
        <article className="card">
          <h2>Agreements in the thread</h2>
          <p>Once two people connect, the deal moves through one conversation instead of fragmenting across DMs and notes apps.</p>
        </article>
        <article className="card">
          <h2>Moderation that is visible</h2>
          <p>Reporting and blocking are exposed from user-facing surfaces so trust is backed by action, not just marketing copy.</p>
        </article>
      </section>

      <section className="card feature-band">
        <div className="feature-band-copy">
          <p className="eyebrow">Ready to use</p>
          <h2>Start with discovery, then move into your workspace.</h2>
          <p>
            Browse public listings first. When you sign in, hobby2hobby unlocks profile
            editing, listing creation, threads, proposals, and trust actions.
          </p>
        </div>
        <div className="actions">
          <Link href="/signin" className="button button-primary">
            Sign in or register
          </Link>
          <Link href="/explore" className="button button-secondary">
            Browse the market
          </Link>
        </div>
      </section>
    </main>
  );
}
