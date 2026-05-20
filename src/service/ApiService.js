import axios from "axios";
import CryptoJS from "crypto-js";

export default class ApiService {
  static BASE_URL = process.env.REACT_APP_BASE_URL;

  static ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY;

  // encrypt data using crypto js
  static encryptData(data) {
    return CryptoJS.AES.encrypt(
      JSON.stringify(data),
      this.ENCRYPTION_KEY,
    ).toString();
  }

  // decrypt data using crypto js
  static decryptData(data) {
    const bytes = CryptoJS.AES.decrypt(data, this.ENCRYPTION_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

  // save token
  static saveToken(data) {
    const encryptedToken = this.encryptData(data);
    localStorage.setItem("data", encryptedToken);
  }

  // retrieve token
  static retrieveToken() {
    const encryptedToken = localStorage.getItem("data");
    if (encryptedToken) {
      return this.decryptData(encryptedToken);
    }
    return null;
  }

  // save role
  static saveRole(role) {
    const encryptedRole = this.encryptData(role);
    localStorage.setItem("role", encryptedRole);
  }

  // retrieve role
  static retrieveRole() {
    const encryptedRole = localStorage.getItem("role");
    if (encryptedRole) {
      return this.decryptData(encryptedRole);
    }
    return null;
  }

  static clearAuth() {
    localStorage.removeItem("data");
    localStorage.removeItem("role");
  }

  static getHeader() {
    const token = this.getToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  //   AUTH & USERS API METHOD

  //   AUTH
  static async registerUser(registrationData) {
    const response = await axios.post(
      `${this.BASE_URL}/auth/register`,
      registrationData,
    );
    return response.data;
  }

  static async loginUser(loginData) {
    const response = await axios.post(
      `${this.BASE_URL}/auth/login`,
      loginData,
    );
    return response.data;
  }

  //   USERS
  static async myProfile() {
    const response = await axios.get(`${this.BASE_URL}/users/account`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async myBooking() {
    const response = await axios.get(`${this.BASE_URL}/users/booking`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async deleteAccount() {
    const response = await axios.delete(`${this.BASE_URL}/users/account`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  //   ROOMS
  static async addRoom(roomData) {
    const response = await axios.post(`${this.BASE_URL}/rooms/add`, roomData, {
      headers: {
        ...this.getHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  static async getRoomTypes() {
    const response = await axios.get(`${this.BASE_URL}/rooms/types`);
    return response.data;
  }

  static async getAllRooms() {
    const response = await axios.get(`${this.BASE_URL}/rooms/all`);
    return response.data;
  }

  static async getRoomById(roomId) {
    const response = await axios.get(`${this.BASE_URL}/rooms/${roomId}`);
    return response.data;
  }

  static async deleteRoom(roomId) {
    const response = await axios.delete(
      `${this.BASE_URL}/rooms/delete/${roomId}`,
      {
        headers: this.getHeader(),
      },
    );
    return response.data;
  }

  static async updateRoom(roomData) {
    const response = await axios.put(`${this.BASE_URL}/rooms/add`, roomData, {
      headers: {
        ...this.getHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  static async getAvailableRooms(checkInDate, checkOutDate, roomType) {
    const response = await axios.get(
      `${this.BASE_URL}/rooms/available?checkinDate=${checkInDate}&checkoutDate=${checkOutDate}&roomType=${roomType}`,
    );
    return response.data;
  }

  //   BOOKINGS
  static async getBookingByReference(bookingCode) {
    const response = await axios.get(
      `${this.BASE_URL}/bookings/${bookingCode}`,
    );
    return response.data;
  }

  static async bookRoom(booking) {
    const response = await axios.post(`${this.BASE_URL}/bookings`, booking, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async getAllBookings(bookingCode) {
    const response = await axios.get(`${this.BASE_URL}/bookings/all`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async updateBooking(booking) {
    const response = await axios.put(
      `${this.BASE_URL}/bookings/update`,
      booking,
      {
        headers: this.getHeader(),
      },
    );
    return response.data;
  }

  //   PAYMENT
  static async proceedPayment(body) {
    const resp = await axios.post(`${this.BASE_URL}/payments/pay`, body, {
      headers: this.getHeader(),
    });
    return resp.data;
  }

  static async updateBookingPayment(body) {
    const resp = await axios.put(`${this.BASE_URL}/payments/update`, body, {
      headers: this.getHeader(),
    });
    return resp.data;
  }

  //   AUTHENTICATION CHECK
  static logout() {
    this.clearAuth();
  }

  static isAuthenticated() {
    const token = this.retrieveToken();
    return !!token;
  }

  static isAdmin() {
    const role = this.retrieveRole();
    return role === "ADMIN";
  }

  static isCustomer() {
    const role = this.retrieveRole();
    return role === "CUSTOMER";
  }
}
