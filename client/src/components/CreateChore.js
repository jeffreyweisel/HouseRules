import { useState } from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import { useNavigate } from "react-router-dom/dist";
import { addChore } from "../managers/choreManager";

export default function CreateChore() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [choreFrequencyDays, setFrequency] = useState("");
  const [errors, setErrors] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const newChore = {
      name,
      difficulty,
      choreFrequencyDays,
    };

    addChore(newChore).then((res) => {
      if (res.errors) {
        setErrors(res.errors);
      } else {
        navigate("/chores");
      }
    });
  };

  return (
    <div className="container">
      <h4>Add New Chore</h4>
      <Form>
        <FormGroup>
          <Label htmlFor="name">Name</Label>
          <Input
          required
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
          required
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
          required
            type="text"
            placeholder="1..."
            name="frequencyOfDays"
            value={choreFrequencyDays}
            onChange={(e) => {
              setFrequency(parseInt(e.target.value));
            }}
          />
        </FormGroup>
        <div style={{ color: "red" }}>
          {Object.keys(errors).map((key) => (
            <p key={key}>
              {key}: {errors[key].join(",")}
            </p>
          ))}
        </div>
        <Button onClick={submit}>Submit</Button>
      </Form>
    </div>
  );
}
