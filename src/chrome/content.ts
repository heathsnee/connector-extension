import { ChromeConnectorClient } from './chrome-connector-client'
import { ChromeDAppClient, messageLifeCycleEvent } from './chrome-dapp-client'
import { decorateMessage } from './helpers/decorate-message'

const connectorClient = ChromeConnectorClient()
const chromeDAppClient = ChromeDAppClient()

chromeDAppClient.messageListener((message) => {
  if (message.type === 'debugMode') {
    const loglevel = message.value ? 'DEBUG' : 'INFO'
    console.log(
      `🛠 Setting loglevel to: ${loglevel}, reload the window for effects to take place`
    )
    chrome.storage.local.set({ loglevel })
  } else {
    decorateMessage(message)
      .map(connectorClient.getConnector().sendMessage)
      .map(chrome.runtime.sendMessage)
      .andThen(() =>
        chromeDAppClient.sendMessageEvent(
          message.interactionId,
          messageLifeCycleEvent.receivedByExtension
        )
      )
  }
})
