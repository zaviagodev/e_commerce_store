import ProductCardSkeleton from "./ProductCardSkeleton";

const ProductListSkeleton = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12">
      {showProductSkeletons(8)}
    </div>
  );
};

export const showProductSkeletons = (loop: number) => {
  const skeletons = []
  for (let i = 0; i < loop; i++){
    skeletons.push(<ProductCardSkeleton key={i}/>)
  }
  return skeletons
}

export default ProductListSkeleton;