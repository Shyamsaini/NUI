import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket!: Socket;

  connect(userId: string): void {
    this.socket = io('http://localhost:5296', {
      path: '/socket.io',
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to WebSocket');
      this.socket.emit('register', userId);
      console.log(`🚀 Register emitted for user: ${userId}`);
    });

    this.socket.on('connect_error', (err) => {
      console.error('❌ Connection Error:');
      console.log(err);
    });

    this.socket.on('server-message', (data) => {
      console.log('📥 Message from server:', data);
    });
  }

  sendMessage(event: string, data: any): void {
    this.socket.emit(event, data);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      console.log('🔌 Disconnected from WebSocket');
    }
  }
}
