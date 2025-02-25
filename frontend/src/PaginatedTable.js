import React, { useState } from 'react';

function PaginatedTable({ columns, data, title, onAdd, onEdit, onDelete }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    return (
        <div>
            <div>
                <h3>{title}</h3>
                <button onClick={onAdd}>Add</button>
            </div>

            <div>
                <table>
                    <thead>
                        <tr>
                            {columns.map((col, index) => (
                                <th key={index}>{col.name}</th>
                            ))}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((item, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex}>{col.selector(item)}</td>
                                ))}
                                <td>
                                    <button onClick={() => onEdit(item)}>Edit</button>
                                    <button onClick={() => onDelete(item)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div>
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default PaginatedTable;