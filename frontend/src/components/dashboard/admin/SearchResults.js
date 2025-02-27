import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import usePagination from "../../../usePagination";

function SearchResults() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query");

    const [results, setResults] = useState({ users: [], cars: [], services: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const {
        page,
        perPage,
        totalPages,
        handleNextPage,
        handlePreviousPage,
        setTotalPagesCount,
    } = usePagination();

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) return;

            setLoading(true);

            try {
                const response = await axios.get(`/admin/search?query=${query}`, {
                    params: { page, per_page: perPage },
                });

                console.log("API Response:", response.data);

                setResults({
                    users: response.data.users?.data || [],
                    cars: response.data.cars?.data || [],
                    services: response.data.services?.data || [],
                });

                setTotalPagesCount(response.data.total_pages || 0);
            } catch (error) {
                setError("An error occurred while fetching results.");
                console.error("Search error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query, page, perPage]);

    const getColumnsAndData = () => {
        if (results.users.length > 0) {
            return {
                columns: [
                    { name: "ID", selector: row => row.user_id },
                    { name: "Username", selector: row => row.username },
                    { name: "Role", selector: row => row.role },
                    { name: "Email", selector: row => row.email },
                ],
                data: results.users,
            };
        }
        if (results.cars.length > 0) {
            return {
                columns: [
                    { name: "ID", selector: row => row.car_id },
                    { name: "Owner", selector: row => row.username },
                    { name: "Name", selector: row => row.name },
                    { name: "Model", selector: row => row.model },
                    { name: "Year", selector: row => row.year },
                    { name: "VIN", selector: row => row.vin },
                ],
                data: results.cars,
            };
        }
        if (results.services.length > 0) {
            return {
                columns: [
                    { name: "ID", selector: row => row.service_id },
                    { name: "Car Name", selector: row => row.car_name },
                    { name: "Mileage", selector: row => row.mileage },
                    { name: "Service Type", selector: row => row.service_type },
                    { name: "Service Date", selector: row => row.service_date },
                    { name: "Next Service Date", selector: row => row.next_service_date || "N/A" },
                    { name: "Cost", selector: row => row.cost },
                    { name: "Notes", selector: row => row.notes },
                ],
                data: results.services,
            };
        }

        return { columns: [], data: [] };
    };

    const { columns, data } = getColumnsAndData();

    return (
        <div>
            <h3>
                Search Results for "{query}"
            </h3>

            {error && <p>{error}</p>}
            {loading ? (
                <p>Loading...</p>
            ) : data.length === 0 ? (
                <p>No results found.</p>
            ) : (
                <div>
                    <table>
                        <thead>
                            <tr>
                                {columns.map((column) => (
                                    <th key={column.name}>
                                        {column.name}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row) => (
                                <tr key={row.service_id || row.car_id || row.user_id}>
                                    {columns.map((column) => (
                                        <td key={column.name}>
                                            {column.selector(row)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div>
                        <button
                            onClick={handlePreviousPage}
                            disabled={page === 1}
                        >
                            Previous
                        </button>
                        <span>
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={page === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SearchResults;