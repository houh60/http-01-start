import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { PostService } from './post.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

    loadedPosts: Post[] = [];
    isFetching = false;
    error = null;
    private errorSub: Subscription;

    constructor(
        private http: HttpClient,
        private postService: PostService
    ) {}

    url = 'https://menu-66b70-default-rtdb.firebaseio.com/posts.json';

    ngOnInit() {
        this.errorSub = this.postService.error.subscribe(errorMessage => this.error = errorMessage);
        this.fetchPosts();
    }

    onCreatePost(postData: Post) {
        // Send Http request
        console.log(postData);
        this.postService.savePost(postData.title, postData.content);
    }

    onFetchPosts() {
        // Send Http request
        this.fetchPosts();
    }

    onClearPosts() {
        // Send Http request
        if(confirm('Are you sure you want to delete all posts?')) {
            this.postService.deletPosts().subscribe(() => {
                this.loadedPosts = [];
            });
        }
    }

    private fetchPosts() {
        this.isFetching = true;
        this.postService.fetchPost().subscribe(posts => {
            this.loadedPosts = posts;
            this.isFetching = false;
            this.error = null;
        }, error => {
            this.error = error;
        });
    }

    onHandleError() {
        this.error = null;
        this.isFetching = false;
    }

    deletePost(id: string) {
        this.postService.deletPost(id).subscribe(response => {
            console.log('response: ', response);
        });
    }

    ngOnDestroy(): void {
        this.errorSub.unsubscribe();
    }
}
