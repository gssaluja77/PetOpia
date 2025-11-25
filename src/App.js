import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import CommunityPosts from "./components/community/CommunityPosts";
import ViewPost from "./components/community/ViewPost";
import "./App.css";
import AdoptPet from "./components/AdoptPet";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import PrivateRoute from "./components/PrivateRoute";
import Navigation from "./components/Navigation";
import { PetCenterHome, PetInfo } from "./components/petcenter/PetCenter";
import ErrorHandler from "./components/ErrorHandler";

function App() {
  const handleChange = () => {
    setCount(count + 1);
  };

  const [count, setCount] = useState(0);
  const [userId, setUserId] = useState(window.sessionStorage.getItem("userid"));
  useEffect(() => {
    setUserId(window.sessionStorage.getItem("userid"));
  }, [count]);

  return (
    <div className="App-container flex flex-col min-h-screen">
      <Router>
        <div className="flex-grow">
          <Navigation userId={userId} handleChange={handleChange} />
          <Routes>
            <Route path="/adoptpet" element={<AdoptPet />} />
            <Route path="/account" element={<PrivateRoute />}>
              <Route index element={<Navigate to="/account/my-pets" replace />} />
              <Route path="my-pets" element={<PetCenterHome />} />
              <Route
                path="/account/my-pet-info/:petId"
                element={<PetInfo />}
              />
              <Route
                path={"/account/community-posts"}
                element={<CommunityPosts />}
              />
              <Route
                path={"/account/community-posts/:postId"}
                element={<ViewPost />}
              />
            </Route>
            <Route
              path="/"
              element={<SignIn handleChange={handleChange} />}
            />
            <Route
              path="/signup"
              element={<SignUp handleChange={handleChange} />}
            />
            <Route
              path="*"
              element={
                <ErrorHandler
                  error={
                    <div><h1>
                      <br />
                      <br />
                      Error 404: Page Not Found!
                    </h1>
                      <Link to={`/account/my-pets`}>
                        <button className="post-link my-posts">
                          Back to Pet-Center
                        </button>
                      </Link>
                    </div>
                  }
                />
              }
            />
          </Routes>
        </div>
      </Router>
      <footer className="text-center text-gray-500 w-full py-2">
        <div className="text-center">
          <span className="text-base font-medium">
            PetOpia{" "}
          </span>
          <span className="font-light text-base">
            © 2023 All Rights Reserved.{" "}
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
