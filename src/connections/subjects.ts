import { DataTypes } from 'io-types/types'
import { err, ok } from 'neverthrow'
import {
  BehaviorSubject,
  filter,
  ReplaySubject,
  Subject,
  first,
  timer,
  merge,
  map,
} from 'rxjs'
import { parseJSON } from 'utils/parse-json'

export type Status = 'connecting' | 'connected' | 'disconnected'

export const wsOfferReceived = new BehaviorSubject<boolean>(false)
export const wsSendAnswer = new ReplaySubject<RTCSessionDescriptionInit>()
export const wsOutgoingMessageSubject = new Subject<string>()
export const wsIncomingMessageSubject = new Subject<MessageEvent<string>>()
export const wsErrorSubject = new Subject<Event>()
export const wsStatusSubject = new BehaviorSubject<Status>('disconnected')
export const wsConnect = new Subject<void>()
export const wsDisconnect = new Subject<void>()

export const rtcStatusSubject = new BehaviorSubject<Status>('disconnected')
export const rtcIncomingMessageSubject = new Subject<string>()
export const rtcOutgoingMessageSubject = new Subject<string>()
export const rtcIceCandidate = new Subject<RTCPeerConnectionIceEvent>()

export const wsParsedIncomingMessage$ = wsIncomingMessageSubject.pipe(
  // TODO: add runtime validation of IO types
  map((message) => parseJSON<{ valid: DataTypes }>(message.data))
)

export const messageConfirmation = (requestId: string, timeout: number) =>
  merge(
    wsParsedIncomingMessage$.pipe(
      filter(
        (result) => result.isOk() && result.value.valid.requestId === requestId
      ),
      map(() => ok(requestId))
    ),
    timer(timeout).pipe(map(() => err({ requestId, reason: 'timeout' }))),
    wsErrorSubject.pipe(map(() => err({ requestId, reason: 'error' })))
  ).pipe(first())
