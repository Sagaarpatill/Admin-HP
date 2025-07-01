import React, { useState, useEffect, useCallback } from 'react';
import {
    Card, CardBody, Col, Row, Button, UncontrolledDropdown,
    DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, FormFeedback
} from 'reactstrap';
import { useParams } from 'react-router-dom';
import Select from 'react-select'; // For better dropdown experience for Phone Number
import { toast } from 'react-toastify';

// Import your API functions (assuming these exist and work)
import { fetchSupervisors, fetchCustomers } from '../../../api';

// Helper function to get initials for display pictures
const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
};

// Placeholder for fetching project-specific team members (would typically come from backend)
const fetchProjectTeamMembers = async (projectId) => {
    // In a real application, this would be an API call to your backend
    // e.g., axios.get(`/api/projects/${projectId}/team`)
    console.log(`Mock API: Fetching team members for project ${projectId}`);
    return new Promise(resolve => {
        setTimeout(() => {
            // Mock data for existing team members on a project
            const mockTeamData = [
                { id: 1, name: 'John Smith', type: 'Supervisor', phoneNumber: '9876543210', email: 'john@example.com', projectsCount: 5, lastLogin: '2025-06-15' },
                { id: 2, name: 'Michael Tan', type: 'Architect', phoneNumber: '9988776655', email: 'michael@example.com', projectsCount: 3, lastLogin: '2025-06-10' },
                { id: 3, name: 'Amit Patel', type: 'Owner', phoneNumber: '9000000000', email: 'amit@example.com', projectsCount: 1, lastLogin: '2025-06-17' },
                { id: 4, name: 'Sara Lee', type: 'Supervisor', phoneNumber: '9999999999', email: 'sara@example.com', projectsCount: 4, lastLogin: '2025-06-16' },
            ];
            resolve(mockTeamData);
        }, 500);
    });
};

