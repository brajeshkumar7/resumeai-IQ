from fastapi.testclient import TestClient

from resumeiq_api.main import app

client = TestClient(app)


def test_liveness_endpoint() -> None:
    response = client.get("/api/v1/health/live")

    assert response.status_code == 200
    payload = response.json()
    assert payload["success"] is True
    assert payload["data"]["status"] == "healthy"


def test_system_meta_endpoint() -> None:
    response = client.get("/api/v1/system/meta")

    assert response.status_code == 200
    payload = response.json()
    assert payload["success"] is True
    assert "guardrails" in payload["data"]
