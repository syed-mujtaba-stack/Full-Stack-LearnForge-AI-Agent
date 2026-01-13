from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional, Union

class LLMProvider(ABC):
    """
    Abstract Base Class for LLM Providers.
    Designed for the LearnForge AI Factory Pattern.
    """
    
    @abstractmethod
    async def generate_text(
        self, 
        prompt: str, 
        system_prompt: Optional[str] = None,
        **kwargs
    ) -> str:
        """Generate a text response from the LLM."""
        pass

    @abstractmethod
    async def generate_json(
        self, 
        prompt: str, 
        schema: Dict[str, Any],
        system_prompt: Optional[str] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """Generate a structured JSON response based on a schema."""
        pass

    @abstractmethod
    async def get_embeddings(self, text: Union[str, List[str]]) -> List[List[float]]:
        """Generate vector embeddings for retrieval."""
        pass
