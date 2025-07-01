import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Card, CardBody, Col, Container, Input, Label, Row, Button, Spinner
} from 'reactstrap';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import { toast } from 'react-toastify';

// Import your API functions
import { createProject, fetchSupervisors, fetchCustomers } from '../../../api';

document.title = "Add New Project | Houzing Partners Admin";

const CreateProject = () => {
    const navigate = useNavigate();

    // Form States
    const [projectName, setProjectName] = useState('');
    const [pinCode, setPinCode] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [projectType, setProjectType] = useState(null);
    const [landArea, setLandArea] = useState('');
    const [constructionArea, setConstructionArea] = useState('');
    const [numFloors, setNumFloors] = useState('');
    const [numRooms, setNumNumRooms] = useState('');
    const [numKitchens, setNumKitchens] = useState('');
    // Description field
    const [description, setDescription] = useState('');


    // Project Grid states
    const [projectCost, setProjectCost] = useState('');
    // MODIFIED: selectedSupervisors is an array of objects, each for a dropdown
    const [selectedSupervisors, setSelectedSupervisors] = useState([null]); // Initialize with one null for the first dropdown
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [bimFile, setBimFile] = useState(null);
    const [floorPlanFile, setFloorPlanFile] = useState(null);
    const [designFile, setDesignFile] = useState(null);

    const [customerOtp, setCustomerOtp] = useState('');
    const [customerOtpVerified, setCustomerOtpVerified] = useState(null);

    // MODIFIED: Supervisor OTP States are now arrays
    const [supervisorOtps, setSupervisorOtps] = useState(['']); // One OTP string per supervisor dropdown
    const [supervisorOtpVerifiedStates, setSupervisorOtpVerifiedStates] = useState([null]); // One verification status per dropdown

    // Dynamic Options states
    const [supervisorOptions, setSupervisorOptions] = useState([]);
    const [customerOptions, setCustomerOptions] = useState([]);
    const [loadingSupervisors, setLoadingSupervisors] = useState(true);
    const [loadingCustomers, setLoadingCustomers] = useState(true);
    const [errorSupervisors, setErrorSupervisors] = useState(null);
    const [errorCustomers, setErrorCustomers] = useState(null);

    // NEW: State to manage number of supervisor rows
    const [numSupervisorRows, setNumSupervisorRows] = useState(1); // Start with 1 row of supervisor + OTP

    const projectTypes = [
        { value: 'Bungalow', label: 'Bungalow' },
        { value: 'Industrial Complex', label: 'Industrial Complex' },
        { value: 'Apartment', label: 'Apartment' },
    ];

    // Functions for Customer OTP verification
    const verifyCustomerOtp = () => {
        // Implement actual customer OTP verification logic here (e.g., API call)
        setCustomerOtpVerified(customerOtp === '123456'); // Simple dummy verification
    };

    // NEW: Function for individual Supervisor OTP verification
    const verifyIndividualSupervisorOtp = (index) => {
        const currentOtp = supervisorOtps[index];
        const updatedVerifiedStates = [...supervisorOtpVerifiedStates];
        // Implement actual supervisor OTP verification logic here (e.g., API call)
        updatedVerifiedStates[index] = (currentOtp === '654321'); // Simple dummy verification
        setSupervisorOtpVerifiedStates(updatedVerifiedStates);
    };

    // Fetch Supervisors on component mount
    useEffect(() => {
        const getSupervisors = async () => {
            try {
                setLoadingSupervisors(true);
                const data = await fetchSupervisors();
                console.log("CreateProject: Fetched raw supervisor data:", data);

                const options = data.map(supervisor => ({
                    value: supervisor.id,
                    label: `${supervisor.name || ''} - ${supervisor.phone_number || ''}`.trim()
                }));
                setSupervisorOptions(options);
            } catch (error) {
                console.error("Error fetching supervisors:", error);
                setErrorSupervisors("Failed to load supervisors.");
                toast.error("Failed to load supervisors.");
            } finally {
                setLoadingSupervisors(false);
            }
        };
        getSupervisors();
    }, []);

    // Fetch Customers on component mount
    useEffect(() => {
        const getCustomers = async () => {
            try {
                setLoadingCustomers(true);
                const data = await fetchCustomers();
                console.log("CreateProject: Fetched raw customer data:", data);

                // --- START OF CUSTOMER DATA MAPPING CORRECTION ---
                const options = data.map(customer => ({
                    // Use ac_phone_number as the value as per your backend data
                    value: customer.ac_phone_number,
                    // Combine first name, last name, and phone number for the label
                    label: `${customer.ac_first_name || ''} ${customer.ac_last_name || ''} - ${customer.ac_phone_number || ''}`.trim()
                }));
                // --- END OF CUSTOMER DATA MAPPING CORRECTION ---

                setCustomerOptions(options);
            } catch (error) {
                console.error("Error fetching customers:", error);
                setErrorCustomers("Failed to load customers.");
                toast.error("Failed to load customers.");
            } finally {
                setLoadingCustomers(false);
            }
        };
        getCustomers();
    }, []);

    // Handler for selecting a supervisor in a specific dropdown
    const handleSupervisorSelect = (selectedOption, index) => {
        const updatedSupervisors = [...selectedSupervisors];
        updatedSupervisors[index] = selectedOption;
        setSelectedSupervisors(updatedSupervisors);
    };

    // Handler for changing OTP in a specific supervisor OTP field
    const handleSupervisorOtpChange = (e, index) => {
        const updatedOtps = [...supervisorOtps];
        updatedOtps[index] = e.target.value;
        setSupervisorOtps(updatedOtps);
        // Reset verification status if OTP changes
        const updatedVerifiedStates = [...supervisorOtpVerifiedStates];
        updatedVerifiedStates[index] = null;
        setSupervisorOtpVerifiedStates(updatedVerifiedStates);
    };

    // Handler to add another supervisor row
    const handleAddAnotherSupervisorRow = () => {
        if (numSupervisorRows < 3) { // Limit to 3 rows
            setNumSupervisorRows(prev => prev + 1);
            setSelectedSupervisors(prev => [...prev, null]); // Add a new null entry for the new dropdown
            setSupervisorOtps(prev => [...prev, '']); // Add a new empty OTP entry
            setSupervisorOtpVerifiedStates(prev => [...prev, null]); // Add a new null verification status
        } else {
            toast.info("You can add a maximum of 3 supervisors.");
        }
    };

    // Handler to remove a supervisor row
    const handleRemoveSupervisorRow = (indexToRemove) => {
        if (numSupervisorRows > 1) { // Ensure at least one row remains
            setNumSupervisorRows(prev => prev - 1);
            setSelectedSupervisors(prev => prev.filter((_, index) => index !== indexToRemove));
            setSupervisorOtps(prev => prev.filter((_, index) => index !== indexToRemove));
            setSupervisorOtpVerifiedStates(prev => prev.filter((_, index) => index !== indexToRemove));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("handleSubmit: Form submission initiated.");

        const formData = new FormData();
        formData.append('projectName', projectName);
        formData.append('projectCost', projectCost);
        formData.append('pinCode', pinCode);
        formData.append('latitude', latitude);
        formData.append('longitude', longitude);
        formData.append('projectType', projectType ? projectType.value : '');
        formData.append('landArea', landArea);
        formData.append('constructionArea', constructionArea);
        formData.append('numFloors', numFloors);
        formData.append('numRooms', numRooms);
        formData.append('numKitchens', numKitchens);
        formData.append('customerPhone', selectedCustomer ? selectedCustomer.value : '');
        formData.append('startDate', startDate && startDate[0] ? startDate[0].toISOString().split('T')[0] : '');
        formData.append('endDate', endDate && endDate[0] ? endDate[0].toISOString().split('T')[0] : '');
        // Append description to form data
        formData.append('description', description);

        // --- MODIFIED SECTION FOR SUPERVISOR IDs ---
        // 1. Always append the first selected supervisor as 'supervisorId' (singular)
        if (selectedSupervisors[0] && selectedSupervisors[0].value) {
            formData.append('supervisorId', selectedSupervisors[0].value);
        } else {
            formData.append('supervisorId', ''); // Send empty if none selected for the primary slot
        }

        // 2. Append supervisorId2 and supervisorId3 if they exist
        if (selectedSupervisors[1] && selectedSupervisors[1].value) {
            formData.append('supervisorId2', selectedSupervisors[1].value);
        } else {
            formData.append('supervisorId2', '');
        }

        if (selectedSupervisors[2] && selectedSupervisors[2].value) {
            formData.append('supervisorId3', selectedSupervisors[2].value);
        } else {
            formData.append('supervisorId3', '');
        }

        // Note: Supervisor OTPs and their verified states are likely for a separate backend verification
        // or a different phase of project management, not typically part of the initial project creation.
        // We are no longer appending supervisorOtps or supervisorOtpVerifiedStates
        // directly to the project creation formData to avoid issues if the backend schema
        // for project creation doesn't expect them.
        // --- END MODIFIED SECTION ---

        // --- FIXED FILE UPLOAD FIELD NAMES TO MATCH BACKEND ---
        if (bimFile) formData.append('bimFilePath', bimFile); // Changed key from 'bimFile' to 'bimFilePath'
        if (floorPlanFile) formData.append('floorPlanFilePath', floorPlanFile); // Changed key from 'floorPlanFile' to 'floorPlanFilePath'
        if (designFile) formData.append('designFilePath', designFile); // Changed key from 'designFile' to 'designFilePath'
        // --- END FIXED FILE UPLOAD FIELD NAMES ---

        try {
            console.log("handleSubmit: Calling createProject API...");
            await createProject(formData);
            console.log("handleSubmit: createProject API call successful!");

            toast.success("Project added successfully!");

            console.log("handleSubmit: Attempting to navigate to /apps-projects");
            navigate('/apps-projects'); // Corrected route
            console.log("handleSubmit: Navigation call made.");

            // Reset form fields
            setProjectName('');
            setPinCode('');
            setLatitude('');
            setLongitude('');
            setProjectType(null);
            setLandArea('');
            setConstructionArea('');
            setNumFloors('');
            setNumNumRooms('');
            setNumKitchens('');
            setProjectCost('');
            setSelectedSupervisors([null]); // Reset to one empty supervisor dropdown
            setNumSupervisorRows(1); // Reset dropdown count
            setSupervisorOtps(['']); // Reset OTPs
            setSupervisorOtpVerifiedStates([null]); // Reset OTP verified states
            setSelectedCustomer(null);
            setStartDate(null);
            setEndDate(null);
            setBimFile(null);
            setFloorPlanFile(null);
            setDesignFile(null);
            setCustomerOtp('');
            setCustomerOtpVerified(null);
            // Reset description
            setDescription('');

        } catch (error) {
            console.error("handleSubmit: Error during project creation:", error);
            // Enhanced error message for user
            const displayMessage = error.message || "Failed to create project. Please try again.";
            toast.error(displayMessage);
            if (error.response && error.response.data) {
                console.error("handleSubmit: Server error response data:", error.response.data);
            }
        }
    };

    return (
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Add New Project" pageTitle="Projects" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="projectName">Project Name</Label>
                          <Input
                            type="text"
                            id="projectName"
                            placeholder="Enter project name"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            required
                          />
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="projectType">Project Type</Label>
                          <Select
                            options={projectTypes}
                            value={projectType}
                            onChange={(val) => setProjectType(val)}
                            placeholder="Select type"
                          />
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="pinCode">Project Pin Code</Label>
                          <Input
                            type="text"
                            id="pinCode"
                            placeholder="Enter pin code"
                            value={pinCode}
                            onChange={(e) => setPinCode(e.target.value)}
                          />
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="latitude">Latitude</Label>
                          <Input
                            type="text"
                            id="latitude"
                            placeholder="Enter latitude"
                            value={latitude}
                            onChange={(e) => setLatitude(e.target.value)}
                          />
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="longitude">Longitude</Label>
                          <Input
                            type="text"
                            id="longitude"
                            placeholder="Enter longitude"
                            value={longitude}
                            onChange={(e) => setLongitude(e.target.value)}
                          />
                        </div>
                      </Col>

                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="landArea">Land Area (sq ft)</Label>
                          <Input
                            type="number"
                            id="landArea"
                            placeholder="Enter land area"
                            value={landArea}
                            onChange={(e) => setLandArea(e.target.value)}
                          />
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="constructionArea">
                            Construction Area (sq ft)
                          </Label>
                          <Input
                            type="number"
                            id="constructionArea"
                            placeholder="Enter construction area"
                            value={constructionArea}
                            onChange={(e) =>
                              setConstructionArea(e.target.value)
                            }
                          />
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="numFloors">Number of Floors</Label>
                          <Input
                            type="number"
                            id="numFloors"
                            value={numFloors}
                            onChange={(e) => setNumFloors(e.target.value)}
                          />
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="numRooms">Number of Rooms</Label>
                          <Input
                            type="number"
                            id="numRooms"
                            value={numRooms}
                            onChange={(e) => setNumNumRooms(e.target.value)}
                          />
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="numKitchens">
                            Number of Kitchens
                          </Label>
                          <Input
                            type="number"
                            id="numKitchens"
                            value={numKitchens}
                            onChange={(e) => setNumKitchens(e.target.value)}
                          />
                        </div>
                      </Col>
                      {/* Description input field */}
                      <Col md={12}>
                        <div className="mb-3">
                          <Label htmlFor="projectDescription">Description</Label>
                          <Input
                            type="textarea"
                            id="projectDescription"
                            placeholder="Enter project description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="4"
                          />
                        </div>
                      </Col>


                      {/* Project Cost Field */}
                      <Col md={12}>
                        <div className="mb-3">
                          <Label htmlFor="projectCost">Project Cost (₹)</Label>
                          <Input
                            type="number"
                            id="projectCost"
                            placeholder="Enter project cost"
                            value={projectCost}
                            onChange={(e) => setProjectCost(e.target.value)}
                          />
                        </div>
                      </Col>

                      {/* Dynamic Supervisor Allocation & OTP Sections */}
                      {[...Array(numSupervisorRows)].map((_, index) => (
                        <React.Fragment key={index}>
                          <Col md={6}>
                            <div className="mb-3">
                              <Label htmlFor={`supervisor-${index}`}>
                                Allocate Supervisor {index + 1}
                              </Label>
                              {loadingSupervisors ? (
                                <Spinner size="sm" color="primary" />
                              ) : errorSupervisors ? (
                                <p className="text-danger">{errorSupervisors}</p>
                              ) : (
                                <div className="d-flex align-items-center gap-2">
                                  <div style={{ flex: 1 }}>
                                    <Select
                                      options={supervisorOptions}
                                      value={selectedSupervisors[index]}
                                      onChange={(val) => handleSupervisorSelect(val, index)}
                                      placeholder={`Select supervisor ${index + 1}`}
                                      id={`supervisor-${index}`}
                                    />
                                  </div>
                                  {numSupervisorRows > 1 && (
                                    <Button
                                      type="button"
                                      color="danger"
                                      size="sm"
                                      onClick={() => handleRemoveSupervisorRow(index)}
                                      className="ms-2"
                                    >
                                      Remove
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          </Col>
                          {/* Supervisor OTP section for this specific supervisor dropdown */}
                          <Col md={6}>
                            <div className="mb-3">
                              <Label htmlFor={`supervisorOtp-${index}`}>
                                OTP Verification (Supervisor {index + 1})
                              </Label>
                              <div className="d-flex gap-2 align-items-center">
                                <Input
                                  type="text"
                                  id={`supervisorOtp-${index}`}
                                  placeholder="Enter OTP"
                                  value={supervisorOtps[index]}
                                  onChange={(e) => handleSupervisorOtpChange(e, index)}
                                />
                                <Button
                                  color="primary"
                                  type="button"
                                  onClick={() => verifyIndividualSupervisorOtp(index)}
                                >
                                  Verify
                                </Button>
                                {supervisorOtpVerifiedStates[index] === true && <span>✅</span>}
                                {supervisorOtpVerifiedStates[index] === false && (
                                  <span className="text-danger">❌ Wrong OTP</span>
                                )}
                              </div>
                            </div>
                          </Col>
                        </React.Fragment>
                      ))}

                      {/* Button to Add Another Supervisor Row */}
                      <Col md={12} className="text-end mb-3">
                          {numSupervisorRows < 3 && ( // Only show if less than 3 rows
                              <Button
                                  type="button"
                                  color="info"
                                  onClick={handleAddAnotherSupervisorRow}
                              >
                                  Add Another Supervisor
                              </Button>
                          )}
                      </Col>

                      {/* Customer Allocation */}
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="customerPhone">
                            Allocate Customer (Phone)
                          </Label>
                          {loadingCustomers ? (
                            <Spinner size="sm" color="primary" />
                          ) : errorCustomers ? (
                            <p className="text-danger">{errorCustomers}</p>
                          ) : (
                            <div className="d-flex align-items-center gap-2">
                              <div style={{ flex: 1 }}>
                                <Select
                                  options={customerOptions}
                                  value={selectedCustomer}
                                  onChange={(val) => setSelectedCustomer(val)}
                                  placeholder="Select customer phone"
                                  id="customerPhone"
                                />
                              </div>
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => {
                                  console.log(
                                    "Selected customer:",
                                    selectedCustomer
                                  );
                                }}
                              >
                                Send
                              </button>
                            </div>
                          )}
                        </div>
                      </Col>

                      {/* Customer OTP section */}
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="customerOtp">
                            OTP Verification (Customer)
                          </Label>
                          <div className="d-flex gap-2 align-items-center">
                            <Input
                              type="text"
                              id="customerOtp"
                              placeholder="Enter OTP"
                              value={customerOtp}
                              onChange={(e) => setCustomerOtp(e.target.value)}
                            />
                            <Button
                              color="primary"
                              type="button"
                              onClick={verifyCustomerOtp}
                            >
                              Verify
                            </Button>
                            {customerOtpVerified === true && <span>✅</span>}
                            {customerOtpVerified === false && (
                              <span className="text-danger">❌ Wrong OTP</span>
                            )}
                          </div>
                        </div>
                      </Col>

                      {/* File Uploads */}
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="bimFilePath">Upload BIM File</Label>
                          <Input
                            type="file"
                            id="bimFilePath"
                            onChange={(e) => setBimFile(e.target.files[0])}
                          />
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="floorPlanFilePath">
                            Upload Floor Plan
                          </Label>
                          <Input
                            type="file"
                            id="floorPlanFilePath"
                            onChange={(e) =>
                              setFloorPlanFile(e.target.files[0])
                            }
                          />
                        </div>
                      </Col>
                      <Col md={12}>
                        <div className="mb-3 ">
                          <Label htmlFor="designFile">Upload Design</Label>
                          <Input
                            type="file"
                            id="designFile"
                            onChange={(e) => setDesignFile(e.target.files[0])}
                          />
                        </div>
                      </Col>

                      {/* Date Pickers */}
                      <Col md={6}>
                        <div className="mb-3 ">
                          <Label htmlFor="startDate">Start Date</Label>
                          <Flatpickr
                            className="form-control"
                            id="startDate"
                            value={startDate}
                            onChange={(date) => setStartDate(date)}
                            options={{ dateFormat: "d M, Y" }}
                            placeholder="Select start date"
                          />
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3 ">
                          <Label htmlFor="endDate">End Date</Label>
                          <Flatpickr
                            className="form-control"
                            id="endDate"
                            value={endDate}
                            onChange={(date) => setEndDate(date)}
                            options={{ dateFormat: "d M, Y" }}
                            placeholder="Select end date"
                          />
                        </div>
                      </Col>

                      <Col md={12}>
                        <div className="text-end">
                          <Button color="success" type="submit">
                            Submit
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
};

export default CreateProject;