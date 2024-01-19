import { useState } from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import { useNavigate } from "react-router-dom/dist";
import { addChore } from "../managers/choreManager";

export default function CreateChore() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [choreFrequencyDays, setFrequency] = useState("");
 

  const submit = () => {
    const newChore = {
      name,
      difficulty,
      choreFrequencyDays
    };

    addChore(newChore).then(() => {
      navigate("/chore");
    });
  };

  return (
    <div className="container">
      <h4>Add New Chore</h4>
      <Form>
        <FormGroup>
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            placeholder="Name..."
            name="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="difficulty">Difficulty (1-5)</Label>
          <Input
            type="text"
            placeholder="1..."
            name="difficulty"
            value={difficulty}
            onChange={(e) => {
              setDifficulty(parseInt(e.target.value));
            }}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="frequency">How often this chore is done</Label>
          <Input
            type="text"
            placeholder="1..."
            name="frequencyOfDays"
            value={choreFrequencyDays}
            onChange={(e) => {
              setFrequency(parseInt(e.target.value));
            }}
          />
        </FormGroup>
        <Button onClick={submit}>Submit</Button>
      </Form>
    </div>
  );
}