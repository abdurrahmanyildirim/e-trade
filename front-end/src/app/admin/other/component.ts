import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/shared/services/rest/db/service';
import { LogService } from 'src/app/shared/services/rest/log/service';
import { saveAs } from 'file-saver';
import { AdminService } from '../service';

@Component({
  selector: 'app-other',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtherComponent implements OnInit {
  constructor(
    private dbService: DbService,
    private adminService: AdminService,
    private logService: LogService
  ) {}

  ngOnInit(): void {
    this.adminService.routeInfo.next([]);
  }

  onClick(): void {
    this.dbService.createBackUp().subscribe((data) => {
      const fileName =
        'taser-backup-' +
        new Date().toLocaleDateString() +
        '-' +
        new Date().toLocaleTimeString() +
        '.zip';
      saveAs(data, fileName);
    });
  }

  downloadLogs(): void {
    this.logService.logs().subscribe((data) => {
      const fileName =
        'taser-logs-' +
        new Date().toLocaleDateString() +
        '-' +
        new Date().toLocaleTimeString() +
        '.json';
      const fileToSave = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      });
      saveAs(fileToSave, fileName);
    });
  }
}
