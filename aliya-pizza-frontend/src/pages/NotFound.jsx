import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container" style={{ padding: '100px 20px', textAlign: 'center', flex: 1 }}>
      <h1 style={{ fontSize: 64, marginBottom: 12 }}>404</h1>
      <p style={{ opacity: .7, marginBottom: 20 }}>Bu sahifa topilmadi.</p>
      <Link to="/" className="btn btn-primary">Bosh sahifaga</Link>
    </div>
  );
}
