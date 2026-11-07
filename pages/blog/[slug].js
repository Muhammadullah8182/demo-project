import Link from 'next/link';
import Seo from '../../components/Seo';
import Layout from '../../components/Layout';
import { postUrl, fmtDate } from '../../data/site';
import { useSite } from '../../lib/site-context';

export async function getServerSideProps({ params }) {
  const { getSiteData, getPost } = await import('../../lib/site-data');
  const site = await getSiteData();
  const post = site.posts.find((p) => p.slug === params.slug) || (await getPost(params.slug));
  const related = site.posts.filter((o) => o.slug !== params.slug).slice(0, 3);
  return { props: { site, post: post || null, related } };
}

export default function BlogPost({ site, post, related }) {
  const live = useSite();
  if (!post) {
    return (
      <Layout active="blog">
        <section className="section">
          <div className="container" style={{ textAlign: 'center' }}>
            <h1>Article not found</h1>
            <p className="muted">It may have been moved or deleted.</p>
            <p style={{ marginTop: '16px' }}>
              <Link className="btn btn-primary" style={{ width: 'auto' }} href="/blog/">
                ← Back to blog
              </Link>
            </p>
          </div>
        </section>
      </Layout>
    );
  }

  const meta = {
    title: post.meta_title || post.title + ' | UAE Rental Car Blog',
    description: post.meta_desc,
    canonical: postUrl(post.slug),
    ogTitle: post.meta_title || post.title,
    ogDescription: post.meta_desc,
    ogType: 'article',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.meta_desc,
        datePublished: post.date,
        author: { '@type': 'Organization', name: 'UAE Rental Car' },
        publisher: { '@type': 'Organization', name: 'UAE Rental Car' },
      },
    ],
  };

  return (
    <Layout active="blog">
      <Seo meta={meta} />

      <section className="section">
        <div className="container">
          <article className="article">
            <h1>{post.title}</h1>
            <p className="meta">📅 {fmtDate(post.date)} &nbsp;•&nbsp; UAE Rental Car</p>
            <div className="body" dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>

          <div className="cta-box">
            <h2>Need a car in Dubai?</h2>
            <p>From AED 79/day — no deposit options, free delivery, 24/7 support.</p>
            <a
              className="btn btn-whatsapp"
              style={{ maxWidth: '320px', margin: '0 auto' }}
              href={live.waLink(`Hi UAE Rental Car, I read your article "${post.title}" and want to rent a car.`)}
              target="_blank"
              rel="noopener"
            >
              💬 WhatsApp Us Now
            </a>
          </div>

          {related.length > 0 && (
            <div className="related">
              <h2 style={{ textAlign: 'center', marginBottom: '18px' }}>Related articles</h2>
              <div className="post-grid">
                {related.map((r) => (
                  <Link key={r.slug} className="post-card" href={`/blog/${r.slug}/`}>
                    <span className="date">{fmtDate(r.date)}</span>
                    <h2>{r.title}</h2>
                    <p>{r.excerpt}</p>
                    <span className="read">Read article →</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
