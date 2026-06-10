interface SimpleHeroProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaUrl?: string;
  attributes?: Record<string, any>;
}

export default function SimpleHero({
  title,
  subtitle,
  ctaText,
  ctaUrl,
  attributes = {},
}: SimpleHeroProps) {
  const { key, ...rest } = attributes;
  return (
    <section
      key={key}
      {...rest}
      style={{
        padding: '80px 24px',
        textAlign: 'center',
        background: '#f9fafb',
      }}
    >
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0 0 16px' }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{ fontSize: '1.125rem', color: '#4b5563', margin: '0 0 32px' }}>
          {subtitle}
        </p>
      )}
      {ctaText && ctaUrl && (
        <a
          href={ctaUrl}
          style={{
            display: 'inline-block',
            padding: '12px 28px',
            background: '#111827',
            color: '#fff',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          {ctaText}
        </a>
      )}
    </section>
  );
}
