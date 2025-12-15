#!/usr/bin/env bash
set -e

API_URL="${1:-http://localhost:3000}"

echo "Running smoke tests against: $API_URL"

# Test 1: Health check
echo "Test 1: Health check..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${API_URL}/health")
if [ "$HTTP_CODE" != "200" ]; then
  echo "FAILED: Health check returned $HTTP_CODE"
  exit 1
fi
echo "PASSED: Health check OK"

# Test 2: Tracks endpoint (should work without auth or return 401)
echo "Test 2: Tracks endpoint..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${API_URL}/tracks")
if [ "$HTTP_CODE" != "200" ] && [ "$HTTP_CODE" != "401" ]; then
  echo "FAILED: Tracks endpoint returned $HTTP_CODE"
  exit 1
fi
echo "PASSED: Tracks endpoint accessible"

echo "All smoke tests passed!"
exit 0
