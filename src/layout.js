import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { NavLink } from '@mantine/core';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { IconDeviceTv, IconFolder, IconUpload, IconUser, IconPlayerTrackNext, IconEye, IconPlus, IconHome } from '@tabler/icons-react';
import React, { useState, useEffect } from 'react';
import ThemeToggle from "./Components/Mantine/ThemeToggle"
import { useNavigate } from 'react-router-dom';

export default function Layout({ children }) {
  const [opened, { toggle }] = useDisclosure();
  const [activeComponent, setActiveComponent] = useState(() => parseInt(localStorage.getItem('activeComponent')) || 1);
  const [userData, setUserData] = useState(null); // State to hold user data
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()
  const updateSidebarSection = (id) => {
    setActiveComponent(id);
    localStorage.setItem('activeComponent', id);
  };

  // Function to fetch user data from the API
  const fetchUserData = async () => {
    const token = localStorage.getItem('token'); 

    if (!token) {
      console.log("No token found");
      return;
    }

    try {
      const response = await fetch('http://localhost/api/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Add Bearer token to headers
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 500) {
          // If the status is 500, navigate back to '/'
          navigate('/');
          return;
        }
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUserData(data); // Set fetched user data in state
      console.log("User data:", data);
      setIsAuthenticated(true)
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData(); // Fetch user data when component mounts
  }, []);

  return (
    <AppShell navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}>
      <AppShell.Navbar p="md">
        <NavLink
          component={Link} // Use component prop to replace NavLink with Link
          to="/dashboard/"
          label="Sākums"
          leftSection={<IconHome size="1rem" stroke={1.5} />}
          childrenOffset={28}
          onClick={() => updateSidebarSection(1)}
          active={activeComponent === 1}
          color="blue"
          variant="light"
        />
        <NavLink
          component={Link} // Wrap in Link component
          to="/dashboard/upload"
          label="Augšupielādēt failus"
          leftSection={<IconUpload size="1rem" stroke={1.5} />}
          childrenOffset={28}
          onClick={() => updateSidebarSection(2)}
          active={activeComponent === 2}
          color="blue"
          variant="light"
        />
        <NavLink
          component={Link} // Wrap in Link component
          to="/dashboard/createSlideshow"
          label="Slaidrādes"
          leftSection={<IconPlayerTrackNext size="1rem" stroke={1.5} />}
          childrenOffset={28}
          onClick={() => updateSidebarSection(6)}
          active={activeComponent === 6}
          color="blue"
          variant="light"
        />
        <NavLink
          component={Link} // Wrap in Link component
          to="/dashboard/selectScreen"
          label="Ekrāni"
          leftSection={<IconDeviceTv size="1rem" stroke={1.5} />}
          childrenOffset={28}
          onClick={() => updateSidebarSection(3)}
          active={activeComponent === 3}
          color="blue"
          variant="light"
        />
        <NavLink
          component={Link} // Wrap in Link component
          to="/dashboard/view"
          label="Mapes"
          leftSection={<IconFolder size="1rem" stroke={1.5} />}
          childrenOffset={28}
          onClick={() => updateSidebarSection(4)}
          active={activeComponent === 4}
          color="blue"
          variant="light"
        />
        <NavLink
          label="Lietotāji"
          leftSection={<IconUser size="1rem" stroke={1.5} />}
          childrenOffset={28}
          onClick={() => updateSidebarSection(5)}
          active={activeComponent === 5}
          color="blue"
          variant="light"
        >
          <NavLink
            component={Link} // Wrap in Link component
            to="/dashboard/createUser"
            label="Izveidot lietotāju"
            leftSection={<IconPlus size="1rem" stroke={1.5} />}
          />
          <NavLink
            component={Link} // Wrap in Link component
            to="/dashboard/viewAllUsers"
            label="Skatīt lietotājus"
            leftSection={<IconEye size="1rem" stroke={1.5} />}
          />
        </NavLink>
        <ThemeToggle />
      </AppShell.Navbar>
      <AppShell.Main>
        {isAuthenticated && children}
      </AppShell.Main>
    </AppShell>
  );
}
