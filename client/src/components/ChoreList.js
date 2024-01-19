import { useEffect, useState } from "react";
import { Button, Table } from "reactstrap";

import { Link } from "react-router-dom";
import { deleteChore, getChores } from "../managers/choreManager";

export default function ChoreList({ loggedInUser }) {
  const [chores, setChores] = useState([]);

  useEffect(() => {
    getChores().then(setChores);
  }, []);

  const handleDeleteButton = async (id) => {
    console.log("Deleting appointment with ID:", id);
    await deleteChore(id);
    const updatedChores = await getChores();
    setChores(updatedChores);
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

            <th></th>
          </tr>
        </thead>
        <tbody>
          {chores.map((c) => (
            <tr key={c.id}>
              <th scope="row">{`${c.name}`}</th>
              <td>{c.difficulty}/5</td>
              <td>Every {c.choreFrequencyDays} days</td>
              <Link to={`${c.id}`}>Details</Link>
              <Button onClick={() => handleDeleteButton(c.id)}>Delete</Button>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
