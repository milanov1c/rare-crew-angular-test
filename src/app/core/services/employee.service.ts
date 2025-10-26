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

  private isValidEntry(e: any): boolean {
    const employeeName = e.EmployeeName?.trim();
    if (e.DeletedOn !== null) return false;
    if (!employeeName) return false;
    if (!e.StarTimeUtc || !e.EndTimeUtc) return false;

    const startTime = new Date(e.StarTimeUtc);
    const endTime = new Date(e.EndTimeUtc);
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) return false;
    if (startTime >= endTime) return false;

    const hours = (endTime.getTime() - startTime.getTime()) / 3600000;
    if (hours <= 0) return false;

    return true;
  }

  getEmployeesWithHours(data: any[]): Employee[] {
    const employeeMap = new Map<string, number>();

    data.forEach((e) => {
      if (!this.isValidEntry(e)) return;

      const name = e.EmployeeName!.trim();
      const startTime = new Date(e.StarTimeUtc);
      const endTime = new Date(e.EndTimeUtc);
      const hours = (endTime.getTime() - startTime.getTime()) / 3600000;

      employeeMap.set(name, (employeeMap.get(name) || 0) + hours);
    });

    const employees: Employee[] = Array.from(employeeMap, ([name, hours_worked]) => ({
      name,
      hours_worked: Math.floor(hours_worked),
      is_deleted: false,
    })).sort((a, b) => b.hours_worked - a.hours_worked);

    return employees;
  }
}
