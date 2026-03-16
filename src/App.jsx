import "./App.css";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import HomePage from "./components/HomePage";
import AddNewCorr from "./components/corrs/AddNewCorr";
import CorrDetailsPage from "./components/corrs/corrDetails/CorrDetailsPage";
import ErrorComponent from "./components/ErrorComponent";
import ProfilePage from "./components/profile/ProfilePage";
import Page404 from "./components/Page404";
import CorrsDashboard from "./components/corrs/CorrsDashboard";
import { ToastContainer } from "react-toastify";
import ModalManager from "./components/modals/ModalManager";
import { useSelector } from "react-redux";
import LoadingComponent from "./components/LoadingComponent";
import NavBar from "./components/Nav/NavBar";

function App() {
  const { initialized } = useSelector((state) => state.async);
  if (!initialized) return <LoadingComponent content="Loading App..." />;
  return (
    <div>
    <NavBar />
    <div className="app-content">
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route element={<PrivateRoute />}>
          <Route exact path="/corrs" element={<CorrsDashboard />} />
          <Route path="/newcorr" element={<AddNewCorr />} />
          <Route path="corr/:id" element={<CorrDetailsPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Page404 />} />
        <Route path="/error" element={<ErrorComponent />} />
      </Routes>
      <ModalManager />
      <ToastContainer hideProgressBar position="top-right" />
    </div>
    </div>
    
  );
}

export default App;

