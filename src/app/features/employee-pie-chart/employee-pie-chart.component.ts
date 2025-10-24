import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, ArcElement, Tooltip, Legend, PieController } from 'chart.js';
import { Employee } from '../../core/interfaces/employee';
import { EmployeeService } from '../../core/services/employee.service';

Chart.register(PieController, ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-employee-pie-chart',
  templateUrl: './employee-pie-chart.component.html',
  styleUrl: './employee-pie-chart.component.scss',
})
export class EmployeePieChartComponent implements OnInit {
  @ViewChild('pieCanvas') pieCanvas!: ElementRef<HTMLCanvasElement>;
  public chart!: Chart;
  employeesData: Employee[] = [];

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.employeeService.getAllEmployees().subscribe((data) => {
      this.employeesData = this.employeeService.getEmployeesWithHours(data);
      this.createChart(this.employeesData)
    });
  }

 

  createChart(employees: Employee[]) {
    const employeePercentagesWithNames = this.getEmployeePercentages(employees);
    const employeeNames = employeePercentagesWithNames.map((e) => e.name);
    const employeePercentages = employeePercentagesWithNames.map(
      (e) => e.percentage
    );
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: employeeNames,
        datasets: [
          {
            label: 'Percentage of working hours',
            data: employeePercentages,
            backgroundColor: [
              'red',
              'pink',
              'green',
              'yellow',
              'orange',
              'blue',
            ],
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
      },
    });
  }

  getEmployeePercentages(employees: Employee[]) {
    const totalHours = employees.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.hours_worked;
    }, 0);

    return employees.map((e) => ({
      name: e.name,
      percentage: (e.hours_worked / totalHours) * 100,
    }));
  }
}
