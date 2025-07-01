// frontend/src/pages/Documents/DocumentsTab.js

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Button,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  FormFeedback,
} from "reactstrap";
import { Link, useParams } from "react-router-dom";

// Assuming these are correctly imported from your api file
import {
  fetchDocuments,
  createDocument,
  updateDocument,
  updateDocumentStatus,
  deleteDocument,
} from "../../../api"; // Adjust path if needed

import { toast } from "react-toastify";
import FeatherIcon from "feather-icons-react"; // Assuming you use this

// Dummy category list - Replace with actual data from Amit sir
const documentCategories = [
  "Project Initiation And Legal",
  "Design And Planning",
  "Construction Execution",
  "Government And Compliance",
  "Financial And Commercial",
  "Customer Handover And After Sales",
  "Internal Or Team Collaboration",
  "Miscellaneous And Custom Uploads",
];

const DocumentsTab = () => {
  // State Initialization
  const [files, setFiles] = useState([]);
  const [modal, setModal] = useState(false); // For upload/edit modal
  const [uploadFile, setUploadFile] = useState({
    name: "",
    category: documentCategories[0],
    file: null,
  });
  const [editingFile, setEditingFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const fileInputRef = useRef(null);

  // State for delete confirmation modal
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
    useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);

  // Get projectId from URL parameters and rename it for consistency
  const { id: projectIdFromUrl } = useParams();

  // Add a console log here to confirm it's getting a value
  console.log("DocumentsTab: projectIdFromUrl from URL =", projectIdFromUrl);

  // Load Documents on Mount (now takes projectId)
  const loadDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Pass projectIdFromUrl to fetchDocuments
      const data = await fetchDocuments(projectIdFromUrl);
      setFiles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading documents:", err);
      setError(
        "Failed to load documents. " + (err.message || "Unknown error.")
      );
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, [projectIdFromUrl]); // Dependency: Recreate if projectIdFromUrl changes

  useEffect(() => {
    if (projectIdFromUrl) {
      loadDocuments();
    } else {
      setLoading(false);
      console.warn(
        "Project ID not found in URL. Not loading documents for a specific project."
      );
      setFiles([]);
    }
  }, [projectIdFromUrl, loadDocuments]); // Dependencies: projectIdFromUrl and loadDocuments

  // Toggle Modal (for upload/edit)
  const toggleModal = () => {
    setModal(!modal);
    if (modal) {
      // If closing modal, reset states
      setUploadFile({ name: "", category: documentCategories[0], file: null });
      setEditingFile(null);
      setFormErrors({}); // Clear errors
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear file input
      }
    }
  };

  // Handle File Change for upload modal
  const handleFileChange = (e) => {
    setUploadFile((prev) => ({ ...prev, file: e.target.files[0] }));
    // Clear file error if a file is selected
    if (e.target.files[0]) {
      setFormErrors((prev) => ({ ...prev, file: "" }));
    }
  };

  // Handle Input Change for new upload
  const handleUploadInputChange = (e) => {
    const { name, value } = e.target;
    setUploadFile((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field being changed
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle Input Change for editing (now also updates uploadFile state)
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setUploadFile((prev) => ({ ...prev, [name]: value }));
    setEditingFile((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Basic form validation for upload
  const validateUploadForm = () => {
    let errors = {};
    if (!uploadFile.name.trim()) errors.name = "Document Name is required.";
    if (!uploadFile.category || uploadFile.category.trim() === "")
      errors.category = "Category is required.";
    if (!editingFile && !uploadFile.file) errors.file = "File is required."; // File is required only for new uploads
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Upload Submit (now sends projectId)
  const handleUploadSubmit = async (e) => {
    e.preventDefault();

    console.log(
      "DocumentsTab: handleUploadSubmit: Value of uploadFile.file before FormData:",
      uploadFile.file
    );

    if (!validateUploadForm()) {
      toast.error("Please correct the form errors.");
      return;
    }

    if (!projectIdFromUrl) {
      toast.error(
        "Project ID is not available. Cannot upload document without a project context."
      );
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("name", uploadFile.name);
    formData.append("category", uploadFile.category);
    formData.append("file", uploadFile.file); // Ensure uploadFile.file is a File object
    formData.append("projectId", projectIdFromUrl);

    // --- ADD THIS BLOCK FOR DETAILED DEBUGGING ---
    console.log("DocumentsTab: Contents of FormData before sending:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
    // --- END DETAILED DEBUGGING ---

    try {
      // Assuming createDocument is an async function that sends formData via axios.post
      await createDocument(formData);
      await loadDocuments(); // Reload documents for this project
      toggleModal();
      toast.success("Document uploaded successfully!");
    } catch (err) {
      console.error("Error uploading document:", err);
      // Improved error message extraction
      const errorMessage =
        err.response &&
        err.response.data &&
        (err.response.data.message || err.response.data.error)
          ? err.response.data.message || err.response.data.error
          : err.message || "Unknown error during upload.";
      setError("Failed to upload document. " + errorMessage);
      toast.error(`Failed to upload document: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle Edit button click
  const handleEdit = (file) => {
    // Populate uploadFile state for modal reuse (its current values will be shown in modal)
    setUploadFile({
      name: file.name,
      category: file.category,
      file: null, // File for edit is optional, user might not change it
    });
    setEditingFile({ ...file }); // Set editingFile for context (e.g., file.id)
    toggleModal(); // Open the modal for editing
  };

  // Handle Edit Save
  const handleEditSave = async (e) => {
    e.preventDefault();
    // Validate edit form
    if (!uploadFile.name.trim() || !uploadFile.category.trim()) {
      toast.error("Please fill all required fields for editing.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("name", uploadFile.name);
    formData.append("category", uploadFile.category);
    if (uploadFile.file) {
      // If a new file was selected during edit
      formData.append("file", uploadFile.file);
    }

    try {
      await updateDocument(editingFile.id, formData);
      await loadDocuments(); // Reload documents
      toggleModal();
      toast.success("Document updated successfully!");
    } catch (err) {
      console.error("Error updating document:", err);
      const errorMessage =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : err.message || "Unknown error during update.";
      setError("Failed to update document. " + errorMessage);
      toast.error(`Failed to update document: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Open delete confirmation modal
  const openDeleteConfirmModal = (file) => {
    setDocumentToDelete(file);
    setIsDeleteConfirmModalOpen(true);
  };

  // Handle Document Deletion (confirmed via modal)
  const confirmDeleteDocument = async () => {
    if (!documentToDelete) return; // Should not happen if modal is opened correctly

    setLoading(true);
    setError(null);
    try {
      await deleteDocument(documentToDelete.id);
      await loadDocuments(); // Reload documents for this project
      toast.success("Document deleted successfully!");
      setIsDeleteConfirmModalOpen(false); // Close modal
      setDocumentToDelete(null); // Clear the document to delete
    } catch (err) {
      console.error("Error deleting document:", err);
      const errorMessage =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : err.message || "Unknown error during deletion.";
      setError("Failed to delete document. " + errorMessage);
      toast.error(`Failed to delete document: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    setLoading(true);
    setError(null);
    const newStatus = currentStatus === "Verified" ? "Unverified" : "Verified";

    try {
      const updatedDoc = await updateDocumentStatus(id, newStatus);

      if (
        !updatedDoc ||
        typeof updatedDoc.id === "undefined" ||
        typeof updatedDoc.status === "undefined"
      ) {
        console.error(
          "Error: updateDocumentStatus did not return a valid updated document with id or status.",
          updatedDoc
        );
        setError("Failed to update status: Invalid response from server.");
        setLoading(false);
        return;
      }

      setFiles((prev) =>
        prev.map((file) =>
          file && file.id === updatedDoc.id
            ? { ...file, status: updatedDoc.status }
            : file
        )
      );
      toast.success(`Status updated to ${newStatus}!`);
    } catch (err) {
      console.error("Error toggling status:", err);
      const errorMessage =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : err.message || "Unknown error during status update.";
      setError("Failed to update status. " + errorMessage);
      toast.error(`Failed to update status: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentViewDownload = (file) => {
    if (file.fileurl) {
      window.open(file.fileurl, "_blank");
    } else {
      toast.error("No direct file URL available for this document.");
    }
  };

  // Categorize files for display
  const categorizedFiles = documentCategories.reduce((acc, category) => {
    acc[category] =
      files && Array.isArray(files)
        ? files.filter(
            (file) =>
              file !== null &&
              typeof file !== "undefined" &&
              file.category === category
          )
        : [];
    return acc;
  }, {});

  return (
    <Container fluid className="p-0">
      <Card>
        <CardHeader className="d-flex justify-content-between align-items-center">
          <h4>Project Documents (Project ID: {projectIdFromUrl || "N/A"})</h4>
          <Button
            color="primary"
            onClick={() => {
              setEditingFile(null);
              toggleModal();
            }}
          >
            Add Document
          </Button>
        </CardHeader>
        <CardBody>
          {loading ? (
            <p className="text-center p-3">Loading documents...</p>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : files.length === 0 ? (
            <p className="text-center text-muted p-3">
              No documents found for this project. Click "Add Document" to
              upload one.
            </p>
          ) : (
            Object.keys(categorizedFiles).map(
              (category) =>
                // Added margin-top to the category div for spacing
                categorizedFiles[category].length > 0 && (
                  <div key={category} className="mb-4 ">
                    <h5 className="mb-5">{category}</h5> {/* Added mb-3 here */}
                    <div className="table-responsive table-card">
                      {/* Added table-layout: fixed to ensure consistent column widths */}
                      <Table
                        className="table-borderless align-middle mb-0"
                        style={{ tableLayout: "fixed", width: "100%" }}
                      >
                        <thead className="table-light">
                          <tr>
                            {/* Explicitly setting widths for better alignment across categories */}
                            <th
                              className="py-2 px-3 align-middle text-start text-nowrap"
                              style={{ width: "5%" }}
                            >
                              Sr.
                            </th>
                            <th
                              className="py-2 px-3 align-middle text-start text-nowrap"
                              style={{ width: "15%" }}
                            >
                              Date Upload
                            </th>
                            <th
                              className="py-2 px-3 align-middle text-start text-nowrap"
                              style={{ width: "20%" }}
                            >
                              Category
                            </th>
                            <th
                              className="py-2 px-3 align-middle text-start text-nowrap"
                              style={{ width: "30%" }}
                            >
                              Document Name
                            </th>
                            <th
                              className="py-2 px-3 align-middle text-start text-nowrap"
                              style={{ width: "10%" }}
                            >
                              Size
                            </th>
                            <th
                              className="py-2 px-3 align-middle text-start text-nowrap"
                              style={{ width: "10%" }}
                            >
                              Status
                            </th>
                            <th
                              className="py-2 px-3 align-middle text-start text-nowrap"
                              style={{ width: "10%" }}
                            >
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {(categorizedFiles[category] || []).length > 0 ? (
                            (categorizedFiles[category] || []).map(
                              (file, index) => (
                                <tr key={file.id}>
                                  <td className="py-2 px-3 align-middle text-start">
                                    {index + 1}
                                  </td>
                                  <td className="py-2 px-3 align-middle text-start">
                                    {file.date}
                                  </td>
                                  <td className="py-2 px-3 align-middle text-start">
                                    {file.category}
                                  </td>
                                  <td className="py-2 px-3 align-middle text-start">
                                    <div
                                      className="d-flex align-items-center"
                                      style={{ width: "100%" }}
                                    >
                                      {" "}
                                      {/* Ensure div takes full width */}
                                      <div className="avatar-sm me-2 flex-shrink-0">
                                        <div
                                          className={`avatar-title bg-light ${file.color} rounded fs-24`}
                                        >
                                          <i className={file.icon}></i>
                                        </div>
                                      </div>
                                      {/* Removed inline maxWidth from h5, relying on flex-grow-1 and parent's width */}
                                      <h5 className="fs-14 mb-0 text-truncate flex-grow-1">
                                        <Link
                                          to="#"
                                          onClick={() =>
                                            handleDocumentViewDownload(file)
                                          }
                                          className="text-body"
                                        >
                                          {file.name}
                                        </Link>
                                      </h5>
                                    </div>
                                  </td>
                                  <td className="py-2 px-3 align-middle text-start">
                                    {file.size}
                                  </td>
                                  <td className="py-2 px-3 align-middle text-start">
                                    <Button
                                      size="sm"
                                      color={
                                        file.status === "Verified"
                                          ? "success"
                                          : "warning"
                                      }
                                      onClick={() =>
                                        handleStatusToggle(file.id, file.status)
                                      }
                                      className="btn-label waves-effect waves-light"
                                    >
                                      <i
                                        className={`ri-checkbox-circle-line label-icon align-middle rounded-pill ${
                                          file.status === "Verified"
                                            ? "fs-12"
                                            : "fs-10"
                                        }`}
                                      ></i>
                                      {file.status}
                                    </Button>
                                  </td>
                                  <td className="py-2 px-3 align-middle text-start">
                                    {/* Individual Action Buttons */}
                                    <Button
                                      type="button"
                                      color="info"
                                      size="sm"
                                      className="me-1"
                                      onClick={() => handleEdit(file)}
                                    >
                                      <i className="ri-edit-line"></i>
                                    </Button>
                                    <Button
                                      type="button"
                                      color="primary"
                                      size="sm"
                                      className="me-1"
                                      onClick={() =>
                                        handleDocumentViewDownload(file)
                                      }
                                    >
                                      <i className="ri-eye-line"></i>
                                    </Button>
                                    <Button
                                      type="button"
                                      color="danger"
                                      size="sm"
                                      onClick={() =>
                                        openDeleteConfirmModal(file)
                                      }
                                    >
                                      <i className="ri-delete-bin-line"></i>
                                    </Button>
                                  </td>
                                </tr>
                              )
                            )
                          ) : (
                            <tr>
                              <td
                                colSpan="7"
                                className="text-center text-muted py-3 align-middle"
                              >
                                No documents in this category.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                )
            )
          )}
        </CardBody>
      </Card>

      {/* Add/Edit Document Modal */}
      <Modal isOpen={modal} toggle={toggleModal} centered>
        <ModalHeader toggle={toggleModal}>
          {editingFile ? "Edit Document" : "Add New Document"}
        </ModalHeader>
        <Form onSubmit={editingFile ? handleEditSave : handleUploadSubmit}>
          <ModalBody>
            <FormGroup>
              <Label for="documentName">Name of the Document</Label>
              <Input
                id="documentName"
                type="text"
                placeholder="Enter document name"
                value={uploadFile.name}
                onChange={handleUploadInputChange}
                name="name"
                invalid={!!formErrors.name}
                required
              />
              <FormFeedback>{formErrors.name}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="documentCategory">Document Category</Label>
              <Input
                id="documentCategory"
                type="select"
                value={uploadFile.category}
                onChange={handleUploadInputChange}
                name="category"
                invalid={!!formErrors.category}
                required
              >
                <option value="">Select Category</option>
                {documentCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Input>
              <FormFeedback>{formErrors.category}</FormFeedback>
            </FormGroup>
            <FormGroup className="mt-3">
              <Label for="uploadFile">
                {editingFile ? "Replace File (Optional)" : "Upload File"}
              </Label>
              <Input
                id="uploadFile"
                type="file"
                onChange={handleFileChange}
                innerRef={fileInputRef}
                invalid={!!formErrors.file}
                required={!editingFile}
                name="file"
              />
              <FormFeedback>{formErrors.file}</FormFeedback>
              {editingFile && !uploadFile.file && (
                <small className="form-text text-muted">
                  Leave blank to keep existing file.
                </small>
              )}
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleModal}>
              Cancel
            </Button>
            <Button type="submit" color="primary">
              {editingFile ? "Save Changes" : "Upload"}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteConfirmModalOpen}
        toggle={() => setIsDeleteConfirmModalOpen(false)}
        centered
      >
        <ModalHeader toggle={() => setIsDeleteConfirmModalOpen(false)}>
          Confirm Deletion
        </ModalHeader>
        <ModalBody>
          <p>
            Are you sure you want to delete the document "
            <strong>{documentToDelete?.name}</strong>"? This action cannot be
            undone.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={() => setIsDeleteConfirmModalOpen(false)}
          >
            Cancel
          </Button>
          <Button color="danger" onClick={confirmDeleteDocument}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default DocumentsTab;
