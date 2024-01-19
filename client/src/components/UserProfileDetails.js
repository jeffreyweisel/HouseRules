import { useState, useEffect } from "react";
import { Card, CardTitle, CardBody } from "reactstrap";
import { getUserProfileById } from "../managers/userProfileManager";
import { useParams } from "react-router-dom";


export default function UserProfileDetails() {
  const [userprofile, setUserProfile] = useState(null);

const { id } = useParams();

  useEffect(() => {
    getUserProfileById(id).then(setUserProfile);
  }, []);

  if (!userprofile) {
    return null;
  }
  return (
    <>
      <h2>Employee Details</h2>
      <Card>
        <CardBody>
          <CardTitle tag="h4">{userprofile.firstName}</CardTitle>
          <p>Email: {userprofile.email}</p>
          <p>Address: {userprofile.address}</p>
        </CardBody>
      </Card>
    </>
  );
}