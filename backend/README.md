# Carlelo Backend

A Spring Boot backend for the Carlelo car marketplace platform, using Firebase Auth for authentication and Firestore as the database.

## Tech Stack

- **Java 21**
- **Spring Boot 3.2.x**
- **Firebase Admin SDK** - Authentication & Firestore
- **Maven** - Build tool
- **Google Cloud Run** - Deployment platform

## Project Structure

```
src/main/java/com/app/backend/
├── BackendApplication.java          # Main application entry point
├── config/
│   ├── FirebaseConfig.java          # Firebase initialization
│   ├── FilterConfig.java            # Auth filter registration
│   └── WebConfig.java               # CORS configuration
├── filters/
│   └── FirebaseAuthFilter.java      # JWT token validation filter
├── controllers/
│   ├── AuthController.java          # Token verification endpoint
│   ├── HealthController.java        # Health check endpoint
│   ├── UserController.java          # User profile endpoints
│   ├── InterestController.java      # Interest management endpoints
│   └── TestDriveController.java     # Test drive booking endpoints
├── services/
│   ├── UserService.java             # User business logic
│   ├── InterestService.java         # Interest business logic
│   └── TestDriveService.java        # Test drive business logic
├── firestore/
│   └── FirestoreService.java        # Firestore CRUD operations
├── dtos/
│   ├── ApiResponse.java             # Standard API response wrapper
│   ├── ErrorDetails.java            # Error information DTO
│   ├── AuthVerifyResponse.java      # Auth verification response
│   ├── UserProfileRequest.java      # User update request
│   ├── UserProfileResponse.java     # User profile response
│   ├── InterestRequest.java         # Interest creation request
│   ├── InterestResponse.java        # Interest response
│   ├── TestDriveRequest.java        # Test drive booking request
│   └── TestDriveResponse.java       # Test drive response
├── exceptions/
│   ├── GlobalExceptionHandler.java  # Centralized error handling
│   ├── ResourceNotFoundException.java
│   ├── FirestoreOperationException.java
│   └── UnauthorizedException.java
└── utils/
    └── RequestUtils.java            # Request utility methods
```

## API Endpoints

### Public Endpoints (No Authentication)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |

### Protected Endpoints (Requires Firebase ID Token)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/v1/api/auth/verify` | Verify token and get user info |
| GET | `/v1/api/user/me` | Get current user profile |
| PUT | `/v1/api/user/me` | Update current user profile |
| POST | `/v1/api/interests` | Create an interest |
| GET | `/v1/api/interests` | List user's interests |
| POST | `/v1/api/test-drives` | Book a test drive |
| GET | `/v1/api/test-drives` | List user's test drives |

## Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

Error responses:
```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

## Setup & Development

### Prerequisites

- Java 21
- Maven 3.9+
- Firebase project with Firestore enabled
- Firebase service account key

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create or select your project
3. Enable **Firestore** in native mode
4. Enable **Authentication** with Email/Phone provider
5. Go to **Project Settings > Service Accounts**
6. Click **Generate new private key**
7. Save the JSON file as `src/main/resources/serviceAccountKey.json`

⚠️ **IMPORTANT**: Never commit `serviceAccountKey.json` to version control!

### 2. Run Locally

```bash
# Navigate to backend directory
cd backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The server will start at `http://localhost:8080`

### 3. Test the API

```bash
# Health check
curl http://localhost:8080/health

# Protected endpoint (requires Firebase ID token)
curl -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN" \
     http://localhost:8080/v1/api/user/me
```

## Firestore Schema

### /users/{uid}
```json
{
  "email": "string",
  "name": "string",
  "city": "string",
  "attributes": { "key": "value" },
  "audiences": ["string"],
  "abTestGroup": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### /interests/{id}
```json
{
  "userId": "string",
  "carId": "string",
  "carOwner": "string",
  "createdAt": "timestamp"
}
```

### /test_drives/{id}
```json
{
  "userId": "string",
  "carId": "string",
  "carOwner": "string",
  "dealerId": "string",
  "preferredDate": "timestamp",
  "status": "requested",
  "createdAt": "timestamp"
}
```

## Deployment to Cloud Run

### Using Docker

```bash
# Build Docker image
docker build -t carlelo-backend .

# Run locally with Docker
docker run -p 8080:8080 \
  -v /path/to/serviceAccountKey.json:/app/serviceAccountKey.json \
  -e FIREBASE_CREDENTIALS_PATH=file:/app/serviceAccountKey.json \
  carlelo-backend
```

### Deploy to Cloud Run

```bash
# Set your project
export PROJECT_ID=your-gcp-project-id
export REGION=asia-south1

# Build and push to Container Registry
gcloud builds submit --tag gcr.io/$PROJECT_ID/carlelo-backend

# Deploy to Cloud Run
gcloud run deploy carlelo-backend \
  --image gcr.io/$PROJECT_ID/carlelo-backend \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars "FIREBASE_CREDENTIALS_PATH=file:/secrets/serviceAccountKey.json" \
  --set-secrets "/secrets/serviceAccountKey.json=firebase-service-account:latest"
```

### Using Cloud Run with Secret Manager

1. Store your service account key in Secret Manager:
```bash
gcloud secrets create firebase-service-account \
  --data-file=serviceAccountKey.json
```

2. Grant Cloud Run access to the secret:
```bash
gcloud secrets add-iam-policy-binding firebase-service-account \
  --member="serviceAccount:YOUR_SERVICE_ACCOUNT" \
  --role="roles/secretmanager.secretAccessor"
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 8080 |
| `FIREBASE_CREDENTIALS_PATH` | Path to Firebase service account key | `classpath:serviceAccountKey.json` |

## Authentication Flow

1. Client authenticates with Firebase Auth (Email OTP)
2. Client receives Firebase ID token
3. Client sends requests with `Authorization: Bearer <token>` header
4. Backend validates token using Firebase Admin SDK
5. User UID is extracted and available for all requests

## License

Private - All rights reserved

