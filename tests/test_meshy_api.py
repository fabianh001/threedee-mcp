import asyncio
import os
from dotenv import load_dotenv
import logging
from src.threedee.meshy_api import MeshyAPI

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load environment variables at the start of the file
load_dotenv()

async def test_create_preview():
    """Test creating a preview task"""
    # Verify API key is loaded
    api_key = os.getenv("MESHY_API_KEY")
    if not api_key:
        logger.error("MESHY_API_KEY not found in environment variables")
        return
        
    logger.info(f"API Key found: {api_key[:6]}...{api_key[-4:]}")
    
    api = MeshyAPI()
    
    # Test preview task creation with simpler parameters
    result = await api.create_preview_task(
        prompt="a monster mask",
        art_style="realistic",
        should_remesh=True
    )
    
    logger.info(f"Preview task created: {result}")
    
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
        
        if task_info and task_info.get("status") == "SUCCEEDED":
            # Test creating refine task
            refine_result = await api.create_refine_task(
                preview_task_id=result["task_id"],
                enable_pbr=True
            )
            logger.info(f"Refine task created: {refine_result}")

async def test_list_tasks():
    """Test listing tasks"""
    api = MeshyAPI()
    result = await api.list_tasks(page_num=1, page_size=10)
    logger.info(f"Listed tasks: {result}")

async def main():
    """Run all tests"""
    try:
        logger.info("Testing preview task creation...")
        await test_create_preview()
        
        logger.info("\nTesting task listing...")
        await test_list_tasks()
        
    except Exception as e:
        logger.error(f"Test failed: {str(e)}")

if __name__ == "__main__":
    asyncio.run(main()) 