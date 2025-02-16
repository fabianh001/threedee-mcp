import { use, useEffect, useState } from 'react';
import { apiClient } from './lib/api-client/client';
import { useAPI } from './hooks/useAPI';
import type { Prompt, Resource } from './lib/api-client/types';
import Scene from "./components/Scene/Scene";
import "./App.css";
import { ChatInput } from "./components/ChatInput";

// Example 1: Simple list with loading state
function PromptsList() {
  const { data, error, isLoading, execute } = useAPI<Prompt[]>(
    () => apiClient.listTools()
  );

  console.log("PromptsList executed: ", data);

  useEffect(() => {
    execute();
  }, []);

  if (isLoading) return <div>Loading prompts...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <h2>Available Prompts</h2>
      {data && JSON.stringify(data, null, 2)}
    </div>
  );
}


function App() {
  const [prompt, setPrompt] = useState<string>("Create a nice tree house");
  const [taskId, setTaskId] = useState<string | null>(null);
  const [sceneURL, setSceneURL] = useState<string | undefined>(undefined);

  const onChangePrompt = async (prompt: string) => {
    setPrompt(prompt);

    const result = await apiClient.generate3D(prompt)

    console.log("API RESULT", result);

    const { model_response, tool_results } = result;

    const task_id  = JSON.parse(tool_results[0].text).task_id;
    console.log("Task ID: ", task_id);

    let finished = false
    while (!finished) {

      const task_status = await apiClient.callTool("get_3d_task", { task_id: task_id });

      console.log("API RESULT 2", task_status);
      const result3 = JSON.parse(task_status.content[0].text);

      console.log("API RESULT 3", result3);
      if (result3.finished_at) {
        finished = true;
        setSceneURL(result3.model_urls.glb);
        console.log("Scene URL: ", result3.models_urls.glb);
      }
      // sleep 10 sec
      await new Promise(r => setTimeout(r, 10000));
    
    }
  };

  return (
    <div>
      <Scene 
        sceneUrl={sceneURL}
      />
      <ChatInput 
        inputValue={prompt}
        setInputValue={setPrompt}
        onSubmit={onChangePrompt}
      />
    </div>
  );
}

export default App;
