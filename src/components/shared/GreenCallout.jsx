export default function GreenCallout({ icon, children }) {
  return (
    <div className="bg-green-pastel border-l-3 border-green-deep rounded-lg p-4">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="w-8 h-8 rounded-full bg-green-deep/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg
              className="w-4 h-4 text-green-deep"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
            </svg>
          </div>
        )}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
