import { Button } from 'components'
import { ErrorText } from '../components/error-text'
import { ledger } from 'ledger/ledger-wrapper'
import {
  LedgerImportOlympiaDeviceRequest,
  LedgerResponse,
  createLedgerOlympiaDeviceResponse,
} from 'ledger/schemas'
import { PairingHeader } from 'pairing/components/pairing-header'
import { useState } from 'react'

export const ImportOlympiaDevice = ({
  message,
  respond,
}: {
  message: LedgerImportOlympiaDeviceRequest
  respond: (response: LedgerResponse) => void
}) => {
  const [error, setError] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const importOlympiaFromLedger = async () => {
    setIsLoading(true)
    const olympiaDevice = await ledger.getOlympiaDeviceInfo(message)

    if (olympiaDevice.isOk()) {
      respond(createLedgerOlympiaDeviceResponse(message, olympiaDevice.value))
    } else {
      setError(olympiaDevice.error)
    }
    setIsLoading(false)
  }

  return (
    <>
      <PairingHeader header="Import Olympia Device">
        Please connect a Ledger Device which was used to manage Olympia accounts
      </PairingHeader>

      <ErrorText error={error} />

      <Button
        full
        mt="large"
        onClick={importOlympiaFromLedger}
        disabled={isLoading}
      >
        Continue
      </Button>
    </>
  )
}
