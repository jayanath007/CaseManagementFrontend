
import { map } from 'rxjs/operators';
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdgedDebRespone, TimeRecordRespone, BilledTimeRespone, CashRecivedRespone } from '../models/interfaces';
import { AppConfig } from '../../core';
import { MatterTypeEnum } from '../models/enums';
@Injectable()
export class TeamEfficiencyService {
    constructor(private http: HttpClient, private appConfig: AppConfig) { }

    public getMonthList() {
        return this.http.get<any>(this.appConfig.serviceBase2 + '/Team/GetMonths').pipe(
            map(response => response.data));
    }

    public getDepartmentList() {
        return this.http.get<any>(this.appConfig.serviceBase2 + '/Team/GetDepartments').pipe(
            map(response => response.data));
    }

    public getTimeRecordedData(user: string, month: number, option: string, department: number) {
        return this.http.get<TimeRecordRespone>(this.appConfig.serviceBase2 + '/Team/GetTimeRecordedValues?users=' +
            user + '&month=' + month + '&byHourOrValue=' + option +
            '&department=' + department).pipe(
                map(response => response.data));
    }

    public getAdgedDebData(user: string, month: number, department: number) {
        return this.http.get<AdgedDebRespone>(this.appConfig.serviceBase2 + '/Team/GetAgedDebtorsValues?users=' +
            user + '&month=' + month + '&department=' + department).pipe(
                map(response => response.data));
    }

    public getBilledTimeData(user: string, month: number, department: number) {
        return this.http.get<BilledTimeRespone>(this.appConfig.serviceBase2 + '/Team/GetAmountBilledTimes?users=' +
            user + '&month=' + month + '&department=' + department).pipe(
                map(response => response.data));
    }

    // public getCashRecivedData(user: string, month: number, department: number) {
    //     const params = {
    //         Department: department,
    //         Users: user,
    //         month: month,
    //     };
    //     const qs = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');
    //     // return this.http.get<CashRecivedRespone>(`${this.appConfig.serviceBase2}/Team/GetCashRecivedValues?${qs}`)
    //     // .map(response => response.data);
    //     // return this.http.get<BilledTimeRespone>(this.appConfig.serviceBase2 + '/Team/GetAmountBilledTimes?${qs})
    //     return this.http.get<CashRecivedRespone>(this.appConfig.serviceBase2 + '/Team/GetCashRecivedValues?' + qs).pipe(
    //         map(response => response.data));
    // }


    public getMatterData(user: string, month: number, department: number, matterType: MatterTypeEnum) {
        const params = {
            Department: department,
            Users: user,
            month: month,
            matterType: matterType
        };
        const qs = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');
        return this.http.get<CashRecivedRespone>(this.appConfig.serviceBase2 + '/Team/GetMattersChartData?' + qs).pipe(
            map(response => response.data));
    }

    public getActivityYearByDepartment(param: any) {

        if (param.user === '') {
            return this.http.get<any>(this.appConfig.serviceBase2
                + '/ActivityTraker/GetAllDayEventsByDepartment?departmentId=' + param.department +
                '&year=' + param.month.monthId).pipe(map(response => response.data));  // param.month.monthId


        } else {
            return this.http.get<any>(this.appConfig.serviceBase2
                + '/ActivityTraker/GetAllDayEventsByUser?userId=' + param.user +
                '&year=' + param.month.monthId).pipe(map(response => response.data));   // param.month.monthId


        }
    }

}
