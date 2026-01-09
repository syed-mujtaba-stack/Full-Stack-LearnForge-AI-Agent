import asyncio
import httpx
import sys
import os
from firebase_admin import auth

# Add parent directory to path so we can import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from app.core import security # Initializes Firebase Admin

async def verify_flow():
    print(f"🔍 Starting End-to-End Verification...")
    print(f"----------------------------------------")
    
    # 1. Verification of Env Vars
    if not settings.FIREBASE_WEB_API_KEY:
        print("❌ Error: FIREBASE_WEB_API_KEY is missing in .env")
        print("   Please find it in Firebase Console -> Project Settings -> General -> Web API Key")
        return

    try:
        # 2. Generate Custom Token (Server-side)
        test_uid = "test-e2e-user"
        print(f"🔑 Generating Custom Token for UID: {test_uid}...")
        custom_token = auth.create_custom_token(test_uid)
        custom_token_str = custom_token.decode("utf-8")
        print(f"✅ Custom Token Generated.")

        # 3. Exchange Custom Token for ID Token (Client-side simulation)
        print(f"🔄 Exchanging for ID Token via Google Identity Platform...")
        exchange_url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key={settings.FIREBASE_WEB_API_KEY}"
        
        async with httpx.AsyncClient() as client:
            response = await client.post(exchange_url, json={"token": custom_token_str, "returnSecureToken": True})
            
            if response.status_code != 200:
                print(f"❌ Failed to exchange token: {response.text}")
                return
                
            data = response.json()
            id_token = data["idToken"]
            print(f"✅ ID Token Obtained!")

            # 4. Call Protected API (Backend)
            print(f"🚀 Calling Protected API: http://localhost:8000/api/v1/users/me ...")
            
            api_response = await client.get(
                "http://localhost:8000/api/v1/users/me",
                headers={"Authorization": f"Bearer {id_token}"}
            )
            
            if api_response.status_code == 200:
                user_data = api_response.json()
                print(f"✅ Success! API returned 200 OK")
                print(f"   User Data: {user_data}")
                print(f"----------------------------------------")
                print(f"🎉 END-TO-END AUTHENTICATION FLOW VERIFIED!")
            else:
                print(f"❌ API Call Failed: {api_response.status_code}")
                print(f"   Response: {api_response.text}")

    except Exception as e:
        print(f"❌ Unexpected Error: {e}")

if __name__ == "__main__":
    asyncio.run(verify_flow())
