import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";
import { Skeleton, Modal, Button, TextInput, PasswordInput, Text, Select, Input } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { IconSearch, IconEdit, IconTrashFilled } from '@tabler/icons-react';
import classes from "../../style/SearchInput.module.css";

export default function ViewUsers() {
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [userToDelete, setUserToDelete] = useState(null); 
    const [userToEdit, setUserToEdit] = useState(null); 
    const token = localStorage.getItem('token');
    const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
    const [editModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);
    const [isFormValid, setIsFormValid] = useState(false);

    const form = useForm({
        initialValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: '',
        },
        validate: {
            username: (value) => (value.length < 2 ? 'Vārds jābūt vismaz 2 simboliem' : null),
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Nederīgs epasts'),
            password: (value) => (value.length > 0 && value.length < 6 ? 'Parolei jābūt vismaz 6 simboliem' : null),
            confirmPassword: (value, values) =>
                value !== values.password ? 'Paroles nesakrīt' : null,
        },
        validateInputOnChange: true,
    });

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const fetchAllUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost/api/getAllUsers', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${token}` },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Tīkla vai iekšēja servera kļūda');
            }

            const data = await response.json();
            setAllUsers(data.users || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            setAllUsers([]); 
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!userToDelete) return;

        const newUsersList = allUsers.filter(user => user.id !== userToDelete.id);
        setAllUsers(newUsersList);

        try {
            const response = await fetch('http://localhost/api/deleteUser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ id: userToDelete.id }),
            });

            if (!response.ok) {
                throw new Error('Tīkla vai iekšēja servera kļūda');
            }

            const data = await response.json();
            setAllUsers(data.users || []);
            setUserToDelete(null);
            closeDeleteModal();
        } catch (error) {
            console.error('Error deleting user:', error);
            setAllUsers(prevUsers => [...prevUsers, userToDelete]);
        }
    };

    const handleEdit = async (values) => {
        if (!userToEdit) return;
    
        try {
            const response = await fetch('http://localhost/api/editUser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ 
                    id: userToEdit.id,
                    name: values.username,
                    email: values.email,
                    role: values.role,
                    password: values.password || null,
                }),
            });
    
            if (!response.ok) {
                throw new Error('Tīkla vai iekšēja servera kļūda');
            }
    
            const data = await response.json();
            setAllUsers(data.users || []); 
            setUserToEdit(null);
            handleCloseEditModal();
        } catch (error) {
            console.error('Error editing user:', error);
        }
    };

    const filteredUsers = allUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteButtonClick = (user) => {
        setUserToDelete(user);
        openDeleteModal();
    };

    const handleEditButtonClick = (user) => {
        setUserToEdit(user);
        form.setValues({ 
            username: user.name, 
            email: user.email, 
            password: '', 
            confirmPassword: '',
            role: user.role, 
        });
        form.validate();
        openEditModal();
    };

    const resetFormState = () => {
        form.reset(); 
        setIsFormValid(false); 
    };

    const handleCloseEditModal = () => {
        resetFormState(); 
        closeEditModal();
        setUserToEdit(null); 
    };

    useEffect(() => {
        const isValid = Object.values(form.errors).every(error => !error) && Object.values(form.values).every(value => value !== '');
        setIsFormValid(isValid);
    }, [form.values, form.errors]);

    return (
        <div className="view-user-content">
            <div className="search-bar">
                <Input classNames={{wrapper: classes.maxWidth}} leftSection={<IconSearch size={18}/>} size='md'></Input>
                <Button  size='md' >Pievienot lietotāju</Button>
            </div>

            {loading ? (
                <div className="user-links">
                    {[...Array(10)].map((_, index) => (
                        <Skeleton key={index} radius="md" height="65px" width="49%" />
                    ))}
                </div>
            ) : filteredUsers.length > 0 ? (
                <div className="user-links">
                    {filteredUsers.map((user) => (
                        <div key={user.id} className="single-user">
                            <span className="user-username">{user.name}</span>
                            <span className="role-wrapper">
                                <span className="role-prefix">Pieejas līmenis</span>
                                <span className="role-title">{user.role}</span>
                            </span>
                            <div className="quick-user-actions">
                                <button className="edit-user" onClick={() => handleEditButtonClick(user)}>
                                    <IconEdit></IconEdit>
                                </button>
                                <button className="delete-user" onClick={() => handleDeleteButtonClick(user)}>
                                    <IconTrashFilled></IconTrashFilled>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <Text>No results found.</Text>
            )}

            <Modal 
                opened={deleteModalOpened} 
                onClose={closeDeleteModal} 
                title="Apstiprināt dzēšanu" 
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
                centered>
                <Text>Vai tiešām vēlaties dzēst lietotāju <strong>{userToDelete?.name}</strong> ?</Text>
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                    <Button onClick={handleDelete} color="red">Apstiprināt</Button>
                    <Button variant="outline" onClick={closeDeleteModal} color="dark">Atcelt</Button>
                </div>
            </Modal>

            <Modal 
            opened={editModalOpened} 
            onClose={handleCloseEditModal} 
            title="Rediģēt lietotāju"
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }} 
            centered>
                <form onSubmit={form.onSubmit(handleEdit)}>
                    <TextInput
                        label="Vārds"
                        placeholder="Ievadiet lietotāja vārdu"
                        {...form.getInputProps('username')}
                    />
                    <TextInput
                        label="Epasts"
                        placeholder="Ievadiet lietotāja e-pastu"
                        {...form.getInputProps('email')}
                    />
                    <PasswordInput
                        label="Parole"
                        placeholder="Ievadiet jauno paroli"
                        {...form.getInputProps('password')}
                    />
                    <PasswordInput
                        label="Apstiprināt paroli"
                        placeholder="Apstipriniet paroli"
                        {...form.getInputProps('confirmPassword')}
                    />
                    <Select
                        label="Pieejas līmenis"
                        placeholder="Izvēlēties lomu"
                        {...form.getInputProps('role')}
                        data={[
                            { value: 'Administrators', label: 'Administrators' },
                            { value: 'Lietotājs', label: 'Lietotājs' },
                            { value: 'Skatītājs', label: 'Skatītājs' },
                        ]}
                    />
                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                        <Button type="submit" disabled={!isFormValid}>Saglabāt izmaiņas</Button>
                        <Button variant="outline" onClick={handleCloseEditModal}>Atcelt</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
