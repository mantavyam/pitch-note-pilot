"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CalendarIcon, VideoIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
// Removed unused textarea import
import { useDocument } from "@/lib/stores/document-store"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  date: z.date(),
  youtubeUrl: z.string().optional().refine((val) => {
    if (!val || val === "") return true
    try {
      new URL(val)
      return true
    } catch {
      return false
    }
  }, "Please enter a valid URL"),
})

type FormData = z.infer<typeof formSchema>

interface QuickCreateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QuickCreateModal({ open, onOpenChange }: QuickCreateModalProps) {
  const router = useRouter()
  const { createDocument } = useDocument()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      youtubeUrl: "",
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true)
      
      // Create the document with DMY format
      const document = createDocument({
        date: format(data.date, "dd-MM-yyyy"),
        youtubeUrl: data.youtubeUrl || undefined,
      })

      // Close modal and navigate to editor
      onOpenChange(false)
      router.push(`/documents/${document.id}`)
      
      // Reset form
      form.reset({
        date: new Date(),
        youtubeUrl: "",
      })
    } catch (error) {
      console.error("Failed to create document:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    form.reset({
      date: new Date(),
      youtubeUrl: "",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Create New Document
          </DialogTitle>
          <DialogDescription>
            Start creating your structured document. Fill in the date and optionally link a YouTube video.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Date *
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd-MM-yyyy")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    This will be the root title of your document (DD-MM-YYYY format)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="youtubeUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <VideoIcon className="h-4 w-4" />
                    YouTube Link (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://youtube.com/watch?v=..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Link a YouTube video to reference in your document
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Document"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
