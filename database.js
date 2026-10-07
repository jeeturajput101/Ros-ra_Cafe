/**
 * Simple LocalStorage Database for Roséra Café
 * Stores reservations and newsletter subscriptions
 */

const RoseraDB = {
  // Initialize database
  init() {
    if (!localStorage.getItem('rosera_reservations')) {
      localStorage.setItem('rosera_reservations', JSON.stringify([]));
    }
    if (!localStorage.getItem('rosera_newsletter')) {
      localStorage.setItem('rosera_newsletter', JSON.stringify([]));
    }
  },

  // Reservations
  addReservation(data) {
    const reservations = this.getReservations();
    const newReservation = {
      id: Date.now(),
      ...data,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    reservations.push(newReservation);
    localStorage.setItem('rosera_reservations', JSON.stringify(reservations));
    return newReservation;
  },

  getReservations() {
    return JSON.parse(localStorage.getItem('rosera_reservations') || '[]');
  },

  updateReservationStatus(id, status) {
    const reservations = this.getReservations();
    const index = reservations.findIndex(r => r.id === id);
    if (index !== -1) {
      reservations[index].status = status;
      localStorage.setItem('rosera_reservations', JSON.stringify(reservations));
    }
  },

  deleteReservation(id) {
    const reservations = this.getReservations();
    const filtered = reservations.filter(r => r.id !== id);
    localStorage.setItem('rosera_reservations', JSON.stringify(filtered));
  },

  // Newsletter
  addSubscription(email) {
    const subscriptions = this.getSubscriptions();
    // Check if email already exists
    if (subscriptions.some(s => s.email === email)) {
      return { success: false, message: 'Email already subscribed' };
    }
    const newSubscription = {
      id: Date.now(),
      email: email,
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    subscriptions.push(newSubscription);
    localStorage.setItem('rosera_newsletter', JSON.stringify(subscriptions));
    return { success: true, data: newSubscription };
  },

  getSubscriptions() {
    return JSON.parse(localStorage.getItem('rosera_newsletter') || '[]');
  },

  deleteSubscription(id) {
    const subscriptions = this.getSubscriptions();
    const filtered = subscriptions.filter(s => s.id !== id);
    localStorage.setItem('rosera_newsletter', JSON.stringify(filtered));
  },

  // Admin helpers
  getAllData() {
    return {
      reservations: this.getReservations(),
      subscriptions: this.getSubscriptions()
    };
  },

  clearAll() {
    localStorage.removeItem('rosera_reservations');
    localStorage.removeItem('rosera_newsletter');
    this.init();
  }
};

// Initialize database
RoseraDB.init();
