import React, { useState, useEffect } from 'react';



const Pagination = ({ total,perpage,indexproducts }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = perpage;

  useEffect(() => {
    const newStartIndex = (currentPage - 1) * itemsPerPage;
    setStartIndex(newStartIndex >= 0 ? newStartIndex : 0);
    indexproducts(newStartIndex);
    console.log(newStartIndex);
  }, [currentPage, itemsPerPage, indexproducts]);

  const totalPages = Math.ceil(total / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const renderItemsForPage = () => {
    const endIndex = Math.min(startIndex + itemsPerPage, total);
    const itemsForPage = Array.from({ length: endIndex - startIndex }, (_, index) => `Item ${startIndex + index + 1}`);

    return itemsForPage.map((item, index) => (
      <li key={index}>{item}</li>
    ));
  };

  return (
    <div>
      <div>
        {[...Array(totalPages).keys()].map((page) => (
          <button key={page + 1} onClick={() => handlePageChange(page + 1)} disabled={currentPage === page + 1}>
            {page + 1}
          </button>
        ))}
      </div>
      
    </div>
  );
};

export default Pagination;
