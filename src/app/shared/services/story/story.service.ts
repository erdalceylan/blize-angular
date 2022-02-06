import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {StoryGroup} from "./storyGroup";
import {Story} from "./story";

@Injectable({
  providedIn: 'root'
})
export class StoryService{
  constructor(public http: HttpClient) { }

  list(offset:number|string): Observable<StoryGroup[]> {
    return this.http.get<StoryGroup[]>(environment.HTTP_PREFIX + '/story/list/'+offset);
  }

  add(blob: Blob): Observable<Story> {
    const file = new File([blob], 'image',{lastModified: Date.now()});

    const formData = new FormData();
    formData.append("image", file);

    return this.http.post<Story>(environment.HTTP_PREFIX + '/story/add', formData);
  }

  seen(story: Story): Observable<any> {

    return this.http.get<any>(environment.HTTP_PREFIX + '/story/seen/'+story.id);
  }
}
