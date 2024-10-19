import { useState } from "react";
import { useCookies } from "react-cookie";

export default function Modal({ task, mode, setShowModal, getData }) {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const editMode = mode === "edit" ? true : false;
  const [data, setData] = useState({
    user_email: editMode ? task.user_email : cookies.Email,
    title: editMode ? task.title : null,
    progress: editMode ? task.progress : 0,
    date: editMode ? task.date : new Date(),
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setData((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }

  async function createTodo(e) {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/todos`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (response.status === 200) {
        setShowModal(false);
        await getData();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function editTodo(e) {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/todos/${task.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (response.status === 200) {
        setShowModal(false);
        await getData();
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="overlay">
      <div className="modal">
        <div className="form-title-container">
          <h3>Let's {mode} your task</h3>
          <button onClick={() => setShowModal(false)}>X</button>
        </div>

        <form onSubmit={editMode ? editTodo : createTodo}>
          <input
            type="text"
            name="title"
            placeHolder="Your task goes here"
            required
            maxLength={30}
            value={data.title}
            onChange={handleChange}
          ></input>
          <br />
          <label for="range">Drag to select your current progress</label>
          <input
            type="range"
            name="progress"
            id="range"
            min="0"
            max="100"
            required
            value={data.progress}
            onChange={handleChange}
          ></input>
          <input type="submit" className={mode} value={mode}></input>
        </form>
      </div>
    </div>
  );
}
