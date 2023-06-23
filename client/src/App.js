import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Layout from './Layout';
import AllProblemPage from "./pages/AllProblemsPage";
import SingleProblem from "./pages/SingleProblemPage";
import AllSubmissionPage from "./pages/AllSubmissionPage";
import AddProblemForm from "./pages/AddProblemForm";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<AllProblemPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/SingleProblem/:id" element={<SingleProblem />} />
        <Route path="/addProblem" element={<AddProblemForm />} />
        <Route path="/AllSubmissions/:id" element={<AllSubmissionPage />} />
      </Route>
    </Routes>
  );
}

export default App;