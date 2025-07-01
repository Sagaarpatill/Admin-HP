import React, { useState } from 'react';
import {
    Card,
    CardBody,
    Col,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    TabPane
} from 'reactstrap';
import classnames from 'classnames';

// Import images
import slack from '../../../assets/images/brands/slack.png';

// Import tab components
import OverviewTab from './OverviewTab';
import DocumentsTab from './DocumentsTab';
import ActivitiesTab from './ActivitiesTab';
import TeamTab from './TeamTab';
import FinanceTab from './FinanceTab';
import RawMaterialTab from './RawMaterialTab';
import SupportTicketsTab from './SupportTicketsTab';
import PlansInternalDocumentsTab from './PlansInternalDocumentsTab.js';

const Section = () => {
    const [activeTab, setActiveTab] = useState('1');

    const toggleTab = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };

    return (
        <React.Fragment>
            <Row>
                <Col lg={12}>
                    <Card className="mt-n4 mx-n4">
                        <div className="bg-warning-subtle">
                            <CardBody className="pb-0 px-4">
                                <Row className="mb-3">
                                    <div className="col-md">
                                        <Row className="align-items-center g-3">
                                            <div className="col-md-auto">
                                                <div className="avatar-md">
                                                    <div className="avatar-title bg-white rounded-circle">
                                                        <img src={slack} alt="logo" style={{ width: '70px', height: '55px' }} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md">
                                                <div>
                                                    <h4 className="fw-bold">Houzing Partner - Admin & Dashboard</h4>
                                                    <div className="hstack gap-3 flex-wrap">
                                                        <div><i className="ri-building-line align-bottom me-1"></i> </div>
                                                        <div className="vr"></div>
                                                        <div>Create Date : <span className="fw-medium">15 Sep, 2021</span></div>
                                                        <div className="vr"></div>
                                                        <div>Due Date : <span className="fw-medium">29 Dec, 2021</span></div>
                                                        <div className="vr"></div>
                                                        <div className="badge rounded-pill bg-info fs-12">New</div>
                                                        <div className="badge rounded-pill bg-danger fs-12">High</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Row>
                                    </div>
                                    <div className="col-md-auto">
                                        <div className="hstack gap-1 flex-wrap">
                                            <button type="button" className="btn py-0 fs-16 favourite-btn material-shadow-none active">
                                                <i className="ri-star-fill"></i>
                                            </button>
                                            <button type="button" className="btn py-0 fs-16 text-body material-shadow-none">
                                                <i className="ri-share-line"></i>
                                            </button>
                                            <button type="button" className="btn py-0 fs-16 text-body material-shadow-none">
                                                <i className="ri-flag-line"></i>
                                            </button>
                                        </div>
                                    </div>
                                </Row>

                                <Nav className="nav-tabs-custom border-bottom-0" role="tablist">
                                    <NavItem>
                                        <NavLink
                                            className={classnames({ active: activeTab === '1' }, "fw-semibold")}
                                            onClick={() => { toggleTab('1'); }}
                                            href="#"
                                        >
                                            Overview
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({ active: activeTab === '2' }, "fw-semibold")}
                                            onClick={() => { toggleTab('2'); }}
                                            href="#"
                                        >
                                            Customer Documents
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({ active: activeTab === '3' }, "fw-semibold")}
                                            onClick={() => { toggleTab('3'); }}
                                            href="#"
                                        >
                                            Updates
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({ active: activeTab === '4' }, "fw-semibold")}
                                            onClick={() => { toggleTab('4'); }}
                                            href="#"
                                        >
                                            Team
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({ active: activeTab === '5' }, "fw-semibold")}
                                            onClick={() => { toggleTab('5'); }}
                                            href="#"
                                        >
                                            Finance
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({ active: activeTab === '6' }, "fw-semibold")}
                                            onClick={() => { toggleTab('6'); }}
                                            href="#"
                                        >
                                            RawMaterial
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({ active: activeTab === '7' }, "fw-semibold")}
                                            onClick={() => { toggleTab('7'); }}
                                            href="#"
                                        >
                                            SupportTickets
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({ active: activeTab === '8' }, "fw-semibold")}
                                            onClick={() => { toggleTab('8'); }}
                                            href="#"
                                        >
                                            PlansInternalDocumentsTab
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                            </CardBody>
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col lg={12}>
                    <TabContent activeTab={activeTab} className="text-muted">
                        <TabPane tabId="1">
                            <OverviewTab />
                        </TabPane>
                        <TabPane tabId="2">
                            <DocumentsTab />
                        </TabPane>
                        <TabPane tabId="3">
                            <ActivitiesTab />
                        </TabPane>
                        <TabPane tabId="4">
                            <TeamTab />
                        </TabPane>
                        <TabPane tabId="5">
                            <FinanceTab />
                        </TabPane>
                        <TabPane tabId="6">
                            <RawMaterialTab />
                        </TabPane>
                        <TabPane tabId="7">
                            <SupportTicketsTab />
                        </TabPane>
                        <TabPane tabId="8">
                            <PlansInternalDocumentsTab />
                        </TabPane>
                    </TabContent>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Section;
