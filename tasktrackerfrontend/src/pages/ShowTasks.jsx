import { useEffect, useState } from "react";
import { getAllTasks, deleteTask, updateTask } from "../api/taskService";
import "./ShowTasks.css";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function ShowTasks() {

  const [tasks,setTasks] = useState([]);
  const [page,setPage] = useState(0);
  const [totalPages,setTotalPages] = useState(0);

  const [openId,setOpenId] = useState(null);
  const [editId,setEditId] = useState(null);
  const [editTask,setEditTask] = useState({});

  useEffect(()=>{
    loadTasks(page);
  },[page]);

  const loadTasks = async(pageNo)=>{
    const res = await getAllTasks(pageNo,6);
    setTasks(res.content || []);
    setTotalPages(res.totalPages || 0);
  };

  const handleDelete = async(id)=>{
    await deleteTask(id);
    loadTasks(page);
  };

  const startEdit = (task)=>{
    setEditId(task.id);
    setEditTask({...task});
  };

  const saveEdit = async () => {
    try {
      const updatedData = {
        title: editTask.title || "",
        description: editTask.description || "",
        status: editTask.status || "TODO",
        priority: editTask.priority || "LOW",
        dueDate: editTask.dueDate ? editTask.dueDate : null
      };

      await updateTask(editId, updatedData);

      setEditId(null);
      loadTasks(page);

    } catch (error) {
      console.error("FULL ERROR ", error.response?.data || error);
      alert("Update failed!");
    }
  };

  const toggleCard = (id)=>{
    setOpenId(openId === id ? null : id);
    setEditId(null);
  };

  const isOverdue = (dueDate,status)=>{
    if(!dueDate) return false;

    const today = new Date();
    const due = new Date(dueDate);

    today.setHours(0,0,0,0);
    due.setHours(0,0,0,0);

    return due < today && status !== "DONE";
  };

  //PDF 
  const downloadPDF = () => {
    const doc = new jsPDF();

    const tableColumn = [
      "Title","Description","Status","Priority","Due Date","Created Date"
    ];

    const tableRows = [];

    tasks.forEach(task => {
      tableRows.push([
        task.title,
        task.description,
        task.status,
        task.priority,
        task.dueDate || "-",
        task.createdAt ? task.createdAt.split("T")[0] : "-"
      ]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 }
    });

    doc.save("tasks.pdf");
  };

  //EXCEL
  const downloadExcel = () => {
    const data = tasks.map(task => ({
      Title: task.title,
      Description: task.description,
      Status: task.status,
      Priority: task.priority,
      DueDate: task.dueDate,
      CreatedDate: task.createdAt
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const file = new Blob([excelBuffer]);
    saveAs(file, "tasks.xlsx");
  };

  //PRINT
  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    window.downloadPDF = downloadPDF;
    window.downloadExcel = downloadExcel;
    window.printTasks = handlePrint;

    return () => {
      delete window.downloadPDF;
      delete window.downloadExcel;
      delete window.printTasks;
    };
  }, [tasks]);

  return (

    <div className="page-container">

      <h2 className="page-heading">Show Tasks</h2>

      <div className="task-grid">

        {tasks.map((task)=>(

          <div
          key={task.id}
          className={`task-card ${isOverdue(task.dueDate,task.status) ? "overdue-card" : ""}`}
          onClick={()=>toggleCard(task.id)}
          >

            <h3 className="task-title">{task.title}</h3>

            {openId === task.id && (

              <div
              className="task-details"
              onClick={(e)=>e.stopPropagation()}
              >

                {editId === task.id ? (

                  <>
                  <input
                  value={editTask.title}
                  onChange={(e)=>setEditTask({...editTask,title:e.target.value})}
                  />

                  <textarea
                  value={editTask.description}
                  onChange={(e)=>setEditTask({...editTask,description:e.target.value})}
                  />

                  <input
                  type="date"
                  value={editTask.dueDate || ""}
                  onChange={(e)=>setEditTask({...editTask,dueDate:e.target.value})}
                  />

                  <select
                  value={editTask.status}
                  onChange={(e)=>setEditTask({...editTask,status:e.target.value})}
                  >
                    <option>TODO</option>
                    <option>IN_PROGRESS</option>
                    <option>DONE</option>
                  </select>

                  <select
                  value={editTask.priority}
                  onChange={(e)=>setEditTask({...editTask,priority:e.target.value})}
                  >
                    <option>HIGH</option>
                    <option>MEDIUM</option>
                    <option>LOW</option>
                  </select>

                  <div className="actions">
                    <button onClick={(e)=>{
                      e.stopPropagation();
                      saveEdit();
                    }}>Save</button>

                    <button className="danger" onClick={(e)=>{
                      e.stopPropagation();
                      setEditId(null);
                    }}>Cancel</button>
                  </div>

                  </>

                ) : (

                  <>
                  <p className="task-desc">{task.description}</p>

                  {task.createdAt && (
                    <span className="task-date">
                      Created: {task.createdAt.split("T")[0]}
                    </span>
                  )}

                  {task.dueDate && (
                    <span className="task-date">
                      Due: {task.dueDate}
                    </span>
                  )}

                  <span
                    className={`badge ${
                      task.status === "TODO"
                        ? "todo"
                        : task.status === "IN_PROGRESS"
                        ? "progress"
                        : "done"
                    }`}
                  >
                    {task.status} | {task.priority}
                  </span>

                  <div className="actions">
                    <button onClick={(e)=>{
                      e.stopPropagation();
                      startEdit(task);
                    }}>Edit</button>

                    <button className="danger" onClick={(e)=>{
                      e.stopPropagation();
                      handleDelete(task.id);
                    }}>Delete</button>
                  </div>
                  </>
                )}

              </div>
            )}

          </div>

        ))}

      </div>

      <div className="pagination">

        <button disabled={page === 0} onClick={()=>setPage(page-1)}>
          Previous
        </button>

        {[...Array(totalPages)].map((_,i)=>(

          <button
          key={i}
          className={page === i ? "active" : ""}
          onClick={()=>setPage(i)}
          >
            {i+1}
          </button>

        ))}

        <button
        disabled={page === totalPages-1}
        onClick={()=>setPage(page+1)}
        >
          Next
        </button>

      </div>

    </div>
  );
}