import type { OurFileRouter } from "@/server/uploadthing"
import { UploadButton } from "@uploadthing/react"

import { useToast } from "@/components/ui/use-toast"
import { PlantImage } from "@/components/plant-image"

export function UploadPlantImageUrl(props: {
  imageUrl: string | undefined
  setImageUrl: (url: string) => void
}) {
  const { toast } = useToast()
  return (
    <div className="flex flex-row items-center gap-4 p-4">
      <PlantImage
        imageUrl={props.imageUrl}
        size={24}
        iconSize={16}
        altText="The plant's image."
      />
      <UploadButton<OurFileRouter>
        multiple={false}
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          if (!res) {
            return
          }
          console.log("Files: ", res)
          const fileUrl = res[0]?.fileUrl
          if (!fileUrl) {
            return
          }
          props.setImageUrl(fileUrl)
          toast({
            title: "Success",
            description: "Upload Completed",
            variant: "default",
          })
        }}
        onUploadError={(error: Error) => {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          })
        }}
      />
    </div>
  )
}
