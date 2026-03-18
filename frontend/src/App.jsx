import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ReactFlowProvider } from "reactflow"

import MissionMap from "./components/MissionMap"
import CoursesPage from "./pages/CoursesPage"
import CourseDetailPage from "./pages/CourseDetailPage"

function App() {

  return (

    <BrowserRouter>

      <ReactFlowProvider>

        <Routes>

          <Route
            path="/"
            element={
              <div>
                <h1>Mapa de Misiones</h1>
                <MissionMap />
              </div>
            }
          />

          <Route
            path="/courses"
            element={<CoursesPage />}
          />

          <Route
            path="/courses/:id"
            element={<CourseDetailPage />}
          />

        </Routes>

      </ReactFlowProvider>

    </BrowserRouter>

  )

}

export default App