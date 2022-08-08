import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { catchError, map } from 'rxjs/operators';
import { Subject, throwError } from "rxjs";

@Injectable({ providedIn: 'root' })
export class PostService {
    url = 'https://menu-66b70-default-rtdb.firebaseio.com/posts.json';

    error = new Subject();

    constructor(
        private http: HttpClient
    ) {}

    savePost(title: string, content: string) {
        const postData: Post = { title: title, content: content };
        console.log('postData: ', postData);
        this.http.post<{ name: string }>(this.url, postData).subscribe(response => {
            console.log('response: ', response);
        }, error => {
            this.error.next(error);
        });
    }

    fetchPost() {
        return this.http.get<{ [key: string]: Post }>(this.url)
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
        return this.http.delete(this.url + '/' + id);
    }

    deletPosts() {
        return this.http.delete(this.url);
    }
}
