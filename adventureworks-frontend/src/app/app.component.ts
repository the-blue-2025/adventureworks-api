import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>AdventureWorks Management</h1>
        <nav class="nav-menu">
          <a routerLink="/persons" routerLinkActive="active">Persons</a>
          <a routerLink="/vendors" routerLinkActive="active">Vendors</a>
          <a routerLink="/purchase-orders" routerLinkActive="active">Purchase Orders</a>
          <a routerLink="/ship-methods" routerLinkActive="active">Ship Methods</a>
          <a routerLink="/purchase-order-details" routerLinkActive="active">Order Details</a>
        </nav>
      </header>
      
      <main class="app-main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .app-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1rem 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .app-header h1 {
      margin: 0 0 1rem 0;
      font-size: 2rem;
      font-weight: 300;
    }

    .nav-menu {
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .nav-menu a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.3s ease;
    }

    .nav-menu a:hover {
      background-color: rgba(255,255,255,0.1);
    }

    .nav-menu a.active {
      background-color: rgba(255,255,255,0.2);
    }

    .app-main {
      flex: 1;
      padding: 2rem;
      background-color: #f5f5f5;
    }
  `]
})
export class AppComponent {
  title = 'adventureworks-frontend';
} 