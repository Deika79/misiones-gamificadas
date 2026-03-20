import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import ChapterDetailPage from "./pages/ChapterDetailPage";

import MissionMap from "./components/MissionMap";
import StudentMissionMap from "./components/StudentMissionMap";

import AuthButtons from "./components/AuthButtons";

function App() {
  return (
    <Router>
      <AuthButtons />

      <Routes>
        {/* 🔥 REDIRECCIÓN */}
        <Route path="/" element={<Navigate to="/courses" />} />

        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />
        <Route path="/chapters/:id" element={<ChapterDetailPage />} />

        <Route path="/mission/:missionId" element={<MissionMap />} />
        <Route path="/play/mission/:missionId" element={<StudentMissionMap />} />
      </Routes>
    </Router>
  );
}

export default App;