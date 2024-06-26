import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import MenuContext from './Context';

function RoleGuard({ allowedRoles, children }) {
  const roles = useContext(MenuContext);
  const rolesArray = roles.roles.map((item) => item.toLowerCase());
  console.log('Allowed Roles:', allowedRoles);
  console.log('User Roles:', roles);
  if (allowedRoles.some(role => rolesArray.includes(role))) {
    return children;
  } else {
    return <Navigate to="/unauthorized" />;
  }
}

export default RoleGuard;
