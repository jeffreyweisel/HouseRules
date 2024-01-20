import { Route, Routes } from "react-router-dom";
import { AuthorizedRoute } from "./auth/AuthorizedRoute";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Home from "./Home";
import UserProfileList from "./UserProfileList";
import UserProfileDetails from "./UserProfileDetails";
import ChoreList from "./ChoreList";
import CreateChore from "./CreateChore";
import ChoreDetails from "./ChoreDetails";
import UserChoreList from "./UserChores";

export default function ApplicationViews({ loggedInUser, setLoggedInUser }) {

  console.log("loggedInUser in ApplicationViews:", loggedInUser);

  return (
    <Routes>
      <Route path="/">
        <Route
          index
          element={
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <Home />
            </AuthorizedRoute>
          }
        />

        <Route
          path="userprofiles"
          element={
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <UserProfileList />
            </AuthorizedRoute>
          }
        />
        <Route
          path="userprofiles/:id"
          element={
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <UserProfileDetails />
            </AuthorizedRoute>
          }
        />

        <Route path="chores">
          <Route
            index
            element={
              <AuthorizedRoute loggedInUser={loggedInUser}>
                <ChoreList loggedInUser={loggedInUser} />
              </AuthorizedRoute>
            }
          />
          <Route
            path="create"
            element={
              <AuthorizedRoute loggedInUser={loggedInUser}>
                <CreateChore />
              </AuthorizedRoute>
            }
          />
          <Route
          path=":id"
          element={
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <ChoreDetails loggedInUser={loggedInUser}/>
            </AuthorizedRoute>
          }
        />
        </Route>
        <Route
          path="mychores"
          element={
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <UserChoreList loggedInUser={loggedInUser}/>
            </AuthorizedRoute>
          }
        />
        <Route
          path="login"
          element={<Login setLoggedInUser={setLoggedInUser} />}
        />
        <Route
          path="register"
          element={<Register setLoggedInUser={setLoggedInUser} />}
        />
      </Route>
      <Route path="*" element={<p>Whoops, nothing here...</p>} />
    </Routes>
  );
}
