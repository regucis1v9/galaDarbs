import { useEffect, useState } from 'react';
import { Indicator, Box, Container, Grid, SimpleGrid, Skeleton, rem, Modal, Text } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import '@mantine/dates/styles.css';
import '@mantine/core/styles.css';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { useDisclosure } from '@mantine/hooks';
import SingleDaySlidesModal from "./SingleDaySlidesModal";
import SystemData from "./SystemData";
import classes from "../../style/ViewSlides.module.css";
import { IconUpload, IconUsers } from '@tabler/icons-react';
import { Link } from 'react-router-dom';


dayjs.extend(isBetween);
dayjs.locale('lv');
const PRIMARY_COL_HEIGHT = rem(300);

export default function ViewAllSlideshows() {
  const [slideshows, setSlideshows] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeSlides, setActiveSlides] = useState([]);
  const [folderCount, setFolderCount] = useState(0); // State for folder count
  const [screenCount, setScreenCount] = useState(0); // State for screen count
  const [todaysSlidesCount, setTodaysSlidesCount] = useState(0); // State for today's slides count
  const [userCount, setUserCount] = useState(0); // State for user count
  const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-md) / 2)`;

  useEffect(() => {
    async function fetchSlideshows() {
      try {
        const response = await fetch('http://localhost/api/getAllSlides');
        const data = await response.json();
        setSlideshows(data);

        // Count today's slides right after setting the slideshows
        countTodaysSlides(data); 

        // Fetch the screens, folders, and users
        fetchScreens();
        fetchFolders();
        fetchUsers(); // Call to fetch users

      } catch (error) {
        console.error('Error fetching slideshows:', error);
      }
    }

    // Function to fetch screens and count them
    async function fetchScreens() {
      const token = localStorage.getItem('token'); // Get the bearer token from local storage
      try {
        const response = await fetch('http://localhost/api/getAllScreens', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const screensData = await response.json();
        setScreenCount(screensData.length); // Set the screen count based on the length of the response
      } catch (error) {
        console.error('Error fetching screens:', error);
        setScreenCount(0); // Set to 0 on error
      }
    }

    // Function to fetch folders and count them
    async function fetchFolders() {
      const token = localStorage.getItem('token'); // Get the bearer token from local storage
      try {
        const response = await fetch('http://localhost/api/listFolders', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const folderData = await response.json();
        setFolderCount(folderData.folders.length); // Set the folder count based on the length of the folders array
      } catch (error) {
        console.error('Error fetching folders:', error);
        setFolderCount(0); // Set to 0 on error
      }
    }

    // Function to fetch users and count them
    async function fetchUsers() {
      const token = localStorage.getItem('token'); // Get the bearer token from local storage
      try {
        const response = await fetch('http://localhost/api/getAllUsers', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const userData = await response.json();
        if (userData.status === 200) { // Check if the response status is OK
          setUserCount(userData.users.length); // Set the user count based on the length of the users array
        } else {
          console.error('Error fetching users:', userData.message); // Log any error messages from the API
          setUserCount(0); // Set to 0 if there's an issue
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setUserCount(0); // Set to 0 on error
      }
    }

    // Function to count today's slides
    const countTodaysSlides = (slides) => {
      const today = dayjs().startOf('day'); // Get today's date
      const count = slides.filter(slide => {
        const startDate = dayjs(slide.startDate);
        const endDate = dayjs(slide.endDate);
        return today.isBetween(startDate, endDate, null, '[]'); // Include start and end dates
      }).length;
      setTodaysSlidesCount(count); // Update today's slides count
    };

    fetchSlideshows();
  }, []);

  const getActiveSlideshowsForDay = (date) => {
    return slideshows.filter((slideshow) => {
      const startDate = dayjs(slideshow.startDate);
      const endDate = dayjs(slideshow.endDate);
      return dayjs(date).isBetween(startDate, endDate, 'day', '[]');
    });
  };

  const handleDayClick = (date) => {
    const activeSlides = getActiveSlideshowsForDay(date);
    if (activeSlides.length > 0) {
      setSelectedDate(date);
      setActiveSlides(activeSlides); // Set the active slides data
      open();
    } else {
      console.log('No slideshows for this day:', date);
    }
  };

  return (
    <div className="slideshow-main">
      <Container my="md" w={900}>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <Box className="centerCalendar">
            <Text>Slaidrāžu grafiks</Text>
            <Calendar
              static
              renderDay={(date) => {
                const day = date.getDate();
                const activeSlides = getActiveSlideshowsForDay(date); // Get active slideshows for this date
                const hasSlideshow = activeSlides.length > 0;

                return (
                  <div onClick={() => handleDayClick(date)} style={{ cursor: hasSlideshow ? 'pointer' : 'default' }}>
                    <Indicator size={6} color="red" offset={-2} disabled={!hasSlideshow}>
                      <div>{day}</div>
                    </Indicator>
                  </div>
                );
              }}
            />
          </Box>
          <Grid gutter="md">
            <Grid.Col>
              <SystemData
                folderCount={folderCount}  // Display folder count
                screenCount={screenCount} // Display screen count
                slideCount={todaysSlidesCount} // Display today's slide count
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Link to="/dashboard/viewAllUsers">
              <Box className='small-grid-box'>
                <IconUsers color='white' size={30}/>
                <Text color='white' ta='center' classNames={{root: classes.seperator}}>Lietotāju skaits:</Text>
                <Text color='white' ta='center'>{userCount}</Text>
              </Box>
              </Link>
            </Grid.Col>
            <Grid.Col span={6}>
              <Link to="/dashboard/upload">
                <Box className='small-grid-box2'>
                  <IconUpload color='black' size={30}/>
                  <Text color='black' ta='center'>Augšupielādēt failus</Text>
                </Box>
              </Link>
            </Grid.Col>
          </Grid>
        </SimpleGrid>
      </Container>
      <Modal
        centered
        opened={opened}
        onClose={close}
        title={`Slideshows for ${dayjs(selectedDate).format('MMMM D, YYYY')}`}
      >
        <SingleDaySlidesModal slides={activeSlides} />
      </Modal>
    </div>
  );
}
