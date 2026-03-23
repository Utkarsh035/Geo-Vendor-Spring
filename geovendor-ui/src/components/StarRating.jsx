import { useState } from 'react';

export default function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  const count = value ? (value.match(/fas fa-star/g) || []).length : 0;

  const handleClick = (idx) => {
    const ratingString = Array(idx).fill('fas fa-star').join(',');
    onChange(ratingString);
  };

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((i) => (
        <i
          key={i}
          className={`fas fa-star${(hover || count) >= i ? ' active' : ''}`}
          onClick={() => handleClick(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          style={{ cursor: 'pointer' }}
        ></i>
      ))}
    </div>
  );
}
