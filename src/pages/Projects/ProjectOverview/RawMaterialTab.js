import React, { useState } from 'react';
import { Card, CardBody, Button, Table, Input } from 'reactstrap';

const initialMaterials = [
    {
        id: 1,
        name: 'Cement',
        quantity: 20,
        unit: 'Bags',
        usedOn: '2025-05-27',
    }
];

const RawMaterialTab = () => {
    const [materials, setMaterials] = useState(initialMaterials);
    const [editRowId, setEditRowId] = useState(null);
    const [editableData, setEditableData] = useState({});

    const handleEditClick = (material) => {
        setEditRowId(material.id);
        setEditableData({ ...material });
    };

    const handleChange = (e, key) => {
        setEditableData({
            ...editableData,
            [key]: e.target.value,
        });
    };

    const handleSave = () => {
        const updated = materials.map(item =>
            item.id === editableData.id ? editableData : item
        );
        setMaterials(updated);
        setEditRowId(null);
        setEditableData({});
    };

    const handleCancel = () => {
        setEditRowId(null);
        setEditableData({});
    };

    const handleDelete = (id) => {
        const updated = materials.filter(item => item.id !== id);
        setMaterials(updated);
    };

    return (
        <Card>
            <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Raw Materials</h5>
                    <Button color="primary" size="sm">
                        <i className="ri-add-line align-middle me-1"></i> Add Material
                    </Button>
                </div>
                <p className="text-muted mb-3">
                    List of raw materials used in this project. (TBD with Amit Sir)
                </p>
                <Table responsive bordered hover>
                    <thead className="table-light">
                        <tr>
                            <th>#</th>
                            <th>Material Name</th>
                            <th>Quantity</th>
                            <th>Unit</th>
                            <th>Used On</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {materials.map((material, index) => (
                            <tr key={material.id}>
                                <td>{index + 1}</td>
                                <td>
                                    {editRowId === material.id ? (
                                        <Input
                                            value={editableData.name}
                                            onChange={(e) => handleChange(e, 'name')}
                                            bsSize="sm"
                                        />
                                    ) : (
                                        material.name
                                    )}
                                </td>
                                <td>
                                    {editRowId === material.id ? (
                                        <Input
                                            type="number"
                                            value={editableData.quantity}
                                            onChange={(e) => handleChange(e, 'quantity')}
                                            bsSize="sm"
                                        />
                                    ) : (
                                        material.quantity
                                    )}
                                </td>
                                <td>
                                    {editRowId === material.id ? (
                                        <Input
                                            value={editableData.unit}
                                            onChange={(e) => handleChange(e, 'unit')}
                                            bsSize="sm"
                                        />
                                    ) : (
                                        material.unit
                                    )}
                                </td>
                                <td>
                                    {editRowId === material.id ? (
                                        <Input
                                            type="date"
                                            value={editableData.usedOn}
                                            onChange={(e) => handleChange(e, 'usedOn')}
                                            bsSize="sm"
                                        />
                                    ) : (
                                        new Date(material.usedOn).toLocaleDateString()
                                    )}
                                </td>
                                <td>
                                    {editRowId === material.id ? (
                                        <>
                                            <Button color="success" size="sm" className="me-1" onClick={handleSave}>
                                                <i className="ri-check-line"></i>
                                            </Button>
                                            <Button color="secondary" size="sm" onClick={handleCancel}>
                                                <i className="ri-close-line"></i>
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                color="info"
                                                size="sm"
                                                className="me-1"
                                                onClick={() => handleEditClick(material)}
                                            >
                                                <i className="ri-edit-line"></i>
                                            </Button>
                                            <Button
                                                color="danger"
                                                size="sm"
                                                onClick={() => handleDelete(material.id)}
                                            >
                                                <i className="ri-delete-bin-line"></i>
                                            </Button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {materials.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center text-muted">
                                    No materials added yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </CardBody>
        </Card>
    );
};

export default RawMaterialTab;
