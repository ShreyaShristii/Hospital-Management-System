import React from 'react';

/**
 * Pagination Component
 * Displays page navigation controls
 */
const Pagination = ({ total, page, pages, pageSize, onPageChange }) => {
  if (pages <= 1) return null;

  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 0',
      borderTop: '1px solid #ecf0f1',
      marginTop: '20px',
      flexWrap: 'wrap',
      gap: '15px',
    }}>
      {/* Info text */}
      <div style={{
        fontSize: '14px',
        color: '#7f8c8d',
        fontWeight: '500',
      }}>
        Showing <span style={{ color: '#2c3e50', fontWeight: '600' }}>{startItem}</span> to{' '}
        <span style={{ color: '#2c3e50', fontWeight: '600' }}>{endItem}</span> of{' '}
        <span style={{ color: '#2c3e50', fontWeight: '600' }}>{total}</span> results
      </div>

      {/* Pagination controls */}
      <div style={{
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
      }}>
        {/* Previous button */}
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          style={{
            padding: '8px 12px',
            border: '1px solid #ddd',
            background: page === 1 ? '#ecf0f1' : '#ffffff',
            color: page === 1 ? '#95a5a6' : '#2c3e50',
            borderRadius: '4px',
            cursor: page === 1 ? 'not-allowed' : 'pointer',
            fontWeight: '500',
            fontSize: '14px',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (page !== 1) {
              e.target.style.background = '#f4f6f9';
              e.target.style.borderColor = '#2c3e50';
            }
          }}
          onMouseLeave={(e) => {
            if (page !== 1) {
              e.target.style.background = '#ffffff';
              e.target.style.borderColor = '#ddd';
            }
          }}
        >
          ← Previous
        </button>

        {/* Page numbers */}
        <div style={{
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
        }}>
          {renderPageNumbers(page, pages, onPageChange)}
        </div>

        {/* Next button */}
        <button
          onClick={() => onPageChange(Math.min(pages, page + 1))}
          disabled={page === pages}
          style={{
            padding: '8px 12px',
            border: '1px solid #ddd',
            background: page === pages ? '#ecf0f1' : '#ffffff',
            color: page === pages ? '#95a5a6' : '#2c3e50',
            borderRadius: '4px',
            cursor: page === pages ? 'not-allowed' : 'pointer',
            fontWeight: '500',
            fontSize: '14px',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (page !== pages) {
              e.target.style.background = '#f4f6f9';
              e.target.style.borderColor = '#2c3e50';
            }
          }}
          onMouseLeave={(e) => {
            if (page !== pages) {
              e.target.style.background = '#ffffff';
              e.target.style.borderColor = '#ddd';
            }
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

/**
 * Helper function to render page number buttons
 */
const renderPageNumbers = (currentPage, totalPages, onPageChange) => {
  const pages = [];
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  // First page button
  if (startPage > 1) {
    pages.push(
      <button
        key={1}
        onClick={() => onPageChange(1)}
        style={getPageButtonStyle(1 === currentPage)}
      >
        1
      </button>
    );
    if (startPage > 2) {
      pages.push(
        <span key="dots-start" style={{ color: '#95a5a6', padding: '0 4px' }}>
          ...
        </span>
      );
    }
  }

  // Middle page buttons
  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <button
        key={i}
        onClick={() => onPageChange(i)}
        style={getPageButtonStyle(i === currentPage)}
      >
        {i}
      </button>
    );
  }

  // Last page button
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pages.push(
        <span key="dots-end" style={{ color: '#95a5a6', padding: '0 4px' }}>
          ...
        </span>
      );
    }
    pages.push(
      <button
        key={totalPages}
        onClick={() => onPageChange(totalPages)}
        style={getPageButtonStyle(totalPages === currentPage)}
      >
        {totalPages}
      </button>
    );
  }

  return pages;
};

/**
 * Helper function to get page button styling
 */
const getPageButtonStyle = (isActive) => ({
  padding: '6px 10px',
  border: isActive ? '1px solid #2c3e50' : '1px solid #ddd',
  background: isActive ? '#2c3e50' : '#ffffff',
  color: isActive ? '#ffffff' : '#2c3e50',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: isActive ? '600' : '500',
  fontSize: '13px',
  transition: 'all 0.2s ease',
});

export default Pagination;
