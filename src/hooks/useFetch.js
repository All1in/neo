import {useState} from "react";
import axios from "axios";

export const useFetch = () => {
    const [neos, setNeos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchNeoData = async () => {
        setIsLoading(true);
        try {
            const date = new Date();
            const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
            const endDate = date;
            const formattedStartDate = startDate.toISOString().split('T')[0];
            const formattedEndDate = endDate.toISOString().split('T')[0];

            const response = await axios.get(
                `https://api.nasa.gov/neo/rest/v1/feed?start_date=${formattedStartDate}&end_date=${formattedEndDate}&api_key=${import.meta.env.VITE_API_KEY}`
            );

            const neoData = response.data.near_earth_objects;
            const neoDates = Object.keys(neoData);

            const neoList = neoDates.map((date) => {
                const neosForDay = neoData[date];
                const maxEstimatedDiameter = Math.max(
                    ...neosForDay.map((neo) => neo.estimated_diameter.kilometers.estimated_diameter_max)
                );
                const hazardousCount = neosForDay.filter((neo) => neo.is_potentially_hazardous_asteroid).length;

                const closestNeo = neosForDay.reduce((closest, neo) => {
                    return neo.close_approach_data[0].miss_distance.kilometers < closest.close_approach_data[0].miss_distance.kilometers
                        ? neo
                        : closest;
                });

                const fastestNeo = neosForDay.reduce((fastest, neo) => {
                    return neo.close_approach_data[0].relative_velocity.kilometers_per_hour >
                    fastest.close_approach_data[0].relative_velocity.kilometers_per_hour
                        ? neo
                        : fastest;
                });

                return {
                    date,
                    maxEstimatedDiameter,
                    hazardousCount,
                    closestNeo,
                    fastestNeo,
                };
            });

            setNeos(neoList);
        } catch (error) {
            console.error('Error fetching NEO data:', error);
        } finally {
            setIsLoading(false);
        }
    };


    return {
        neos,
        isLoading,
        fetchNeoData,
        setNeos
    }
}
