import { WebRtcSubjectsType } from 'webrtc/subjects'
import log from 'loglevel'
import { withLatestFrom, tap } from 'rxjs'
import { SignalingSubjectsType } from 'signaling/subjects'

export const rtcRestart = (
  webRtcSubjects: WebRtcSubjectsType,
  signalingSubjects: SignalingSubjectsType,
  createPeerConnection: () => void
) =>
  webRtcSubjects.rtcRestartSubject.pipe(
    withLatestFrom(signalingSubjects.wsSourceSubject),
    tap(([, source]) => {
      log.debug(`🕸🔄 [${source}] restarting webRTC...`)
      createPeerConnection()
      signalingSubjects.wsConnectSubject.next(true)
    })
  )
