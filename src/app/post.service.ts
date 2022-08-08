import { HttpClient } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { Post } from "./post.model";
import { catchError, map } from 'rxjs/operators';
import { Subject, throwError } from "rxjs";

@Injectable({ providedIn: 'root' })
export class PostService {
    url = 'https://menu-66b70-default-rtdb.firebaseio.com/';

    error = new Subject();

    constructor(
        private http: HttpClient
    ) {}

    savePost(title: string, content: string) {
        const postData: Post = { title: title, content: content };
        return this.http.post<{ name: string }>(this.url + 'posts.json', postData);
    }

    fetchPost() {
        return this.http.get<{ [key: string]: Post }>(this.url + 'posts.json')
            .pipe(map(responseData => {
                const postArray: Post[] = [];
                for(const key in responseData) {
                    if(responseData.hasOwnProperty(key)) {
                        postArray.push({ ...responseData[key], id: key });
                    }
                }
                return postArray;
            }), catchError(errorRes => {
                return throwError(errorRes);
            }));
    }

    deletPost(id: string) {
        let endpoint = this.url + `posts/${id}.json`;
        return this.http.delete(endpoint);
    }

    deletPosts() {
        return this.http.delete(this.url + 'posts.json');
    }
}
