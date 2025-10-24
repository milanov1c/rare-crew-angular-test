import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../core/services/employee.service';
import { Employee } from '../../core/interfaces/employee';

@Component({
  selector: 'app-employee-table',
  templateUrl: './employee-table.component.html',
  styleUrls: ['./employee-table.component.scss']
})
export class EmployeeTableComponent implements OnInit{

  employees: Employee[]=[];

  constructor(private employeeService: EmployeeService){}

  ngOnInit(): void {
    this.employeeService.getAllEmployees().subscribe(data=>{
      this.employees=this.employeeService.getEmployeesWithHours(data);
    });
  }

}
