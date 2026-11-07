import Link from 'next/link';
import Seo from '../../components/Seo';
import Layout from '../../components/Layout';
import { postUrl, fmtDate } from '../../data/site';
import { pageMeta } from '../../lib/page-meta';

export async function getServerSideProps() {
  const { getSiteData } = await import('../../lib/site-data');
  const site = await getSiteData();
  return { props: { site } };
}
export default function BlogIndex({ site }) {
  const page = site.pages['blog'] || {};
  const posts = site.posts;
  return (
    <Layout active="blog">
      <Seo meta={pageMeta('blog', page, site.settings)} />

      <section className="blog-hero">
        <div className="container">
          <h1>{page.h1 || 'Dubai Car Rental Blog'}</h1>
          <p>{page.hero_subtitle || 'Guides, tips & deals — new article every day.'}</p>
        </div>
      </section>

      {page.body_html ? (
  <section className="section" style={{ paddingBottom: 0 }}>
    <div className="container">
      <div dangerouslySetInnerHTML={{ __html: page.body_html }} />
    </div>
  </section>
) : null}

      <section className="section">
        <div className="container">
          {posts.length === 0 ? (
            <p className="muted" style={{ textAlign: 'center' }}>
              No articles yet — check back soon.
            </p>
          ) : (
            <div className="post-grid">
              {posts.map((p) => (
                <Link key={p.slug} className="post-card" href={`/blog/${p.slug}/`}>
                  {p.keyword ? <span className="kw">{p.keyword}</span> : null}
                  <span className="date">{fmtDate(p.date)}</span>
                  <h2>{p.title}</h2>
                  <p>{p.excerpt}</p>
                  <span className="read">Read article →</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
