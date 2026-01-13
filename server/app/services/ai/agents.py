from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.ai.factory import get_ai_provider, TaskType
from app.services.ai.ingestion import ContentIngestor
import logging

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.ai = get_ai_provider()
        self.ingestor = ContentIngestor(db)

class AITutorService(AIService):
    async def chat(self, user_id: str, course_id: int, message: str, history: List[Dict[str, str]] = None) -> str:
        """
        Agentic Tutor with multi-turn reasoning and RAG.
        """
        # 1. Search for context (including potential query expansion)
        search_query = message
        if len(message) < 10: # Short queries benefit from expansion
            expansion_prompt = f"Expand this student question into a search query for educational materials: {message}"
            search_query = await self.ai.generate_text(expansion_prompt, max_tokens=50)

        search_results = await self.ingestor.search_course_content(search_query, course_id=course_id, top_k=5)
        
        context_parts = []
        if search_results and search_results.get('matches'):
            for match in search_results['matches']:
                meta = match['metadata']
                context_parts.append(f"Source: {meta.get('title')}\nContent: {meta.get('text')}")

        context_text = "\n\n---\n\n".join(context_parts)

        # 2. Construct Enhanced System Prompt
        system_prompt = (
            "You are the EduGenius Agentic Tutor, a sovereign AI educator. "
            "Your mission is to guide students through complex concepts using the provided context. "
            "\n\nGUIDELINES:\n"
            "1. BE AGENTIC: Don't just answer; guide. Ask follow-up questions to test understanding.\n"
            "2. RAG FIRST: Use the provided context as your primary knowledge source.\n"
            "3. MARKDOWN: Use rich markdown (tables, bold, lists) for readability.\n"
            "4. CODE: If providing code, explain it line-by-line.\n"
            "5. NO TEACHER NEEDED: You are the authority. Provide complete, verified explanations.\n"
            "\n\nCONTEXT FROM COURSE:\n"
            f"{context_text}"
        )

        # 3. Handle History
        messages = []
        if history:
            # Map history format to standard OpenAI roles
            for h in history[-10:]: # Keep last 10 turns
                messages.append({"role": h["role"], "content": h["content"]})
        
        messages.append({"role": "user", "content": message})

        # 4. Generate response using the provider's native chat capability if possible
        # Falling back to generate_text for broad compatibility
        full_conversation = ""
        for m in messages:
            full_conversation += f"{m['role'].capitalize()}: {m['content']}\n"

        return await self.ai.generate_text(full_conversation, system_prompt=system_prompt)

class QuizGeneratorService(AIService):
    async def generate_lesson_quiz(self, lesson_id: int) -> Dict[str, Any]:
        """
        Generate a 5-question multiple choice quiz for a specific lesson.
        """
        from sqlalchemy.future import select
        from app import models
        
        # 1. Fetch lesson content
        result = await self.db.execute(
            select(models.course.Lesson).filter(models.course.Lesson.id == lesson_id)
        )
        lesson = result.scalars().first()
        if not lesson:
            return {"error": "Lesson not found"}

        # 2. Define Quiz Schema
        quiz_schema = {
            "type": "object",
            "properties": {
                "title": {"type": "string"},
                "questions": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "question": {"type": "string"},
                            "options": {"type": "array", "items": {"type": "string"}, "minItems": 4, "maxItems": 4},
                            "correct_answer": {"type": "string"},
                            "explanation": {"type": "string"}
                        },
                        "required": ["question", "options", "correct_answer", "explanation"]
                    },
                    "minItems": 5,
                    "maxItems": 5
                }
            },
            "required": ["title", "questions"]
        }

        # 3. Request Quiz Generation
        prompt = (
            f"Generate a challenging 5-question multiple choice quiz based on this lesson: {lesson.title}\n\n"
            f"Lesson Content:\n{lesson.content}"
        )
        
        system_prompt = "You are an expert curriculum designer. Create high-quality, pedagogical quizzes."
        
        return await self.ai.generate_json(prompt, schema=quiz_schema, system_prompt=system_prompt)

class CodeAssistantService(AIService):
    async def explain_code(self, code: str, language: str = "python") -> str:
        """
        Provide detailed explanation and debugging for a code snippet.
        """
        system_prompt = (
            f"You are a Senior Software Engineer specializing in {language}. "
            "Break down the provided code, explain how it works, and identify any potential bugs or performance issues."
        )
        
        prompt = f"Explain this code and suggest improvements:\n\n```{language}\n{code}\n```"
        
        return await self.ai.generate_text(prompt, system_prompt=system_prompt)
