import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import ChapterDetailPage from "./pages/ChapterDetailPage";

// 👇 IMPORTS CORRECTOS DESDE COMPONENTS
import MissionMap from "./components/MissionMap";
import StudentMissionMap from "./components/StudentMissionMap";

import AuthButtons from "./components/AuthButtons";

function App() {
  return (
    <Router>
      <AuthButtons />

      <Routes>
        <Route path="/" element={<div>Home</div>} />

        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />
        <Route path="/chapters/:id" element={<ChapterDetailPage />} />

        {/* Editor profesor */}
        <Route path="/mission/:missionId" element={<MissionMap />} />

        {/* Modo alumno */}
        <Route path="/play/mission/:missionId" element={<StudentMissionMap />} />
      </Routes>
    </Router>
  );
}

export default App;