import requests
import json
import os
from datetime import datetime

# ======= CONFIGURATION =======
ACCESS_TOKEN = os.getenv("ACCESS_TOKEN")
IG_USER_ID = os.getenv("IG_USER_ID")
FILE_NAME = "followers.json"

# ======= FUNCTIONS =======

def get_followers():
    """Calls the Instagram Graph API to get the current followers"""
    url = f"https://graph.facebook.com/v19.0/{IG_USER_ID}/followers"
    params = {"access_token": ACCESS_TOKEN}
    followers = []

    while url:
        response = requests.get(url, params=params)
        data = response.json()
        if "data" not in data:
            print("⚠️ Could not retrieve followers:", data)
            break

        followers.extend([u["username"] for u in data["data"]])
        url = data.get("paging", {}).get("next")

    return followers

def load_json():
    """Loads previous followers data from file"""
    if os.path.exists(FILE_NAME):
        with open(FILE_NAME, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"all_followers": [], "previous_followers": [], "new_followers": []}

def save_json(data):
    """Saves updated followers data to file"""
    with open(FILE_NAME, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

def compare_followers(current, previous):
    """Compares current and previous followers to find new ones"""
    new_ones = [f for f in current if f not in previous]
    return new_ones

# ======= MAIN PROCESS =======

def main():
    print("📥 Fetching followers list...")
    current_followers = get_followers()
    if not current_followers:
        print("❌ Could not fetch the followers list.")
        return

    print(f"🔹 Current followers: {len(current_followers)}")

    previous_data = load_json()
    previous_followers = previous_data.get("all_followers", [])

    new_followers = compare_followers(current_followers, previous_followers)
    print(f"🆕 New followers: {len(new_followers)}")

    data = {
        "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "all_followers": current_followers,
        "previous_followers": previous_followers,
        "new_followers": new_followers
    }

    save_json(data)
    print(f"💾 Data saved to {FILE_NAME}")

if __name__ == "__main__":
    main()
