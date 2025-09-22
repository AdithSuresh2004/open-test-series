import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import DashboardPage from "./pages/DashboardPage";
import ExamSelectionPage from "./pages/ExamSelectionPage";
import ExamPage from "./pages/ExamPage";
import ErrorPage from "./pages/ErrorPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="*" element={<ErrorPage />} />
          <Route index element={<DashboardPage />} />
          <Route path="/exams" element={<ExamSelectionPage />} />
        </Route>
        <Route path="exam/:examId" element={<ExamPage />} />
      </Routes>
    </Router>
  );
}

export default App;
