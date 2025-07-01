import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';

// Import avatar image
import avatar1 from "../../assets/images/users/avatar-1.jpg";

const ProfileDropdown = () => {
  // Select user data from Redux
  const profiledropdownData = createSelector(
    (state) => state.Profile,
    (profile) => ({
      user: profile.user
    })
  );
  const { user } = useSelector(profiledropdownData);

  // State for the username to show in the dropdown
  const [userName, setUserName] = useState("Admin");

  // Set username from sessionStorage or fallback values
  useEffect(() => {
    if (sessionStorage.getItem("authUser")) {
      const obj = JSON.parse(sessionStorage.getItem("authUser"));
      let name = "Admin";

      const authType = process.env.REACT_APP_DEFAULTAUTH;

      if (authType === "fake") {
        if (obj?.username) {
          name = obj.username;
        } else if (user?.first_name) {
          name = user.first_name;
        } else if (obj?.data?.first_name) {
          name = obj.data.first_name;
        }
      } else if (authType === "firebase") {
        if (obj?.email) {
          name = obj.email;
        }
      } else {
        // OTP login fallback
        if (obj?.phone) {
          name = obj.phone;
        }
      }

      setUserName(name);
    }
  }, [user]);

  // Dropdown toggle state
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const toggleProfileDropdown = () => {
    setIsProfileDropdown(!isProfileDropdown);
  };

  return (
    <React.Fragment>
      <Dropdown isOpen={isProfileDropdown} toggle={toggleProfileDropdown} className="ms-sm-3 header-item topbar-user">
        <DropdownToggle tag="button" type="button" className="btn">
          <span className="d-flex align-items-center">
            <img className="rounded-circle header-profile-user" src={avatar1} alt="Header Avatar" />
            <span className="text-start ms-xl-2">
              <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">{userName}</span>
              <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">Welcome</span>
            </span>
          </span>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem className='p-0'>
            <Link to="/logout" className="dropdown-item">
              <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>
              <span className="align-middle" data-key="t-logout">Logout</span>
            </Link>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default ProfileDropdown;
