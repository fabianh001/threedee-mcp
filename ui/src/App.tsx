import { useState } from 'react';
import { apiClient } from './lib/api-client/client';
import Scene from "./components/Scene/Scene";
import "./App.css";
import { ChatInput } from "./components/ChatInput";

function App() {
  const [prompt, setPrompt] = useState<string>("Create a nice tree house");
  const [progress, setProgress] = useState<number | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [previeLoaded, setPreviewLoaded] = useState<boolean>(false);
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

      const progress = result3.progress;
      setPrompt(`Waiting for model to be generated ${progress}%`);

      console.log("API RESULT 3", result3);
      if (result3.finished_at) {
        finished = true;
        setSceneURL(result3.model_urls.glb);
        console.log("Scene URL: ", result3.model_urls.glb);
        setPrompt("");
      }
      
      // sleep 10 sec
      await new Promise(r => setTimeout(r, 10000));
    }

    const refined_result = await apiClient.callTool("create_3d_refine", { preview_task_id: task_id });
    console.log("Refined result: ", refined_result);

    const refined_task_id  = JSON.parse(refined_result.content[0].text).result;
    console.log("Refined Task ID: ", refined_task_id);

    let refined_finished = false
    while (!refined_finished) {
      const refined_task_status = await apiClient.callTool("get_3d_task", { task_id: refined_task_id });

      console.log("refined_task_status", refined_task_status);
      const refined_task_result = JSON.parse(refined_task_status.content[0].text);

      const progress = refined_task_result.progress;
      setPrompt(`Waiting for model to be colorized ${progress}%`);

      console.log("API RESULT 3", refined_task_result);
      if (refined_task_result.finished_at) {
        refined_finished = true;
        setSceneURL(refined_task_result.model_urls.glb);
        console.log("Scene URL: ", refined_task_result.model_urls.glb);
        setPrompt("");
      }
      
      // sleep 10 sec
      await new Promise(r => setTimeout(r, 10000));
    }
    setPrompt("");
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
        progress={progress}
        setProgress={setProgress}
      />
    </div>
  );
}

export default App;
