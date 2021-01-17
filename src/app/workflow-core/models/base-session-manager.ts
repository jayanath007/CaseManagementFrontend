import { BaseFileSession } from './base-file-session';
import { BehaviorSubject } from 'rxjs';

export class BaseSessionManager<TSession extends BaseFileSession> {

  private hashMap = new Map<string, BehaviorSubject<TSession>>();
  constructor() { }

  public addSession(appId: number, fileId: number, branchId: number, session: TSession) {
    this.getSession(appId, fileId, branchId).next(session);
  }

  public removeSession(appId: number, fileId: number, branchId: number) {
    this.getSession(appId, fileId, branchId).next(null);
  }

  public getSession(appId: number, fileId: number, branchId: number) {
    const hash = this.toHash(appId, fileId, branchId);
    if (!this.hashMap.has(hash)) {
      this.hashMap.set(hash, new BehaviorSubject(null));
    }
    return this.hashMap.get(hash);
  }

  protected toHash(appId: number, fileId: number, branchId: number) {
    return [appId, fileId, branchId].join(':');
  }

}
