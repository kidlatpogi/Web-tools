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
      {item.access && <p className="access">{item.access}</p>}
      {item.bestFor && (
        <p className="bestfor"><strong>Best for:</strong> {item.bestFor}</p>
      )}
      <p>{item.description}</p>
      {item.tags && <p>Tags: {item.tags.join(', ')}</p>}

      {/* Links container: primary link and optional Student Offer side-by-side */}
      <div className="card-links">
        {item.url && (
          <a className="card-link" href={item.url} target="_blank" rel="noreferrer">Open {item.name}</a>
        )}

        {item.name && item.name.toLowerCase().includes('gemini') && (
          <a className="card-link student-offer" href="https://gemini.google/students/" target="_blank" rel="noreferrer">Student Offer</a>
        )}

        {item.name && item.name.toLowerCase().includes('perplexity') && (
          <a className="card-link student-offer" href="https://www.perplexity.ai/referrals/Y6KKN1VS" target="_blank" rel="noreferrer">Student Offer</a>
        )}

        {item.id === 'github-copilot' && (
          <a className="card-link student-offer" href="https://github.com/education/students" target="_blank" rel="noreferrer">Student Offer</a>
        )}
      </div>
    </div>
  );
}
