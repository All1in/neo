import axios from 'axios';
import { useEffect, useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import './NeoList.css'

const NeoList = () => {
    const [neos, setNeos] = useState([]);
    const [highlightedNeos, setHighlightedNeos] = useState([]);
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

    useEffect(() => {
        fetchNeoData();
        const interval = setInterval(fetchNeoData, 5000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const sortedNeos = [...neos].sort((a, b) => b.hazardousCount - a.hazardousCount);
        setHighlightedNeos(sortedNeos.slice(0, 2));
    }, [neos]);

    const removeOldestNeo = () => {
        setNeos((prevNeos) => prevNeos.slice(1));
    };

    useEffect(() => {
        if (neos.length === 6) {
            removeOldestNeo();
        }
    }, [neos]);

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Near Orbital Objects (NEO)
            </Typography>
            { isLoading && <div className="custom-loader"></div> }
            {neos.map((neo) => (
                <Box
                    key={neo.date}
                    sx={{
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        padding: '1rem',
                        marginBottom: '1rem',
                        backgroundColor: highlightedNeos.includes(neo) ? '#ff0000' : '#fff',
                        color: highlightedNeos.includes(neo) ? '#fff' : '#000',
                    }}
                >
                    <Typography variant="h5" component="h2">
                        Date: {neo.date}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Max Estimated Diameter (km): {neo.maxEstimatedDiameter}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Potentially Hazardous NEOs: {neo.hazardousCount}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Closest NEO (km): {neo.closestNeo.close_approach_data[0].miss_distance.kilometers}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Fastest NEO (kph): {neo.fastestNeo.close_approach_data[0].relative_velocity.kilometers_per_hour}
                    </Typography>
                </Box>
            ))}
        </Container>
    );
};

export default NeoList;

