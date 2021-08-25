import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DbService } from 'src/app/shared/services/rest/db/service';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-other',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MnOtherComponent implements OnInit {
  constructor(private cd: ChangeDetectorRef, private dbService: DbService) {}

  ngOnInit(): void {}

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
