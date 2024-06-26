import './App.css';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import Header from './components/Header';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminConfig from './components/AdminConfig';
import Configuration from './components/Configuration';
import TradeFeed from './components/TradeFeed';
// import AccountOpeningForm from './components/AccountOpeningForm';
import Portal from './components/Portal.js';
import MenuContext from './components/Context';
import { useState, useEffect } from 'react';
import Poa from './components/Poa';
import AddingUser from './components/AddingUser';
import UserList from './components/UserList';
import PoaConfiguration from './components/PoaConfiguration';
import UnauthorizedPage from './components/UnauthorizedPage';
import RoleGuard from './components/RoleGuard';
import Tab_table from './components/Tab_table';
import PoA_Tab_table from './components/PoA_Tab_table.js';


function App() {
  const [roles, setRoles] = useState(() => {
    const storedRoles = localStorage.getItem('roles');
    return storedRoles ? JSON.parse(storedRoles) : [];
  });
  // const isUserLoggedIn = roles.length > 0;

  useEffect(() => {
    localStorage.setItem('roles', JSON.stringify(roles));
  }, [roles]);
  return (
    <div className="App">
      <Router>
        <MenuContext.Provider value={{ roles, setRoles }}>
          {/* <Header /> */}
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Login />} />

            {/* Protected routes with RoleGuard */}
            <Route
              path="/dashboard"
              element={<RoleGuard allowedRoles={['admin', 'pms']}><Dashboard /></RoleGuard>}
            />
            <Route
              path="/admin"
              element={<RoleGuard allowedRoles={['admin', 'pms']}><AdminConfig /></RoleGuard>}
            />
            <Route
              path="/configuration"
              element={<RoleGuard allowedRoles={['admin', 'nominee']}><Configuration /></RoleGuard>}
            />
            <Route
              path="/tradeFeed"
              element={<RoleGuard allowedRoles={['admin', 'nominee']}><Tab_table /></RoleGuard>}
            />
            <Route
              path="/addinguser"
              element={<RoleGuard allowedRoles={['admin']}><AddingUser /></RoleGuard>}
            />
            {/* <Route
              path="/poa"
              element={<RoleGuard allowedRoles={['admin', 'poa']}><PoA_Tab_table /></RoleGuard>}
            /> */}

            <Route path="/poa" element={<PoA_Tab_table />} />

            {/* <Route
              path="/poa"
              element={<RoleGuard allowedRoles={['admin', 'poa']}><Poa /></RoleGuard>}
            /> */}
            <Route
              path="/portal"
              element={<RoleGuard allowedRoles={['admin', 'pms', 'nominee', 'poa']}><Portal /></RoleGuard>}
            />
            <Route
              path="/userlist"
              element={<RoleGuard allowedRoles={['admin']}><UserList /></RoleGuard>}
            />
            <Route
              path="/poaconfiguration"
              element={<RoleGuard allowedRoles={['admin', 'poa']}><PoaConfiguration /></RoleGuard>}
            />

            {/* Unauthorized page */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
          </Routes>
          <Footer />
        </MenuContext.Provider>
      </Router>
    </div>
  );
}

export default App;
