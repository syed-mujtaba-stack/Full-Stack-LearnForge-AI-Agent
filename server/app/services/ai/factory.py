from enum import Enum
from app.services.ai.base_provider import LLMProvider
from app.services.ai.gemini_provider import GeminiProvider

class TaskType(str, Enum):
    GENERAL = "general"
    CODING = "coding"
    SUMMARY = "summary"
    QUIZ = "quiz"
    CHAT = "chat"

def get_ai_provider(task: TaskType = TaskType.GENERAL) -> LLMProvider:
    """
    Factory function to get the appropriate AI provider.
    Currently defaults to Gemini for all tasks to leverage the free tier.
    """
    # In the future, this can branch based on task type:
    # if task == TaskType.CODING: 
    #     return OpenAIProvider(model="gpt-4")
    
    return GeminiProvider()
