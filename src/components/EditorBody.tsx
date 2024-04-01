import { WelcomePage } from '../WelcomePage.tsx'

interface EditorBodyProps {
  selectedDocument: string
}

export function EditorBody({ selectedDocument }: EditorBodyProps) {
  if (selectedDocument === '') return <WelcomePage />

  return <div>{selectedDocument}</div>
}