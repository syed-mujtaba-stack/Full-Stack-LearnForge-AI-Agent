import json
from typing import Any, Dict, List, Optional, Union
from openai import AsyncOpenAI
from app.services.ai.base_provider import LLMProvider
from app.core.config import settings

class GeminiProvider(LLMProvider):
    """
    Gemini 2.0 implementation using OpenAI compatibility layer.
    Allows use of Google's powerful models with the standard OpenAI SDK.
    """

    def __init__(self, model: str = "gemini-2.0-flash"):
        self.model = model
        # Configuration for Google's OpenAI-compatible endpoint
        self.client = AsyncOpenAI(
            api_key=settings.GOOGLE_API_KEY,
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
        )

    async def generate_text(
        self, 
        prompt: str, 
        system_prompt: Optional[str] = None,
        **kwargs
    ) -> str:
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        response = await self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            **kwargs
        )
        return response.choices[0].message.content or ""

    async def generate_json(
        self, 
        prompt: str, 
        schema: Dict[str, Any],
        system_prompt: Optional[str] = None,
        **kwargs
    ) -> Dict[str, Any]:
        # Construct explicit JSON formatting instructions
        schema_str = json.dumps(schema, indent=2)
        enhanced_prompt = f"{prompt}\n\nReturn ONLY a JSON object that matches this schema:\n{schema_str}"
        
        # Gemini-OpenAI bridge supports response_format for some models, 
        # but explicit prompting is safer for free-tier compatibility
        result_text = await self.generate_text(
            enhanced_prompt, 
            system_prompt=system_prompt,
            response_format={"type": "json_object"},
            **kwargs
        )
        try:
            return json.loads(result_text)
        except json.JSONDecodeError:
            # Fallback parsing if LLM prefix/suffix text exists
            start = result_text.find("{")
            end = result_text.rfind("}") + 1
            if start != -1 and end != 0:
                return json.loads(result_text[start:end])
            return {"error": "Failed to parse AI response as JSON", "raw": result_text}

    async def get_embeddings(self, text: Union[str, List[str]]) -> List[List[float]]:
        # Using OpenAI-style embedding call (mapped to Google gecko/text-embedding models)
        input_text = [text] if isinstance(text, str) else text
        response = await self.client.embeddings.create(
            model="text-embedding-004", # Google default
            input=input_text
        )
        return [data.embedding for data in response.data]
