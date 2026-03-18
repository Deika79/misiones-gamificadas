import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ReactFlowProvider } from "reactflow"

import MissionMap from "./components/MissionMap"
import StudentMissionMap from "./components/StudentMissionMap"

import CoursesPage from "./pages/CoursesPage"
import CourseDetailPage from "./pages/CourseDetailPage"
import ChapterDetailPage from "./pages/ChapterDetailPage"

function App() {

  return (

    <BrowserRouter>

      <ReactFlowProvider>

        <Routes>

          <Route
            path="/"
            element={<CoursesPage />}
          />

          <Route
            path="/courses"
            element={<CoursesPage />}
          />

          <Route
            path="/courses/:id"
            element={<CourseDetailPage />}
          />

          <Route
            path="/chapters/:id"
            element={<ChapterDetailPage />}
          />

          <Route
            path="/mission/:missionId"
            element={<MissionMap />}
          />

          {/* MODO ALUMNO */}
          <Route
            path="/play/mission/:missionId"
            element={<StudentMissionMap />}
          />

        </Routes>

      </ReactFlowProvider>

    </BrowserRouter>

  )

}

export default App