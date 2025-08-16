"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  PlusIcon, 
  TrashIcon, 
  GripVerticalIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "lucide-react"
import { cn } from "@/lib/utils"

interface TableData {
  headers: string[]
  rows: string[][]
}

interface AdvancedTableEditorProps {
  content?: TableData
  onUpdate: (table: TableData) => void
  isEditing?: boolean
  onEditingChange?: (editing: boolean) => void
}

export function AdvancedTableEditor({ 
  content, 
  onUpdate, 
  isEditing = false,
  onEditingChange 
}: AdvancedTableEditorProps) {
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null)

  const handleCellEdit = (rowIndex: number, colIndex: number, value: string) => {
    if (!content) return

    const newTable = { ...content }
    if (rowIndex === -1) {
      // Editing header
      newTable.headers[colIndex] = value
    } else {
      // Editing cell
      newTable.rows[rowIndex][colIndex] = value
    }
    onUpdate(newTable)
  }

  const addColumn = () => {
    if (!content) return

    const newTable = {
      headers: [...content.headers, `Column ${content.headers.length + 1}`],
      rows: content.rows.map(row => [...row, ''])
    }
    onUpdate(newTable)
  }

  const removeColumn = (colIndex: number) => {
    if (!content || content.headers.length <= 1) return

    const newTable = {
      headers: content.headers.filter((_, i) => i !== colIndex),
      rows: content.rows.map(row => row.filter((_, i) => i !== colIndex))
    }
    onUpdate(newTable)
  }

  const addRow = () => {
    if (!content) return

    const newTable = {
      ...content,
      rows: [...content.rows, new Array(content.headers.length).fill('')]
    }
    onUpdate(newTable)
  }

  const removeRow = (rowIndex: number) => {
    if (!content || content.rows.length <= 1) return

    const newTable = {
      ...content,
      rows: content.rows.filter((_, i) => i !== rowIndex)
    }
    onUpdate(newTable)
  }

  const moveColumn = (fromIndex: number, toIndex: number) => {
    if (!content || toIndex < 0 || toIndex >= content.headers.length) return

    const newHeaders = [...content.headers]
    const newRows = content.rows.map(row => [...row])

    // Move header
    const [movedHeader] = newHeaders.splice(fromIndex, 1)
    newHeaders.splice(toIndex, 0, movedHeader)

    // Move column data
    newRows.forEach(row => {
      const [movedCell] = row.splice(fromIndex, 1)
      row.splice(toIndex, 0, movedCell)
    })

    onUpdate({ headers: newHeaders, rows: newRows })
  }

  const moveRow = (fromIndex: number, toIndex: number) => {
    if (!content || toIndex < 0 || toIndex >= content.rows.length) return

    const newRows = [...content.rows]
    const [movedRow] = newRows.splice(fromIndex, 1)
    newRows.splice(toIndex, 0, movedRow)

    onUpdate({ ...content, rows: newRows })
  }

  if (!content?.headers?.length) {
    return (
      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
        <div className="text-4xl mb-4">📊</div>
        <p className="text-sm text-muted-foreground mb-4">Create a table</p>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onUpdate({ 
            headers: ['Column 1', 'Column 2'], 
            rows: [['', '']] 
          })}
        >
          Add Table
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {isEditing && (
        <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
          <Button
            variant="outline"
            size="sm"
            onClick={addColumn}
            className="flex items-center gap-1"
          >
            <PlusIcon className="h-3 w-3" />
            Add Column
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={addRow}
            className="flex items-center gap-1"
          >
            <PlusIcon className="h-3 w-3" />
            Add Row
          </Button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-border">
          <thead>
            <tr>
              {isEditing && <th className="border border-border p-1 w-8"></th>}
              {content.headers.map((header, colIndex) => (
                <th key={colIndex} className="border border-border p-2 bg-muted font-medium text-left relative group">
                  {editingCell?.row === -1 && editingCell?.col === colIndex ? (
                    <Input
                      value={header}
                      onChange={(e) => handleCellEdit(-1, colIndex, e.target.value)}
                      onBlur={() => setEditingCell(null)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') setEditingCell(null)
                      }}
                      autoFocus
                      className="h-8"
                    />
                  ) : (
                    <div 
                      className="cursor-pointer"
                      onClick={() => isEditing && setEditingCell({ row: -1, col: colIndex })}
                    >
                      {header}
                    </div>
                  )}
                  
                  {isEditing && (
                    <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 flex">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => moveColumn(colIndex, colIndex - 1)}
                        disabled={colIndex === 0}
                      >
                        <ChevronLeftIcon className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => moveColumn(colIndex, colIndex + 1)}
                        disabled={colIndex === content.headers.length - 1}
                      >
                        <ChevronRightIcon className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-destructive"
                        onClick={() => removeColumn(colIndex)}
                        disabled={content.headers.length <= 1}
                      >
                        <TrashIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {content.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="group">
                {isEditing && (
                  <td className="border border-border p-1 bg-muted/20">
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-6 p-0"
                        onClick={() => moveRow(rowIndex, rowIndex - 1)}
                        disabled={rowIndex === 0}
                      >
                        <ChevronUpIcon className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-6 p-0"
                        onClick={() => moveRow(rowIndex, rowIndex + 1)}
                        disabled={rowIndex === content.rows.length - 1}
                      >
                        <ChevronDownIcon className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-6 p-0 text-destructive"
                        onClick={() => removeRow(rowIndex)}
                        disabled={content.rows.length <= 1}
                      >
                        <TrashIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                )}
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border border-border p-2">
                    {editingCell?.row === rowIndex && editingCell?.col === cellIndex ? (
                      <Input
                        value={cell}
                        onChange={(e) => handleCellEdit(rowIndex, cellIndex, e.target.value)}
                        onBlur={() => setEditingCell(null)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') setEditingCell(null)
                        }}
                        autoFocus
                        className="h-8"
                      />
                    ) : (
                      <div 
                        className="cursor-pointer min-h-[20px]"
                        onClick={() => isEditing && setEditingCell({ row: rowIndex, col: cellIndex })}
                      >
                        {cell || (isEditing ? "Click to edit" : "")}
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
