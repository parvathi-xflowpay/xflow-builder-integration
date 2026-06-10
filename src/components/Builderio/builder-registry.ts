import { Builder } from '@builder.io/react';
import SimpleHero from '@components/demo/SimpleHero';
import CardList from '@components/demo/CardList';
import FaqBlock from '@components/demo/FaqBlock';

Builder.registerComponent(SimpleHero, {
  name: 'SimpleHero',
  friendlyName: 'Simple Hero',
  noWrap: true,
  models: ['tools'],
  inputs: [
    { name: 'title', friendlyName: 'Title', type: 'text', required: true, defaultValue: 'Hero Title' },
    { name: 'subtitle', friendlyName: 'Subtitle', type: 'text', defaultValue: 'Hero subtitle text' },
    { name: 'ctaText', friendlyName: 'CTA Text', type: 'text', defaultValue: 'Get started' },
    { name: 'ctaUrl', friendlyName: 'CTA URL', type: 'url', defaultValue: '/' },
  ],
});

Builder.registerComponent(CardList, {
  name: 'CardList',
  friendlyName: 'Card List',
  noWrap: true,
  models: ['tools'],
  inputs: [
    { name: 'title', friendlyName: 'Section Title', type: 'text', required: true, defaultValue: 'Cards' },
    {
      name: 'cards',
      friendlyName: 'Cards',
      type: 'list',
      defaultValue: [
        { title: 'Card 1', description: 'Description for card 1' },
        { title: 'Card 2', description: 'Description for card 2' },
        { title: 'Card 3', description: 'Description for card 3' },
      ],
      subFields: [
        { name: 'title', friendlyName: 'Title', type: 'text', required: true },
        { name: 'description', friendlyName: 'Description', type: 'text', required: true },
      ],
    },
  ],
});

Builder.registerComponent(FaqBlock, {
  name: 'FaqBlock',
  friendlyName: 'FAQ Block',
  noWrap: true,
  models: ['tools'],
  inputs: [
    { name: 'title', friendlyName: 'Section Title', type: 'text', required: true, defaultValue: 'Frequently Asked Questions' },
    {
      name: 'faqs',
      friendlyName: 'FAQs',
      type: 'list',
      defaultValue: [
        { question: 'What is this?', answer: 'This is a minimal Builder.io reproduction.' },
        { question: 'How does it work?', answer: 'It uses the same integration layer as xflow-web.' },
      ],
      subFields: [
        { name: 'question', friendlyName: 'Question', type: 'text', required: true },
        { name: 'answer', friendlyName: 'Answer', type: 'longText', required: true },
      ],
    },
  ],
});
