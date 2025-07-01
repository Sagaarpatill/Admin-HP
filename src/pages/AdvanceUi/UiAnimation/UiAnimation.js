import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Input,
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Badge,
} from "reactstrap";

import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import AOS from "aos";
import "aos/dist/aos.css";
import { fetchArchitects, deletearchitect, addArchitect, updateArchitect } from "../../../api";
//import { ToastContainer, toast } from 'react-toastify';
import { Status } from "filepond";
import { setUISelectionClean } from "@testing-library/user-event/dist/cjs/document/UI.js";

// Import the API call functions



const UiAnimation = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [architects, setArchitects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addLocation, setAddLocation] = useState("");

  // Modals and form state
  const [suspendModal, setSuspendModal] = useState(false);
  const [selectedArchitect, setSelectedArchitect] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const [editModal, setEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editFirstName, setEditFirstName] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editLocation, setEditLocation] = useState("")
  const trimmedFirstName = editFirstName.trim();
  const trimmedLocation = editLocation.trim();

  // State for delete confirmation modal
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [architectToDelete, setArchitectToDelete] = useState(null); // Stores the architect object to be deleted

  const [addModal, setAddModal] = useState(false);
  const [addName, setAddName] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [addStatus, setAddStatus] = useState("Active");
  const [addFirstName, setAddFirstName] = useState("");
  const [addLastName, setAddLastName] = useState("");
  const ITEMS_PER_PAGE = 10;


  const filteredArchitects = architects.filter((arch) =>
    `${arch.first_name} ${arch.last_name} ${arch.phone_number}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredArchitects.length / ITEMS_PER_PAGE);

  const paginatedArchitects = filteredArchitects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Load data from backend
  useEffect(() => {
    AOS.init({ easing: "ease-out-back", duration: 3000, anchorPlacement: "top-bottom" });
    loadArchitectData();
    const refreshInterval = setInterval(() => {
      window.location.reload(); // This will force a full page reload
    }, 600000);
  }, []);

  const loadArchitectData = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchArchitects();
      console.log("Fetched raw data(inside UiAnimation):", data);
      const mappedData = (Array.isArray(data) ? data : []).map(
        (architect, idx) => {
          return {
            srNo: idx + 1,
            ar_id: architect.ar_id,
            first_name: architect.ar_first_name,
            last_name: architect.ar_last_name,
            phone_number: architect.ar_phone_number,
            location: architect.ar_location,
            status: architect.ar_status === "active"
              ? "Active"
              : "Inactive",
          }
        }
      );
      console.log("Mapped architects (inside UiAnimation):", mappedData);
      setArchitects(mappedData);
    } catch (err) {
      console.error("Error loading architects:", err);
      setError(err.message || "Failed to fetch Architects");
      setArchitects([]);
    } finally {
      setLoading(false);
    }
  }

  const handleAddArchitect = async () => {
    if (!addFirstName.trim() || !addPhone.trim() || !addLocation.trim()) {
      toast.warn("Please fill in first name, phone, and location.");
      return;
    }
    const cleanedPhone = addPhone.trim();
    if (!/^\d{10}$/.test(cleanedPhone)) {
      toast.error("Phone number must be exactly 10 digits.");
      return;
    }
    const is_active = addStatus === "Active";

    const newArchitectData = {
      first_name: addFirstName.trim(),
      last_name: addLastName.trim(),
      phone_number: addPhone.trim(),
      location: addLocation.trim(),
      status: addStatus,
    };

    try {
      await addArchitect(newArchitectData);
      toast.success("Architect added successfully!");
      setAddModal(false);
      setAddFirstName("");
      setAddLastName("");
      setAddPhone("");
      setAddLocation("");
      setAddStatus("Active");
      await loadArchitectData();
    } catch (error) {
      console.error("Error adding architect:", error);
      toast.error(error.message || "Failed to add architect!");
    }
  };


  const handleDeleteClick = (architect) => {
    setArchitectToDelete(architect);
    setDeleteConfirmationModal(true);
  };


  const handleConfirmDelete = async () => {
    if (!architectToDelete) return;

    try {
      await deletearchitect(architectToDelete.ar_id);
      setDeleteConfirmationModal(false);
      setArchitectToDelete(null);
      await loadArchitectData();
      toast.success("Architect deleted successfully.");


    } catch (error) {
      console.error("Error deleting architect:", error.message);
      toast.error("Failed to delete architect!");
    }
  };


  const handleConfirmSuspend = () => {
    if (!selectedArchitect) return;


    const updatedList = architects.map((arch) =>
      arch.ar_id === selectedArchitect.ar_id
        ? { ...arch, status: newStatus || "Inactive" }
        : arch
    );

    setArchitects(updatedList);
    setSuspendModal(false);
    setSelectedArchitect(null);
    setNewStatus("");
  };

  const handleSuspendClick = (architect) => {
    setSelectedArchitect(architect);
    setNewStatus(architect.status);
    setSuspendModal(true);
  };

  const handleEditClick = (architect) => {
    setSelectedArchitect(architect);
    console.log("--- Architect Object clicked for edit ---");
    console.log("Architect object:", architect);
    console.log("Architect ID from object (architect.ar_id):", architect.ar_id); // CHECK THIS!
    console.log("---------------------------------------");
    // Correctly set separate first and last name states
    setEditFirstName(architect.first_name || ''); // Use ar_first_name
    setEditLastName(architect.last_name || '');   // Use ar_last_name
    setEditPhone(architect.phone_number || ''); // Ensure ar_phone_number
    setEditLocation(architect.location || ''); // Ensure ar_location
    setEditStatus(architect.ar_status === 'active' ? 'Active' : 'Inactive'); // Make sure this is also set
    setEditModal(true);
  };

  // const handleEditClick = (architect) => {
  //   setSelectedArchitect(architect);
  //   (`${architect.first_name} ${architect.last_name}`);
  //   setEditPhone(architect.phone_number);
  //   setEditLocation(architect.location)
  //   setEditModal(true);
  // };

  // In UiAnimation.js
const handleConfirmEdit = async () => {
    if (!selectedArchitect) {
      toast.error("No architect selected for update.");
      return;
    }

    const trimmedFirstName = editFirstName.trim(); // <-- Make sure this is uncommented and used
    const trimmedLastName = editLastName.trim(); // <-- Add this if not there
    const trimmedLocation = editLocation.trim();
    const cleanedPhone = editPhone.trim();

    // Your validation (re-enable these!)
    if (!trimmedFirstName || !trimmedLocation || !cleanedPhone) {
        toast.warn("First Name, Phone, and Location are required.");
        return;
    }
    if (!/^\d{10}$/.test(cleanedPhone)) {
      toast.error("Phone number must be exactly 10 digits.");
      return;
    }

    console.log("selectedArchitect.ar_id (value being sent):", selectedArchitect.ar_id); // This log will now show the correct ID
    console.log("-----------------------");

    // Convert string status "Active"/"Inactive" to boolean true/false
    const is_active_status = editStatus.trim() === "Active";

    const updatedArchitectData = {
      ar_first_name: trimmedFirstName, // Use trimmedFirstName
      ar_last_name: trimmedLastName || '', // Use trimmedLastName
      ar_phone_number: cleanedPhone,
      ar_location: trimmedLocation,
      ar_is_active: is_active_status, // Boolean status for backend
      ar_status: editStatus.trim().toLowerCase(), // Add ar_status string for backend
    };

    try {
      // FIX 1: Change selectedArchitect.architectId to selectedArchitect.ar_id
      await updateArchitect(selectedArchitect.ar_id, updatedArchitectData);

      toast.success("Architect updated successfully!");
      setEditModal(false);
      setSelectedArchitect(null);
      setEditFirstName('');
      setEditLastName('');
      setEditPhone('');
      setEditLocation('');
      setEditStatus('Active');
      await loadArchitectData();

    } catch (error) {
      console.error("Error updating architect:", error);
      // FIX 2: Use .data.message or .data.error, and correct capitalization for 'data'
      toast.error(error.response?.data?.message || error.response?.data?.error || "Failed to update architect!");
    }
};


  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Manage Architect" pageTitle="Admin" />

          <Card>
            <CardBody>
              <Row className="mb-3 align-items-center">
                <Col md={6}>
                  <Input
                    type="text"
                    placeholder="Search name or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Col>
                <Col md={6} className="text-end">
                  <Button color="success" onClick={() => setAddModal(true)}>
                    Add Architect
                  </Button>
                </Col>
              </Row>

              {loading ? (
                <p>Loading architects...</p>
              ) : error ? (
                <p className="text-danger">{error}</p>
              ) : (
                <Table className="table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>Sr/No</th>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedArchitects.map((architect) => (
                      <tr key={architect.ar_id}> {/* Corrected whitespace issue here */}
                        <td>{architect.srNo}</td>
                        <td>{architect.first_name} {architect.last_name}</td>
                        <td>{architect.phone_number}</td>
                        <td>{architect.location}</td>
                        <td>
                          {/* Ensure `architect.status` is used, not `architect.ar_Status` */}
                          <Badge color={
                            architect.status === "Active"
                              ? "success"
                              : "danger"
                          }>
                            {architect.status}
                          </Badge>
                        </td>
                        <td>
                          <Button
                            type="button"
                            className="btn btn-sm btn-info me-1" // Added some styling for better spacing
                            onClick={() => handleEditClick(architect)}
                          ><i class="ri-edit-line"></i>                            
                          </Button>
                          <Button
                            color="danger"
                            size="sm"
                            onClick={() => handleDeleteClick(architect)}
                          >
                            <i className="ri-delete-bin-line"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}

              {totalPages > 1 && (
                <Row className="mt-3">
                  <Col className="d-flex justify-content-end">
                    <ul className="pagination mb-0">
                      <li className="page-item">
                        <Button
                          className="page-link"
                          onClick={() =>
                            setCurrentPage((p) => Math.max(p - 1, 1))
                          }
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                      </li>
                      {[...Array(totalPages)].map((_, i) => (
                        <li
                          className={`page-item ${currentPage === i + 1 ? "active" : ""
                            }`}
                          key={i}
                        >
                          <Button
                            className="page-link"
                            onClick={() => setCurrentPage(i + 1)}
                          >
                            {i + 1}
                          </Button>
                        </li>
                      ))}
                      <li className="page-item">
                        <Button
                          className="page-link"
                          onClick={() =>
                            setCurrentPage((p) => Math.min(p + 1, totalPages))
                          }
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                      </li>
                    </ul>
                  </Col>
                </Row>
              )}
            </CardBody>
          </Card>

          {/* Suspend Modal */}
          <Modal
            isOpen={suspendModal}
            toggle={() => setSuspendModal(!suspendModal)}
          >
            <ModalHeader toggle={() => setSuspendModal(!suspendModal)}>
              Change Status
            </ModalHeader>
            <ModalBody>
              {selectedArchitect && (
                <div>
                  <p>
                    Change status for <strong>{selectedArchitect.first_name} {selectedArchitect.last_name}</strong>:
                  </p>
                  <div className="d-flex gap-3">
                    <Button
                      color={newStatus === "Active" ? "success" : "secondary"}
                      onClick={() => setNewStatus("Active")}
                    >
                      Active
                    </Button>
                    <Button
                      color={
                        newStatus === "Inactive" ? "warning" : "secondary"
                      }
                      onClick={() => setNewStatus("Inactive")}
                    >
                      Inactive
                    </Button>
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={handleConfirmSuspend}>
                Confirm
              </Button>
              <Button color="secondary" onClick={() => setSuspendModal(false)}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>

          {/* Edit Modal */}
          <Modal isOpen={editModal} toggle={() => setEditModal(!editModal)}>
            <ModalHeader toggle={() => setEditModal(!editModal)}>
              Edit Architect
            </ModalHeader>
            <ModalBody>
              {/* Changed 'Name' to 'First Name' and 'Last Name' */}
              <FormGroup>
                <Label for="editFirstName">First Name</Label>
                <Input
                  id="editFirstName"
                  type="text"
                  value={editFirstName} // <--- Value tied to editFirstName state
                  onChange={(e) => setEditFirstName(e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <Label for="editLastName">Last Name</Label>
                <Input
                  id="editLastName"
                  type="text"
                  value={editLastName} // <--- Value tied to editLastName state
                  onChange={(e) => setEditLastName(e.target.value)}
                />
              </FormGroup>


              <FormGroup>
                <Label for="editPhone">Phone</Label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '8px', fontSize: '1.5em' }}>🇮🇳</span>
                  <span style={{ marginRight: '5px' }}>+91</span>
                  <Input
                    id="editPhone"
                    type="text"
                    maxLength="10"
                    value={editPhone}
                    // Use the cleaner function for phone input
                    onChange={(e) => {
                      const value = e.target.value;
                      const cleanedValue = value.replace(/\D/g, '');
                      if (cleanedValue.length <= 10) {
                        setEditPhone(cleanedValue);
                      }
                    }}
                    style={{ flexGrow: 1 }}
                  />
                </div>
              </FormGroup>

              <FormGroup>
                <Label for="editLocation">Location</Label>
                <Input
                  id="editLocation"
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <Label for="editStatus">Status</Label>
                <Input
                  id="editStatus"
                  type="select"
                  value={editStatus} // 'active', 'pending', 'inactive' strings
                  onChange={(e) => setEditStatus(e.target.value)}
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>   {/* Match frontend state to backend boolean */}
                  <option value="Inactive">Inactive</option> {/* Case sensitive to "Active" for boolean conversion */}
                  {/* <option value="pending">Pending</option> If you have this status on backend, handle it.
             For ar_is_active (boolean), only Active/Inactive makes sense */}
                </Input>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={handleConfirmEdit}>
                Save
              </Button>
              <Button color="secondary" onClick={() => setEditModal(false)}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>

          {/* Delete Confirmation Modal */}
          <Modal
            isOpen={deleteConfirmationModal}
            toggle={() => setDeleteConfirmationModal(!deleteConfirmationModal)}
          >
            <ModalHeader toggle={() => setDeleteConfirmationModal(!deleteConfirmationModal)}>
              Confirm Delete
            </ModalHeader>
            <ModalBody>
              {architectToDelete && (
                <p>
                  Are you sure you want to delete architect{" "}
                  <strong>{architectToDelete.first_name} {architectToDelete.last_name}</strong>?
                  This action will mark the architect as inactive.
                </p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onClick={handleConfirmDelete}>
                Delete
              </Button>
              <Button color="secondary" onClick={() => setDeleteConfirmationModal(false)}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>

          {/* Add Modal */}
          <Modal isOpen={addModal} toggle={() => setAddModal(!addModal)}>
            <ModalHeader toggle={() => setAddModal(!addModal)}>
              Add Architect
            </ModalHeader>
            <ModalBody>

              <FormGroup>
                <Label for="addFirstName">First Name</Label>
                <Input
                  id="addFirstName"
                  type="text"
                  value={addFirstName}
                  onChange={(e) => setAddFirstName(e.target.value)}
                  placeholder="Enter first name"
                />
              </FormGroup>

              <FormGroup>
                <Label for="addLastName">Last Name</Label>
                <Input
                  id="addLastName"
                  type="text"
                  value={addLastName}
                  onChange={(e) => setAddLastName(e.target.value)}
                  placeholder="Enter last name"
                />
              </FormGroup>

              <FormGroup>
                <Label for="addPhone">Phone</Label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '8px', fontSize: '1.5em' }}>🇮🇳</span>
                  <span style={{ marginRight: '5px' }}>+91</span>
                  <Input
                    id="addPhone"
                    type="number"
                    value={addPhone}
                    maxLength="10"
                    max={10}
                    onChange={(e) => {
                      const value = e.target.value;
                      const cleanedValue = value.replace(/\D/g, '');
                      if (cleanedValue.length <= 10) {
                        setAddPhone(cleanedValue);
                      }
                    }}


                  />
                </div>
              </FormGroup>

              <FormGroup>
                <Label for="addLocation">Location</Label>
                <Input
                  id="addLocation"
                  type="text"
                  value={addLocation}
                  onChange={(e) => setAddLocation(e.target.value)}
                  placeholder="Enter location"
                />
              </FormGroup>
              <FormGroup>
                <Label>Status</Label>
                <div className="d-flex gap-3">
                  <Button
                    color={addStatus === "Active" ? "success" : "secondary"}
                    onClick={() => setAddStatus("Active")}
                  >
                    Active
                  </Button>
                  <Button
                    color={addStatus === "Inactive" ? "warning" : "secondary"}
                    onClick={() => setAddStatus("Inactive")}
                  >
                    Inactive
                  </Button>
                </div>
              </FormGroup>
            </ModalBody>
            <ModalFooter>

              <Button
                color="primary"
                onClick={handleAddArchitect}
              >
                Add
              </Button>
              <Button color="secondary" onClick={() => setAddModal(false)}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </Container>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </React.Fragment >
  );
};
export default UiAnimation;