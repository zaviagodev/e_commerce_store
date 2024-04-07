const SvgSkeleton = ({ className }: { className?: string }) => {
  return <svg className={className + " animate-pulse rounded bg-gray-300"} />;
};

export default SvgSkeleton;
