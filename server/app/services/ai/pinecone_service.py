from pinecone import Pinecone, ServerlessSpec
from typing import List, Dict, Any, Optional
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class PineconeService:
    def __init__(self):
        self.pc = Pinecone(api_key=settings.PINECONE_API_KEY)
        self.index_name = settings.PINECONE_INDEX_NAME
        
    async def ensure_index(self, dimension: int = 768): # 768 for Google text-embedding-004
        if self.index_name not in self.pc.list_indexes().names():
            logger.info(f"Creating Pinecone index: {self.index_name}")
            self.pc.create_index(
                name=self.index_name,
                dimension=dimension,
                metric='cosine',
                spec=ServerlessSpec(
                    cloud='aws',
                    region=settings.PINECONE_ENVIRONMENT
                )
            )
            
    def get_index(self):
        return self.pc.Index(self.index_name)

    async def upsert_vectors(self, vectors: List[Dict[str, Any]], namespace: str = "default"):
        """
        vectors: List of Dict with {"id": str, "values": List[float], "metadata": Dict}
        """
        index = self.get_index()
        index.upsert(vectors=vectors, namespace=namespace)

    async def query_vectors(
        self, 
        vector: List[float], 
        top_k: int = 3, 
        namespace: str = "default",
        filter: Optional[Dict[str, Any]] = None
    ):
        index = self.get_index()
        return index.query(
            vector=vector,
            top_k=top_k,
            include_metadata=True,
            namespace=namespace,
            filter=filter
        )

# Global singleton
pinecone_service = PineconeService()
