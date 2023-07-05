import { useState } from "react";
import { Container, Typography, Box } from '@mui/material';

const NeoList = () => {
    const [neos, setNeos] = useState([]);

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Near Orbital Objects (NEO)
            </Typography>
        </Container>
    );
};

export default NeoList;
