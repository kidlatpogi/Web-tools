import '../CSS/SimpleList.css';

export default function SimpleList({ items = [], title = '' }) {
  return (
    <div className="simple-list-container">
      {title && <h3 className="simple-list-title">{title}</h3>}
      <ul className="simple-list">
        {items.map((item, index) => (
          <li key={index} className="simple-list-item">
            {typeof item === 'string' ? item : item.content || item}
          </li>
        ))}
      </ul>
    </div>
  );
}
