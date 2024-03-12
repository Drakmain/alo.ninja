import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MarketOrdersComponent } from './market-orders/market-orders.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { LegendComponent } from './legend/legend.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MarketOrdersComponent, NgbNavModule, LegendComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'alo.ninja-front';

  active = 1;
}
