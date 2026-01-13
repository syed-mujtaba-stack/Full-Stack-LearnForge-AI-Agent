import asyncio
import os
from dotenv import load_dotenv
load_dotenv()

from app.services.ai.factory import get_ai_provider
from app.services.ai.pinecone_service import pinecone_service

async def test_ai_infrastructure():
    print("🚀 Starting AI Infrastructure Test...")
    
    # 1. Test AI Provider
    ai = get_ai_provider()
    print(f"✅ AI Provider initialized: {type(ai).__name__}")
    
    try:
        response = await ai.generate_text("Say 'Hello LearnForge!' in a tutorial-style phrase.")
        print(f"🤖 AI Response: {response}")
    except Exception as e:
        print(f"❌ AI Generation Failed: {e}")

    # 2. Test Embeddings
    try:
        embedding = await ai.get_embeddings(["This is a test document."])
        print(f"✅ Embedding generated! Dimension: {len(embedding[0])}")
    except Exception as e:
        print(f"❌ Embedding Generation Failed: {e}")

    # 3. Test Pinecone
    try:
        await pinecone_service.ensure_index(dimension=768)
        print(f"✅ Pinecone Index Verified: {pinecone_service.index_name}")
    except Exception as e:
        print(f"❌ Pinecone Verification Failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_ai_infrastructure())
