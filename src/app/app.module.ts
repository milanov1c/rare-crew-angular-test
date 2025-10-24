import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmployeeTableComponent } from './features/employee-table/employee-table.component';
import { EmployeePieChartComponent } from './features/employee-pie-chart/employee-pie-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    EmployeeTableComponent,
    EmployeePieChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
