import React, { useState } from 'react';

function PaginatedTable({ columns, data, title, onAdd, onEdit, onDelete }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold">{title}</h3>
                <button
                    onClick={onAdd}
                    className="w-[100px] px-3 py-1 border rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                    Add
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            {columns.map((col, index) => (
                                <th key={index} className="border border-gray-300 px-4 py-2">
                                    {col.name}
                                </th>
                            ))}
                            <th className="border border-gray-300 px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((item, rowIndex) => (
                            <tr key={rowIndex} className="border border-gray-300">
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} className="border border-gray-300 px-4 py-2">
                                        {col.selector(item)}
                                    </td>
                                ))}
                                <td className="border border-gray-300 px-4 py-2 flex gap-2">
                                    <button
                                        onClick={() => onEdit(item)}
                                        className="w-[100px] px-2 py-1 border rounded bg-yellow-500 text-white hover:bg-yellow-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(item)}
                                        className="w-[100px] px-2 py-1 border rounded bg-red-500 text-white hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex justify-center items-center gap-2">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    aria-label="Previous Page"
                >
                    Previous
                </button>
                <span className="text-sm">Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    aria-label="Next Page"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default PaginatedTable;