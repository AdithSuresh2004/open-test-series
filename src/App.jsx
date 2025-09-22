import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import ExamPage from "./pages/ExamPage";
import ErrorPage from "./pages/ErrorPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="*" element={<ErrorPage />} />
          <Route index element={<HomePage />} />
        </Route>
        <Route path="exams/:examId" element={<ExamPage />} />
      </Routes>
    </Router>
  );
}

export default App;
