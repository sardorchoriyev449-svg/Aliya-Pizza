import './CategoryTabs.css';

export default function CategoryTabs({ categories, onPick }) {
  return (
    <div className="category-tabs-wrap">
      <div className="container">
        <div className="category-tabs">
          {categories.map((c) => (
            <button key={c._id} className="tab" onClick={() => onPick(c._id)}>
              {c.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
