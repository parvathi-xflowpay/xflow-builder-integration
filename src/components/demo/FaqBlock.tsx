'use client';
import { useState } from 'react';

interface Faq {
  question: string;
  answer: string;
}

interface FaqBlockProps {
  title: string;
  faqs: Faq[];
  attributes?: Record<string, any>;
}

function FaqItem({ question, answer }: Faq) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 0',
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          fontSize: '1rem',
          fontWeight: 600,
          padding: 0,
        }}
      >
        {question}
        <span style={{ fontSize: '1.25rem', marginLeft: '16px' }}>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <p style={{ marginTop: '12px', color: '#4b5563', lineHeight: 1.6 }}>{answer}</p>
      )}
    </div>
  );
}

export default function FaqBlock({ title, faqs = [], attributes = {} }: FaqBlockProps) {
  const { key, ...rest } = attributes;
  return (
    <section
      key={key}
      {...rest}
      style={{ padding: '64px 24px', maxWidth: '800px', margin: '0 auto' }}
    >
      <h2 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '32px' }}>
        {title}
      </h2>
      {faqs.map((faq, i) => (
        <FaqItem key={i} {...faq} />
      ))}
    </section>
  );
}
