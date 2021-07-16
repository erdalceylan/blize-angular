import {environment} from 'src/environments/environment';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StaticService {
  public STATIC_IMAGE_PREFIX = environment.SELF_PREFIX;
  public API_IMAGE_PREFIX = environment.HTTP_PREFIX;
}
