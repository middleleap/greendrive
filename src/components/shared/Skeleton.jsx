export function Skeleton({ className = '', width, height, rounded = 'rounded-lg' }) {
  return (
    <div
      className={`skeleton-pulse bg-bank-gray-alt/50 ${rounded} ${className}`}
      style={{ width, height }}
    />
  );
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2.5 ${className}`}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          height={12}
          className={i === lines - 1 ? 'w-3/5' : 'w-full'}
          rounded="rounded"
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ children, className = '' }) {
  return (
    <div className={`card p-6 ${className}`}>
      {children || (
        <>
          <Skeleton height={14} className="w-2/5 mb-4" rounded="rounded" />
          <SkeletonText />
        </>
      )}
    </div>
  );
}

export function ScoreTabSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SkeletonCard>
          <div className="flex flex-col items-center py-6">
            <Skeleton width={180} height={180} rounded="rounded-full" />
            <Skeleton width={120} height={24} className="mt-4" />
          </div>
        </SkeletonCard>
        <SkeletonCard className="md:col-span-2">
          <Skeleton height={14} className="w-2/5 mb-5" rounded="rounded" />
          <div className="space-y-4">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between">
                  <Skeleton width={100} height={11} rounded="rounded" />
                  <Skeleton width={40} height={11} rounded="rounded" />
                </div>
                <Skeleton height={8} className="w-full" rounded="rounded-full" />
              </div>
            ))}
          </div>
        </SkeletonCard>
      </div>
      <SkeletonCard>
        <Skeleton height={14} className="w-1/4 mb-3" rounded="rounded" />
        <Skeleton height={200} className="w-full" />
      </SkeletonCard>
    </div>
  );
}

export function VehicleTabSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SkeletonCard>
        <Skeleton height={14} className="w-2/5 mb-4" rounded="rounded" />
        <div className="space-y-3">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton width={80} height={12} rounded="rounded" />
              <Skeleton width={120} height={12} rounded="rounded" />
            </div>
          ))}
        </div>
      </SkeletonCard>
      <SkeletonCard>
        <Skeleton height={14} className="w-2/5 mb-4" rounded="rounded" />
        <Skeleton height={24} className="w-1/3 mb-3" />
        <Skeleton height={8} className="w-full" rounded="rounded-full" />
      </SkeletonCard>
      <SkeletonCard className="md:col-span-2">
        <Skeleton height={14} className="w-1/4 mb-3" rounded="rounded" />
        <Skeleton height={240} className="w-full" />
      </SkeletonCard>
    </div>
  );
}

export function ChargingTabSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SkeletonCard>
        <Skeleton height={14} className="w-2/5 mb-4" rounded="rounded" />
        <Skeleton height={12} className="w-full mb-4" rounded="rounded-full" />
        <div className="space-y-2">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton width={100} height={12} rounded="rounded" />
              <Skeleton width={40} height={12} rounded="rounded" />
            </div>
          ))}
        </div>
      </SkeletonCard>
      <div className="space-y-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}

export function RateTabSkeleton() {
  return (
    <div className="space-y-6">
      <SkeletonCard>
        <Skeleton height={14} className="w-2/5 mb-5" rounded="rounded" />
        <div className="flex items-center gap-4">
          <Skeleton height={80} className="flex-1" />
          <Skeleton width={40} height={40} rounded="rounded-full" />
          <Skeleton height={80} className="flex-1" />
        </div>
      </SkeletonCard>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
