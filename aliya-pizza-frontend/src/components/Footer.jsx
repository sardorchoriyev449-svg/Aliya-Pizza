export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--char-600)', padding: '28px 20px', textAlign: 'center',
      color: 'var(--flour-200)', opacity: .55, fontSize: 13, marginTop: 'auto',
    }}>
      © {new Date().getFullYear()} Aliya Pizza — barcha huquqlar himoyalangan.
    </footer>
  );
}
