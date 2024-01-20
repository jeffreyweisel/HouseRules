import { useEffect, useState } from "react";
import { Button, Table } from "reactstrap";
import { Link } from "react-router-dom";
import {
  completeChore,
  deleteChore,
  getChores,
} from "../managers/choreManager";

export default function ChoreList({ loggedInUser }) {
  const [chores, setChores] = useState([]);

  console.log("loggedInUser in ChoreList:", loggedInUser);

  useEffect(() => {
    getChores().then(setChores);
  }, []);

  const handleDeleteButton = async (id) => {
    console.log("Deleting Chore with ID:", id);
    await deleteChore(id);
    const updatedChores = await getChores();
    setChores(updatedChores);
  };

  const handleChoreCompletionButtonClick = async (id) => {
    console.log("Completing chore with Id:", id);

    // Check if loggedInUser and loggedInUser.id are defined
    if (loggedInUser && loggedInUser.id) {
      await completeChore(id, loggedInUser.id);
      const updatedChores = await getChores();
      setChores(updatedChores);
    } else {
      console.error("Error: loggedInUser or loggedInUser.id is undefined");
    }
  };

  return (
    <>
      <h2>Chore List</h2>
      <Link to={"create"}>Add</Link>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Difficulty</th>
            <th>Chore Frequency</th>
          </tr>
        </thead>
        <tbody>
          {chores.map((c) => (
            <tr key={c.id}>
              <th
                scope="row"
                style={{ color: c.daysOverDue >= 1 ? "red" : "black" }}
              >
                {c.name}
              </th>
              <td>{c.difficulty}/5</td>
              <td>Every {c.choreFrequencyDays} days</td>
              {loggedInUser.roles.includes("Admin") && (
                <Link to={`${c.id}`}>Details</Link>
              )}
              {loggedInUser.roles.includes("Admin") && (
                <Button onClick={() => handleDeleteButton(c.id)}>Delete</Button>
              )}
              <Button onClick={() => handleChoreCompletionButtonClick(c.id)}>
                Complete
              </Button>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
