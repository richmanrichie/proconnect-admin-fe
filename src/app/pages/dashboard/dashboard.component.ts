import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import Chart from 'chart.js';

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "../../variables/charts";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public datasets: any;
  public data: any;
  public salesChart;
  public clicked: boolean = true;
  public clicked1: boolean = false;

  isOrgAdmin = false;
  isSuperAdmin = false;
  roleResolved = false;

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit() {
    this.adminService.getUser().subscribe(user => {
      if (user.role === 'ADMIN_ORGANISATION') {
        this.isOrgAdmin = true;
      } else if (user.role === 'SUPER_ADMIN') {
        this.isSuperAdmin = true;
      }
      this.roleResolved = true;
      if (!this.isOrgAdmin && !this.isSuperAdmin) {
        this.initCharts();
      }
    });
  }

  private initCharts() {
    this.datasets = [
      [0, 20, 10, 30, 15, 40, 20, 60, 60],
      [0, 20, 5, 25, 10, 30, 15, 40, 40]
    ];
    this.data = this.datasets[0];

    var chartOrders = document.getElementById('chart-orders');
    parseOptions(Chart, chartOptions());
    new Chart(chartOrders, {
      type: 'bar',
      options: chartExample2.options,
      data: chartExample2.data
    });

    var chartSales = document.getElementById('chart-sales');
    this.salesChart = new Chart(chartSales, {
      type: 'line',
      options: chartExample1.options,
      data: chartExample1.data
    });
  }

  public updateOptions() {
    this.salesChart.data.datasets[0].data = this.data;
    this.salesChart.update();
  }
}
