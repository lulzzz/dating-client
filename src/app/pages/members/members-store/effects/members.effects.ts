import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, concatMap, map, switchMap, withLatestFrom } from "rxjs/operators";
import { of } from "rxjs";
import { Injectable } from "@angular/core";
import { LOAD_MEMBERS, LOAD_MEMBERS_FAILURE, LOAD_MEMBERS_SUCCESS } from "../actions/members.actions";
import { MemberService } from "../services/member.service";
import { AppState } from "@root-store/root-state";
import { selectMembers } from "@pages/members/members-store/selectors/members.selectors";
import { Store } from "@ngrx/store";

@Injectable()
export class MembersEffects {
  constructor(private actions$: Actions, private memberService: MemberService,
              private store: Store<AppState>) {}

  loadMembers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LOAD_MEMBERS),
      concatMap(action => of(action).pipe(
        withLatestFrom(this.store.select(selectMembers))
      )),
      switchMap(([ action, members ]) => {
        if (members) {
          return of(LOAD_MEMBERS_SUCCESS({ members }));
        }
        return this.memberService.getMembers().pipe(
          map(members => LOAD_MEMBERS_SUCCESS({ members })),
          catchError(error => of(LOAD_MEMBERS_FAILURE({ error }))),
        )
      })));
}
