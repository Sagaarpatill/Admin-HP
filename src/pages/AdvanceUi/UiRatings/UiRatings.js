import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Badge,
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Spinner,
  FormGroup,
  Label,
  Alert,
  FormFeedback,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import CountUp from "react-countup";
import {
  fetchSupervisors,
  addSupervisor,
  deleteSupervisor,
  updatedSupervisorData,
} from "../../../api"; // Assuming these are correctly defined
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UiRatings = () => {
  // State hooks
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    active: 0,
    inactive: 0,
    edited: 0,
    removed: 0,
  });
  const [formData, setFormData] = useState({
    id: null,
    first_name: "",
    last_name: "",
    phone_number: "",
    address: "",
    last_active: "",
    status: "",
  });

  // UI state for search/filter/add/edit/delete
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [supervisorToDelete, setSupervisorToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [otpSuccess, setOtpSuccess] = useState(null);

  const [siteManagedModal, setSiteManagedModal] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);

  const API_URL = "http://localhost:5000"; // Ensure this matches your backend API URL

  // Function to open the Site Managed Modal
  const openSiteManagedModal = (supervisor) => {
    // No dummy projects added here.
    // Ensure the 'supervisor' object passed here already contains a 'projects' array
    // if you want projects to be displayed. Otherwise, "No projects assigned" will show.
    setSelectedSupervisor(supervisor);
    setSiteManagedModal(true);
  };

  // Formik for admin OTP validation
  const admin_otp = useFormik({
    initialValues: {
      adminphone_number: "+91",
      otp: "",
    },
    validationSchema: Yup.object({
      adminphone_number: Yup.string()
        .required("Please enter admin phone number")
        .matches(
          /^\+91\d{10}$/,
          "Enter 10-digit phone number after +91 (e.g., +919912345678)"
        ),
      otp: Yup.string().when("adminphone_number", {
        is: (val) => otpSent && val, // Only require OTP if it has been sent
        then: (schema) => schema.required("Please enter OTP"),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),
    onSubmit: () => {}, // No direct submit for Formik here, handled by handleSubmit
  });

  // Example customersWidgets (replace with your actual logic if different)
  const customersWidgets = [
    {
      title: "Total Supervisors",
      counter: supervisors.length,
      suffix: "",
      prefix: "",
      decimals: 0,
      percentage: "100%",
      percentageClass: "success",
      arrowIcon: "ri-arrow-up-line",
      icon: "ri-user-settings-line",
    },
    {
      title: "Pending Supervisors",
      counter: supervisors.filter((s) => s.status === "Pending").length,
      suffix: "",
      prefix: "",
      decimals: 0,
      percentage: "+2.1%",
      percentageClass: "info",
      arrowIcon: "ri-arrow-up-s-line",
      icon: "ri-user-smile-line",
    },
    {
      title: "Edited Supervisors",
      counter: stats.edited, // You'll need to track this in your data or API
      suffix: "",
      prefix: "",
      decimals: 0,
      percentage: "-1.4%",
      percentageClass: "danger",
      arrowIcon: "ri-arrow-down-s-line",
      icon: "ri-edit-line",
    },
    {
      title: "Removed Supervisors",
      counter: stats.removed, // You'll need to track this in your data or API
      suffix: "",
      prefix: "",
      decimals: 0,
      percentage: stats.removed > 0 ? "+8.0%" : "0%",
      percentageClass: "success",
      arrowIcon: "ri-arrow-up-s-line",
      icon: "ri-user-unfollow-line",
    },
  ];

  // Toggle function for the Add/Edit Supervisor Modal
  const toggleEditModal = () => {
    setEditModal(!editModal);
    if (!editModal) {
      setOtpSent(false);
      setOtpVerified(false);
      setOtpSuccess(null);
      setOtpError(null);
      setFormData({}); // Clear form data on close/initial open
      admin_otp.resetForm(); // Reset Formik values
    }
  };

  // Load supervisors from API and map data
  // Load supervisors from API and map data
const loadSupervisors = async () => {
  setLoading(true);
  setError(null);
  try {
    const data = await fetchSupervisors(); // Raw data from your API
    console.log("Fetched raw data (inside UiRatings):", data);

    // Map raw API data to your component's state structure
    const mappedData = (Array.isArray(data) ? data : []).map(
  (supervisor, idx) => {
    // --- CHANGE THESE LINES ---
    // Instead of splitting a 'name' field, directly use the 'first_name' and 'last_name'
    // that your backend is already sending.
    const first_name = supervisor.first_name || "N/A"; // Use actual first_name from backend, fallback to N/A
    const last_name = supervisor.last_name || "";      // Use actual last_name from backend, fallback to empty string
    // --- END OF CHANGE ---

    // Determine address: Use supervisor.address if available, otherwise "N/A"
    const address = supervisor.address || "N/A";

    // Determine last_active: Use supervisor.last_active if available, otherwise new Date()
    // Assuming last_active might be a string or date from backend.
    const last_active = supervisor.last_active
      ? new Date(supervisor.last_active).toLocaleDateString()
      : new Date().toLocaleDateString();

    return {
      srNo: idx + 1,
      id: supervisor.id,
      first_name: first_name,  // Now uses the correct first_name from backend
      last_name: last_name,    // Now uses the correct last_name from backend
      phone_number: supervisor.phone_number,
      address: address,
      status: supervisor.status, // This line was already correct, no change needed here.
      last_active: last_active,
      projects: supervisor.projects || [], // Assuming projects might be an empty array if not present
    };
  }
);

    console.log("Mapped supervisors (inside UiRatings):", mappedData);
    setSupervisors(mappedData);
  } catch (err) {
    console.error("Error loading supervisors:", err);
    setError(err.message || "Failed to fetch supervisors");
    setSupervisors([]);
  } finally {
    setLoading(false);
  }
};

  // Fetch supervisors on component mount
  useEffect(() => {
    loadSupervisors();
  }, []);

  // Handle changes in the supervisor add/edit form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Open add supervisor modal
  const handleAddClick = () => {
    setIsEditing(false);
    setFormData({});
    setOtpSent(false);
    setOtpVerified(false);
    setEditModal(true);
    admin_otp.resetForm();
  };

  // Handle form submission for adding or updating a supervisor
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    try {
      if (!isEditing) {
        // Validation for add mode (requires OTP verification)
        if (!otpVerified) {
          setError("Please verify OTP before submitting.");
          toast.error("Please verify OTP before submitting.");
          return;
        }
        await addSupervisor({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone_number: formData.phone_number,
          address: formData.address,
          status: formData.status,
          admin_phone_number: admin_otp.values.adminphone_number,
          otp: admin_otp.values.otp,
        });
        toast.success("Supervisor added successfully!");
      } else {
        // Update mode
        await updatedSupervisorData(formData.id, {
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone_number: formData.phone_number,
          address: formData.address,
          status: formData.status,
        });
        toast.success("Supervisor updated successfully!");
      }
      await loadSupervisors(); // Refresh supervisor list
      setEditModal(false); // Close modal
      setFormData({}); // Clear form
      setOtpSent(false);
      setOtpVerified(false);
      setOtpSuccess(null);
      admin_otp.resetForm(); // Reset Formik
    } catch (err) {
      setError(err.message || "Failed to save Supervisor");
      toast.error(err.message || "Failed to save Supervisor");
    }
  };

  // Send OTP to admin phone number
  // const sendOtp = async () => {
  //   setOtpLoading(true);
  //   setOtpError("");
  //   setOtpSuccess("");
  //   try {
  //     // Manually trigger validation for adminphone_number before sending OTP
  //     await admin_otp.validateField('adminphone_number');
  //     if (admin_otp.errors.adminphone_number) {
  //       setOtpError(admin_otp.errors.adminphone_number);
  //       setOtpLoading(false);
  //       return;
  //     }

  //     const response = await axios.post(`${API_URL}/api/send-otp`, {
  //       phone: admin_otp.values.adminphone_number,
  //     });
  //     console.log("OTP Send Response:", response.data);
  //     if (response.status === 200) {
  //       setOtpSent(true);
  //       setOtpSuccess("OTP sent successfully!");
  //     } else {
  //       setOtpError(response.data.error || "Failed to send OTP");
  //     }
  //   } catch (err) {
  //     setOtpError(err.response?.data?.message || "Network error or OTP sending failed");
  //   }
  //   setOtpLoading(false);
  // };

  // // Verify OTP
  // const verifyOtp = async () => {
  //   setVerifyLoading(true);
  //   setOtpError(null);
  //   try {
  //     // Manually trigger validation for otp before verifying
  //     await admin_otp.validateField('otp');
  //     if (admin_otp.errors.otp) {
  //       setOtpError(admin_otp.errors.otp);
  //       setVerifyLoading(false);
  //       return;
  //     }

  //     const response = await axios.post(`${API_URL}/api/verify-otp`, {
  //       phone: admin_otp.values.adminphone_number,
  //       otp: admin_otp.values.otp,
  //     });
  //     if (response.status === 200) {
  //       setOtpVerified(true);
  //       setOtpSuccess("OTP verified! You can now submit.");
  //     } else {
  //       setOtpError(response.data.message || "OTP verification failed");
  //     }
  //   } catch (err) {
  //     setOtpError(err.response?.data?.message || "OTP invalid or verification failed");
  //   }
  //   setVerifyLoading(false);
  // };
// Hardcoded Send OTP function for development/testing
const sendOtp = async () => {
  setOtpLoading(true);
  setOtpError("");
  setOtpSuccess("");

  // Simulate a delay like an actual API call
  await new Promise(resolve => setTimeout(resolve, 500));

  // Manually trigger validation for adminphone_number before "sending" OTP
  await admin_otp.validateField('adminphone_number');
  if (admin_otp.errors.adminphone_number) {
    setOtpError(admin_otp.errors.adminphone_number);
    setOtpLoading(false);
    return;
  }

  // Hardcode success
  setOtpSent(true);
  setOtpSuccess("OTP sent successfully! (Hardcoded)");
  setOtpLoading(false);
};

// Hardcoded Verify OTP function for development/testing
const verifyOtp = async () => {
  setVerifyLoading(true);
  setOtpError(null);

  // Simulate a delay like an actual API call
  await new Promise(resolve => setTimeout(resolve, 500));

  // Manually trigger validation for otp before "verifying"
  await admin_otp.validateField('otp');
  if (admin_otp.errors.otp) {
    setOtpError(admin_otp.errors.otp);
    setVerifyLoading(false);
    return;
  }

  // You can even add a check for a specific "hardcoded" OTP value here
  // For example, if you want "123456" to be the correct OTP
  if (admin_otp.values.otp === "123456") { // <-- You can change "123456" to any desired hardcoded OTP
    setOtpVerified(true);
    setOtpSuccess("OTP verified! You can now submit. (Hardcoded)");
  } else {
    setOtpError("Hardcoded OTP is incorrect. Use 123456 (or your chosen hardcoded value).");
  }

  setVerifyLoading(false);
};
  // Filter supervisors based on search term and status
  const filteredSupervisors = supervisors.filter((item) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      item.first_name?.toLowerCase().includes(search) ||
      item.last_name?.toLowerCase().includes(search) ||
      item.phone_number?.toLowerCase().includes(search) ||
      String(item.id).includes(search);

    const matchesStatus =
      !filterStatus ||
      item.status?.toLowerCase() === filterStatus.toLowerCase(); // Case-insensitive status filter

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredSupervisors.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  // Open edit supervisor modal and populate form
  const handleEditClick = (sup) => {
    setIsEditing(true);
    setFormData({
      id: sup.id,
      first_name: sup.first_name,
      last_name: sup.last_name,
      phone_number: sup.phone_number,
      address: sup.address,
      status: sup.status,
    });
    setOtpSent(false); // No OTP for editing
    setOtpVerified(false); // No OTP for editing
    setEditModal(true);
    admin_otp.resetForm();
  };

  // Confirm delete modal
  const confirmDelete = (supervisor) => {
    setSupervisorToDelete(supervisor);
    setDeleteModal(true);
  };

  // Cancel delete action
  const handleCancelDelete = () => {
    setDeleteModal(false);
    setSupervisorToDelete(null);
  };

  // Execute delete action
  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await deleteSupervisor(supervisorToDelete.id);
      await loadSupervisors(); // Reload supervisors after deletion
      setDeleteModal(false);
      setSupervisorToDelete(null);
      toast.success("Supervisor deleted successfully!");
    } catch (err) {
      setError(err.message || "Failed to delete Supervisor");
      toast.error(err.message || "Failed to delete Supervisor");
      console.error("Delete error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
      />
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Supervisor" pageTitle="Admin" />
          <Row>
            {customersWidgets.map((item, key) => (
              <Col xxl={3} sm={8} key={key}>
                <Card className="card-animate">
                  <CardBody>
                    <div className="d-flex justify-content-between">
                      <div>
                        <p className="fw-medium text-muted mb-0">
                          {item.title}
                        </p>
                        <h2 className="mt-4 ff-secondary fw-semibold">
                          <span
                            className="counter-value"
                            data-target={item.counter}
                          >
                            <CountUp
                              start={0}
                              end={item.counter}
                              duration={3}
                              suffix={item.suffix}
                              prefix={item.prefix}
                              decimals={item.decimals}
                            />
                          </span>
                        </h2>
                        <p className="mb-0 text-muted">
                          <span
                            className={`badge bg-${item.percentageClass}-subtle text-${item.percentageClass} mb-0`}
                          >
                            <i className={`${item.arrowIcon} align-middle`}></i>{" "}
                            {item.percentage}
                          </span>{" "}
                          vs. previous month
                        </p>
                      </div>
                      <div>
                        <div className="avatar-sm flex-shrink-0">
                          <span className="avatar-title bg-info-subtle text-info rounded-circle fs-4">
                            <i className={item.icon}></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
          <Row className="align-items-center mb-3">
            <Col md={3}>
              <Input
                type="text"
                placeholder="Search by name, phone, or ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
            <Col md={2}>
              <Input
                type="select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </Input>
            </Col>
            <Col md="auto" className="ms-auto">
              <Button
                className="btn btn-danger add-btn"
                onClick={handleAddClick}
              >
                <i className="ri-add-line align-bottom"></i> Add Supervisor
              </Button>
            </Col>
          </Row>

          <Row>
            <Col xl={12}>
              <Card>
                <CardBody>
                  <div className="table-responsive table-card">
                    <table className="table align-middle table-nowrap table-striped-columns mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Sr/No</th>
                          <th>Name</th>
                          <th>Phone</th>
                          <th>Address</th>
                          {/* <th>Site Managed</th> */}
                          <th>Last Active</th>
                          <th>Status</th>
                          <th className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentRecords.length > 0 ? (
                          currentRecords.map((sup) => (
                            <tr key={sup.id}>
                              <td>{sup.srNo}</td>
                              <td>
                                {sup.first_name} {sup.last_name}
                              </td>
                              <td>{sup.phone_number}</td>
                              <td>{sup.address}</td>
                              <td>{sup.last_active}</td>
                              <td>
                                <Badge
                                  color={
                                    sup.status === "Active"
                                      ? "success"
                                      : sup.status === "Pending"
                                      ? "warning"
                                      : "danger"
                                  }
                                >
                                  {sup.status}
                                </Badge>
                              </td>
                              <td className="text-center">
                                <Button
                                  size="sm"
                                  className=" me-1"
                                  onClick={() => openSiteManagedModal(sup)}
                                >
                                  Site Managed
                                </Button>
                                <Button
                                  size="sm"
                                  color="info"
                                  className="me-1"
                                  onClick={() => handleEditClick(sup)}
                                >
                                  <i className="ri-edit-line"></i>
                                </Button>
                                <Button
                                  size="sm"
                                  color="danger"
                                  onClick={() => confirmDelete(sup)}
                                >
                                  <i className="ri-delete-bin-line"></i>
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="8" className="text-center">
                              No supervisors found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <Button
                      color="link"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    >
                      <i className="ri-arrow-left-s-line"></i> Previous
                    </Button>
                    <span>
                      Page {currentPage} of{" "}
                      {Math.ceil(filteredSupervisors.length / recordsPerPage) ||
                        1}
                    </span>
                    <Button
                      color="link"
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(
                            prev + 1,
                            Math.ceil(
                              filteredSupervisors.length / recordsPerPage
                            )
                          )
                        )
                      }
                      disabled={
                        currentPage ===
                        Math.ceil(filteredSupervisors.length / recordsPerPage)
                      }
                    >
                      Next <i className="ri-arrow-right-s-line"></i>
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>

        {/* Edit/Add Modal */}
        <Modal
          isOpen={editModal}
          toggle={toggleEditModal}
          centered
        >
          <ModalHeader toggle={toggleEditModal}>
            {isEditing ? "Edit Supervisor" : "Add Supervisor"}
          </ModalHeader>
          <ModalBody>
            {error && <Alert color="danger">{error}</Alert>}
            {otpSuccess && <Alert color="success">{otpSuccess}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label>First Name</Label>
                    <Input
                      name="first_name"
                      value={formData.first_name || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Last Name</Label>
                    <Input
                      name="last_name"
                      value={formData.last_name || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Phone Number</Label>
                    <Input
                      name="phone_number"
                      value={formData.phone_number || ""}
                      onChange={handleInputChange}
                      required
                      maxLength={10}
                    />
                  </FormGroup>
                </Col>
                {/* Admin Phone Number and OTP (Add mode only) */}
                {!isEditing && (
                  <Col md={6}>
                    <FormGroup>
                      <Label>Admin Phone Number</Label>
                      <Input
                        name="adminphone_number"
                        value={admin_otp.values.adminphone_number}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (!value.startsWith("+91")) {
                            admin_otp.setFieldValue("adminphone_number", "+91");
                          } else {
                            // Allow up to +91 followed by 10 digits
                            if (/^\+91\d{0,10}$/.test(value)) {
                              admin_otp.setFieldValue("adminphone_number", value);
                            }
                          }
                        }}
                        onBlur={admin_otp.handleBlur}
                        maxLength={13}
                        required
                        invalid={
                          admin_otp.touched.adminphone_number &&
                          !!admin_otp.errors.adminphone_number
                        }
                        disabled={otpVerified || otpLoading}
                        placeholder="+919912345678"
                      />
                      {admin_otp.touched.adminphone_number && admin_otp.errors.adminphone_number && (
                        <FormFeedback>{admin_otp.errors.adminphone_number}</FormFeedback>
                      )}
                      {admin_otp.values.adminphone_number.length === 13 &&
                        !otpSent &&
                        !admin_otp.errors.adminphone_number && (
                          <Button
                            color="primary"
                            size="sm"
                            className="mt-2"
                            type="button"
                            onClick={sendOtp}
                            disabled={otpLoading || otpVerified}
                          >
                            {otpLoading ? <Spinner size="sm" /> : "Send OTP"}
                          </Button>
                        )}
                    </FormGroup>
                  </Col>
                )}
                {!isEditing && otpSent && (
                  <Col md={6}>
                    <FormGroup>
                      <Label>Enter OTP</Label>
                      <Row className="g-2">
                        <Col>
                          <Input
                            name="otp"
                            value={admin_otp.values.otp}
                            onChange={admin_otp.handleChange}
                            onBlur={admin_otp.handleBlur}
                            maxLength={6}
                            invalid={
                              admin_otp.touched.otp && !!admin_otp.errors.otp
                            }
                            disabled={otpVerified || verifyLoading}
                            placeholder="Enter OTP"
                          />
                          {admin_otp.touched.otp && admin_otp.errors.otp && (
                            <FormFeedback>{admin_otp.errors.otp}</FormFeedback>
                          )}
                        </Col>
                        <Col xs="auto">
                          <Button
                            color="success"
                            onClick={verifyOtp}
                            disabled={verifyLoading || otpVerified || !admin_otp.values.otp || admin_otp.errors.otp}
                            type="button"
                          >
                            {verifyLoading ? (
                              <Spinner size="sm" />
                            ) : otpVerified ? (
                              "Verified"
                            ) : (
                              "Verify"
                            )}
                          </Button>
                        </Col>
                      </Row>
                      {otpError && (
                        <Alert color="danger" className="mt-2 py-1 px-2">
                          {otpError}
                        </Alert>
                      )}
                    </FormGroup>
                  </Col>
                )}
                <Col md={6}>
                  <FormGroup>
                    <Label>Address</Label>
                    <Input
                      name="address"
                      value={formData.address || ""}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Status</Label>
                    <Input
                      type="select"
                      name="status"
                      value={formData.status || ""}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Inactive">Inactive</option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
              <Button
                type="submit"
                color="primary"
                block
                disabled={!isEditing && (!otpVerified || !otpSent)}
                className="mt-3"
              >
                {isEditing ? "Update" : "Submit"}
              </Button>
            </Form>
          </ModalBody>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal isOpen={deleteModal} toggle={handleCancelDelete} centered>
          <ModalHeader toggle={handleCancelDelete}>
            Confirm Deletion
          </ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to delete supervisor{" "}
              <strong>
                {supervisorToDelete?.first_name} {supervisorToDelete?.last_name}
              </strong>
              ?
            </p>
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button color="secondary" onClick={handleCancelDelete}>
                Cancel
              </Button>
              <Button color="danger" onClick={handleConfirmDelete}>
                Delete
              </Button>
            </div>
          </ModalBody>
        </Modal>

        {/* Site Managed Supervisor Modal */}
        <Modal
          isOpen={siteManagedModal}
          toggle={() => setSiteManagedModal(false)}
          size="lg"
          centered
          style={{ border: "none" }}
        >
          <ModalHeader
            toggle={() => setSiteManagedModal(false)}
            style={{
              background: "#2c3e50",
              border: "none",
              color: "#ffffff",
              padding: "1.25rem 1.5rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              fontWeight: 700,
              letterSpacing: "0.5px"
            }}
          >
            <div className="d-flex align-items-center">
              <div
                className="me-3 p-2 rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  background: "#f39c12",
                  width: "40px",
                  height: "40px"
                }}
              >
                <i className="ri-building-line fs-4" style={{ color: "#2c3e50" }} aria-hidden="true"></i>
              </div>
              <span className="fs-4 fw-bold text-uppercase text-white">
                Site Managed by {selectedSupervisor?.first_name}{" "}
                {selectedSupervisor?.last_name}
              </span>
            </div>
          </ModalHeader>
          <ModalBody style={{ background: "#ecf0f1", padding: "2rem" }}>
            {/* Supervisor Info Section */}
            <div className="d-flex flex-wrap align-items-center mb-4 pb-3 border-bottom">
              <div className="me-4 mb-3">
                <div className="avatar-lg">
                  <span
                    className="avatar-title rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      background: "#34495e",
                      color: "#f39c12",
                      fontSize: "1.5rem",
                      fontWeight: 700
                    }}
                    aria-label="Supervisor Initials"
                  >
                    {selectedSupervisor?.first_name?.charAt(0)}
                    {selectedSupervisor?.last_name?.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="flex-grow-1">
                <h4 className="mb-1" style={{ color: "#2c3e50", fontWeight: 700 }}>
                  {selectedSupervisor?.first_name} {selectedSupervisor?.last_name}
                </h4>
                <div className="d-flex flex-wrap align-items-center text-muted">
                  <span className="me-3">
                    <i className="ri-phone-line me-1" aria-hidden="true"></i>
                    {selectedSupervisor?.phone_number || "N/A"}
                  </span>
                  <span>
                    <i className="ri-map-pin-line me-1" aria-hidden="true"></i>
                    {selectedSupervisor?.address || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Analytics Section */}
            <div className="mb-4 pb-3 border-bottom">
              <h5
                className="mb-3 text-white p-2 d-flex align-items-center"
                style={{
                  background: "#34495e",
                  color: "#f39c12",
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                  borderRadius: "4px"
                }}
              >
                <i className="ri-bar-chart-2-line me-2" aria-hidden="true"></i>
                <span className="text-uppercase">Page Analytics</span>
              </h5>
              <div className="d-flex flex-wrap">
                <div className="me-4">
                  <h6 className="text-muted mb-2">Projects Managed</h6>
                  <span
                    className="badge"
                    style={{
                      background: "#f39c12",
                      color: "#2c3e50",
                      fontWeight: 700,
                      padding: "0.5rem 1rem",
                      borderRadius: "4px"
                    }}
                  >
                    {selectedSupervisor?.projects?.length || 0}
                  </span>
                </div>
                <div>
                  <h6 className="text-muted mb-2">Last Active</h6>
                  <span
                    className="badge"
                    style={{
                      background: "#95a5a6",
                      color: "#fff",
                      fontWeight: 700,
                      padding: "0.5rem 1rem",
                      borderRadius: "4px"
                    }}
                  >
                    {selectedSupervisor?.last_active || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Projects Table */}
            <div>
              <h5
                className="mb-3 text-white p-2 d-flex align-items-center"
                style={{
                  background: "#34495e",
                  color: "#f39c12",
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                  borderRadius: "4px"
                }}
              >
                <i className="ri-folder-2-line me-2" aria-hidden="true"></i>
                <span className="text-uppercase">Projects Managed</span>
              </h5>
              <div className="table-responsive">
                <table
                  className="table mb-0"
                  style={{ background: "#fff", borderRadius: "4px", overflow: "hidden" }}
                >
                  <thead style={{ background: "#2c3e50", color: "#f39c12" }}>
                    <tr>
                      <th className="text-center">Sr No.</th>
                      <th>Project Name</th>
                      <th>Address</th>
                      <th>Started On</th>
                      <th>Last Visit</th>
                      <th>Last Update</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSupervisor?.projects?.length ? (
                      selectedSupervisor.projects.map((project, index) => (
                        <tr key={project.id}>
                          <td className="text-center">{index + 1}</td>
                          <td>{project.name || "N/A"}</td>
                          <td>{project.address || "N/A"}</td>
                          <td>{project.startedOn || "N/A"}</td>
                          <td>{project.lastVisit || "N/A"}</td>
                          <td>{project.lastUpdate || "N/A"}</td>
                          <td className="text-center">
                            <Button
                              size="sm"
                              style={{
                                background: "transparent",
                                color: "#e74c3c",
                                borderColor: "#e74c3c",
                                fontWeight: 700,
                                borderRadius: "4px"
                              }}
                              onClick={() => {
                                // You'll need to implement actual remove project logic here
                                alert(`Remove project ${project.id} from supervisor`);
                              }}
                            >
                              <i className="ri-delete-bin-line me-1" aria-hidden="true"></i>
                              Remove
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          No projects assigned.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    </React.Fragment>
  );
};

export default UiRatings;