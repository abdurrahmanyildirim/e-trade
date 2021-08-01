import { Component, Input, OnInit } from '@angular/core';
import { Comment } from 'src/app/shared/models/product';

@Component({
  selector: 'app-comments',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class CommentsComponent implements OnInit {
  @Input() comments: Comment[];
  @Input() rate: number;

  ngOnInit(): void {
    this.comments.map((comment) => {
      const timestamp = comment._id.toString().substring(0, 8);
      comment.date = new Date(parseInt(timestamp, 16) * 1000);
    });
  }
}
