const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory storage for appointments (in production, use a database)
let availableSlots = [
    'Monday, June 10 at 9:00 AM',
    'Monday, June 10 at 2:00 PM',
    'Tuesday, June 11 at 10:00 AM',
    'Tuesday, June 11 at 3:00 PM',
    'Wednesday, June 12 at 11:00 AM',
    'Wednesday, June 12 at 4:00 PM',
    'Thursday, June 13 at 9:00 AM',
    'Thursday, June 13 at 1:00 PM',
    'Friday, June 14 at 10:00 AM',
    'Friday, June 14 at 2:00 PM'
];

let bookedAppointments = [];

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Contoso Dentistry Scheduler API',
        version: '1.0.0',
        status: 'running'
    });
});

// Get available appointment slots
app.get('/api/availability', (req, res) => {
    console.log('GET /api/availability - Fetching available slots');
    res.json(availableSlots);
});

// Schedule an appointment
app.post('/api/schedule', (req, res) => {
    console.log('POST /api/schedule - Request body:', req.body);
    
    const { time, patientName, patientEmail } = req.body;

    if (!time) {
        return res.status(400).json({
            success: false,
            message: 'Appointment time is required'
        });
    }

    // Check if the slot is available
    const slotIndex = availableSlots.findIndex(slot => 
        slot.toLowerCase().includes(time.toLowerCase()) || 
        time.toLowerCase().includes(slot.toLowerCase())
    );

    if (slotIndex === -1) {
        return res.status(400).json({
            success: false,
            message: 'The requested time slot is not available'
        });
    }

    // Book the appointment
    const bookedSlot = availableSlots[slotIndex];
    availableSlots.splice(slotIndex, 1);
    
    const appointment = {
        id: bookedAppointments.length + 1,
        time: bookedSlot,
        patientName: patientName || 'Unknown',
        patientEmail: patientEmail || 'Not provided',
        bookedAt: new Date().toISOString()
    };
    
    bookedAppointments.push(appointment);

    console.log('Appointment booked:', appointment);

    res.json({
        success: true,
        message: 'Appointment scheduled successfully',
        appointmentTime: bookedSlot,
        appointmentId: appointment.id
    });
});

// Get all booked appointments (admin endpoint)
app.get('/api/appointments', (req, res) => {
    console.log('GET /api/appointments - Fetching all booked appointments');
    res.json(bookedAppointments);
});

// Cancel an appointment
app.delete('/api/appointments/:id', (req, res) => {
    const appointmentId = parseInt(req.params.id);
    console.log(`DELETE /api/appointments/${appointmentId} - Canceling appointment`);

    const appointmentIndex = bookedAppointments.findIndex(apt => apt.id === appointmentId);

    if (appointmentIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Appointment not found'
        });
    }

    const canceledAppointment = bookedAppointments[appointmentIndex];
    bookedAppointments.splice(appointmentIndex, 1);
    
    // Add the slot back to available slots
    availableSlots.push(canceledAppointment.time);
    availableSlots.sort();

    res.json({
        success: true,
        message: 'Appointment canceled successfully',
        canceledAppointment: canceledAppointment
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Contoso Dentistry Scheduler API is running on port ${PORT}`);
    console.log(`Available endpoints:`);
    console.log(`  GET  /api/availability - Get available appointment slots`);
    console.log(`  POST /api/schedule - Schedule an appointment`);
    console.log(`  GET  /api/appointments - Get all booked appointments`);
    console.log(`  DELETE /api/appointments/:id - Cancel an appointment`);
});

module.exports = app;
