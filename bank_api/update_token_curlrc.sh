# Configuration
LOGIN_URL="http://localhost:3000/api/customers/login" 
USERNAME="johndoe" # Replace with your dev username
PASSWORD="securepassword123" # Replace with your dev password
CURLRC_PATH="$HOME/.curlrc"

# Retrieve the token using curl
RESPONSE=$(curl -s -X POST "$LOGIN_URL" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$USERNAME\", \"password\":\"$PASSWORD\"}")

# Debug: Output the response (remove or comment out in production)
echo "Response from server: $RESPONSE"

# Extract the token using jq
TOKEN=$(echo "$RESPONSE" | jq -r '.token')

# Check if token retrieval was successful
if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "Failed to retrieve token. Please check your credentials and login endpoint."
  exit 1
fi

# Remove any existing Authorization header
grep -v "^header = \"Authorization: Bearer " "$CURLRC_PATH" > "${CURLRC_PATH}.tmp"

# Create a temp .curlrc file with the new token
echo "header = \"Authorization: Bearer $TOKEN\"" >> "${CURLRC_PATH}.tmp"

# Replace the old .curlrc with the updated one
mv "${CURLRC_PATH}.tmp" "$CURLRC_PATH"

echo "Updated $CURLRC_PATH with the new token."
