import ProgressBar from "./ProgressBar";
import Tickicon from "./Tickicon";
import { useState } from "react";
import Modal from "./Modal";

export default function ListItem({ task, getData }) {
  const [showModal, setShowModal] = useState(false);

  async function deleteTodo() {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/todos/${task.id}`,
        {
          method: "DELETE",
        }
      );
      if (response.status === 200) {
        await getData();
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <li className="list-item">
      <div className="info-container">
        <Tickicon />
        <p className="task-title">{task.title}</p>
        <ProgressBar progress={task.progress} />
      </div>

      <div className="btn-container">
        <button
          type="submit"
          className="edit-btn"
          onClick={() => setShowModal(true)}
        >
          EDIT
        </button>
        <button type="submit" className="delete-btn" onClick={deleteTodo}>
          DELETE
        </button>
      </div>

      {showModal && (
        <Modal
          task={task}
          mode="edit"
          setShowModal={setShowModal}
          getData={getData}
        />
      )}
    </li>
  );
}
