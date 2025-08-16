"use client"

import { useEffect } from "react"
import { useParams } from "next/navigation"
import { useDocument } from "@/lib/stores/document-store"
import { DocumentEditor } from "@/components/editor/document-editor"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function DocumentPage() {
  const params = useParams()
  const documentId = params.id as string
  const { documents, currentDocument, setCurrentDocument, isLoading } = useDocument()

  useEffect(() => {
    // Find and set the current document
    const document = documents.find(doc => doc.id === documentId)
    if (document) {
      setCurrentDocument(document)
    }
  }, [documentId, documents, setCurrentDocument])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (!currentDocument) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Document not found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            The document you&apos;re looking for doesn&apos;t exist or has been deleted.
          </p>
        </div>
      </div>
    )
  }

  return <DocumentEditor document={currentDocument} />
}
