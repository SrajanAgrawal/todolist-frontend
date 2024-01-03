import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


const baseUrl = 'https://todolist-backend-production-a752.up.railway.app';


const AddTask = () => {

    const navigate = useNavigate();
    const [task, setTask] = useState("");
    const [priority, setPriority] = useState("");
    const [error, setError] = useState(null);

    // Check if component is in edit mode
    const isEdit = useLocation().state?.isEdit || false;
    const taskToEdit = useLocation().state?.taskToEdit || {};
    // Use useMemo to memoize the taskToEdit value
    // const taskToEdit = useMemo(() => useLocation().state?.taskToEdit || {}, [useLocation().state]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setError(null);
        }, 3000);

        return () => clearTimeout(timeoutId); // Cleanup the timeout on component unmount
    }, [error]);

    useEffect(() => {
        // If in edit mode, set initial values from taskToEdit
        if (isEdit) {
            setTask(taskToEdit.message || "");
            setPriority(taskToEdit.priority || "");
        }
    }, [isEdit, taskToEdit]);

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!task || !priority) {
            setError("Please fill all the fields");
            return;
        }

        // Additional logic for editing existing task
        const editEndpoint = isEdit ? `/${taskToEdit.id}` : "/add";

        try {
            const data = {
                message: task,
                priority: priority
            }
            const response = await fetch(`${baseUrl}/api/task${editEndpoint}`, {
                method: isEdit ? 'PUT' : 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data1 = await response.json();
                console.log(data1);
                navigate("/dashboard");
            }
        } catch {
            console.log("error");
        }
    }
    return (
        <div style={styles.container}>
            <form style={styles.form}>
                {error && <div style={styles.error}>{error}</div>}
                <label style={styles.label} htmlFor="task">
                    Add a Task
                </label>
                <input
                    style={styles.input}
                    required
                    type="text"
                    name="task"
                    placeholder="Write Here....."
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    autoComplete="off" // Disable autocomplete
                />
                <label style={styles.label} htmlFor="priority">
                    Priority
                </label>
                <div style={styles.radioGroup}>
                    <label style={styles.label} required htmlFor="high">
                        High
                        <input
                            style={styles.input}
                            type="radio"
                            id="high"
                            name="priority"
                            value="high"
                            checked={priority === 'high'}
                            onChange={(e) => setPriority(e.target.value)}
                        />
                    </label>
                    <label style={styles.label} required htmlFor="medium">
                        Medium
                        <input
                            style={styles.input}
                            type="radio"
                            id="medium"
                            name="priority"
                            value="medium"
                            checked={priority === 'medium'}
                            onChange={(e) => setPriority(e.target.value)}
                        />
                    </label>
                    <label style={styles.label} required htmlFor="low">
                        Low
                        <input
                            style={styles.input}
                            type="radio"
                            id="low"
                            name="priority"
                            value="low"
                            checked={priority === 'low'}
                            onChange={(e) => setPriority(e.target.value)}
                        />
                    </label>
                </div>
                <button style={styles.button} type="submit" onClick={handleAddTask}>
                    {isEdit ? 'Update Task' : 'Add Task'}
                </button>

                <button style={styles.seeAllButton} onClick={() => navigate('/dashboard')}>
                    See All Tasks
                </button>
            </form>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
    },

    form: {
        backgroundColor: '#fff', // Set background color to white
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '70%', // Set a width for the form
        padding: '20px', // Add padding for spacing
        border: '1px solid #ccc', // Add a border for visual separation
        borderRadius: '5px', // Add border-radius for rounded corners
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', // Add box shadow for a subtle elevation effect
    },

    label: {
        marginBottom: '8px', // Add margin-bottom for spacing between labels and inputs
        textAlign: 'left', // Align labels to the left
    },

    input: {
        margin: '8px 0', // Add margin for spacing between inputs
        padding: '8px', // Add padding for input content
        border: '1px solid #ccc', // Add a border for input styling
        borderRadius: '3px', // Add border-radius for rounded corners
        fontSize: '16px', // Specify a font size
        outline: 'none', // Remove outline
        transition: 'border 0.3s ease', // Add transition for smooth border animation
        width: '100%', // Set width to 100% for responsiveness
    },

    radioGroup: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%', // Set width to 100% for responsiveness
        marginBottom: '16px', // Add margin-bottom for spacing
    },

    button: {
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "5px",
        padding: "10px",
        margin: "10px 0", // Add margin-top and margin-bottom for spacing
        width: "30%", // Set width to 100% for responsiveness
        cursor: "pointer",
    },

    seeAllButton: {
        backgroundColor: "#ccc",
        color: "#666",
        border: "none",
        borderRadius: "5px",
        padding: "10px",
        margin: "10px 0", // Add margin-top and margin-bottom for spacing
        width: "30%", // Set width to 100% for responsiveness
        cursor: "pointer",
    },

    error: {
        color: "red",
        marginBottom: "10px",
    },
};


export default AddTask;