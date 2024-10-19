import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

// Components
import Auth from "./components/Auth";
import ListHeader from "./components/ListHeader";
import ListItem from "./components/ListItem";

function App() {
  const [tasks, setTasks] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(null);

  // Set email and token from cookies
  const userEmail = cookies.Email;
  const authToken = cookies.AuthToken;

  // Sort by date
  const sortedTasks = tasks?.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  useEffect(() => {
    if (authToken) {
      getData();
    }
    // eslint-disable-next-line
  }, []);

  async function getData() {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/todos/${userEmail}`
      );
      const jsonData = await response.json();

      setTasks(jsonData);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="app">
      {/* Show auth page */}
      {!authToken && <Auth />}

      {/* Authenicated */}
      {authToken && (
        <>
          <ListHeader listName={"Todo List"} getData={getData} />
          <p className="user-email">Welcome {userEmail}</p>
          {sortedTasks?.map((task) => (
            <ListItem key={task.id} task={task} getData={getData} />
          ))}
        </>
      )}
    </div>
  );
}

export default App;
