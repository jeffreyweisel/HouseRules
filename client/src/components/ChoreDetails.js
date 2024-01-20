import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, FormGroup, Input, Label } from "reactstrap";
import {
  assignChore,
  getChoreById,
  unassignChore,
  updateChore,
} from "../managers/choreManager";
import { getUserProfiles } from "../managers/userProfileManager";

export default function ChoreDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chore, setChore] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getChoreById(id).then(setChore);
  }, [id]);

  useEffect(() => {
    getUserProfiles().then(setUsers);
  }, []);

  const handleInputChange = (e) => {
    setChore({
      ...chore,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = async (userId, isChecked) => {
    try {
      if (isChecked) {
        await assignChore(id, userId);
      } else {
        await unassignChore(id, userId);
      }
      getUserProfiles().then(setUsers);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateChore({
      id,
      name: chore.name,
      difficulty: chore.difficulty,
      choreFrequencyDays: chore.choreFrequencyDays,
    });
    navigate("/chores");
  };

  if (!chore) {
    return null;
  }

  return (
    <div className="container">
      <h2>Edit Chore</h2>
      <Form>
        <FormGroup>
          <Label for="name">Name: </Label>
          <Input
            type="text"
            name="name"
            id="name"
            value={chore.name}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="difficulty">Difficulty: </Label>
          <Input
            type="text"
            name="difficulty"
            id="difficulty"
            value={chore.difficulty}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="frequency">How often chore needs to be done: </Label>
          <Input
            type="text"
            name="choreFrequencyDays"
            id="choreFrequencyDays"
            value={chore.choreFrequencyDays}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <h5>Chore Assignments</h5>
          <div>
            {users.map((user) => (
              <div key={user.id}>
                <input
                  type="checkbox"
                  id={`userCheckbox-${user.id}`}
                  checked={user.choreAssignments.some(
                    (assignment) => assignment.choreId === chore.id
                  )}
                  onChange={(e) =>
                    handleCheckboxChange(user.id, e.target.checked)
                  }
                />
                <label
                  htmlFor={`userCheckbox-${user.id}`}
                >{`${user.firstName} ${user.lastName}`}</label>
              </div>
            ))}
          </div>
        </FormGroup>
        <Button type="button" onClick={handleSubmit} color="primary">
          Save Changes
        </Button>
      </Form>
    </div>
  );
}
