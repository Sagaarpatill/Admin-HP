import React from "react";
import { Navigate } from "react-router-dom";

//Dashboard
import DashboardAnalytics from "../pages/DashboardAnalytics";
import DashboardCrm from "../pages/DashboardCrm";
import DashboardEcommerce from "../pages/DashboardEcommerce";

import DashboardCrypto from "../pages/DashboardCrypto";
import DashboardProject from "../pages/DashboardProject";
import DashboardNFT from "../pages/DashboardNFT";
import DashboardJob from "../pages/DashboardJob/";

// Api 

//Calendar


// Email box




// Project
import ProjectList from "../pages/Projects/ProjectList";
import ProjectOverview from "../pages/Projects/ProjectOverview"; // This uses index.js (or ProjectOverview.js) 
import CreateProject from "../pages/Projects/CreateProject";

//Task


//Transactions


//Crm Pages


//Invoices
import InvoiceList from "../pages/Invoices/InvoiceList";
import InvoiceCreate from "../pages/Invoices/InvoiceCreate";
import InvoiceDetails from "../pages/Invoices/InvoiceDetails";

// Support Tickets


// //Ecommerce Pages


// NFT Marketplace Pages


// Base Ui


// Advance Ui


import UiAnimation from "../pages/AdvanceUi/UiAnimation/UiAnimation";


import UiRatings from "../pages/AdvanceUi/UiRatings/UiRatings";
import UiHighlight from "../pages/AdvanceUi/UiHighlight/UiHighlight";

// Widgets
// import Widgets from '../pages/Widgets/Index';

//Forms


//Tables


//Icon pages


//Maps


//AuthenticationInner pages

//pages





//APi Key


//login
import Login from "../pages/Authentication/Login";

import Logout from "../pages/Authentication/Logout";


//Charts


//Job pages


// Landing Index


// import PrivecyPolicy from '../pages/Pages/PrivacyPolicy';
// import TermsCondition from '../pages/Pages/TermsCondition';


// User Profile
import UserProfile from "../pages/Authentication/user-profile";




import { components } from "react-select";
// New develop branch

const authProtectedRoutes = [
  { path: "/dashboard-analytics", component: <DashboardAnalytics /> },
  { path: "/dashboard-crm", component: <DashboardCrm /> },
  { path: "/dashboard", component: <DashboardEcommerce /> },
  { path: "/index", component: <DashboardEcommerce /> },
  { path: "/dashboard-crypto", component: <DashboardCrypto /> },
  { path: "/dashboard-projects", component: <DashboardProject /> },
  { path: "/dashboard-nft", component: <DashboardNFT /> },
  { path: "/dashboard-job", component: <DashboardJob /> },







/// changes done by sagar
  //Chat

  //EMail


  //Projects
  { path: "/apps-projects", component: <ProjectList /> },
  { path: "/apps-projects-overview/:id", component: <ProjectOverview /> },
  { path: "/apps-projects-create", component: <CreateProject /> },

  //Tasks

  //Api Key
 

  //Crm

  //Invoices
  { path: "/apps-invoices-list", component: <InvoiceList /> },
  { path: "/apps-invoices-details", component: <InvoiceDetails /> },
  { path: "/apps-invoices-create", component: <InvoiceCreate /> },

  //Supports Tickets


  //transactions


//API
  // {path: "/api", component: <fetchCustomers />},
  // NFT Marketplace
  

  //charts



  // Base Ui
  

  // Advance Ui

  { path: "/Architect", component: <UiAnimation /> },
  { path: "/Stake-Holder", component: <UiRatings /> },
  { path: "/Customer", component: <UiHighlight /> },

  // Widgets
  // { path: "/widgets", component: <Widgets /> },

  // Forms
  

  //Tables

  //Icons


  //Maps


  //Pages
 

  //Job pages
 

  // { path: "/pages-privacy-policy", component: <PrivecyPolicy /> },
  // { path: "/pages-terms-condition", component: <TermsCondition /> },


  //User Profile
  { path: "/profile", component: UserProfile  },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
  { path: "*", component: <Navigate to="/dashboard" /> },
];

const publicRoutes = [
  // Authentication Page
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },



  //AuthenticationInner pages







];

export { authProtectedRoutes, publicRoutes };