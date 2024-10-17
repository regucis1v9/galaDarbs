import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { NavLink } from '@mantine/core';
import { IconDeviceTv, IconFolder, IconUpload, IconUser,IconPlayerTrackNext, IconEye, IconPlus } from '@tabler/icons-react';
import React, { useState, useEffect } from 'react';

export default function Layout({ children }) {
  const [opened, { toggle }] = useDisclosure();

  const [activeComponent, setActiveComponent] = useState(
    () => parseInt(localStorage.getItem('activeComponent')) || 1
  );
  

  const updateSidebarSection = (id) => {
    setActiveComponent(id);
    localStorage.setItem('activeComponent', id); 
  };

  return (
    <AppShell
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      
    >
      <AppShell.Navbar p="md">
        <NavLink
          href="/dashboard/upload"
          label="Augšupielādēt failus"
          leftSection={<IconUpload size="1rem" stroke={1.5} />}
          childrenOffset={28}
          onClick={() => updateSidebarSection(1)}
          active={activeComponent === 1}  // Reading active component from local state
          color="blue"
          variant="light"
        />
        <NavLink
          label="Ekrāni"
          leftSection={<IconDeviceTv size="1rem" stroke={1.5} />}
          childrenOffset={28}
          onClick={() => updateSidebarSection(2)}
          active={activeComponent === 2}
          color="blue"
          variant="light"
          href="/dashboard/selectScreen"
        >
        </NavLink>
        <NavLink
           href="/dashboard/view"
          label="Mapes"
          leftSection={<IconFolder size="1rem" stroke={1.5} />}
          childrenOffset={28}
          onClick={() => updateSidebarSection(3)}
          active={activeComponent === 3}
          color="blue"
          variant="light"
        >
        </NavLink>
        <NavLink
          href="#required-for-focus"
          label="Lietotāji"
          leftSection={<IconUser size="1rem" stroke={1.5} />}
          childrenOffset={28}
          onClick={() => updateSidebarSection(4)}
          active={activeComponent === 4}
          color="blue"
          variant="light"
        >
          <NavLink href="/dashboard/createUser" label="Izveidot lietotāju" leftSection={<IconPlus size="1rem" stroke={1.5} />} />
          <NavLink label="Skatīt lietotājus" href="/dashboard/viewAllUsers" leftSection={<IconEye size="1rem" stroke={1.5} />}/>
          
        </NavLink>
        <NavLink
          href="#required-for-focus"
          label="Slaidrādes"
          leftSection={<IconPlayerTrackNext size="1rem" stroke={1.5} />}
          childrenOffset={28}
          onClick={() => updateSidebarSection(5)}
          active={activeComponent === 5}
          color="blue"
          variant="light"
        >
          <NavLink href="/dashboard/createSlideshow" label="Izveidot slaidrādi" leftSection={<IconPlus size="1rem" stroke={1.5} />} />
          <NavLink label="Skatīt Slaidrādes" href="/dashboard/viewAllUsers" leftSection={<IconEye size="1rem" stroke={1.5} />} />
          
        </NavLink>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
