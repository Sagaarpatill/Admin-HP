import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Card, CardBody, Col, DropdownItem, DropdownMenu,
    DropdownToggle, Input, Row, UncontrolledDropdown
} from 'reactstrap';
import DeleteModal from "../../../Components/Common/DeleteModal";
import { ToastContainer, toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Make sure to import toastify CSS

// Import your API functions directly
import { fetchProjects, deleteProject } from '../../../api'; // Corrected path

const List = () => {
    const navigate = useNavigate();

    // Use useState to manage project list directly in the component
    const [projectLists, setProjectLists] = useState([]);
    const [loading, setLoading] = useState(true); // Add a loading state
    const [error, setError] = useState(null); // Add an error state

    const [searchQuery, setSearchQuery] = useState("");
    const [deleteModal, setDeleteModal] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);

    // Function to fetch projects
    const getProjects = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchProjects();
            setProjectLists(data);
        } catch (err) {
            setError(err.message);
            toast.error("Failed to fetch projects: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch projects on component mount
    useEffect(() => {
        getProjects();
    }, []);

    const onClickDelete = (project) => {
        setProjectToDelete(project);
        setDeleteModal(true);
    };

    const handleDeleteProjectList = async () => {
        if (projectToDelete) {
            try {
                await deleteProject(projectToDelete.pg_project_id);
                toast.success("Project deleted successfully!");
                setDeleteModal(false);
                setProjectToDelete(null); // Clear the project to delete
                getProjects(); // Re-fetch projects to update the list
            } catch (err) {
                toast.error("Error deleting project: " + err.message);
                setError(err.message);
                setDeleteModal(false);
            }
        }
    };

    // Filter projects based on pg_project_name from your database schema
    const filteredProjects = projectLists?.filter((item) =>
        item.pg_project_name?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    if (loading) {
        return (
            <div className="page-content">
                <div className="text-center mt-5">Loading projects...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-content">
                <div className="text-center mt-5 text-danger">Error: {error}</div>
            </div>
        );
    }

    return (
        <React.Fragment>
            <ToastContainer closeButton={false} />
            <DeleteModal
                show={deleteModal}
                onDeleteClick={handleDeleteProjectList}
                onCloseClick={() => setDeleteModal(false)}
            />

            {/* Header & Search */}
            <Row className="g-4 mb-3">
                <div className="col-sm-auto">
                    <Link to="/apps-projects-create" className="btn btn-success">
                        <i className="ri-add-line align-bottom me-1"></i> Add New
                    </Link>
                </div>

                <div className="col-sm-3 ms-auto">
                    <div className="d-flex justify-content-sm-end gap-2">
                        <div className="search-box ms-2 col-sm-7">
                            <Input
                                type="text"
                                className="form-control"
                                placeholder="Search by project name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <i className="ri-search-line search-icon"></i>
                        </div>

                        {/* This select is not yet functional with your backend */}
                        <select className="form-control w-md">
                            <option value="All">All</option>
                            <option value="Last 7 Days">Last 7 Days</option>
                            <option value="Last 30 Days">Last 30 Days</option>
                            <option value="Last Year">Last Year</option>
                            <option value="This Month">This Month</option>
                            <option value="Today">Today</option>
                            <option value="Yesterday">Yesterday</option>
                        </select>
                    </div>
                </div>
            </Row>

            {/* Projects Grid Layout */}
            <div className="row">
                {filteredProjects.length === 0 ? (
                    <Col xs={12}>
                        <p className="text-center text-muted">No projects found. Create a new one!</p>
                    </Col>
                ) : (
                    filteredProjects.map((item) => (
                        <Col xxl={3} sm={6} className="project-card" key={item.pg_project_id}>
                            <Card className="card-height-100 cursor-pointer" onClick={() => navigate(`/apps-projects-overview/${item.pg_project_id}`)}>
                                <CardBody>
                                    <div className="d-flex flex-column h-100">

                                        {/* Last Updated - using pg_updated_date or pg_created_date */}
                                        <div className="d-flex justify-content-between mb-2">
                                            <p className="text-muted mb-0">
                                                <i className="ri-time-line align-bottom me-1"></i>
                                                {/* Format date as needed */}
                                                {item.pg_updated_date ? new Date(item.pg_updated_date).toLocaleDateString() : new Date(item.pg_created_date).toLocaleDateString()}
                                            </p>

                                            {/* Delete Dropdown */}
                                            <UncontrolledDropdown direction="start">
                                                <DropdownToggle tag="a" role="button">
                                                    <i className="ri-more-fill"></i>
                                                </DropdownToggle>
                                                <DropdownMenu className="dropdown-menu-end">
                                                    <DropdownItem onClick={(e) => { e.stopPropagation(); onClickDelete(item); }}>
                                                        <i className="ri-delete-bin-5-fill align-bottom me-2 text-muted"></i> Delete
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </UncontrolledDropdown>
                                        </div>

                                        {/* Project Name */}
                                        <h5 className="mb-2 fs-16 text-primary">{item.pg_project_name}</h5>

                                        {/* Supervisor */}
                                        <p className="text-muted mb-1"><strong>Supervisor:</strong> {item.pg_supervisor_name || 'N/A'}</p>

                                        {/* Steps */}
                                        <p className="text-muted mb-1"><strong>Steps Completed:</strong> {item.pg_steps_completed}</p>

                                        {/* Progress */}
                                        <div className="mt-3">
                                            <p className="text-muted mb-1">Work Progress</p>
                                            <div className="progress progress-sm animated-progress">
                                                <div
                                                    className="progress-bar bg-success"
                                                    role="progressbar"
                                                    style={{ width: `${item.pg_work_completed_percent || 0}%` }}
                                                    aria-valuenow={item.pg_work_completed_percent || 0}
                                                    aria-valuemin="0"
                                                    aria-valuemax="100"
                                                ></div>
                                            </div>
                                            <small className="text-muted">{item.pg_work_completed_percent || 0}% completed</small>
                                        </div>

                                        {/* Payment + Cost */}
                                        <div className="mt-3 d-flex justify-content-between">
                                            <div>
                                                <p className="text-muted mb-1">Payment Due</p>
                                                <h6 className="mb-0">{item.pg_payment_due_percent || 0}%</h6>
                                            </div>
                                            <div>
                                                <p className="text-muted mb-1">Project Cost</p>
                                                <h6 className="mb-0">₹ {item.pg_project_cost?.toLocaleString('en-IN') || '0'}</h6>
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    ))
                )}
            </div>
        </React.Fragment>
    );
};

export default List;