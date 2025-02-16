import logging
from mcp.server.fastmcp import FastMCP
from .meshy_api import MeshyAPI

# Set up logging
logger = logging.getLogger(__name__)

# Initialize FastMCP server and API client
mcp = FastMCP("threedee")
api = MeshyAPI()


@mcp.tool()
async def create_3d_preview(prompt: str, art_style: str = "realistic", 
                          seed: int = None, ai_model: str = "meshy-4",
                          topology: str = "triangle", target_polycount: int = 30000,
                          should_remesh: bool = True, symmetry_mode: str = "auto") -> dict:
    """Create a Text to 3D Preview task.
    
    Args:
        prompt: Description of what kind of object the 3D model should be
        art_style: Style of the model ("realistic" or "sculpture")
        seed: Optional seed for reproducible results
        ai_model: AI model to use (default: "meshy-4")
        topology: Mesh topology ("quad" or "triangle")
        target_polycount: Target number of polygons (100-300000)
        should_remesh: Whether to enable remeshing
        symmetry_mode: Symmetry behavior ("off", "auto", or "on")
        
    Returns:
        Dictionary containing the preview task information
    """
    return await api.create_preview_task(prompt, art_style, seed, ai_model,
                                       topology, target_polycount, should_remesh, symmetry_mode)

@mcp.tool()
async def create_3d_refine(preview_task_id: str, enable_pbr: bool = False,
                          texture_prompt: str = None) -> dict:
    """Create a Text to 3D Refine task from a preview task.
    
    Args:
        preview_task_id: ID of the successful preview task
        enable_pbr: Generate PBR maps (metallic, roughness, normal)
        texture_prompt: Optional prompt to guide texturing
        
    Returns:
        Dictionary containing the refine task information
    """
    return await api.create_refine_task(preview_task_id, enable_pbr, texture_prompt)

@mcp.tool()
async def get_3d_task(task_id: str) -> dict:
    """Retrieve information about a specific Text to 3D task.
    
    Args:
        task_id: Unique identifier of the task
        
    Returns:
        Dictionary containing the task details including status and model URLs
    """
    return await api.get_task(task_id)

@mcp.tool()
async def list_3d_tasks(page_num: int = 1, page_size: int = 10, 
                       sort_by: str = "-created_at") -> dict:
    """List Text to 3D tasks with pagination.
    
    Args:
        page_num: Page number for pagination (starts at 1)
        page_size: Number of items per page (max 50)
        sort_by: Sort order ("+created_at" or "-created_at")
        
    Returns:
        Dictionary containing the paginated list of tasks
    """
    return await api.list_tasks(page_num, page_size, sort_by) 