import { useEffect, useState } from "react";
import { Button, Table } from "reactstrap";
import { getUserProfilesWithRoles } from "../managers/userProfileManager";
import { Link } from "react-router-dom";


export default function UserProfileList({ loggedInUser }) {
  const [userProfiles, setUserProfiles] = useState([]);

  useEffect(() => {
    getUserProfilesWithRoles().then(setUserProfiles);
  }, []);

  return (
    <>
      <h2>User Profiles</h2>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Email</th>
            <th>Username</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {userProfiles.map((up) => (
            <tr key={up.id}>
              <th scope="row">{`${up.firstName} ${up.lastName}`}</th>
              
              <td>{up.address}</td>
              <td>{up.email}</td>
              <td>{up.userName}</td>
              <Link to={`${up.id}`}>Details</Link>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}