import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import CommunityFeed from "./components/community/CommunityFeed";
import ViewPost from "./components/community/ViewPost";
import "./App.css";
import AdoptPet from "./components/AdoptPet";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import PrivateRoute from "./components/PrivateRoute";
import Navigation from "./components/Navigation";
import PetCenter from "./components/petcenter/PetCenter";
import ErrorHandler from "./components/ErrorHandler";
import { isSessionExpired } from "./utils/session";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./utils/hooks/useAuth";
import { RefreshProvider } from "./context/RefreshContext";
import PetInfo from "./components/petcenter/PetInfo";

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
    <div
      className="App-container flex flex-col min-h-screen"
      onClick={handleActivity}
    >
      <Router>
        <div className="flex-grow">
          <Navigation userId={userId} />
          <Routes>
            <Route path="/adoptpet" element={<AdoptPet />} />
            <Route path="/account" element={<PrivateRoute />}>
              <Route
                index
                element={<Navigate to="/account/my-pets" replace />}
              />
              <Route path="my-pets" element={<PetCenter />} />
              <Route path="my-pet-info/:petId" element={<PetInfo />} />
              <Route path="community-posts" element={<CommunityFeed />} />
              <Route path="my-posts" element={<CommunityFeed />} />
              <Route path={"community-posts/:postId"} element={<ViewPost />} />
            </Route>
            <Route path="/" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="*"
              element={
                <ErrorHandler
                  error={
                    <div className="text-center py-10">
                      <h1 className="text-2xl font-bold text-red-600 mb-4">
                        Error 404: Page Not Found!
                      </h1>
                      <div className="flex flex-col gap-4">
                        <div className="flex justify-center">
                          <Link to={`/account/my-pets`}>
                            <button className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                              &larr; Back to Pet Center
                            </button>
                          </Link>
                        </div>
                        <div className="flex justify-center">
                          <Link to={`/account/community-posts`}>
                            <button className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                              &larr; Back to Community Feed
                            </button>
                          </Link>
                        </div>
                      </div>
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
          <span className="text-base font-medium">PetOpia </span>
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
      <RefreshProvider>
        <AppContent />
      </RefreshProvider>
    </AuthProvider>
  );
}

export default App;
