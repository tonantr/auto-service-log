import { useState } from "react";

function usePagination(initialPage = 1, initialPerPage = 10) {
    const [page, setPage] = useState(initialPage);
    const [perPage, setPerPage] = useState(initialPerPage);
    const [totalPages, setTotalPages] = useState(0);

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    const handlePreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const setTotalPagesCount = (total) => {
        setTotalPages(total);
    };

    const paginationControls = (
        <div style={{ marginTop: "20px" }}>
            <button onClick={handlePreviousPage} disabled={page === 1}>
                Previous
            </button>
            <span> Page {page} of {totalPages} </span>
            <button onClick={handleNextPage} disabled={page === totalPages}>
                Next
            </button>
        </div>
    );

    return {
        page,
        perPage,
        setPerPage,
        setTotalPagesCount,
        paginationControls,
    };
}

export default usePagination