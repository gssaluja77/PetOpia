import { useEffect } from "react";
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
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import PrivateRoute from "./components/PrivateRoute";
import Navigation from "./components/Navigation";
import { PetCenterHome, PetInfo } from "./components/petcenter/PetCenter";
import ErrorHandler from "./components/ErrorHandler";
import { isSessionExpired } from "./utils/session";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AppContent() {
  const { userId, loginTime, lastActivity, logout, updateActivity } = useAuth();

  useEffect(() => {
    if (userId) {
      const isExpired = isSessionExpired(loginTime, lastActivity);
      if (isExpired) {
        logout();
      }
    }
  }, [userId, loginTime, lastActivity, logout]);

  const handleActivity = () => {
    if (userId) {
      updateActivity();
    }
  };

  return (
    <div className="App-container flex flex-col min-h-screen" onClick={handleActivity}>
      <Router>
        <div className="flex-grow">
          <Navigation userId={userId} />
          <Routes>
            <Route path="/adoptpet" element={<AdoptPet />} />
            <Route path="/account" element={<PrivateRoute />}>
              <Route index element={<Navigate to="/account/my-pets" replace />} />
              <Route path="my-pets" element={<PetCenterHome />} />
              <Route path="my-pet-info/:petId" element={<PetInfo />} />
              <Route path="community-posts" element={<CommunityPosts />} />
              <Route
                path={"community-posts/:postId"}
                element={<ViewPost />}
              />
            </Route>
            <Route
              path="/"
              element={<SignIn />}
            />
            <Route
              path="/signup"
              element={<SignUp />}
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

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
