import { SfIconArrowBack, SfIconArrowForward } from '@storefront-ui/react';
import React, { useState, useEffect } from 'react';

const Pagination = ({ total,perpage,indexproducts,selectedpage }) => {
  const initialPage = typeof selectedpage !== 'undefined' ? selectedpage : 1;


  const [currentPage, setCurrentPage] = useState(initialPage);
  const [startIndex, setStartIndex] = useState(1);
  const itemsPerPage = perpage;

  useEffect(() => {
    const newStartIndex = (currentPage - 1) * itemsPerPage;
    setStartIndex(newStartIndex >= 0 ? newStartIndex : 0);
    

  }, [currentPage]);

  const totalPages = Math.ceil(total / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    indexproducts(newPage);
  };

  const renderItemsForPage = () => {
    const endIndex = Math.min(startIndex + itemsPerPage, total);
    const itemsForPage = Array.from({ length: endIndex - startIndex }, (_, index) => `Item ${startIndex + index + 1}`);

    return itemsForPage.map((item, index) => (
      <li key={index}>{item}</li>
    ));
  };

  return (
    <div className='w-full flex justify-between items-center mt-20'>
      <button className={`flex items-center gap-x-2 ${currentPage <= 1 ? 'text-secgray' : ''}`} onClick={() => handlePageChange(parseInt(currentPage) - 1)} disabled={currentPage <= 1}>
        <SfIconArrowBack className='w-5 h-5'/>
        ก่อนหน้า
      </button>
      <div className='flex gap-x-[2px]'>
      {[...Array(totalPages).keys()].map((page) => (
          <button
            className={`h-10 w-10 rounded-lg hover:bg-zinc-100 hover:text-maingray ${currentPage == page + 1 || selectedpage == page+1 ? 'bg-zinc-100' : 'bg-white text-maingray'}`}
            key={page + 1}
            onClick={() => handlePageChange(page + 1)}
            disabled={currentPage == page + 1}
          >
            {page + 1}
          </button>
      ))}


      </div>
      <button className={`flex items-center gap-x-2 ${currentPage >= totalPages ? 'text-secgray' : ''}`} onClick={() => handlePageChange(parseInt(currentPage) + 1)} disabled={currentPage >= totalPages}>
        ถัดไป
        <SfIconArrowForward className='w-5 h-5'/>
      </button>
    </div>
  );
};

export default Pagination;