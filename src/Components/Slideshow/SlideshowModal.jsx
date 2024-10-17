import { Stack, MultiSelect, Checkbox, Group, Button } from "@mantine/core";
import { useEffect, useState } from "react";
import { DateTimePicker } from "@mantine/dates";
import { useDispatch, useSelector } from "react-redux";
import { updateStartDate } from "../../actions/startDateAction";
import { updateEndDate } from "../../actions/endDateAction";
import { updateSlideshowScreens } from "../../actions/slideshowScreenActions";
import '@mantine/dates/styles.css';
import dateStyle from "../../style/DateModal.module.css";

export default function SlideshowModal() {
    const [screens, setScreens] = useState([]); // Holds screen options for MultiSelect
    const [selectedScreens, setSelectedScreens] = useState([]); // Selected screens state
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [startDateError, setStartDateError] = useState(null); // State for error message
    const token = localStorage.getItem('token');
    const dispatch = useDispatch();
    
    // Retrieve values from Redux state
    const reduxSelectedScreens = useSelector((state) => state.screens.screens || []); // Default to empty array
    const reduxStartDate = useSelector((state) => state.startDate.startDate || null); // Default to null
    const reduxEndDate = useSelector((state) => state.endDate.endDate || null); // Default to null
    const slideData = useSelector((state) => state.imageLinks)

    // Fetch screens data when the component mounts
    useEffect(() => {
        fetchScreens();
    }, []);

    // Set the selected screens from Redux state when component mounts
    useEffect(() => {
        if (reduxSelectedScreens.length > 0) { // Only set if redux state has data
            setSelectedScreens(reduxSelectedScreens); // Set selected screens from Redux
        }
    }, [reduxSelectedScreens]); // Run this effect whenever reduxSelectedScreens changes

    // Set initial dates from Redux state when component mounts
    useEffect(() => {
        if (reduxStartDate) {
            setStartDate(new Date(reduxStartDate)); // Set start date from Redux
        }
        if (reduxEndDate) {
            setEndDate(new Date(reduxEndDate)); // Set end date from Redux
        }
    }, [reduxStartDate, reduxEndDate]); // Run this effect when reduxStartDate or reduxEndDate changes

    // Dispatch selected screens to Redux whenever they change
    useEffect(() => {
        dispatch(updateSlideshowScreens(selectedScreens));
    }, [selectedScreens, dispatch]);

    // Dispatch start date to Redux whenever it changes
    useEffect(() => {
        dispatch(updateStartDate(startDate));
        // Validate the date inputs
        if (startDate && endDate && endDate <= startDate) {
            setStartDateError("Sākuma datumam jābūt pirms beigu datumam");
        } else {
            setStartDateError(null);
        }
    }, [startDate, endDate, dispatch]);

    // Dispatch end date to Redux whenever it changes
    useEffect(() => {
        dispatch(updateEndDate(endDate));
    }, [endDate, dispatch]);

    // Fetch screen data from the API
    const fetchScreens = async () => {
        try {
            const response = await fetch('http://localhost/api/getAllScreens', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            const transformedData = data
                .map(screen => ({
                    value: String(screen.id), // Convert id to string
                    label: screen.table_name // table_name as label
                }))
                .sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically by label

            setScreens(transformedData); // Set the fetched screens in local state
        } catch (error) {
            console.error('Error fetching screens:', error);
        }
    };

    // Handle changes in the MultiSelect
    const handleMultiSelectChange = (values) => {
        setSelectedScreens(values);
    };

    // Handle the "Select All" checkbox
    const handleSelectAllChange = (event) => {
        if (event.currentTarget.checked) {
            setSelectedScreens(screens.map(screen => screen.value)); // Select all
        } else {
            setSelectedScreens([]); // Deselect all
        }
    };

    // Function to append reduxStartDate, reduxEndDate, and reduxSelectedScreens to each imageLink
    const prepareDataForPost = () => {
        const combinedData = slideData.map(imageLink => ({
            ...imageLink,
            startDate: reduxStartDate,
            endDate: reduxEndDate,
            selectedScreens: reduxSelectedScreens
        }));

        console.log("Combined Data for POST:", combinedData);
        return combinedData;
    };

    // Determine if the button should be disabled
    const isButtonDisabled = !startDate || !endDate || selectedScreens.length === 0 || !!startDateError;

    return (
        <Stack align="stretch" gap="md">
            <MultiSelect
                maxDropdownHeight={150}
                required
                label="Izvēlies ekrānus"
                placeholder="Izvēlies ekrānu"
                data={screens} // Use local screens state here
                searchable
                clearable
                nothingFoundMessage="Tāda ekrāna nav"
                value={selectedScreens}
                onChange={handleMultiSelectChange}
                variant="filled"
            />
            <Checkbox
                label="Izvēlēties visus ekrānus"
                variant="outline"
                checked={selectedScreens.length === screens.length} // Check if all are selected
                onChange={handleSelectAllChange} // Use the new handler
            />
            <Group justify="space-between">
                <DateTimePicker
                    clearable
                    required
                    classNames={{ root: dateStyle.dateWidth, label: dateStyle.textLeft }}
                    minDate={new Date()}
                    value={startDate}
                    onChange={setStartDate}
                    label="Sākuma datums"
                    placeholder="Izvēlies sākuma datumu"
                    variant="filled"
                    error={startDateError} // Show error message
                />

                <DateTimePicker
                    clearable
                    required
                    classNames={{ root: dateStyle.dateWidth, label: dateStyle.textRight }}
                    minDate={startDate} // Ensure end date cannot be before start date
                    value={endDate}
                    onChange={setEndDate}
                    label="Beigu datums"
                    placeholder="Izvēlies beigu datumu"
                    variant="filled"
                    disabled={!startDate}
                />
            </Group>
            <Button disabled={isButtonDisabled} onClick={() => prepareDataForPost()}>
                Izveidot slaidrādi
            </Button>
        </Stack>
    );
}
