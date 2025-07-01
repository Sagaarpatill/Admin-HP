// Import Images
import sitePlan from "../../assets/images/brands/slack.png";
import elevation from "../../assets/images/brands/dribbble.png";
import interiors from "../../assets/images/brands/mail_chimp.png";
import landscaping from "../../assets/images/brands/dropbox.png";
import avatar2 from "../../assets/images/users/avatar-2.jpg";
import avatar3 from "../../assets/images/users/avatar-3.jpg";
import avatar4 from "../../assets/images/users/avatar-4.jpg";
import avatar5 from "../../assets/images/users/avatar-5.jpg";
import avatar6 from "../../assets/images/users/avatar-6.jpg";
import avatar7 from "../../assets/images/users/avatar-7.jpg";
import avatar8 from "../../assets/images/users/avatar-8.jpg";
import avatar9 from "../../assets/images/users/avatar-9.jpg";
import avatar10 from "../../assets/images/users/avatar-10.jpg";
import { Link } from "react-router-dom";

const projectList = [
  {
    id: 1,
    label: "Green Valley Phase 1",
    lastUpdated: "1 hour ago",
    supervisorName: "Ramesh Kumar",
    stepsCompleted: "12/20",
    progressBar: "60%",
    paymentDue: 25,
    projectCost: 8500000,
    // Link:"/"
  },
  {
    id: 2,
    label: "Sunrise Apartments",
    lastUpdated: "3 hours ago",
    supervisorName: "Sunita Sharma",
    stepsCompleted: "18/50",
    progressBar: "36%",
    paymentDue: 40,
    projectCost: 12000000,
  },
  {
    id: 3,
    label: "Oakwood Luxury Villas",
    lastUpdated: "30 minutes ago",
    supervisorName: "Amit Joshi",
    stepsCompleted: "25/40",
    progressBar: "62%",
    paymentDue: 15,
    projectCost: 15000000,
  },
  {
    id: 4,
    label: "City Central Mall",
    lastUpdated: "Yesterday",
    supervisorName: "Neha Verma",
    stepsCompleted: "30/60",
    progressBar: "50%",
    paymentDue: 50,
    projectCost: 20000000,
  },
  {
    id: 5,
    label: "Hilltop Residency",
    lastUpdated: "2 days ago",
    supervisorName: "Deepak Singh",
    stepsCompleted: "22/50",
    progressBar: "45%",
    paymentDue: 35,
    projectCost: 9700000,
  },
  {
    id: 6,
    label: "Palm Commercial Hub",
    lastUpdated: "5 hours ago",
    supervisorName: "Kavita Rao",
    stepsCompleted: "50/50",
    progressBar: "100%",
    paymentDue: 0,
    projectCost: 18000000,
  },
  {
    id: 7,
    label: "Skyline Towers",
    lastUpdated: "1 day ago",
    supervisorName: "Mohit Bansal",
    stepsCompleted: "14/50",
    progressBar: "28%",
    paymentDue: 60,
    projectCost: 13500000,
  },
  {
    id: 8,
    label: "Lakeside Villas",
    lastUpdated: "3 days ago",
    supervisorName: "Priya Mehta",
    stepsCompleted: "20/50",
    progressBar: "40%",
    paymentDue: 55,
    projectCost: 11000000,
  },
  {
    id: 9,
    label: "Silver Crest Homes",
    lastUpdated: "2 hours ago",
    supervisorName: "Suresh Rana",
    stepsCompleted: "35/40",
    progressBar: "88%",
    paymentDue: 10,
    projectCost: 9200000,
  },
  {
    id: 10,
    label: "Royal Heights",
    lastUpdated: "Today",
    supervisorName: "Meera Sinha",
    stepsCompleted: "40/50",
    progressBar: "80%",
    paymentDue: 20,
    projectCost: 14500000,
  },
  {
    id: 11,
    label: "Oceanview Apartments",
    lastUpdated: "4 days ago",
    supervisorName: "Rajiv Nair",
    stepsCompleted: "38/60",
    progressBar: "63%",
    paymentDue: 33,
    projectCost: 12500000,
  },
  {
    id: 12,
    label: "Golden Sands Plaza",
    lastUpdated: "6 hours ago",
    supervisorName: "Anita George",
    stepsCompleted: "45/60",
    progressBar: "75%",
    paymentDue: 18,
    projectCost: 17500000,
  },
  {
    id: 13,
    label: "Mountain View Villas",
    lastUpdated: "Yesterday",
    supervisorName: "Rahul Yadav",
    stepsCompleted: "20/40",
    progressBar: "50%",
    paymentDue: 40,
    projectCost: 9500000,
  },
  {
    id: 14,
    label: "Meadow Heights",
    lastUpdated: "Today",
    supervisorName: "Sneha Kapoor",
    stepsCompleted: "28/35",
    progressBar: "80%",
    paymentDue: 22,
    projectCost: 10200000,
  },
  {
    id: 15,
    label: "Crescent Business Bay",
    lastUpdated: "3 days ago",
    supervisorName: "Vikram Chauhan",
    stepsCompleted: "60/70",
    progressBar: "86%",
    paymentDue: 12,
    projectCost: 25000000,
  },
  {
    id: 16,
    label: "Maple Gardens",
    lastUpdated: "Last Week",
    supervisorName: "Garima Singh",
    stepsCompleted: "15/30",
    progressBar: "50%",
    paymentDue: 45,
    projectCost: 8900000,
  },
  {
    id: 17,
    label: "Pearl Residency",
    lastUpdated: "2 days ago",
    supervisorName: "Tarun Ahuja",
    stepsCompleted: "10/20",
    progressBar: "50%",
    paymentDue: 35,
    projectCost: 8600000,
  },
  {
    id: 18,
    label: "Emerald Square",
    lastUpdated: "5 hours ago",
    supervisorName: "Divya Mishra",
    stepsCompleted: "48/60",
    progressBar: "80%",
    paymentDue: 19,
    projectCost: 19800000,
  }
];

export { projectList };