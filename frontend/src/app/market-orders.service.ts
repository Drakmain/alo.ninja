import { Injectable, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class MarketOrdersService {
  private socket: Socket;
  private url = 'http://192.168.1.15:3909';

  marketOrdersSignals = signal("")

  constructor() {
    this.socket = io(this.url);

    this.socket.on("newMarketOrders", (data: string) => {
      console.log(data)
      this.marketOrdersSignals.set(data);
    });
  }
}
