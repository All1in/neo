import { useEffect, useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useFetch } from "../../hooks/useFetch.js";
import './NeoList.css'

const NeoList = () => {
    const [highlightedNeos, setHighlightedNeos] = useState([]);
    const {
        neos,
        isLoading,
        setNeos,
        fetchNeoData
    } = useFetch()


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
        if (neos.length === 7) {
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

