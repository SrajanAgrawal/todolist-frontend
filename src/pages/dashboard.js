import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'
// React Icons 
// import { FaDeleteLeft } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";


const baseUrl = 'https://todolist-backend-production-a752.up.railway.app';


const Dashboard = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");

    const [tasks, setTasks] = useState([]);

    const [check, setCheck] = useState(false);  // for checkbox
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {

            navigate('/login');
        } else {
            const decodedToken = jwtDecode(token);
            console.log(decodedToken);

            setName(decodedToken.sub);
            navigate("/dashboard", { state: { name: decodedToken.sub } });
            getAllTask();
        }
    }, [navigate]);

    const getAllTask = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/task/tasks`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setTasks(data);
            }
        } catch (error) {
            console.log("error");
        }
    };

    const handleEdit = async (taskId) => {
        const taskToEdit = tasks.find(task => task.id === taskId);

        // Navigate to AddTask with task details
        navigate("/addTask", { state: { isEdit: true, taskToEdit } });
    };

    const handleDelete = async (taskId) => {
        try {
            const response = await fetch(`${baseUrl}/api/task/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
            }


        } catch {
            console.log("error");
        }
        // Implement delete functionality here
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        navigate("/dashboard");
    };


    const handleCheckboxClick = async (taskId) => {
        // e.preventDefault();
        try {

            const response = await fetch(`${baseUrl}/api/task/comp/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setCheck(!check);
                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task.id === taskId ? { ...task, completed: !task.completed } : task
                    )
                );
            }

        } catch {
            console.log("error");
        }
        navigate("/dashboard");
    }

    const renderTasksByPriority = (priority, color) => {
        return tasks
            .filter((task) => task.priority === priority)
            .map((task) => (
                <li key={task.id} style={{ ...StyleSheet.list, color }}>
                    {/* {console.log(task.completed)} */}
                    <div style={StyleSheet.flex}>

                        <input type="checkbox" style={StyleSheet.check} id={`task${task.id}`} checked={task.completed} onClick={() => handleCheckboxClick(task.id)} />
                        <label htmlFor={`task${task.id}`}>{task.message.slice(0, 30)}</label>
                    </div>
                    <div style={StyleSheet.flex}>
                        <FaRegEdit style={StyleSheet.edit} onClick={() => handleEdit(task.id)} />
                        {/* <button onClick={() => handleEdit(task.id)}>Edit</button> */}
                        <MdDelete style={StyleSheet.delete} onClick={() => handleDelete(task.id)} />
                    </div>
                    {/* <button onClick={() => handleDelete(task.id)}>Delete</button> */}
                </li>
            ));
    };

    return (
        <>
            <div style={StyleSheet.main}>
                <div style={StyleSheet.welcome}>
                    <div >
                        <h1>Welcome, {name}!</h1>
                    </div>
                    <div >

                        <button
                            style={StyleSheet.btn}
                            type="submit"
                            onClick={() => navigate("/addTask")}
                        >
                            Add Task
                        </button>
                    </div>
                </div>
            </div>

            <div style={StyleSheet.items}>
                <div style={StyleSheet.priorityContainer}>
                    <h2 style={StyleSheet.priorityHeading}>High Priority</h2>
                    <ul>{renderTasksByPriority('high', 'red')}</ul>
                </div>

                <div style={StyleSheet.priorityContainer}>
                    <h2 style={StyleSheet.priorityHeading}>Medium Priority</h2>
                    <ul>{renderTasksByPriority('medium', 'blue')}</ul>
                </div>

                <div style={StyleSheet.priorityContainer}>
                    <h2 style={StyleSheet.priorityHeading}>Low Priority</h2>
                    <ul>{renderTasksByPriority('low', 'green')}</ul>
                </div>
            </div>
        </>
    );
};

const StyleSheet = {
    flex: {
        display: "flex",
        alignItems: "center",
    },
    list: {
        listStyleType: 'none',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid black',
        borderRadius: '15px',
        padding: '15px 5px',
        marginTop: '15px',
        width: '400px',
    },
    items: {
        display: 'flex',
        flexDirection: 'row',
        // justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: "50px"
    },
    main: {
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', // Add box shadow for a subtle elevation effect
    },
    welcome: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        borderBottom: '1px solid black',
        width: "90%",
        margin: "auto"

    },
    inp: {
        border: '1px solid black',
        borderRadius: '5px',
        padding: '5px',
        margin: '5px',
        width: '200px',
    },
    btn: {
        border: '1px solid black',
        borderRadius: '15px',
        padding: '5px',
        margin: '5px',
        width: '200px',
        backgroundColor: 'black',
        color: 'white',
        fontWeight: 'bold',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', // Add box shadow for a subtle elevation effect

    },
    priorityContainer: {
        width: "100%",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontWeight: 'bold',
        fontSize: '17px',
    },
    priorityHeading: {
        color: 'black',
    },
    check: {
        width: "20px",
        height: "20px",
        marginRight: '10px',
        cursor: 'pointer',
    },
    edit: {
        // padding: "2px",
        width: "20px",
        height: "20px",
        marginRight: '10px',
        color: 'blue',
        cursor: 'pointer',
    },
    delete: {
        width: "20px",
        height: "20px",
        color: 'red',
        cursor: 'pointer',
    },
};

export default Dashboard;
