class Appointments {
    constructor() {
        this.appointments = [];
    }

    // Añade citas al []
    addAppointment(appointment){
        this.appointments = [...this.appointments, appointment]
    }

    // Elimina citas del []
    deleteAppointment(id) {
        this.appointments = this.appointments.filter(appointment => appointment.id !== id);
    }

    // Elimina citas del []
    updateAppointment(_appointment) {
        this.appointments = this.appointments.map(
            appointment => appointment.id === _appointment.id ? _appointment : appointment
        );
        console.log(this.appointments);
    }
}

export default Appointments;