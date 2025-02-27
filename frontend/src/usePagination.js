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

    return {
        page,
        perPage,
        setPerPage,
        totalPages,
        handleNextPage,
        handlePreviousPage,
        setTotalPagesCount,
    };
}

export default usePagination