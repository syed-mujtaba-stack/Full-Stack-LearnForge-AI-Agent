from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app import models
from app.services.ai.factory import get_ai_provider
from app.services.ai.pinecone_service import pinecone_service
import logging

logger = logging.getLogger(__name__)

class ContentIngestor:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.ai = get_ai_provider()

    def chunk_text(self, text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
        """Simple sliding window chunking."""
        if not text:
            return []
        
        chunks = []
        words = text.split()
        
        # Approximate tokens using word count (4 chars/token avg)
        # For a truly semantic chunker, we'd use recursive character splitting
        # But this works for an initial implementation
        current_pos = 0
        while current_pos < len(words):
            end_pos = current_pos + chunk_size // 4 # heuristic
            chunk = " ".join(words[current_pos:end_pos])
            chunks.append(chunk)
            current_pos += (chunk_size - overlap) // 4
            
        return chunks

    async def ingest_course(self, course_id: int):
        """Invert a course's content into Pinecone."""
        # Fetch course with modules and lessons
        result = await self.db.execute(
            select(models.course.Course).filter(models.course.Course.id == course_id)
        )
        course = result.scalars().first()
        if not course:
            logger.error(f"Course {course_id} not found for ingestion")
            return

        logger.info(f"Starting ingestion for course: {course.title}")
        
        # Process lessons
        all_vectors = []
        for module in course.modules:
            for lesson in module.lessons:
                combined_text = f"Course: {course.title}\nModule: {module.title}\nLesson: {lesson.title}\n\n{lesson.content}"
                chunks = self.chunk_text(combined_text)
                
                if not chunks:
                    continue
                
                # Generate embeddings for all chunks in a lesson
                embeddings = await self.ai.get_embeddings(chunks)
                
                for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
                    vector_id = f"course_{course.id}_lesson_{lesson.id}_chunk_{i}"
                    all_vectors.append({
                        "id": vector_id,
                        "values": embedding,
                        "metadata": {
                            "course_id": course.id,
                            "module_id": module.id,
                            "lesson_id": lesson.id,
                            "text": chunk,
                            "title": lesson.title,
                            "course_title": course.title
                        }
                    })

        if all_vectors:
            await pinecone_service.upsert_vectors(all_vectors, namespace="courses")
            logger.info(f"Ingested {len(all_vectors)} vectors for course {course_id}")
            
    async def search_course_content(self, query: str, course_id: Optional[int] = None, top_k: int = 3):
        """Search course content for RAG."""
        embedding = await self.ai.get_embeddings([query])
        
        filter_dict = None
        if course_id:
            filter_dict = {"course_id": {"$eq": course_id}}
            
        return await pinecone_service.query_vectors(
            vector=embedding[0],
            top_k=top_k,
            namespace="courses",
            filter=filter_dict
        )
