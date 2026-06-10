interface Card {
  title: string;
  description: string;
}

interface CardListProps {
  title: string;
  cards: Card[];
  attributes?: Record<string, any>;
}

export default function CardList({ title, cards = [], attributes = {} }: CardListProps) {
  const { key, ...rest } = attributes;
  return (
    <section
      key={key}
      {...rest}
      style={{ padding: '64px 24px', maxWidth: '1200px', margin: '0 auto' }}
    >
      <h2 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '40px' }}>
        {title}
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px',
        }}
      >
        {cards.map((card, i) => (
          <div
            key={i}
            style={{
              padding: '24px',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              background: '#fff',
            }}
          >
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '8px' }}>
              {card.title}
            </h3>
            <p style={{ color: '#6b7280', lineHeight: 1.6 }}>{card.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
