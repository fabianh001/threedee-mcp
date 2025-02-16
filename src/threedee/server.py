import logging
from .tools import mcp

# Set up logging
logger = logging.getLogger(__name__)

def main():
    """Entry point for the threedee-mcp application."""
    logger.info("Starting 3D MCP server")
    try:
        mcp.run(transport='stdio')
        logger.info("Server initialized successfully")
    except Exception as e:
        logger.error(f"Server error occurred: {str(e)}", exc_info=True)
        raise

if __name__ == "__main__":
    main()