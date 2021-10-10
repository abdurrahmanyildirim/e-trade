import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/shared/services/rest/db/service';
import { saveAs } from 'file-saver';
import { AdminService } from '../service';

@Component({
  selector: 'app-other',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtherComponent implements OnInit {
  constructor(private dbService: DbService, private adminService: AdminService) {}

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
}
