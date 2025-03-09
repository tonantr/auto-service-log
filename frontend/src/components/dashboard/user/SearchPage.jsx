import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import usePagination from "../../../usePagination";
import { BASE_URL } from "../../../config";

function SearchPage() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query");

    const [results, setResults] = useState({ users: [], cars: [], services: [] });
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const {
        page,
        perPage,
        setTotalPagesCount,
        paginationControls,
    } = usePagination();

    useEffect(() => {
        const token = localStorage.getItem("access_token");

        if (!token) {
            navigate("/login");
            return;
        }

        const fetchResults = async () => {
            if (!query) return;
            try {
                const response = await axios.get(`${BASE_URL}/user/search?query=${query}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { page, per_page: perPage },
                });

                setResults({
                    users: response.data.users?.data || [],
                    cars: response.data.cars?.data || [],
                    services: response.data.services?.data || [],
                });
                setTotalPagesCount(response.data.total_pages || 0);
            } catch (error) {
                if (error.response?.status === 401) {
                    localStorage.removeItem("access_token");
                    navigate("/login");
                } else {
                    console.error("Search error:", error);
                    setError("An error occurred while fetching search results.");
                }
            }
        };

        fetchResults();
    }, [query, page, perPage, navigate]);

    const getColumnsAndData = () => {
        if (results.cars.length > 0) {
            return {
                columns: [
                    { name: "ID", selector: row => row.car_id },
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
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {data.length === 0 && <p>No results found.</p>}
            {data.length > 0 && (
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
                                <tr key={row.service_id || row.car_id}>
                                    {columns.map((column) => (
                                        <td key={column.name}>
                                            {column.selector(row)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {paginationControls}
                </div>
            )}
        </div>
    );
}

export default SearchPage;