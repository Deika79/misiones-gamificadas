import MissionMap from "./components/MissionMap"
import { ReactFlowProvider } from "reactflow"

function App() {

  return (

    <ReactFlowProvider>

      <div>
        <h1>Mapa de Misiones</h1>
        <MissionMap />
      </div>

    </ReactFlowProvider>

  )

}

export default App