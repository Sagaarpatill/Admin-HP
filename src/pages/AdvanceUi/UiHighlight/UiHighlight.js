// This file is part of the AdminHP project. Kasim
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  FormFeedback,
  Label,
  Alert,
  Spinner,
  Input,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import CountUp from "react-countup";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Make sure this import is correct for named exports
import {
  fetchCustomers, addCustomer, updateCustomer, deleteCustomer
} from "../../../api"; // Adjust the import path as needed
import axios from "axios";
const API_URL = "http://localhost:5000"; // Adjust this to your backend URL

const UiHighlight = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal and form states
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [otpVerified, setOtpVerified] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [otpError, setOtpError] = useState(null);

  const adminOtpFormik = useFormik({
    initialValues: {
      admin_phone_number: "+91",
      otp: "",
    },
    validationSchema: Yup.object({
      admin_phone_number: Yup.string()
        .required("Please enter admin phone number")
        .matches(
          /^\+91\d{10}$/,
          "Enter 10-digit phone number after +91 (e.g., +919912345678"
        ),
      otp: Yup.string().when("admin_phone_number", {
        is: (val) => otpSent && val,
        then: (schema) => schema.required("Please enter the OTP"),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),

    onSubmit: () => {},
  });

  // Function to load data from the API
  const loadCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCustomers(); // raw DB data
      console.log("Fetched raw data:", data);

      const mappedData = (Array.isArray(data) ? data : []).map(
        (customer, idx) => ({
          srNo: idx + 1,
          id: customer.ac_id,
          first_name: customer.ac_first_name,
          last_name: customer.ac_last_name,
          phone_number: customer.ac_phone_number,
          address: customer.ac_address,
          last_active: customer.ac_created_date
            ? new Date(customer.ac_created_date).toLocaleDateString()
            : "",
          status: customer.ac_status
            ? customer.ac_status.charAt(0).toUpperCase() +
              customer.ac_status.slice(1).toLowerCase()
            : customer.ac_is_active
            ? "Active"
            : "Inactive",
        })
      );

      console.log("Mapped customers:", mappedData);
      setCustomers(mappedData);
    } catch (err) {
      console.error("Error loading customers:", err);
      setError(err.message || "Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  // Fetch customers on mount
  useEffect(() => {
    loadCustomers();
  }, []);

  // Filtered supervisors for search/filter
  const filteredCustomers = customers.filter((item) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      item.first_name?.toLowerCase().includes(search) ||
      item.last_name?.toLowerCase().includes(search) ||
      item.phone_number?.toLowerCase().includes(search) ||
      item.address?.toLowerCase().includes(search) ||
      String(item.id).includes(search);

    const matchesStatus =
      !filterStatus ||
      (filterStatus === "Active" && item.status === "Active") ||
      (filterStatus === "Inactive" && item.status === "Inactive");

    return matchesSearch && matchesStatus;
  });

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredCustomers.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  // Modal handlers
  // const toggleEditModal = () => {
  //   setEditModal(!editModal);
  //   if (!editModal) {
  //     setOtpSent(false);
  //     setOtpVerified(false);
  //     setOtpSuccess(null);
  //     setOtpError(null);
  //     setFormData({});
  //   }
  // };

  const toggleEditModal = () => {
    setEditModal(!editModal);
    if (!editModal) {
      setOtpSent(false);
      setOtpVerified(false);
      setOtpSuccess(null);
      setOtpError(null);
      setFormData({});
      adminOtpFormik.resetForm(); // Reset Formik values here
    }
  };

  const handleAddClick = () => {
    setIsEditing(false);
    setFormData({});
    setOtpSent(false);
    setOtpVerified(false);
    setEditModal(true);
  };

  const handleEditClick = (cust) => {
    setIsEditing(true);
    setFormData({
      id: cust.id,
      first_name: cust.first_name,
      last_name: cust.last_name,
      phone_number: cust.phone_number,
      address: cust.address,
      status: cust.status,
    });
    setOtpSent(false);
    setOtpVerified(false);
    setEditModal(true);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleSendAdminOtp = async () => {
  //   setOtpLoading(true);
  //   setOtpError("");
  //   setOtpSuccess("");
  //   try {
  //     const response = await axios.post(`${API_URL}/api/send-otp`, {
  //       phone: adminOtpFormik.values.admin_phone_number,
  //       // otp: adminOtpFormik.values.otp,
  //     });
  //     console.log("OTP Send Response:", response.data);
  //     console.log("OTP Sent successfully"); // Add this
  //     if (response) {
  //       setOtpSent(true);
  //       setOtpSuccess("OTP sent successfully!");
  //       console.log("OTP Sent, otpSent:", true);
  //     } else {
  //       setOtpError(response.data.error || "Failed to send OTP");
  //     }
  //   } catch (err) {
  //     setOtpError("Network error");
  //   }
  //   setOtpLoading(false);
  // };

  // const handleOtpVerification = async () => {
  //   setVerifyLoading(true);
  //   setOtpError(null);
  //   try {
  //     const response = await axios.post(`${API_URL}/api/verify-otp`, {
  //       phone: adminOtpFormik.values.admin_phone_number,
  //       otp: adminOtpFormik.values.otp,
  //     });
  //     if (response) {
  //       setOtpVerified(true);
  //       setOtpSuccess("OTP verified! You can now submit.");
  //     } else {
  //       setOtpError(response.data || "OTP verification failed");
  //     }
  //   } catch (err) {
  //     setOtpError("Otp invalid");
  //   }
  //   setVerifyLoading(false);
  // };



const handleSendAdminOtp = async () => {
  setOtpLoading(true);
  setOtpError("");
  setOtpSuccess("");
  try {
    // Hardcoded: Always assume OTP sent
    setOtpSent(true);
    setOtpSuccess("OTP sent successfully!");
    console.log("OTP Sent, otpSent:", true);
  } catch (err) {
    setOtpError("Network error (hardcoded, should not occur)");
  }
  setOtpLoading(false);
};

const handleOtpVerification = async () => {
  setVerifyLoading(true);
  setOtpError(null);
  try {
    const enteredOtp = adminOtpFormik.values.otp;
    // Hardcoded: Always accept OTP "123456"
    if (enteredOtp === "123456") {
      setOtpVerified(true);
      setOtpSuccess("OTP verified! You can now submit.");
    } else {
      setOtpError("OTP verification failed (wrong OTP)");
    }
  } catch (err) {
    setOtpError("OTP invalid (hardcoded, should not occur)");
  }
  setVerifyLoading(false);
};




  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    try {
      if (!isEditing) {
        if (!otpVerified) {
          setError("Please verify OTP before submitting.");
          toast.error("Please verify OTP before submitting.");
          return;
        }
        await addCustomer({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone_number: formData.phone_number,
          address: formData.address,
          admin_phone_number: adminOtpFormik.values.admin_phone_number,
          otp: adminOtpFormik.values.otp,
        });
        toast.success("Customer added successfully!");
      } else {
        await updateCustomer(formData.id, {
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone_number: formData.phone_number,
          address: formData.address,
          status: formData.status,
        });
        toast.success("Customer updated successfully!");
      }
      await loadCustomers();
      setEditModal(false);
      setFormData({});
      setOtpSent(false);
      setOtpVerified(false);
      setOtpSuccess(null);
      adminOtpFormik.resetForm();
    } catch (err) {
      setError(err.message || "Failed to save customer");
      toast.error(err.message || "Failed to save customer");
    }
  };

  // Delete modal handlers
  const confirmDelete = (customer) => {
    setCustomerToDelete(customer);
    setDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await deleteCustomer(customerToDelete.id);
      // Reload customers after deletion
      await loadCustomers();
      setDeleteModal(false);
      setCustomerToDelete(null);
      toast.success("Customer deleted successfully!");
    } catch (err) {
      setError(err.message || "Failed to delete customer");
      toast.error(err.message || "Failed to delete customer");
      console.error("Delete error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModal(false);
    setCustomerToDelete(null);
  };

  const customersWidgets = [
    {
      title: "Total Customers",
      counter: customers.length,
      suffix: "",
      prefix: "",
      decimals: 0,
      percentage: "+5.2%",
      percentageClass: "success",
      arrowIcon: "ri-arrow-up-s-line",
      icon: "ri-user-add-line",
    },
    {
      title: "Pending Customers",
      counter: customers.length,
      suffix: "",
      prefix: "",
      decimals: 0,
      percentage: "+5.2%",
      percentageClass: "success",
      arrowIcon: "ri-arrow-up-s-line",
      icon: "ri-user-add-line",
    },
    {
      title: "Edited Customers",
      counter: customers.ac_is_active,
      suffix: "",
      prefix: "",
      decimals: 0,
      percentage: "+5.2%",
      percentageClass: "success",
      arrowIcon: "ri-arrow-up-s-line",
      icon: "ri-user-add-line",
    },
    {
      title: "Removed Customers",
      counter: customers.length,
      suffix: "",
      prefix: "",
      decimals: 0,
      percentage: "+5.2%",
      percentageClass: "success",
      arrowIcon: "ri-arrow-up-s-line",
      icon: "ri-user-add-line",
    },
  ];
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
          <BreadCrumb title="Customers" pageTitle="Admin" />
          <Row>
            {customersWidgets.map((item, key) => (
              <Col xxl={3} sm={6} key={key}>
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
                            className={
                              "badge bg-" +
                              item.percentageClass +
                              "-subtle text-" +
                              item.percentageClass +
                              " mb-0"
                            }
                          >
                            <i className={item.arrowIcon + " align-middle"}></i>{" "}
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
              </Input>
            </Col>
            <Col md="auto" className="ms-auto">
              <Button
                className="btn btn-danger add-btn"
                onClick={handleAddClick}
              >
                <i className="ri-add-line align-bottom"></i> Add Customer
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
                          <th>Last Active</th>
                          <th>Status</th>
                          <th className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentRecords.length > 0 ? (
                          currentRecords.map((cust) => (
                            <tr key={cust.id}>
                              <td>{cust.srNo}</td>
                              <td>
                                {cust.first_name} {cust.last_name}
                              </td>
                              <td>{cust.phone_number}</td>
                              <td>{cust.address}</td>
                              <td>{cust.last_active}</td>
                              <td>
                                <Badge
                                  color={
                                    cust.status === "Active"
                                      ? "success"
                                      : "danger"
                                  }
                                >
                                  {cust.status}
                                </Badge>
                              </td>
                              <td className="text-center">
                                
                                <Button
                                  size="sm"
                                  color="success"
                                  onClick={() => handleEditClick(cust)}
                                >
                                  <i class="ri-edit-line"></i>
                                </Button>{" "}
                                <Button
                                  size="sm"
                                  color="danger"
                                  onClick={() => confirmDelete(cust)}
                                >
                                  <i class="ri-delete-bin-line"></i>
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="text-center">
                              No customers found.
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
                      {Math.ceil(filteredCustomers.length / recordsPerPage) ||
                        1}
                    </span>
                    <Button
                      color="link"
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(
                            prev + 1,
                            Math.ceil(filteredCustomers.length / recordsPerPage)
                          )
                        )
                      }
                      disabled={
                        currentPage ===
                        Math.ceil(filteredCustomers.length / recordsPerPage)
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
          toggle={() => setEditModal(!editModal)}
          centered
        >
          <ModalHeader toggle={() => setEditModal(!editModal)}>
            {isEditing ? "Edit Customer" : "Add Customer"}
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
                        name="admin_phone_number"
                        value={adminOtpFormik.values.admin_phone_number}
                        onChange={(e) => {
                          // Ensure it always starts with +91
                          const value = e.target.value;
                          if (!value.startsWith("+91")) {
                            adminOtpFormik.setFieldValue(
                              "admin_phone_number",
                              "+91"
                            );
                          } else {
                            // Optionally, limit to +91 and 10 digits
                            if (/^\+91\d{0,10}$/.test(value)) {
                              adminOtpFormik.setFieldValue(
                                "admin_phone_number",
                                value
                              );
                            }
                          }
                        }}
                        maxLength={15}
                        required
                        invalid={
                          adminOtpFormik.touched.admin_phone_number &&
                          !!adminOtpFormik.errors.admin_phone_number
                        }
                        disabled={otpVerified}
                        placeholder="+919912345678"
                      />
                      <FormFeedback>
                        {adminOtpFormik.errors.admin_phone_number}
                      </FormFeedback>
                      {adminOtpFormik.values.admin_phone_number &&
                        adminOtpFormik.values.admin_phone_number.length >= 10 &&
                        !otpSent && (
                          <Button
                            color="primary"
                            size="sm"
                            className="mt-2"
                            type="button"
                            onClick={handleSendAdminOtp}
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
                      <Row>
                        <Col>
                          <Input
                            name="otp"
                            value={adminOtpFormik.values.otp}
                            onChange={adminOtpFormik.handleChange}
                            maxLength={6}
                            // onBlur={adminOtpFormik.handleBlur}
                            invalid={
                              adminOtpFormik.touched.otp &&
                              !!adminOtpFormik.errors.otp
                            }
                            disabled={otpVerified}
                            placeholder="Enter OTP"
                          />
                          <FormFeedback>
                            {adminOtpFormik.errors.otp}
                          </FormFeedback>
                        </Col>
                        <Col xs="auto">
                          <Button
                            color="success"
                            onClick={handleOtpVerification}
                            disabled={verifyLoading || otpVerified}
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
                {isEditing && (
                  <Col md={6}>
                    <FormGroup>
                      <Label>Status</Label>
                      <Input
                        type="select"
                        name="status"
                        value={formData.status || ""}
                        onChange={handleInputChange}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </Input>
                    </FormGroup>
                  </Col>
                )}
              </Row>
              <Button
                type="submit"
                color="primary"
                block
                disabled={!isEditing && (!otpVerified || !otpSent)}
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
              Are you sure you want to delete customer{" "}
              <strong>{customerToDelete?.first_name}</strong>?
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
      </div>
    </React.Fragment>
  );
};

export default UiHighlight;
