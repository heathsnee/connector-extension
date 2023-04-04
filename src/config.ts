import { LogLevelNumbers } from 'loglevel'
import packageJson from '../package.json'
const { version } = packageJson
import { Buffer } from 'buffer'
import { Logger } from 'tslog'

globalThis.Buffer = Buffer

const turnServers = {
  test: [
    {
      urls: 'turn:turn-dev-udp.rdx-works-main.extratools.works:80?transport=udp',
      username: 'username',
      credential: 'password',
    },
    {
      urls: 'turn:turn-dev-tcp.rdx-works-main.extratools.works:80?transport=tcp',
      username: 'username',
      credential: 'password',
    },
  ],
  rcnet: [
    {
      urls: 'turn:relay.metered.ca:80',
      username: '51253affa7c2960189ce8cb6',
      credential: '3HWkp3Wgg2cujD2g',
    },
    {
      urls: 'turn:relay.metered.ca:443',
      username: '51253affa7c2960189ce8cb6',
      credential: '3HWkp3Wgg2cujD2g',
    },
    {
      urls: 'turn:relay.metered.ca:443?transport=tcp',
      username: '51253affa7c2960189ce8cb6',
      credential: '3HWkp3Wgg2cujD2g',
    },
  ],
  development: [
    {
      urls: 'turn:relay.metered.ca:80',
      username: '51253affa7c2960189ce8cb6',
      credential: '3HWkp3Wgg2cujD2g',
    },
    {
      urls: 'turn:relay.metered.ca:443',
      username: '51253affa7c2960189ce8cb6',
      credential: '3HWkp3Wgg2cujD2g',
    },
    {
      urls: 'turn:relay.metered.ca:443?transport=tcp',
      username: '51253affa7c2960189ce8cb6',
      credential: '3HWkp3Wgg2cujD2g',
    },
  ],
  beta: [
    {
      urls: 'turn:turn-betanet-udp.radixdlt.com:80?transport=udp',
      username: 'username',
      credential: 'password',
    },
    {
      urls: 'turn:turn-betanet-tcp.radixdlt.com:80?transport=tcp',
      username: 'username',
      credential: 'password',
    },
  ],
} as const

const mode = import.meta.env.MODE as 'test' | 'development' | 'beta'

const peerConnectionConfig: RTCConfiguration = {
  iceTransportPolicy: 'relay',
  iceServers: [
    // {
    //   urls: 'stun:stun.l.google.com:19302',
    // },
    // {
    //   urls: 'stun:stun1.l.google.com:19302',
    // },
    // {
    //   urls: 'stun:stun2.l.google.com:19302',
    // },
    // {
    //   urls: 'stun:stun3.l.google.com:19302',
    // },
    // {
    //   urls: 'stun:stun4.l.google.com:19302',
    // },
    ...(turnServers[mode] || []),
  ],
}

export const config = {
  environment: process.env.NODE_ENV,
  logLevel: import.meta.env.VITE_APP_LOG_LEVEL as LogLevelNumbers,
  version,
  secrets: {
    connectionPasswordByteLength: 32,
  },
  storage: { key: 'radix' },
  signalingServer: {
    baseUrl: import.meta.env.VITE_APP_SIGNALING_SERVER_BASE_URL,
    reconnect: {
      interval: 1000,
    },
    useBatchedIceCandidates: false,
    iceCandidatesBatchTime: 2000,
    useTargetClientId: import.meta.env.VITE_APP_USE_TARGET_CLIENT_ID === 'true',
  },
  webRTC: {
    isInitiator: import.meta.env.VITE_APP_IS_INITIATOR === 'true',
    disconnectOnVisibilityChange: false,
    peerConnectionConfig,
    dataChannelConfig: {
      negotiated: true,
      id: 0,
      ordered: true,
    },
    chunkSize: 11_500,
    confirmationTimeout: 3_000,
  },
  popup: {
    width: 375,
    height: 559,
    offsetTop: 0,
    pages: {
      pairing: 'src/pairing/index.html',
      devTools: 'src/chrome/dev-tools/dev-tools.html',
    },
    closeDelayTime: 700,
    showOnInstall: false,
  },
}

const logger = new Logger({
  prettyLogTemplate: '{{hh}}:{{MM}}:{{ss}}:{{ms}}\t{{logLevelName}}\t',
  minLevel: config.logLevel,
})

logger.trace('🛠 loaded config', config)
