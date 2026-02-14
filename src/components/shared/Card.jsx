export default function Card({ children, className = '', padding = true, featured = false }) {
  return (
    <div className={`${featured ? 'card-featured' : 'card'} ${padding ? 'p-6' : ''} ${className}`}>
      {children}
    </div>
  );
}
