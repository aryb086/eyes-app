import React from 'react';
import Card from '../components/ui/Card';
import FeedLayout from '../components/feed/FeedLayout';

const Notifications = () => {
  const items = [
    { id: 1, title: 'New comment on your post', time: '2h ago' },
    { id: 2, title: 'Your post was liked by Alex', time: '5h ago' },
    { id: 3, title: 'City alert: Road closure downtown', time: '1d ago' },
  ];

  return (
    <FeedLayout title="Notifications">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {items.map(n => (
          <Card key={n.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>{n.title}</div>
              <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{n.time}</div>
            </div>
          </Card>
        ))}
      </div>
    </FeedLayout>
  );
};

export default Notifications;
