import React, { useState } from 'react';
import { Card, CardBody, Button, Badge, Table } from 'reactstrap';

const SupportTicketsTab = () => {
    const [tickets, setTickets] = useState([
        {
            id: 1,
            title: "Payment not updated",
            date: "27-May-2025",
            status: "Unsolved"
        },
        {
            id: 2,
            title: "Site visit not scheduled",
            date: "28-May-2025",
            status: "Solved"
        }
    ]);

    const toggleStatus = (id) => {
        setTickets(tickets.map(ticket =>
            ticket.id === id
                ? { ...ticket, status: ticket.status === "Solved" ? "Unsolved" : "Solved" }
                : ticket
        ));
    };

    return (
        <Card>
            <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Support Tickets</h5>
                </div>
                <p className="text-muted mb-3">List of support requests raised by customers. You can mark them as solved or unsolved.</p>

                <Table responsive bordered hover>
                    <thead className="table-light">
                        <tr>
                            <th>#</th>
                            <th>Ticket Title</th>
                            <th>Raised On</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map((ticket, index) => (
                            <tr key={ticket.id}>
                                <td>{index + 1}</td>
                                <td>{ticket.title}</td>
                                <td>{ticket.date}</td>
                                <td>
                                    <Badge color={ticket.status === "Solved" ? "success" : "danger"}>
                                        {ticket.status}
                                    </Badge>
                                </td>
                                <td>
                                    <Button
                                        color={ticket.status === "Solved" ? "warning" : "success"}
                                        size="sm"
                                        onClick={() => toggleStatus(ticket.id)}
                                    >
                                        {ticket.status === "Solved" ? "Mark Unsolved" : "Mark Solved"}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </CardBody>
        </Card>
    );
};

export default SupportTicketsTab;
