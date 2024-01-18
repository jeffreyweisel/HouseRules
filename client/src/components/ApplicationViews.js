import { Route, Routes } from "react-router-dom";
import { AuthorizedRoute } from "./auth/AuthorizedRoute";
import Login from "./auth/Login";
import Register from "./auth/Register";


export default function ApplicationViews({ loggedInUser, setLoggedInUser }) {
  return (
    <Routes>
      <Route path="/">
        <Route
          index
          element={
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <>Thing 1</>
            </AuthorizedRoute>
          }
        />
        <Route
          path="bikes"
          element={
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <>Thing 2</>
            </AuthorizedRoute>
          }
        />
        <Route path="workorders">
          <Route
            index
            element={
              <AuthorizedRoute loggedInUser={loggedInUser}>
                <>Thing 3</>
              </AuthorizedRoute>
            }
          />
        </Route>
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