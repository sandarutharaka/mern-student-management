import { useEffect, useState } from "react";
import { CiEdit, CiSquarePlus } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import axios from "axios";

function App() {
  const [students, setStudents] = useState([]);
  const [studentLoaded, setStudentsLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({ name: "", date: "", reg: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!studentLoaded) {
      axios.get("https://mern-student-management-backend-ap32.onrender.com/students").then((res) => {
        setStudents(res.data);
        setStudentsLoaded(true);
      });
    }
  }, [studentLoaded]);

  const validateForm = () => {
    if (!currentStudent.name || !currentStudent.date || !currentStudent.reg) {
      setError("All fields are required");
      return false;
    }
    return true;
  };

  const handleAddOrUpdateStudent = () => {
    if (!validateForm()) return;
    
    if (isEditing) {
      axios.put(`https://mern-student-management-backend-ap32.onrender.com/students/${currentStudent.reg}`, currentStudent)
        .then(() => {
          alert("Student Updated Successfully");
          setStudentsLoaded(false);
        })
        .catch((err) => alert(err));
    } else {
      const isDuplicate = students.some(std => std.reg === currentStudent.reg);
      if (isDuplicate) {
        setError("Registration number already exists");
        return;
      }
      
      axios.post("https://mern-student-management-backend-ap32.onrender.com/students", currentStudent)
        .then(() => {
          alert("Student Added Successfully");
          setStudentsLoaded(false);
        })
        .catch((err) => alert(err));
    }
    
    setCurrentStudent({ name: "", date: "", reg: "" });
    setIsModalOpen(false);
    setIsEditing(false);
    setError("");
  };

  const handleEditStudent = (student) => {
    setCurrentStudent(student);
    setIsEditing(true);
    setIsModalOpen(true);
    setError("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <button 
        className="fixed bottom-6 right-6 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700"
        onClick={() => { setIsModalOpen(true); setIsEditing(false); setCurrentStudent({ name: "", date: "", reg: "" }); setError(""); }}
      >
        <CiSquarePlus size={24} />
      </button>
      
      <h1 className="text-2xl font-bold mb-6">Student List</h1>
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gray-200 text-gray-700 font-semibold p-3 grid grid-cols-4 text-center">
          <div>Reg No</div>
          <div>Name</div>
          <div>Date</div>
          <div>Actions</div>
        </div>
        {students.map((std, index) => (
          <div
            key={index}
            className="grid grid-cols-4 items-center text-center p-3 border-b border-gray-300 hover:bg-gray-100"
          >
            <div>{std.reg}</div>
            <div>{std.name}</div>
            <div>{std.date}</div>
            <div className="flex justify-center space-x-2">
              <button className="p-2 text-blue-600 hover:text-blue-800" onClick={() => handleEditStudent(std)}>
                <CiEdit size={20} />
              </button>
              <button className="p-2 text-red-600 hover:text-red-800" onClick={() => {
                if (!confirm("Delete?")) return;
                axios.delete(`https://mern-student-management-backend-ap32.onrender.com/students/${std.reg}`).then(() => setStudentsLoaded(false));
              }}>
                <MdDelete size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"> 
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Student" : "Add Student"}</h2>
            {error && <p className="text-red-500 mb-3" aria-live="polite">{error}</p>}
            <input 
              type="text" 
              placeholder="Reg No" 
              className="w-full p-2 mb-3 border border-gray-300 rounded" 
              value={currentStudent.reg} 
              onChange={(e) => setCurrentStudent({ ...currentStudent, reg: e.target.value })}
              disabled={isEditing}
            />
            <input 
              type="text" 
              placeholder="Name" 
              className="w-full p-2 mb-3 border border-gray-300 rounded" 
              value={currentStudent.name} 
              onChange={(e) => setCurrentStudent({ ...currentStudent, name: e.target.value })}
            />
            <input 
              type="date" 
              className="w-full p-2 mb-3 border border-gray-300 rounded" 
              value={currentStudent.date} 
              onChange={(e) => setCurrentStudent({ ...currentStudent, date: e.target.value })}
            />
            <div className="flex justify-end space-x-2">
              <button 
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                onClick={() => { setIsModalOpen(false); setError(""); }}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleAddOrUpdateStudent}
              >
                {isEditing ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;