import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import PaginatedTable from "../../../PaginatedTable";

function SearchResults() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query");

    const [results, setResults] = useState({ users: [], cars: [], services: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) return;

            try {
                setLoading(true);
                const response = await axios.get(`/admin/search?query=${query}`);
                console.log(response.data);
                setResults(response.data);
            } catch (error) {
                setError("An error occurred while fetching results.");
                console.error("Search error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    const getColumnsAndData = () => {
        const { users, cars, services } = results;

        if (users.length > 0) {
            return {
                columns: [
                    { name: "ID", selector: row => row.user_id },
                    { name: "Username", selector: row => row.username },
                    { name: "Role", selector: row => row.role },
                    { name: "Email", selector: row => row.email },
                ],
                data: users,
            };
        } else if (cars.length > 0) {
            return {
                columns: [
                    { name: "ID", selector: row => row.car_id },
                    { name: "Owner", selector: row => row.owner },
                    { name: "Name", selector: row => row.name },
                    { name: "Model", selector: row => row.model },
                    { name: "Year", selector: row => row.year },
                    { name: "VIN", selector: row => row.vin },
                ],
                data: cars,
            };
        } else if (services.length > 0) {
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
                data: services,
            };
        }

        return { columns: [], data: [] };
    };

    const { columns, data } = getColumnsAndData();

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Search Results for "{query}"</h1>
            
            {error && <p className="text-red-500">{error}</p>}
            {loading ? (
                <p className="text-gray-600 mt-2">Loading...</p>
            ) : data.length === 0 ? (
                <p>No results found.</p>
            ) : (
                <PaginatedTable columns={columns} data={data} />
            )}
        </div>
    );
}

export default SearchResults;