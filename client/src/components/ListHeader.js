import { useState } from "react";
import Modal from "./Modal";
import { useCookies } from "react-cookie";

export default function ListHeader({ listName, getData }) {
  const [showModal, setShowModal] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(null);

  function signOut() {
    removeCookie("Email");
    removeCookie("AuthToken");
    window.location.reload();
  }

  return (
    <div className="list-header">
      <h1 className="list-title">&#x1F9FE; {listName}</h1>
      <div className="btn-container">
        <button
          type="submit"
          className="create-btn"
          onClick={() => setShowModal(true)}
        >
          ADD NEW
        </button>
        <button type="submit" className="signout-btn" onClick={signOut}>
          SIGN OUT
        </button>
      </div>
      {showModal && (
        <Modal mode="create" setShowModal={setShowModal} getData={getData} />
      )}
    </div>
  );
}
