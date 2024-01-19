import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table } from "reactstrap";
import { getChoreById } from "../managers/choreManager";


export default function ChoreDetails() {
  const { id } = useParams();
  const [chore, setChore] = useState(null);

  useEffect(() => {
    getChoreById(id).then(setChore);
  }, []);

  if (!chore) {
    return null;
  }

  return (
    <div className="container">
      <h2>
        {chore.name} 
      </h2>
      <Table>
        <tbody>
          <tr>
            <th scope="row">Difficulty</th>
            <td>{chore.difficulty}</td>
          </tr>
          <tr>
            <th scope="row">Frequency</th>
            <td>Every {chore.choreFrequencyDays} days</td>
          </tr>
          <tr></tr>
        </tbody>
      </Table>
      <h5>Chore Assignments</h5>
      {chore.choreAssignments?.length ? (
        <Table>
          <thead>
            <tr>
              <th>Asignee Name</th>
              
            </tr>
          </thead>
          <tbody>
            {chore.choreAssignments.map((ca) => (
              <tr key={`chore-${ca.id}`}>
                <td>
                  {ca.userProfile.firstName} {ca.userProfile.lastName}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No assignments for this chore</p>
      )}
    </div>
  );
}