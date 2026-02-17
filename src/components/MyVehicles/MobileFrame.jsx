export default function MobileFrame({ children }) {
  return (
    <div className="flex justify-center py-8 px-4">
      <div className="mobile-frame">
        <div className="mobile-notch" />
        <div className="mobile-screen">{children}</div>
        <div className="mobile-home-indicator" />
      </div>
    </div>
  );
}
