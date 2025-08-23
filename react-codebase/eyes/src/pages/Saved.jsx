import React from 'react';
import Card from '../components/ui/Card';
import FeedLayout from '../components/feed/FeedLayout';

const Saved = () => {
  const items = [
    { id: 1, title: 'How to stay safe during a city-wide alert', by: 'Admin' },
    { id: 2, title: 'Neighborhood watch guidelines', by: 'Community Team' },
  ];

  return (
    <FeedLayout title="Saved">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {items.map(item => (
          <Card key={item.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>{item.title}</div>
              <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{item.by}</div>
            </div>
          </Card>
        ))}
      </div>
    </FeedLayout>
  );
};

export default Saved;
