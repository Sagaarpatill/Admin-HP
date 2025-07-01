// frontend/src/pages/Projects/OverviewTab.js

import React, { useState, useEffect, useCallback } from 'react';
import {
    Container, Row, Col, Card, CardBody, CardHeader, Badge, Button
} from 'reactstrap';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

// Assuming you have a fetchProject function in your api.js
import { fetchProject } from '../../../api';

const OverviewTab = () => {
    // Get projectId from URL parameters
    const { id: projectIdFromUrl } = useParams();

    // State to hold the project details
    const [projectDetails, setProjectDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch project details
    const loadProjectDetails = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchProject(projectIdFromUrl);
            setProjectDetails(data);

        } catch (err) {
            console.error("Error loading project details:", err);
            const errorMessage = err.response && err.response.data && (err.response.data.message || err.response.data.error)
                ? (err.response.data.message || err.response.data.error)
                : (err.message || "Unknown error.");
            setError("Failed to load project details. " + errorMessage);
            toast.error("Failed to load project details: " + errorMessage);
        } finally {
            setLoading(false);
        }
    }, [projectIdFromUrl]);

    // Fetch project details when the component mounts or projectId changes
    useEffect(() => {
        if (projectIdFromUrl) {
            loadProjectDetails();
        } else {
            setLoading(false);
            setError("No Project ID provided in the URL.");
            toast.error("No Project ID provided for overview.");
        }
    }, [projectIdFromUrl, loadProjectDetails]);

    if (loading) {
        return (
            <Container fluid className="p-4 text-center">
                <p>Loading project details...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container fluid className="p-4 text-danger text-center">
                <p>{error}</p>
            </Container>
        );
    }

    if (!projectDetails) {
        return (
            <Container fluid className="p-4 text-muted text-center">
                <p>No project details available.</p>
            </Container>
        );
    }

    // Helper function to render supervisor details
    // This function is still present but its main content is inlined below for consistency
    // with the customer details structure.
    const renderSupervisorDetails = (supervisor, index) => {
        if (!supervisor || (!supervisor.name && !supervisor.phone_number && !supervisor.email)) {
            return (
                <div className="text-muted text-center p-3">
                    <p className="mb-0">Supervisor {index + 1}: Not Allocated</p>
                </div>
            );
        }
        return (
            <div className="p-4">
                <h5 className="mb-3 text-primary border-bottom pb-2">Supervisor {index + 1}</h5>
                <ul className="list-unstyled mb-0">
                    <li className="d-flex align-items-center mb-2">
                        <i className="ri-user-line text-info me-2 fs-5"></i>
                        <p className="mb-0"><strong>Name:</strong> {supervisor.name || "N/A"}</p>
                    </li>
                    <li className="d-flex align-items-center mb-2">
                        <i className="ri-phone-line text-success me-2 fs-5"></i>
                        <p className="mb-0"><strong>Phone:</strong> {supervisor.phone_number || "N/A"}</p>
                    </li>
                    <li className="d-flex align-items-center">
                        <i className="ri-mail-line text-warning me-2 fs-5"></i>
                        <p className="mb-0"><strong>Email:</strong> {supervisor.email || "N/A"}</p>
                    </li>
                </ul>
            </div>
        );
    };

    // Prepare supervisor data for rendering
    const supervisorsToDisplay = [];
    if (projectDetails.supervisor1) supervisorsToDisplay.push(projectDetails.supervisor1);
    if (projectDetails.supervisor2) supervisorsToDisplay.push(projectDetails.supervisor2);
    if (projectDetails.supervisor3) supervisorsToDisplay.push(projectDetails.supervisor3);

    // Fallback for older projects or if backend still only sends 'supervisor'
    if (supervisorsToDisplay.length === 0 && projectDetails.supervisor) {
        supervisorsToDisplay.push(projectDetails.supervisor);
    }


    return (
        <Container fluid className="p-0">
            {/* Project Information Section - ENHANCED FOR READABILITY */}
            <Card className="mb-4">
                <CardHeader className="bg-light d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Project Details</h5> {/* Changed title for clarity */}
                    {projectDetails.status && (
                        <Badge
                            color={
                                projectDetails.status === "Completed" ? "success" :
                                projectDetails.status === "In Progress" ? "primary" :
                                projectDetails.status === "On Hold" ? "warning" :
                                "secondary"
                            }
                            className="fs-12"
                        >
                            {projectDetails.status}
                        </Badge>
                    )}
                </CardHeader>
                <CardBody className="p-4">
                    <Row className="g-4"> {/* Increased gap for better spacing */}
                        {/* Group 1: Core Project Identifiers */}
                        <Col lg={6} md={12}>
                            <Card className="h-100 shadow-sm border border-primary">
                                <CardBody>
                                    <h6 className="mb-3 text-primary"><i className="ri-information-line me-2"></i>General Info</h6>
                                    <ul className="list-unstyled mb-0">
                                        <li className="d-flex align-items-center mb-2">
                                            <i className="ri-projector-line text-info me-2 fs-5"></i>
                                            <p className="mb-0"><strong>Project Name:</strong> {projectDetails.projectName || "N/A"}</p>
                                        </li>
                                        <li className="d-flex align-items-center">
                                            <i className="ri-hashtag text-secondary me-2 fs-5"></i>
                                            <p className="mb-0"><strong>Project ID:</strong> {projectDetails.projectId || "N/A"}</p>
                                        </li>
                                    </ul>
                                </CardBody>
                            </Card>
                        </Col>

                        {/* Group 2: Location Details */}
                        <Col lg={6} md={12}>
                            <Card className="h-100 shadow-sm border border-success">
                                <CardBody>
                                    <h6 className="mb-3 text-success"><i className="ri-map-pin-line me-2"></i>Location</h6>
                                    <ul className="list-unstyled mb-0">
                                        <li className="d-flex align-items-center mb-2">
                                            <i className="ri-map-pin-line text-danger me-2 fs-5"></i>
                                            <p className="mb-0"><strong>Pin Code:</strong> {projectDetails.pinCode || "N/A"}</p>
                                        </li>
                                        <li className="d-flex align-items-center">
                                            <i className="ri-global-line text-info me-2 fs-5"></i>
                                            <p className="mb-0"><strong>Coordinates:</strong> {projectDetails.latitude && projectDetails.longitude ? `${projectDetails.latitude}, ${projectDetails.longitude}` : "N/A"}</p>
                                        </li>
                                    </ul>
                                </CardBody>
                            </Card>
                        </Col>

                        {/* Group 3: Project Specifications */}
                        <Col lg={6} md={12}>
                            <Card className="h-100 shadow-sm border border-warning">
                                <CardBody>
                                    <h6 className="mb-3 text-warning"><i className="ri-grid-fill me-2"></i>Specifications</h6>
                                    <ul className="list-unstyled mb-0">
                                        <li className="d-flex align-items-center mb-2">
                                            <i className="ri-home-4-line text-dark me-2 fs-5"></i>
                                            <p className="mb-0"><strong>Project Type:</strong> {projectDetails.projectType || "N/A"}</p>
                                        </li>
                                        <li className="d-flex align-items-center mb-2">
                                            <i className="ri-shape-2-line text-purple me-2 fs-5"></i>
                                            <p className="mb-0"><strong>Land Area:</strong> {projectDetails.landArea ? `${projectDetails.landArea} sq ft` : "N/A"}</p>
                                        </li>
                                        <li className="d-flex align-items-center mb-2">
                                            <i className="ri-building-line text-success me-2 fs-5"></i>
                                            <p className="mb-0"><strong>Construction Area:</strong> {projectDetails.constructionArea ? `${projectDetails.constructionArea} sq ft` : "N/A"}</p>
                                        </li>
                                        <li className="d-flex align-items-center mb-2">
                                            <i className="ri-building-3-line text-warning me-2 fs-5"></i>
                                            <p className="mb-0"><strong>Number of Floors:</strong> {projectDetails.numFloors || "N/A"}</p>
                                        </li>
                                        <li className="d-flex align-items-center mb-2">
                                            <i className="ri-door-open-line text-info me-2 fs-5"></i>
                                            <p className="mb-0"><strong>Number of Rooms:</strong> {projectDetails.numRooms || "N/A"}</p>
                                        </li>
                                        <li className="d-flex align-items-center">
                                            <i className="ri-restaurant-line text-danger me-2 fs-5"></i>
                                            <p className="mb-0"><strong>Number of Kitchens:</strong> {projectDetails.numKitchens || "N/A"}</p>
                                        </li>
                                    </ul>
                                </CardBody>
                            </Card>
                        </Col>

                        {/* Group 4: Financials & Dates */}
                        <Col lg={6} md={12}>
                            <Card className="h-100 shadow-sm border border-info">
                                <CardBody>
                                    <h6 className="mb-3 text-info"><i className="ri-wallet-line me-2"></i>Financials & Timeline</h6>
                                    <ul className="list-unstyled mb-0">
                                        <li className="d-flex align-items-center mb-2">
                                            <i className="ri-hand-coin-line text-success me-2 fs-5"></i>
                                            <p className="mb-0"><strong>Project Cost:</strong> {projectDetails.projectCost ? `₹ ${projectDetails.projectCost}` : "N/A"}</p>
                                        </li>
                                        <li className="d-flex align-items-center mb-2">
                                            <i className="ri-calendar-line text-secondary me-2 fs-5"></i>
                                            <p className="mb-0"><strong>Start Date:</strong> {projectDetails.startDate || "N/A"}</p>
                                        </li>
                                        <li className="d-flex align-items-center">
                                            <i className="ri-calendar-check-line text-primary me-2 fs-5"></i>
                                            <p className="mb-0"><strong>End Date:</strong> {projectDetails.endDate || "N/A"}</p>
                                        </li>
                                    </ul>
                                </CardBody>
                            </Card>
                        </Col>

                        {/* Group 5: Associated Files */}
                        <Col xs={12}>
                            <Card className="shadow-sm border border-dark">
                                <CardBody>
                                    <h6 className="mb-3 text-dark"><i className="ri-folder-open-line me-2"></i>Associated Files</h6>
                                    <Row className="g-2">
                                        <Col md={4} className="d-flex align-items-center">
                                            <i className="ri-file-3-line text-dark me-2 fs-5"></i>
                                            <p className="mb-0 me-2"><strong>BIM File:</strong></p>
                                            {projectDetails.bimFilePath ? (
                                                <Button size="sm" color="info" href={projectDetails.bimFilePath} target="_blank" rel="noopener noreferrer">View BIM File <i className="ri-external-link-line align-bottom"></i></Button>
                                            ) : <span className="text-muted">N/A</span>}
                                        </Col>
                                        <Col md={4} className="d-flex align-items-center">
                                            <i className="ri-ruler-line text-info me-2 fs-5"></i>
                                            <p className="mb-0 me-2"><strong>Floor Plan:</strong></p>
                                            {projectDetails.floorPlanFilePath ? (
                                                <Button size="sm" color="info" href={projectDetails.floorPlanFilePath} target="_blank" rel="noopener noreferrer">View Floor Plan <i className="ri-external-link-line align-bottom"></i></Button>
                                            ) : <span className="text-muted">N/A</span>}
                                        </Col>
                                        <Col md={4} className="d-flex align-items-center">
                                            <i className="ri-paint-brush-line text-warning me-2 fs-5"></i>
                                            <p className="mb-0 me-2"><strong>Design File:</strong></p>
                                            {projectDetails.designFilePath ? (
                                                <Button size="sm" color="info" href={projectDetails.designFilePath} target="_blank" rel="noopener noreferrer">View Design File <i className="ri-external-link-line align-bottom"></i></Button>
                                            ) : <span className="text-muted">N/A</span>}
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>

                        {/* Group 6: Project Description */}
                        <Col xs={12}>
                            <Card className="shadow-sm border border-secondary">
                                <CardBody>
                                    <h6 className="mb-3 text-secondary"><i className="ri-file-text-line me-2"></i>Description</h6>
                                    <p className="text-muted mb-0">{projectDetails.description || "No description available for this project."}</p>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </CardBody>
            </Card>

            {/* Customer Information Section - NOW ENHANCED FOR READABILITY */}
            <Card className="mb-4">
                <CardHeader className="bg-light">
                    <h5 className="mb-0">Customer Information</h5>
                </CardHeader>
                <CardBody className="p-4">
                    {projectDetails.customer?.name || projectDetails.customer?.phoneNumber || projectDetails.customer?.email || projectDetails.customerPhone ? (
                        <Card className="h-100 shadow-sm border border-info"> {/* Added card for customer details */}
                            <CardBody className="p-4"> {/* Added padding to inner card body */}
                                <h6 className="mb-3 text-info"><i className="ri-account-circle-line me-2"></i>Customer Details</h6> {/* Added heading for inner card */}
                                <ul className="list-unstyled mb-0">
                                    <li className="d-flex align-items-center mb-2">
                                        <i className="ri-user-line text-info me-2 fs-5"></i>
                                        <p className="mb-0"><strong>Name:</strong> {projectDetails.customer?.name || "N/A"}</p>
                                    </li>
                                    <li className="d-flex align-items-center mb-2">
                                        <i className="ri-phone-line text-success me-2 fs-5"></i>
                                        <p className="mb-0"><strong>Phone:</strong> {projectDetails.customer?.phoneNumber || projectDetails.customerPhone || "N/A"}</p>
                                    </li>
                                    <li className="d-flex align-items-center">
                                        <i className="ri-mail-line text-warning me-2 fs-5"></i>
                                        <p className="mb-0"><strong>Email:</strong> {projectDetails.customer?.email || "N/A"}</p>
                                    </li>
                                </ul>
                            </CardBody>
                        </Card>
                    ) : (
                        <p className="text-muted text-center py-3 mb-0">No customer information available for this project.</p>
                    )}
                </CardBody>
            </Card>

            {/* Supervisor Information Section - NOW CONSISTENT WITH CUSTOMER DESIGN */}
            <Card>
                <CardHeader className="bg-light">
                    <h5 className="mb-0">Supervisor Information</h5>
                </CardHeader>
                <CardBody>
                    {supervisorsToDisplay.length > 0 ? (
                        <Row className="g-3">
                            {supervisorsToDisplay.map((supervisor, index) => (
                                <Col key={`sup-details-${index}`} xs={12} md={6} lg={4}>
                                    {/* This is the key change: Each supervisor gets their own inner Card */}
                                    <Card className="h-100 shadow-sm border border-info"> {/* Changed border color to info */}
                                        <CardBody className="p-4"> {/* Ensure consistent padding */}
                                            {supervisor && (supervisor.name || supervisor.phone_number || supervisor.email) ? (
                                                <>
                                                    {/* Changed heading color to text-info for consistency */}
                                                    <h6 className="mb-3 text-info border-bottom pb-2"><i className="ri-account-circle-line me-2"></i>Supervisor {index + 1} Details</h6>
                                                    <ul className="list-unstyled mb-0">
                                                        <li className="d-flex align-items-center mb-2">
                                                            <i className="ri-user-line text-info me-2 fs-5"></i>
                                                            <p className="mb-0"><strong>Name:</strong> {supervisor.name || "N/A"}</p>
                                                        </li>
                                                        <li className="d-flex align-items-center mb-2">
                                                            <i className="ri-phone-line text-success me-2 fs-5"></i>
                                                            <p className="mb-0"><strong>Phone:</strong> {supervisor.phone_number || "N/A"}</p>
                                                        </li>
                                                        <li className="d-flex align-items-center">
                                                            <i className="ri-mail-line text-warning me-2 fs-5"></i>
                                                            <p className="mb-0"><strong>Email:</strong> {supervisor.email || "N/A"}</p>
                                                        </li>
                                                    </ul>
                                                </>
                                            ) : (
                                                <p className="text-muted text-center py-3 mb-0">Supervisor {index + 1}: Not Allocated</p>
                                            )}
                                        </CardBody>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <Row>
                            <Col xs={12}>
                                <p className="text-muted text-center py-3 mb-0">No supervisors allocated to this project.</p>
                            </Col>
                        </Row>
                    )}
                </CardBody>
            </Card>
        </Container>
    );
};

export default OverviewTab;