const TeamTab = () => {
    const { id: projectId } = useParams(); // Get project ID from URL
    const [teamMembers, setTeamMembers] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [newMember, setNewMember] = useState({
        personType: null, // Stores { value: 'Supervisor', label: 'Supervisor' }
        phoneNumber: null, // Stores { value: 'phone_number', label: 'Name - phone_number' }
        otp: '',
        name: '', // Auto-filled based on phone number selection
        email: '', // Auto-filled based on phone number selection
    });
    const [formErrors, setFormErrors] = useState({});
    const [allStakeholders, setAllStakeholders] = useState([]); // All customers and supervisors
    const [loadingStakeholders, setLoadingStakeholders] = useState(true);
    const [loadingTeam, setLoadingTeam] = useState(true);
    const [otpVerified, setOtpVerified] = useState(false);

    // Person Type Options for the dropdown
    const personTypeOptions = [
        { value: 'Owner', label: 'Owner' },
        { value: 'Supervisor', label: 'Supervisor' },
        { value: 'Architect', label: 'Architect' },
    ];

    // --- Fetch All Stakeholders (Customers and Supervisors) ---
    useEffect(() => {
        const loadStakeholders = async () => {
            try {
                setLoadingStakeholders(true);
                const [supervisorsData, customersData] = await Promise.all([
                    fetchSupervisors(),
                    fetchCustomers()
                ]);

                // Map fetched data into a common format for the Select component
                const mappedSupervisors = supervisorsData.map(s => ({
                    value: s.phone_number,
                    label: `${s.name} - ${s.phone_number} (Supervisor)`,
                    type: 'Supervisor',
                    name: s.name,
                    email: s.email,
                }));

                const mappedCustomers = customersData.map(c => ({
                    value: c.phone,
                    label: `${c.name} - ${c.phone} (Customer)`,
                    type: 'Owner', // Assuming customers can be Owners for this context
                    name: c.name,
                    email: c.email,
                }));

                // Combine all stakeholders (you might filter out duplicates or customers not acting as 'Owners')
                setAllStakeholders([...mappedSupervisors, ...mappedCustomers]);

            } catch (err) {
                console.error("Failed to load stakeholders:", err);
                toast.error("Failed to load available stakeholders.");
            } finally {
                setLoadingStakeholders(false);
            }
        };

        loadStakeholders();
    }, []);

    // --- Fetch Project Team Members ---
    const loadTeamMembers = useCallback(async () => {
        if (!projectId) return;
        setLoadingTeam(true);
        try {
            // Replace with actual API call: const data = await fetchProjectTeamMembers(projectId);
            const data = await fetchProjectTeamMembers(projectId); // Using the mock function for now
            setTeamMembers(data);
        } catch (err) {
            console.error("Failed to load project team members:", err);
            toast.error("Failed to load project team.");
        } finally {
            setLoadingTeam(false);
        }
    }, [projectId]);

    useEffect(() => {
        loadTeamMembers();
    }, [loadTeamMembers]);

    const toggleModal = () => {
        setModalOpen(!modalOpen);
        if (modalOpen) { // Reset state when closing modal
            setNewMember({
                personType: null,
                phoneNumber: null,
                otp: '',
                name: '',
                email: '',
            });
            setFormErrors({});
            setOtpVerified(false);
        }
    };

    const handleNewMemberChange = (field, value) => {
        setNewMember(prev => ({ ...prev, [field]: value }));
        setFormErrors(prev => ({ ...prev, [field]: '' })); // Clear error on change

        // If personType or phoneNumber changes, reset OTP verification
        if (field === 'personType' || field === 'phoneNumber') {
            setOtpVerified(false);
        }

        // Logic to auto-fill name and email based on selected phone number
        if (field === 'phoneNumber' && value) {
            const selectedStakeholder = allStakeholders.find(s => s.value === value.value);
            if (selectedStakeholder) {
                setNewMember(prev => ({
                    ...prev,
                    phoneNumber: value,
                    name: selectedStakeholder.name,
                    email: selectedStakeholder.email || '',
                    personType: prev.personType || { value: selectedStakeholder.type, label: selectedStakeholder.type } // Pre-select type if not already selected
                }));
            }
        }
    };

    const validateForm = () => {
        let errors = {};
        if (!newMember.personType) errors.personType = 'Person Type is required.';
        if (!newMember.phoneNumber) errors.phoneNumber = 'Phone Number is required.';
        if (!newMember.otp.trim()) errors.otp = 'OTP is required.';
        if (!otpVerified) errors.otp = 'OTP not verified.';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleVerifyOtp = () => {
        // Mock OTP verification logic
        if (newMember.otp === '123456') { // Dummy OTP
            setOtpVerified(true);
            toast.success('OTP Verified!');
            setFormErrors(prev => ({ ...prev, otp: '' })); // Clear OTP error
        } else {
            setOtpVerified(false);
            setFormErrors(prev => ({ ...prev, otp: 'Invalid OTP.' }));
            toast.error('Invalid OTP.');
        }
    };

    const handleSubmitNewMember = async () => {
        if (!validateForm()) {
            toast.error('Please correct the form errors.');
            return;
        }

        if (!projectId) {
            toast.error('Project ID not available. Cannot add team member.');
            return;
        }

        // Check if the selected phone number is already a team member for this project
        const isAlreadyMember = teamMembers.some(
            member => member.phoneNumber === newMember.phoneNumber.value && member.type === newMember.personType.value
        );

        if (isAlreadyMember) {
            toast.warn('This person is already a team member for this project with the selected role.');
            toggleModal();
            return;
        }

        setLoadingTeam(true);
        try {
            // In a real application, you'd send this data to a backend API
            // e.g., await axios.post(`/api/projects/${projectId}/team`, { ...newMember, phoneNumber: newMember.phoneNumber.value });
            const addedMember = {
                id: Date.now(), // Mock ID
                name: newMember.name,
                type: newMember.personType.value,
                phoneNumber: newMember.phoneNumber.value,
                email: newMember.email,
                projectsCount: Math.floor(Math.random() * 10) + 1, // Mock data
                lastLogin: new Date().toISOString().split('T')[0], // Mock data
            };
            setTeamMembers(prev => [...prev, addedMember]);
            toast.success('Team member added successfully!');
            toggleModal();
        } catch (err) {
            console.error("Failed to add team member:", err);
            toast.error("Failed to add team member.");
        } finally {
            setLoadingTeam(false);
        }
    };

    const handleDeleteTeamMember = (memberId) => {
        // In a real application, you'd send this to a backend API
        // e.g., await axios.delete(`/api/projects/${projectId}/team/${memberId}`);
        setTeamMembers(prev => prev.filter(member => member.id !== memberId));
        toast.success('Team member removed.');
    };

    return (
        <Card>
            <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0">Team (Project ID: {projectId})</h5>
                    <Button color="primary" onClick={toggleModal}>
                        + Add Team Member
                    </Button>
                </div>

                {loadingTeam ? (
                    <p className="text-center text-muted">Loading team members...</p>
                ) : teamMembers.length === 0 ? (
                    <p className="text-center text-muted">No team members allocated to this project yet.</p>
                ) : (
                    <div className="table-responsive table-card">
                        <table className="table table-borderless align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="py-2 px-3 text-start">DP/Image</th>
                                    <th className="py-2 px-3 text-start">Name</th>
                                    <th className="py-2 px-3 text-start">Stakeholder Type</th>
                                    <th className="py-2 px-3 text-start">Phone Number</th>
                                    <th className="py-2 px-3 text-start">Email</th>
                                    <th className="py-2 px-3 text-start">Projects</th>
                                    <th className="py-2 px-3 text-start">Last Login</th>
                                    <th className="py-2 px-3 text-start">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teamMembers.map(member => (
                                    <tr key={member.id}>
                                        <td className="py-2 px-3">
                                            <div className="avatar-sm d-inline-block">
                                                <div className="avatar-title bg-soft-primary rounded-circle text-primary fs-5">
                                                    {getInitials(member.name)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-2 px-3">{member.name}</td>
                                        <td className="py-2 px-3">{member.type}</td>
                                        <td className="py-2 px-3">{member.phoneNumber}</td>
                                        <td className="py-2 px-3">{member.email || 'N/A'}</td>
                                        <td className="py-2 px-3">{member.projectsCount}</td>
                                        <td className="py-2 px-3">{member.lastLogin}</td>
                                        <td className="py-2 px-3">
                                            <Button
                                                color="danger"
                                                size="sm"
                                                onClick={() => handleDeleteTeamMember(member.id)}
                                            >
                                                Remove
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardBody>

            {/* Add Team Member Modal */}
            <Modal isOpen={modalOpen} toggle={toggleModal} centered>
                <ModalHeader toggle={toggleModal}>Add New Team Member</ModalHeader>
                <ModalBody>
                    <div className="mb-3">
                        <Label for="personType">Person Type</Label>
                        <Select
                            id="personType"
                            options={personTypeOptions}
                            value={newMember.personType}
                            onChange={(selectedOption) => handleNewMemberChange('personType', selectedOption)}
                            placeholder="Select Person Type"
                            classNamePrefix="select"
                            className={formErrors.personType ? 'is-invalid' : ''}
                        />
                        {formErrors.personType && <FormFeedback className="d-block">{formErrors.personType}</FormFeedback>}
                    </div>

                    <div className="mb-3">
                        <Label for="phoneNumber">Phone Number</Label>
                        <Select
                            id="phoneNumber"
                            options={allStakeholders.map(s => ({ value: s.value, label: s.label }))}
                            value={newMember.phoneNumber}
                            onChange={(selectedOption) => handleNewMemberChange('phoneNumber', selectedOption)}
                            placeholder={loadingStakeholders ? "Loading phone numbers..." : "Search or select phone number"}
                            isClearable
                            isLoading={loadingStakeholders}
                            classNamePrefix="select"
                            className={formErrors.phoneNumber ? 'is-invalid' : ''}
                        />
                        {formErrors.phoneNumber && <FormFeedback className="d-block">{formErrors.phoneNumber}</FormFeedback>}
                        {!newMember.phoneNumber && !loadingStakeholders && (
                            <small className="text-muted">
                                If phone number is new, please add it in the <a href="/stakeholders" target="_blank">Stakeholder Management</a> page first.
                            </small>
                        )}
                        {newMember.phoneNumber && (
                             <div className="mt-2">
                                <p className="mb-0"><strong>Name:</strong> {newMember.name || 'N/A'}</p>
                                <p className="mb-0"><strong>Email:</strong> {newMember.email || 'N/A'}</p>
                             </div>
                        )}
                    </div>

                    <div className="mb-3">
                        <Label for="otp">OTP</Label>
                        <div className="d-flex align-items-center">
                            <Input
                                id="otp"
                                type="text"
                                placeholder="Enter OTP"
                                value={newMember.otp}
                                onChange={(e) => handleNewMemberChange('otp', e.target.value)}
                                className={formErrors.otp ? 'is-invalid' : ''}
                            />
                            <Button
                                color="info"
                                className="ms-2"
                                onClick={handleVerifyOtp}
                                disabled={otpVerified || !newMember.otp.trim()}
                            >
                                Verify
                            </Button>
                        </div>
                        {formErrors.otp && <FormFeedback className="d-block">{formErrors.otp}</FormFeedback>}
                        {otpVerified && <span className="text-success ms-2">✅ Verified!</span>}
                    </div>

                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleSubmitNewMember} disabled={!otpVerified}>
                        Add Member
                    </Button>
                    <Button color="secondary" onClick={toggleModal}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </Card>
    );
};

export default TeamTab;
