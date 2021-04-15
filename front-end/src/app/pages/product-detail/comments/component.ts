import { Component, Input, OnInit } from '@angular/core';
import { Comment } from 'src/app/shared/models/product';

@Component({
  selector: 'app-comments',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class CommentsComponent implements OnInit {
  @Input() comments: Comment;
  @Input() rate: number;

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  seperateComments(): void {}
}
