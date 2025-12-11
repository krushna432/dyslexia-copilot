"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { scanImage } from "@/app/actions";
import { UploadCloud, Loader2 } from "lucide-react";

type ImageUploadDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onScanned: (text: string) => void;
};

export function ImageUploadDialog({ isOpen, onOpenChange, onScanned }: ImageUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !preview) {
      toast({ title: "No file selected", description: "Please choose an image to scan.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const result = await scanImage(preview);
      if (result.error) throw new Error(result.error);
      onScanned(result.extractedText!);
      toast({ title: "Text Extracted Successfully" });
      onClose();
    } catch (error) {
      toast({ title: "Scan Failed", description: (error as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const onClose = () => {
    setFile(null);
    setPreview(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Scan Text from Image</DialogTitle>
          <DialogDescription>
            Upload an image of a document or book page to extract the text.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {preview ? (
            <div className="relative w-full h-48 rounded-md overflow-hidden border">
              <Image src={preview} alt="Image preview" layout="fill" objectFit="contain" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg">
                <UploadCloud className="w-12 h-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Drag & drop or click to upload</p>
            </div>
          )}
          <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button onClick={handleUpload} disabled={!file || loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Scan Text
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
