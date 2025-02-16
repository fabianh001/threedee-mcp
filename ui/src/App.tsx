import Scene from "./components/Scene/Scene";
import "./App.css";
import { ChatInput } from "./components/ChatInput";

function App() {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1">
        <Scene />
      </div>
      <ChatInput />
    </div>
  );
}

export default App;
