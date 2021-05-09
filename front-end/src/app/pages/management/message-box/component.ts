import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { DialogType } from 'src/app/shared/components/dialog/component';
import { DialogService } from 'src/app/shared/components/dialog/service';
import { Contact } from 'src/app/shared/models/contact';
import { ContactService } from 'src/app/shared/services/rest/contact/service';
import { isPresent } from 'src/app/shared/util/common';

@Component({
  selector: 'app-mn-message-box',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MnMessageBoxComponent implements OnInit, OnDestroy {
  messages: Contact[];
  allMessages: Contact[];
  onCloseIcon = false;

  constructor(
    private contactService: ContactService,
    private dialogService: DialogService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initMessages();
  }

  initMessages(): void {
    this.contactService.getMesssages().subscribe({
      next: (messages) => {
        this.allMessages = messages.sort(
          (a: Contact, b: Contact) =>
            new Date(b.sendDate).getTime() - new Date(a.sendDate).getTime()
        );
        this.messages = this.allMessages.slice();
        this.cd.detectChanges();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  showDesc(message: Contact): void {
    if (this.onCloseIcon) {
      return;
    }
    this.dialogService.message({
      acceptButton: 'Kapat',
      desc: message.desc,
      dialog: DialogType.Message,
      onClose: (result) => {
        if (!message.isRead) {
          this.contactService.toggleRead(message._id).subscribe((readedMessage) => {
            this.messages.map((msg) => {
              if (msg._id === readedMessage._id) {
                msg.isRead = true;
              }
              return readedMessage;
            });
          });
        }
      }
    });
  }

  removeMessage(message: Contact): void {
    this.dialogService.message({
      acceptButton: 'Evet',
      refuseButton: 'İptal Et',
      desc: 'Bu mesajı silmek istediğinize emin misiniz?',
      dialog: DialogType.Confirm,
      onClose: (result) => {
        if (result) {
          this.contactService.removeMessage(message._id).subscribe({
            next: () => {
              const index = this.messages.indexOf(message);
              this.messages.splice(index, 1);
            },
            error: (error) => {
              console.log(error);
            }
          });
        }
      }
    });
  }

  filterMessages(isRead?: boolean): void {
    if (isPresent(isRead)) {
      this.messages = this.allMessages.filter((msg) => msg.isRead === isRead).slice();
    } else {
      this.messages = this.allMessages.slice();
    }
  }

  ngOnDestroy(): void {}
}
