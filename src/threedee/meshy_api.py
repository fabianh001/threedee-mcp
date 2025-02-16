import os
import httpx
from typing import Any
import logging
from dotenv import load_dotenv

# Set up logging
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

class MeshyAPI:
    """Handler for Meshy API interactions."""
    
    def __init__(self):
        self.api_base = "https://api.meshy.ai"
        self.api_key = os.getenv("MESHY_API_KEY")
        if not self.api_key:
            raise ValueError("MESHY_API_KEY environment variable is not set")
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        self.user_agent = "threedee-app/1.0"
        
    async def make_request(self, url: str, method: str = "GET", data: dict = None) -> dict[str, Any] | None:
        """Make a request to the Meshy API with proper error handling."""
        async with httpx.AsyncClient() as client:
            try:
                if method == "GET":
                    response = await client.get(url, headers=self.headers, timeout=30.0)
                else:  # POST
                    logger.debug(f"Making POST request to {url}")
                    logger.debug(f"Headers: {self.headers}")
                    logger.debug(f"Data: {data}")
                    response = await client.post(url, headers=self.headers, json=data, timeout=30.0)
                
                # Log the response for debugging
                logger.debug(f"Response status: {response.status_code}")
                logger.debug(f"Response content: {response.text}")
                
                response.raise_for_status()
                return response.json()
            except httpx.HTTPStatusError as e:
                logger.error(f"HTTP error occurred: {e.response.text}")
                return None
            except Exception as e:
                logger.error(f"API request failed: {str(e)}")
                return None

    async def create_preview_task(self, prompt: str, art_style: str = "realistic", 
                                seed: int = None, ai_model: str = "meshy-4",
                                topology: str = "triangle", target_polycount: int = 30000,
                                should_remesh: bool = True, symmetry_mode: str = "auto") -> dict[str, Any]:
        """Create a Text to 3D Preview task."""
        url = f"{self.api_base}/openapi/v2/text-to-3d"
        
        data = {
            "mode": "preview",
            "prompt": prompt,
            "art_style": art_style,
            "should_remesh": should_remesh,
            "topology": topology,
            "target_polycount": target_polycount,
            "symmetry_mode": symmetry_mode,
            "ai_model": ai_model
        }
        if seed is not None:
            data["seed"] = seed
            
        response = await self.make_request(url, method="POST", data=data)
        if response:
            return {"task_id": response["result"]}
        return None

    async def create_refine_task(self, preview_task_id: str, enable_pbr: bool = False,
                                texture_prompt: str = None) -> dict[str, Any] | None:
        """Create a Text to 3D Refine task."""
        url = f"{self.api_base}/openapi/v2/text-to-3d"
        
        data = {
            "mode": "refine",
            "preview_task_id": preview_task_id,
            "enable_pbr": enable_pbr
        }
        if texture_prompt:
            data["texture_prompt"] = texture_prompt
            
        return await self.make_request(url, method="POST", data=data)

    async def get_task(self, task_id: str) -> dict[str, Any] | None:
        """Retrieve a Text to 3D task."""
        url = f"{self.api_base}/openapi/v2/text-to-3d/{task_id}"
        return await self.make_request(url)

    async def list_tasks(self, page_num: int = 1, page_size: int = 10, 
                        sort_by: str = "-created_at") -> dict[str, Any] | None:
        """List Text to 3D tasks."""
        url = f"{self.api_base}/openapi/v2/text-to-3d"
        params = {
            "page_num": page_num,
            "page_size": min(page_size, 50),  # Maximum allowed is 50
            "sort_by": sort_by
        }
        param_string = "&".join(f"{k}={v}" for k, v in params.items())
        url = f"{url}?{param_string}"
        return await self.make_request(url) 