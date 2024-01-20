import { useEffect, useState } from "react";
import { completeChore, getChores } from "../managers/choreManager";
import { Button, Table } from "reactstrap";
import { Link } from "react-router-dom";

export default function UserChoreList({ loggedInUser }) {
    const [chores, setChores] = useState([]);
  
    console.log("loggedInUser in userchores:", loggedInUser);
  
    useEffect(() => {
      getChores().then(setChores);
    }, []);
  
    const handleChoreCompletionButtonClick = async (id) => {
      console.log("Completing chore with Id:", id);
  
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
        <h2>My Chores</h2>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Difficulty</th>
              <th>Chore Frequency</th>
            </tr>
          </thead>
          <tbody>
            {chores
              .filter((c) => c.choreAssignments && c.choreAssignments.some(
                (assignment) => assignment.userProfileId === loggedInUser.id
              ))
              .map((c) => (
                <tr key={c.id}>
                  <th scope="row">{`${c.name}`}</th>
                  <td>{c.difficulty}/5</td>
                  <td>Every {c.choreFrequencyDays} days</td>
                  <Link to={`${c.id}`}>Details</Link>
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
