import asyncio
import os
from dotenv import load_dotenv
import logging
from src.threedee.meshy_api import MeshyAPI

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

async def test_image_to_3d():
    """Test creating an image to 3D task"""
    # Verify API key is loaded
    api_key = os.getenv("MESHY_API_KEY")
    if not api_key:
        logger.error("MESHY_API_KEY not found in environment variables")
        return
        
    logger.info(f"API Key found: {api_key[:6]}...{api_key[-4:]}")
    
    api = MeshyAPI()
    
    # Test image to 3D task creation
    # Replace with your actual image URL
    local_image_path = "tests/assets/download.jpg"  # Change this to your image path
    image_url = api.image_file_to_data_uri(local_image_path)
    
    result = await api.create_image_to_3d_task(
        image_url=image_url,
        enable_pbr=True,
        should_remesh=True,
        should_texture=True
    )
    
    logger.info(f"Image to 3D task created: {result}")
    
    if result and "task_id" in result:
        # Test getting task status
        task_info = await api.get_task(result["task_id"])
        logger.info(f"Task info: {task_info}")
        
        # Wait for task to complete and get final result
        while task_info and task_info.get("status") in ["PENDING", "IN_PROGRESS"]:
            logger.info(f"Task progress: {task_info.get('progress')}%")
            await asyncio.sleep(5)
            task_info = await api.get_task(result["task_id"])
        
        logger.info(f"Final task status: {task_info}")

async def main():
    """Run all tests"""
    try:
        logger.info("Testing image to 3D task creation...")
        await test_image_to_3d()
        
    except Exception as e:
        logger.error(f"Test failed: {str(e)}")

if __name__ == "__main__":
    asyncio.run(main())