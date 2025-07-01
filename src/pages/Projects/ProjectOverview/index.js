import React from 'react';
import { Container } from 'reactstrap';
import { useParams } from 'react-router-dom'; // ✅ Import useParams
import Section from './Section';

const ProjectOverview = () => {
    const { id } = useParams(); // ✅ Get the dynamic project ID from the URL

    document.title = "Project Overview | Houzing Partners - Admin & Dashboard";

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    {/* ✅ Pass the ID to Section if needed */}
                    <Section projectId={id} />
                </Container>
            </div>
        </React.Fragment>
    );
};

export default ProjectOverview;
