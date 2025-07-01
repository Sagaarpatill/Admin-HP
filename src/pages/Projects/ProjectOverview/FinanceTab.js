import React from 'react';
import {
  Card, CardBody, Col, Row, Table, UncontrolledDropdown,
  DropdownToggle, DropdownMenu, DropdownItem, Button
} from 'reactstrap';

const FinanceTab = () => {
  const transactions = [
    { id: 1, type: 'Invoice', title: 'Initial Deposit Invoice', amount: '₹1,00,000', date: '01 May 2025', icon: 'ri-file-text-line' },
    { id: 2, type: 'Payment', title: 'Initial Deposit Received', amount: '₹1,00,000', date: '03 May 2025', icon: 'ri-bank-card-line' },
    { id: 3, type: 'Plan', title: 'Milestone 2 - Framing', amount: '₹2,00,000', date: '15 Jun 2025', icon: 'ri-calendar-check-line' },
    { id: 4, type: 'Invoice', title: 'Framing Invoice', amount: '₹2,00,000', date: '20 Jun 2025', icon: 'ri-file-text-line' },
  ];

  return (
    <Card>
      <CardBody>
        <h5 className="mb-4">Finance Summary</h5>

        {/* Transactions */}
        <div className="table-responsive mb-4">
          <h6 className="text-muted mb-3">Transactions</h6>
          <Table className="align-middle table-nowrap mb-0">
            <thead className="table-light">
              <tr>
                <th>Type</th>
                <th>Title</th>
                <th>Amount</th>
                <th>Date</th>
                <th style={{ width: "120px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id}>
                  <td>
                    <i className={`ri ${txn.icon} align-middle text-primary me-2`}></i>
                    {txn.type}
                  </td>
                  <td>{txn.title}</td>
                  <td className="fw-semibold">{txn.amount}</td>
                  <td>{txn.date}</td>
                  <td>
                    <UncontrolledDropdown>
                      <DropdownToggle tag="button" className="btn btn-soft-secondary btn-sm btn-icon">
                        <i className="ri-more-fill"></i>
                      </DropdownToggle>
                      <DropdownMenu className="dropdown-menu-end">
                        <DropdownItem><i className="ri-eye-line me-2"></i>View</DropdownItem>
                        <DropdownItem><i className="ri-edit-2-line me-2"></i>Edit</DropdownItem>
                        <DropdownItem><i className="ri-download-line me-2"></i>Download</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem className="text-danger"><i className="ri-delete-bin-line me-2"></i>Delete</DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Payment Plan */}
        <div className="mb-4">
          <h6 className="text-muted mb-3">Payment Plan</h6>
          <ul className="list-group">
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Booking Amount
              <span className="badge bg-success-subtle text-success">₹1,00,000</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Milestone 1 - Foundation
              <span className="badge bg-warning-subtle text-warning">₹2,50,000</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Milestone 2 - Framing
              <span className="badge bg-warning-subtle text-warning">₹2,00,000</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Final Handover
              <span className="badge bg-danger-subtle text-danger">₹5,00,000</span>
            </li>
          </ul>
        </div>

        {/* Invoices Issued */}
        <div className="mb-4">
          <h6 className="text-muted mb-3">Invoices Issued</h6>
          <ul className="list-unstyled mb-0">
            <li className="d-flex justify-content-between py-2 border-bottom">
              <span>Invoice #INV001 - Booking</span>
              <span className="fw-medium text-muted">₹1,00,000</span>
            </li>
            <li className="d-flex justify-content-between py-2 border-bottom">
              <span>Invoice #INV002 - Framing</span>
              <span className="fw-medium text-muted">₹2,00,000</span>
            </li>
          </ul>
        </div>

        {/* Payments Made */}
        <div>
          <h6 className="text-muted mb-3">Payments Made</h6>
          <ul className="list-unstyled mb-0">
            <li className="d-flex justify-content-between py-2 border-bottom">
              <span>Payment Received on 03 May 2025</span>
              <span className="fw-medium text-success">₹1,00,000</span>
            </li>
          </ul>
        </div>

        {/* Add Button */}
        <div className="text-end mt-4">
          <Button color="primary"><i className="ri-add-line me-1"></i> Add Transaction</Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default FinanceTab;
