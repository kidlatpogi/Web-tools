import React from 'react';
import '../CSS/App.css';

export default function ItemCard({ item }) {
  if (!item) {
    return (
      <div className="card">
        <h3>Select an item</h3>
        <p>Click an item from the list to view details.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      {item.tags && <p>Tags: {item.tags.join(', ')}</p>}
      {item.url && (
        <p>
          <a href={item.url} target="_blank" rel="noreferrer">Open {item.name}</a>
        </p>
      )}
    </div>
  );
}
