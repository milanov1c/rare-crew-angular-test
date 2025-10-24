import { Injectable } from '@angular/core';
import { Employee } from '../interfaces/employee';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private http: HttpClient) {}

  getAllEmployees() {
    const url = 'https://rc-vault-fap-live-1.azurewebsites.net';
    const endpoint = 'api/gettimeentries';
    const key = 'vO17RnE8vuzXzPJo5eaLLjXjmRW07law99QTD90zat9FfOQJKKUcgQ==';
    return this.http.get<any[]>(`${url}/${endpoint}?code=${key}`);
  }

  getEmployeesWithHours(data: any[]): Employee[] {
    const employeeMap = new Map<string, number>();

    data.forEach((e) => {
      const employeeName = e.EmployeeName?.trim();
      const startTime = new Date(e.StarTimeUtc);
      const endTime = new Date(e.EndTimeUtc);

      if (e.DeletedOn !== null) {
        console.error(`Employee ${employeeName || e.Id} is deleted.`);
        return;
      }

      if (!employeeName) {
        console.error(`Employee ${e.Id} doesn't have a name.`);
        return;
      }

      if (
        isNaN(startTime.getTime()) ||
        isNaN(endTime.getTime())
      ) {
        console.error(`${employeeName} has invalid start or end time`);
        return;
      }
      

      const hours = (endTime.getTime() - startTime.getTime()) / 3600000;

      if (hours <= 0) {
        console.error(`Employee ${employeeName} has negative working hours`);
        return;
      }

      if (employeeMap.has(employeeName)) {
        employeeMap.set(employeeName, employeeMap.get(employeeName)! + hours);
      } else {
        employeeMap.set(employeeName, hours);
      }
    });

    const employees: Employee[] = Array.from(
      employeeMap,
      ([name, hours_worked]) => ({
        name,
        hours_worked: Math.floor(hours_worked),
        is_deleted: false,
      })
    ).sort((a, b) => b.hours_worked - a.hours_worked);

    return employees;
  }
}
