import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {StoryGroup} from "./storyGroup";
import {Story} from "./story";
import {StoryViewItem} from "./StoryViewItem";

@Injectable({
  providedIn: 'root'
})
export class StoryService{
  constructor(public http: HttpClient) { }

  groupList(offset:number|string): Observable<StoryGroup[]> {
    return this.http.get<StoryGroup[]>(environment.HTTP_PREFIX + '/story/group-list/'+offset);
  }

  meList(): Observable<StoryGroup[]> {
    return this.http.get<StoryGroup[]>(environment.HTTP_PREFIX + '/story/me-list');
  }

  viewList(story?: Story, offset?: number): Observable<StoryViewItem[]> {

    return this.http.get<any>(environment.HTTP_PREFIX + '/story/view-list/'+story?.id+'/'+offset);
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

  delete(storyId: string): Observable<any> {

    return this.http.get<any>(environment.HTTP_PREFIX + '/story/delete/'+storyId);
  }
}
