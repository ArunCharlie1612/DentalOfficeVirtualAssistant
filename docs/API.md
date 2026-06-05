# API Documentation

## Contoso Dentistry Scheduler API

Base URL: `https://contoso-dentistry-scheduler.azurewebsites.net`

### Endpoints

#### 1. Health Check

**GET** `/`

Returns API status and version.

**Response:**
```json
{
  "message": "Contoso Dentistry Scheduler API",
  "version": "1.0.0",
  "status": "running"
}
```

**Status Codes:**
- `200 OK` - API is running

---

#### 2. Get Available Appointments

**GET** `/api/availability`

Returns list of available appointment time slots.

**Response:**
```json
[
  "Monday, June 10 at 9:00 AM",
  "Monday, June 10 at 2:00 PM",
  "Tuesday, June 11 at 10:00 AM",
  "Tuesday, June 11 at 3:00 PM",
  "Wednesday, June 12 at 11:00 AM",
  "Wednesday, June 12 at 4:00 PM",
  "Thursday, June 13 at 9:00 AM",
  "Thursday, June 13 at 1:00 PM",
  "Friday, June 14 at 10:00 AM",
  "Friday, June 14 at 2:00 PM"
]
```

**Status Codes:**
- `200 OK` - Successfully retrieved available slots

**Example:**
```bash
curl https://contoso-dentistry-scheduler.azurewebsites.net/api/availability
```

---

#### 3. Schedule an Appointment

**POST** `/api/schedule`

Books an appointment for a patient.

**Request Body:**
```json
{
  "time": "Monday, June 10 at 9:00 AM",
  "patientName": "John Doe",
  "patientEmail": "john@example.com"
}
```

**Parameters:**
- `time` (required): The appointment time slot (must match available slot)
- `patientName` (optional): Name of the patient
- `patientEmail` (optional): Email of the patient

**Response (Success):**
```json
{
  "success": true,
  "message": "Appointment scheduled successfully",
  "appointmentTime": "Monday, June 10 at 9:00 AM",
  "appointmentId": 1
}
```

**Response (Error - Time Not Available):**
```json
{
  "success": false,
  "message": "The requested time slot is not available"
}
```

**Response (Error - Missing Time):**
```json
{
  "success": false,
  "message": "Appointment time is required"
}
```

**Status Codes:**
- `200 OK` - Appointment scheduled successfully
- `400 Bad Request` - Invalid request or time slot not available

**Example:**
```bash
curl -X POST https://contoso-dentistry-scheduler.azurewebsites.net/api/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "time": "Monday, June 10 at 9:00 AM",
    "patientName": "John Doe",
    "patientEmail": "john@example.com"
  }'
```

---

#### 4. Get All Appointments (Admin)

**GET** `/api/appointments`

Returns all booked appointments. This is an admin endpoint.

**Response:**
```json
[
  {
    "id": 1,
    "time": "Monday, June 10 at 9:00 AM",
    "patientName": "John Doe",
    "patientEmail": "john@example.com",
    "bookedAt": "2026-06-05T10:30:00.000Z"
  },
  {
    "id": 2,
    "time": "Tuesday, June 11 at 10:00 AM",
    "patientName": "Jane Smith",
    "patientEmail": "jane@example.com",
    "bookedAt": "2026-06-05T11:15:00.000Z"
  }
]
```

**Status Codes:**
- `200 OK` - Successfully retrieved appointments

**Example:**
```bash
curl https://contoso-dentistry-scheduler.azurewebsites.net/api/appointments
```

---

#### 5. Cancel an Appointment

**DELETE** `/api/appointments/:id`

Cancels an appointment by ID.

**Parameters:**
- `id` (path parameter): The appointment ID to cancel

**Response (Success):**
```json
{
  "success": true,
  "message": "Appointment canceled successfully",
  "canceledAppointment": {
    "id": 1,
    "time": "Monday, June 10 at 9:00 AM",
    "patientName": "John Doe",
    "patientEmail": "john@example.com",
    "bookedAt": "2026-06-05T10:30:00.000Z"
  }
}
```

**Response (Error - Not Found):**
```json
{
  "success": false,
  "message": "Appointment not found"
}
```

**Status Codes:**
- `200 OK` - Appointment canceled successfully
- `404 Not Found` - Appointment ID does not exist

**Example:**
```bash
curl -X DELETE https://contoso-dentistry-scheduler.azurewebsites.net/api/appointments/1
```

---

## Bot Integration

The ChatBot uses the Scheduler API to:
1. Fetch available appointments when user asks
2. Book appointments when user provides a time

### Example Bot Flow

**User:** "What appointments are available?"

**Bot Action:**
```javascript
const response = await axios.get(`${schedulerApiEndpoint}/api/availability`);
```

**Bot Response:** Lists available times

**User:** "Schedule me for Monday at 9 AM"

**Bot Action:**
```javascript
const response = await axios.post(`${schedulerApiEndpoint}/api/schedule`, {
  time: "Monday, June 10 at 9:00 AM"
});
```

**Bot Response:** Confirms booking

---

## CORS Configuration

The API has CORS enabled for all origins. In production, restrict this:

```javascript
app.use(cors({
  origin: 'https://your-website-url.azurewebsites.net'
}));
```

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production:

1. Install `express-rate-limit`:
```bash
npm install express-rate-limit
```

2. Add to server.js:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
```

---

## Testing the API

### Using cURL

```bash
# Health check
curl https://contoso-dentistry-scheduler.azurewebsites.net/

# Get availability
curl https://contoso-dentistry-scheduler.azurewebsites.net/api/availability

# Schedule appointment
curl -X POST https://contoso-dentistry-scheduler.azurewebsites.net/api/schedule \
  -H "Content-Type: application/json" \
  -d '{"time": "Monday, June 10 at 9:00 AM", "patientName": "Test User"}'

# Get all appointments
curl https://contoso-dentistry-scheduler.azurewebsites.net/api/appointments

# Cancel appointment
curl -X DELETE https://contoso-dentistry-scheduler.azurewebsites.net/api/appointments/1
```

### Using Postman

1. Import the API collection (if provided)
2. Set base URL variable
3. Test each endpoint
4. Verify responses

### Using JavaScript

```javascript
const axios = require('axios');

const API_BASE = 'https://contoso-dentistry-scheduler.azurewebsites.net';

// Get availability
async function getAvailability() {
  const response = await axios.get(`${API_BASE}/api/availability`);
  console.log(response.data);
}

// Schedule appointment
async function scheduleAppointment(time, name, email) {
  const response = await axios.post(`${API_BASE}/api/schedule`, {
    time,
    patientName: name,
    patientEmail: email
  });
  console.log(response.data);
}
```

---

## Future Enhancements

Planned API improvements:

1. **Authentication**
   - JWT tokens for admin endpoints
   - Patient authentication

2. **Database Integration**
   - Replace in-memory storage with Azure SQL
   - Persist appointments

3. **Email Notifications**
   - Send confirmation emails
   - Send reminders

4. **Calendar Integration**
   - Sync with Outlook/Google Calendar
   - ICS file generation

5. **Recurring Appointments**
   - Support for recurring visits
   - Follow-up scheduling

6. **Patient Portal**
   - View appointment history
   - Update contact information

---

## Support

For API issues:
- Check server logs in Azure App Service
- Review [Troubleshooting Guide](TROUBLESHOOTING.md)
- Test locally first with `npm start`
